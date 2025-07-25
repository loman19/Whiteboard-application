'use client';

import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const socket = io('http://localhost:5000');

const Whiteboard = ({ roomId }: { roomId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [pages, setPages] = useState<string[][]>([[]]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [history, setHistory] = useState<string[][]>([[]]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Initial sync
    socket.emit('joinRoom', roomId);
    socket.on('draw', ({ offsetX, offsetY, pmX, pmY, color, brushSize }) => {
      const ctx = contextRef.current;
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        ctx.beginPath();
        ctx.moveTo(pmX, pmY);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
    });

    socket.on('clearCanvas', () => {
      clearCanvas();
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  }, [color]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    socket.emit('draw', {
      offsetX,
      offsetY,
      pmX: offsetX - 1,
      pmY: offsetY - 1,
      color,
      brushSize,
      roomId,
    });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    contextRef.current?.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleClear = () => {
    clearCanvas();
    socket.emit('clearCanvas', { roomId });
  };

  return (
    <div className="relative w-full h-full">
      <Sidebar
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        onClear={handleClear}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Whiteboard;
