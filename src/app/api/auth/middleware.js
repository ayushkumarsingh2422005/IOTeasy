import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export function isAuthenticated(handler) {
  return async function (req) {
    const headersList = headers();
    const token = headersList.get('authorization');

    if (!token || !token.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid token provided' },
        { status: 401 }
      );
    }

    const actualToken = token.split(' ')[1];
    
    // In a real application, you would verify the JWT token here
    // For this example, we'll use a simple comparison with env variable
    const validToken = process.env.AUTH_TOKEN;

    if (actualToken !== validToken) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // If authentication is successful, proceed with the actual handler
    return handler(req);
  };
} 