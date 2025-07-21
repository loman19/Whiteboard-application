// components/ui/button.tsx
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 font-semibold',
        className
      )}
      {...props}
    />
  );
}
