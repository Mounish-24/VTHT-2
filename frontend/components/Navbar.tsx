'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, User } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (token) {
      setIsLoggedIn(true);
      setRole(userRole || '');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">

        {/* LEFT SIDE: LOGO + COLLEGE NAME */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Vel Tech Logo"
            width={45}
            height={45}
            className="rounded"
          />
          {/* The container below uses flex-col to stack the text vertically */}
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-xl md:text-2xl font-bold tracking-tight">
              Vel Tech High Tech
            </span>
            <span className="text-[10px] md:text-[12px] font-medium text-blue-200">
              Dr. Rangarajan Dr. Sakunthala Engineering College
            </span>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-orange-400 hidden sm:block">
            Home
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link
                href={
                  role === 'Student'
                    ? '/student'
                    : role === 'Faculty'
                      ? '/faculty'
                      : '/admin'
                }
                className="hover:text-orange-400 font-medium"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-sm font-bold transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full font-bold transition shadow-lg">
                <User size={18} /> Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}