'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        alert('Signup failed');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <Button className="w-full" onClick={handleSignup}>
            Sign Up
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
