import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_API = ['/api/auth/login', '/api/auth/register', '/api/debug'];
const PUBLIC_PAGES = ['/', '/login', '/register'];

async function verifyJWT(token: string, secret: string): Promise<boolean> {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !signatureB64) return false;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const signature = Uint8Array.from(
      atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify('HMAC', cryptoKey, signature, data);
    if (!valid) return false;

    // Check expiry
    const payload = JSON.parse(atob(payloadB64));
    if (payload.exp && Date.now() / 1000 > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_API.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (pathname.startsWith('/_next') || pathname === '/favicon.ico') return NextResponse.next();

  const token = request.cookies.get('token')?.value;
  const secret = process.env.JWT_SECRET || '';
  const isValid = token ? await verifyJWT(token, secret) : false;

  if (PUBLIC_PAGES.includes(pathname)) {
    if (isValid) return NextResponse.redirect(new URL('/dashboard', request.url));
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    if (!isValid) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    return NextResponse.next();
  }

  if (!isValid) return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};