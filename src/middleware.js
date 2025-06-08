import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only apply to /api routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Skip authentication for login endpoint
    if (request.nextUrl.pathname === '/api/auth/login') {
      return NextResponse.next();
    }

    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const validToken = process.env.AUTH_TOKEN;

    if (token !== validToken) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 