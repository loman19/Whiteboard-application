'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Save, Undo2, Redo2, ArrowLeft, ArrowRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useWhiteboardStore } from '@/store/whiteboardStore';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { clearCanvas, undo, redo, saveCanvas, addPage, goToPrevPage, goToNextPage } = useWhiteboardStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveCanvas();
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col gap-3 p-4 border-r h-full w-20 bg-white shadow-md">
      <Button variant="ghost" size="icon" onClick={addPage} title="Add Page">
        <Plus />
      </Button>
      <Button variant="ghost" size="icon" onClick={goToPrevPage} title="Previous Page">
        <ArrowLeft />
      </Button>
      <Button variant="ghost" size="icon" onClick={goToNextPage} title="Next Page">
        <ArrowRight />
      </Button>
      <Button variant="ghost" size="icon" onClick={undo} title="Undo">
        <Undo2 />
      </Button>
      <Button variant="ghost" size="icon" onClick={redo} title="Redo">
        <Redo2 />
      </Button>
      <Button variant="ghost" size="icon" onClick={clearCanvas} title="Clear">
        <Trash2 />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleSave} disabled={isSaving} title="Save">
        <Save />
      </Button>
    </div>
  );
}
