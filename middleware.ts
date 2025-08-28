import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const ua = req.headers.get('user-agent') || '';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  const res = NextResponse.next();
  // Only reset when changed to minimize set-cookie churn
  const existing = req.cookies.get('device')?.value;
  const target = isMobile ? 'mobile' : 'desktop';
  if (existing !== target) res.cookies.set('device', target, { path: '/', sameSite: 'lax' });
  // Basic security headers (most also added by Vercel edge, but kept here if self-hosted)
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  res.headers.set('X-XSS-Protection', '0'); // modern browsers use CSP; placeholder
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
