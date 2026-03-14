import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { withAuth } from '@/lib/middleware/auth';
import { successResponse, errorResponse } from '@/lib/response';

export const GET = withAuth(async (request: NextRequest, context, user) => {
  try {
    await dbConnect();
    const dbUser = await User.findById(user.userId).select('-password');
    if (!dbUser) return errorResponse('User not found', 404);
    return successResponse({ user: dbUser });
  } catch (error) {
    console.error('Profile error:', error);
    return errorResponse('Internal server error', 500);
  }
});
