"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {Menu} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {CartDrawer} from "@/components/cart/cart-drawer";
import {Button} from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {Link, usePathname} from "@/i18n/navigation";
import {localeNames} from "@/lib/site";
import {cn} from "@/lib/utils";
import type {Locale} from "@/i18n/routing";

const navItems = [
  {href: "/", key: "home"},
  {href: "/story", key: "story"},
  {href: "/shop", key: "shop"},
  {href: "/explore", key: "explore"},
  {href: "/contact", key: "contact"}
] as const;

export function SiteHeader() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-forest-950/10 bg-parchment-50/96 shadow-sm backdrop-blur-xl"
          : "bg-gradient-to-b from-forest-950/78 via-forest-950/34 to-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          aria-label="Wecacha Sơn La Coffee"
        >
          <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-forest-950/20 bg-parchment-50 shadow-warm">
            <Image
              src="/image.png"
              alt=""
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </span>
          <span className="leading-none">
            <span className={cn("block font-serif text-xl transition-colors duration-500", solid ? "text-forest-950" : "text-white")}>
              Wecacha
            </span>
            <span className={cn("block text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-500", solid ? "text-forest-950/60" : "text-white/78")}>
              Sơn La Coffee
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember",
                  solid
                    ? "text-forest-950/75 hover:bg-forest-950/6 hover:text-forest-950"
                    : "text-white/82 hover:bg-white/10 hover:text-white",
                  active && solid && "bg-forest-950/8 text-earth-600",
                  active && !solid && "bg-white/10 text-ember shadow-[0_0_28px_rgba(181,101,0,0.22)]"
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} pathname={pathname} solid={solid} />
          <CartDrawer />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function LocaleSwitcher({
  locale,
  pathname,
  solid
}: {
  locale: Locale;
  pathname: string;
  solid: boolean;
}) {
  const nextLocale = locale === "vi" ? "en" : "vi";

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      className={cn(
        "hidden h-10 min-w-14 items-center justify-center rounded-full border px-3 text-xs font-bold uppercase transition sm:inline-flex",
        solid
          ? "border-forest-950/20 text-forest-950/70 hover:bg-forest-950/6 hover:text-forest-950"
          : "border-white/28 bg-white/8 text-white backdrop-blur hover:bg-white/16"
      )}
      aria-label={localeNames[nextLocale]}
    >
      {nextLocale}
    </Link>
  );
}

function MobileMenu() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const nextLocale = locale === "vi" ? "en" : "vi";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/28 bg-white/8 text-white backdrop-blur transition hover:bg-white/16 lg:hidden"
          aria-label={t("menu")}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Wecacha · Sơn La Coffee</SheetTitle>
        </SheetHeader>
        <nav className="mt-10 grid gap-2" aria-label="Mobile">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-3 font-serif text-3xl text-forest-950 transition hover:bg-forest-800/8",
                    active && "text-earth-700"
                  )}
                >
                  {t(item.key)}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
        <div className="mt-8 flex gap-3">
          <Button asChild variant="forest">
            <Link href="/shop">{t("shop")}</Link>
          </Button>
          <Button asChild variant="light">
            <Link href="/contact">{t("contact")}</Link>
          </Button>
        </div>
        <div className="mt-8 border-t border-forest-950/12 pt-5">
          <SheetClose asChild>
            <Link
              href={pathname}
              locale={nextLocale}
              className="inline-flex h-10 items-center rounded-full border border-forest-950/14 px-4 text-sm font-semibold text-forest-950"
            >
              {localeNames[nextLocale]}
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
