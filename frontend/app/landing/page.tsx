// // app/landing/page.tsx

// import Link from 'next/link';
// import Image from 'next/image';
// import logo from '@/public/logo.png'; // Replace with your app logo if needed

// export default function LandingPage() {
//   return (
//     <main className="min-h-screen bg-[#eaf1f4] flex items-center justify-center px-4">
//       <div className="flex flex-col items-center space-y-6">
//         <div className="text-center">
//           <Image src={logo} alt="WhiteMagic Logo" width={64} height={64} className="mx-auto mb-2" />
//           <h1 className="text-4xl font-extrabold text-[#4d908e]">WhiteMagic</h1>
//         </div>

//         <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md text-center space-y-4">
//           <h2 className="text-xl font-bold text-gray-800">Welcome to WhiteMagic</h2>
//           <p className="text-gray-600">The real-time collaborative whiteboard. Please log in or sign up to continue.</p>

//           <div className="space-y-3 pt-4">
//             <Link href="/login">
//               <button className="w-full py-2 bg-[#4d908e] text-white font-semibold rounded-md hover:bg-[#3b746f] transition">
//                 Login
//               </button>
//             </Link>
//             <Link href="/signup">
//               <button className="w-full py-2 bg-gray-100 text-gray-800 font-semibold rounded-md hover:bg-gray-200 transition">
//                 Sign Up
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
