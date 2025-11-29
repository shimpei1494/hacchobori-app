// Proxy temporarily disabled for local development without DB/auth
// TODO: Re-enable when DB and authentication are set up
// Note: Renamed from middleware.ts to proxy.ts for Next.js 16 compatibility

import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Allow all routes during development without authentication
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
