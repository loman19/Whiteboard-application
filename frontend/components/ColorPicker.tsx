// components/ColorPicker.tsx
'use client';
import { SketchPicker } from 'react-color';

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
}

export default function ColorPicker({ color, setColor }: ColorPickerProps) {
  return (
    <SketchPicker
      color={color}
      onChangeComplete={(updated) => setColor(updated.hex)}
    />
  );
}
