// components/Whiteboard.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SketchPicker } from 'react-color';

const socket = io('http://localhost:5000');

interface WhiteboardProps {
  roomId: string;
}

export default function Whiteboard({ roomId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');

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

    socket.emit('joinRoom', roomId);
    socket.on('draw', ({ offsetX, offsetY, pmX, pmY, color, brushSize }) => {
      const ctx = contextRef.current;
      if (!ctx) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.moveTo(pmX, pmY);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
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
      contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    }
  }, [color, tool]);

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
    contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    socket.emit('draw', {
      offsetX,
      offsetY,
      pmX: offsetX - 1,
      pmY: offsetY - 1,
      color: tool === 'eraser' ? '#ffffff' : color,
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

  // Example placeholders for saving/loading
  const saveCanvasToDB = async () => {
    const canvas = canvasRef.current;
    const dataURL = canvas?.toDataURL();
    await fetch('/api/sessions/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, image: dataURL }),
    });
  };

  const loadCanvasFromDB = async () => {
    const res = await fetch(`/api/sessions/load?roomId=${roomId}`);
    const { image } = await res.json();
    const img = new Image();
    img.src = image;
    img.onload = () => {
      contextRef.current?.drawImage(img, 0, 0);
    };
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-white p-4 rounded shadow">
        <SketchPicker color={color} onChangeComplete={(c) => setColor(c.hex)} />
        <input
          type="range"
          min={1}
          max={20}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
        <button onClick={() => setTool('brush')} className="bg-blue-500 text-white px-2 py-1 rounded">Brush</button>
        <button onClick={() => setTool('eraser')} className="bg-gray-400 text-white px-2 py-1 rounded">Eraser</button>
        <button onClick={handleClear} className="bg-red-500 text-white px-2 py-1 rounded">Clear</button>
        <button onClick={saveCanvasToDB} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
        <button onClick={loadCanvasFromDB} className="bg-yellow-500 text-white px-2 py-1 rounded">Load</button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
    </div>
  );
}
