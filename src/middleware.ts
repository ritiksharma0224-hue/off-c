import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "kapdology_admin_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes, excluding /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !token.includes(".")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const [encodedPayload] = token.split(".");
      // Decode base64url payload
      const payloadStr = atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(payloadStr);

      if (!payload.expiresAt || Date.now() > payload.expiresAt) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(ADMIN_COOKIE_NAME);
        return response;
      }
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
