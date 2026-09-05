import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 🛡️ Next.js Middleware: Bảo vệ các route Dashboard & Điều hướng đăng nhập
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('hn_user_session');

  const isProtectedPath =
    pathname.startsWith('/student') ||
    pathname.startsWith('/teacher') ||
    pathname.startsWith('/dashboard');

  // 1. Chưa đăng nhập mà truy cập vào route bảo vệ -> Chuyển hướng về /login
  if (isProtectedPath) {
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Đã đăng nhập mà vào lại /login hoặc /signup -> Chuyển hướng về Dashboard
  if (pathname === '/login' || pathname === '/signup') {
    if (sessionCookie && sessionCookie.value) {
      try {
        const user = JSON.parse(sessionCookie.value);
        const isTeacher =
          user.role === 'teacher' ||
          user.role === 'instructor' ||
          user.role === 'administrator';
        const target = isTeacher ? '/teacher' : '/student';
        return NextResponse.redirect(new URL(target, request.url));
      } catch {
        // Cookie không hợp lệ -> Tiếp tục trang login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/student/:path*',
    '/teacher/:path*',
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
};
