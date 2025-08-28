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
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
