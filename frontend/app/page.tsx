// // ap/page.tsx
// 'use client';

// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';

// export default function HomePage() {
//   return (
//     <div className="flex flex-col items-center justify-center text-center py-20 px-4">
//       <Image src="/logo.png" alt="WhiteMagic Logo" width={100} height={100} />

//       <h1 className="text-4xl md:text-5xl font-bold mt-6 bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text">
//         Welcome to WhiteMagic
//       </h1>

//       <p className="text-lg text-gray-600 mt-4 max-w-xl">
//         Collaborate. Sketch. Create. Share. A real-time whiteboard experience crafted for teams and creatives.
//       </p>

//       <div className="mt-8 flex gap-4">
//         <Link href="/create-session">
//           <Button className="px-6 py-3 text-lg">Create Session</Button>
//         </Link>
//         <Link href="/join-session">
//           <Button variant="outline" className="px-6 py-3 text-lg">
//             Join Session
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// }

import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo.png'; // Replace with your app logo if needed

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#eaf1f4] flex items-center justify-center px-4">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <Image src={logo} alt="WhiteMagic Logo" width={64} height={64} className="mx-auto mb-2" />
          <h1 className="text-4xl font-extrabold text-[#4d908e]">WhiteMagic</h1>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Welcome to WhiteMagic</h2>
          <p className="text-gray-600">The real-time collaborative whiteboard. Please log in or sign up to continue.</p>

          <div className="space-y-3 pt-4">
            <Link href="/login">
              <button className="w-full py-2 bg-[#4d908e] text-white font-semibold rounded-md hover:bg-[#3b746f] transition">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="w-full py-2 bg-gray-100 text-gray-800 font-semibold rounded-md hover:bg-gray-200 transition">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
