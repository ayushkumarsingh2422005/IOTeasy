'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Topbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                Hydroponics
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                href="/"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
              >
                Dashboard
              </Link>
              <Link
                href="/ems"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/ems')}`}
              >
                EMS
              </Link>
              <Link
                href="/lms"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/lms')}`}
              >
                LMS
              </Link>
              <Link
                href="/nfads"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/nfads')}`}
              >
                NFADS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 