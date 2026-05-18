import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bảo vệ các route /[locale]/admin/** (trừ trang login)
  const adminMatch = pathname.match(/^\/(vi|en)(\/admin)(\/.*)?$/);
  const isAdminRoute = !!adminMatch;
  const isLoginPage = !!pathname.match(/^\/(vi|en)\/admin\/login/);

  if (isAdminRoute && !isLoginPage) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const locale = pathname.split("/")[1];
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }

    // Gắn cookies session vào response rồi chạy tiếp intl
    const intlResponse = intlMiddleware(request);
    // Copy cookies từ auth response sang intl response
    response.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value);
    });
    return intlResponse;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|og|trpc|_next|_vercel|.*\\..*).*)"
};
