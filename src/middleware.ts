import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const portalAuthEnabled = process.env.ENABLE_PORTAL_AUTH === 'true';

export async function middleware(request: NextRequest) {
  if (!portalAuthEnabled) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/app')) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Mockup mode: only check that a token exists.
    // JWT verification can be re-enabled when backend auth wiring is ready.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
