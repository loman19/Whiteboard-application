// stores/whiteboardStore.ts
import { create } from 'zustand';

interface Page {
  dataUrl: string | null;
}

interface WhiteboardState {
  canvasRef: HTMLCanvasElement | null;
  setCanvasRef: (ref: HTMLCanvasElement | null) => void;

  clearCanvas: () => void;
  saveCanvas: () => string | null;
  loadCanvas: (dataUrl: string) => void;

  undo: () => void;
  redo: () => void;

  addPage: () => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;

  pages: Page[];
  currentPageIndex: number;
  history: string[]; // stack for undo
  future: string[]; // stack for redo
}

export const useWhiteboardStore = create<WhiteboardState>((set, get) => ({
  canvasRef: null,
  pages: [{ dataUrl: null }],
  currentPageIndex: 0,
  history: [],
  future: [],

  setCanvasRef: (ref) => set({ canvasRef: ref }),

  clearCanvas: () => {
    const canvas = get().canvasRef;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL();
        set((state) => ({
          history: [...state.history, dataUrl],
          future: [],
        }));
      }
    }
  },

  saveCanvas: () => {
    const canvas = get().canvasRef;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      set((state) => {
        const updatedPages = [...state.pages];
        updatedPages[state.currentPageIndex] = { dataUrl };
        return { pages: updatedPages };
      });
      return dataUrl;
    }
    return null;
  },

  loadCanvas: (dataUrl) => {
    const canvas = get().canvasRef;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
      }
    }
  },

  undo: () => {
    const { history, future, canvasRef } = get();
    if (history.length > 0 && canvasRef) {
      const lastState = history[history.length - 1];
      set({
        history: history.slice(0, -1),
        future: [canvasRef.toDataURL(), ...future],
      });
      get().loadCanvas(lastState);
    }
  },

  redo: () => {
    const { future, history, canvasRef } = get();
    if (future.length > 0 && canvasRef) {
      const nextState = future[0];
      set({
        future: future.slice(1),
        history: [...history, canvasRef.toDataURL()],
      });
      get().loadCanvas(nextState);
    }
  },

  addPage: () => {
    set((state) => {
      const newPages = [...state.pages, { dataUrl: null }];
      return {
        pages: newPages,
        currentPageIndex: newPages.length - 1,
      };
    });
  },

  goToPrevPage: () => {
    const { currentPageIndex, pages } = get();
    if (currentPageIndex > 0) {
      const prevData = pages[currentPageIndex - 1]?.dataUrl;
      set({ currentPageIndex: currentPageIndex - 1 });
      if (prevData) get().loadCanvas(prevData);
      else get().clearCanvas();
    }
  },

  goToNextPage: () => {
    const { currentPageIndex, pages } = get();
    if (currentPageIndex < pages.length - 1) {
      const nextData = pages[currentPageIndex + 1]?.dataUrl;
      set({ currentPageIndex: currentPageIndex + 1 });
      if (nextData) get().loadCanvas(nextData);
      else get().clearCanvas();
    }
  },
}));
