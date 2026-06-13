import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);
const locales = ["vi", "en"] as const;
type Locale = (typeof locales)[number];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en/admin" || pathname.startsWith("/en/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en\/admin/, "/vi/admin");
    return NextResponse.redirect(url);
  }

  const adminMatch = pathname.match(/^\/(vi|en)(\/admin)(\/.*)?$/);
  const isAdminRoute = !!adminMatch;
  const isLoginPage = !!pathname.match(/^\/(vi|en)\/admin\/login/);

  if (isAdminRoute && !isLoginPage) {
    return intlMiddleware(request);
  }

  // Redirect to preferred locale from cookie when URL locale doesn't match
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value as Locale | undefined;
  if (cookieLocale && locales.includes(cookieLocale)) {
    const urlLocaleMatch = pathname.match(/^\/(vi|en)(\/|$)/);
    const urlLocale = urlLocaleMatch?.[1] as Locale | undefined;
    if (urlLocale && urlLocale !== cookieLocale) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace(`/${urlLocale}`, `/${cookieLocale}`);
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|og|trpc|_next|_vercel|.*\\..*).*)"
};
