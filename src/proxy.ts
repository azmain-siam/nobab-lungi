import { getToken } from 'next-auth/jwt';
import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleIntl = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Redirect localized dashboard URLs (/en/dashboard, /bn/dashboard) to unlocalized /dashboard
  if (pathname.match(/^\/(?:en|bn)\/dashboard/)) {
    const cleanDashboardPath = pathname.replace(/^\/(?:en|bn)/, '');
    return NextResponse.redirect(new URL(cleanDashboardPath, request.url));
  }

  // 2. Handle /dashboard routes directly (Bypassing next-intl to avoid locale rewriting/404s)
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  // 3. For non-dashboard routes, run next-intl middleware first
  const response = handleIntl(request);

  // Normalize pathname by stripping locale prefix (/en or /bn)
  const cleanPathname = pathname.replace(/^\/(?:en|bn)/, '') || '/';

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Protect /account routes — must be logged in; Admin redirected to /dashboard
  if (cleanPathname.startsWith('/account')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  const authOnlyPaths = ['/login', '/register', '/forgot-password'];
  if (token && authOnlyPaths.includes(cleanPathname)) {
    if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return response;
}

export const middleware = proxy;

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|favicon.ico|sitemap.xml|robots.txt|images/|.*\\..*).*)',
    '/dashboard/:path*'
  ],
};
