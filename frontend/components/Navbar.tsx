'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token'); // if using token
    router.push('/login');
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <span className="text-xl font-bold text-blue-600">CollaboBoard</span>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" className="text-sm text-gray-700 hover:text-black">
            Dashboard
          </Button>
        </Link>
      </div>

      <div>
        <Button onClick={handleLogout} variant="outline" className="text-sm">
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
