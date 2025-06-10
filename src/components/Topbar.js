'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Topbar({ onRefresh, onLogout, isRefreshing, lastRefresh }) {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-blue-100 border-blue-500' : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100 border-transparent';
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto">
        <div className="mx-4 sm:mx-6 lg:mx-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">H</span>
                  </div>
                  <span className="text-lg font-bold text-gray-100 hidden sm:block">
                    Hydroponics
                  </span>
                </Link>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                {[
                  { path: '/', label: 'Dashboard' },
                  { path: '/ems', label: 'EMS' },
                  { path: '/lms', label: 'LMS' },
                  { path: '/nfads', label: 'NFADS' }
                ].map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border-l-2 transition-all duration-200 ${isActive(link.path)}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              {/* Last Update Badge */}
              {lastRefresh && (
                <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                  <svg className="w-3 h-3 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-gray-400">
                    {lastRefresh.toLocaleTimeString()}
                  </span>
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 text-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-all duration-200 ${
                  isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isRefreshing}
              >
                <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-900 to-red-800 text-red-100 hover:from-red-800 hover:to-red-700 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden py-2">
            <div className="flex space-x-1">
              {[
                { path: '/', label: 'Dashboard' },
                { path: '/ems', label: 'EMS' },
                { path: '/lms', label: 'LMS' },
                { path: '/nfads', label: 'NFADS' }
              ].map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`flex-1 text-center px-2 py-2 rounded-md text-sm font-medium ${isActive(link.path)}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
} 