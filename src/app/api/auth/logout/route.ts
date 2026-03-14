import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/response';

export async function POST(request: NextRequest) {
  const response = successResponse({ message: 'Logged out successfully' });

  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
