// app/layout.tsx
import '../styles/globals.css'; // ✅ Correct relative path

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Whiteboard App',
  description: 'Collaborative whiteboard app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
