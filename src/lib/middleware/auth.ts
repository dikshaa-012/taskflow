import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, JWTPayload } from '@/lib/jwt';
import { errorResponse } from '@/lib/response';

export type AuthenticatedHandler = (
  request: NextRequest,
  context: { params?: Record<string, string> },
  user: JWTPayload
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (
    request: NextRequest,
    context: { params?: Record<string, string> }
  ): Promise<NextResponse> => {
    const user = getUserFromRequest(request);
    if (!user) {
      return errorResponse('Unauthorized. Please log in.', 401);
    }
    return handler(request, context, user);
  };
}
