import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from './src/lib/auth/constants';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/produtos') && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && token) {
    const productsUrl = new URL('/produtos', request.url);
    return NextResponse.redirect(productsUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/produtos/:path*']
};

