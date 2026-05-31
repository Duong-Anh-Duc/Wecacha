import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin pages call requireAdmin() server-side. Avoid doing a second Supabase auth
  // network request in middleware on every client navigation.
  const adminMatch = pathname.match(/^\/(vi|en)(\/admin)(\/.*)?$/);
  const isAdminRoute = !!adminMatch;
  const isLoginPage = !!pathname.match(/^\/(vi|en)\/admin\/login/);

  if (isAdminRoute && !isLoginPage) {
    return intlMiddleware(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|og|trpc|_next|_vercel|.*\\..*).*)"
};
