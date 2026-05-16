"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {motion, AnimatePresence} from "framer-motion";
import {ChevronDown, Coffee} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {CartDrawer} from "@/components/cart/cart-drawer";
import {Link, usePathname} from "@/i18n/navigation";
import {cn} from "@/lib/utils";
import type {Locale} from "@/i18n/routing";
import {LocaleSwitcher} from "./locale-switcher";
import {MobileMenu} from "./mobile-menu";
import {navItems} from "./nav-config";

export function SiteHeader() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [localeLoading, setLocaleLoading] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const el = document.documentElement;
      const progress = (el.scrollTop || document.body.scrollTop) / (el.scrollHeight - el.clientHeight);
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !isHome;
  const lightHeader = false;

  return (
    <>
      <AnimatePresence>
        {localeLoading && (
          <motion.div
            key="locale-overlay"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fdfcf8]/75 backdrop-blur-md"
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-[#a46131]/15" />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#a46131]"
                animate={{rotate: 360}}
                transition={{duration: 0.9, repeat: Infinity, ease: "linear"}}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#a46131]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          lightHeader
            ? "border-b border-forest-950/0 bg-[#f4f2ea]/92 backdrop-blur-xl"
            : solid
            ? "border-b border-white/10 bg-forest-950/95 shadow-cinematic backdrop-blur-xl"
            : "bg-gradient-to-b from-forest-950/78 via-forest-950/34 to-transparent"
        )}
      >
        {/* Scroll progress bar — tạm ẩn */}
        {/* <div className="absolute top-0 left-0 right-0 h-[3px] z-10">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-[#38bdf8] via-[#4ade80] to-[#a3e635]"
            style={{scaleX: scrollProgress}}
            transition={{duration: 0}}
          />
        </div> */}
        <div className={cn(
          "mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8",
          lightHeader ? "max-w-[1720px]" : "max-w-7xl"
        )}>
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
              <span className={cn(
                "block font-serif text-xl transition-colors duration-500",
                lightHeader ? "text-forest-950" : "text-white"
              )}>
                Wecacha
              </span>
              <span className={cn(
                "block text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-500",
                lightHeader ? "text-forest-950/70" : "text-white/80"
              )}>
                Sơn La Coffee
              </span>
            </span>
          </Link>

          <nav className="hidden h-full items-center gap-8 lg:flex" aria-label="Main">
            {navItems.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <div key={item.href} className="group relative flex h-full items-center">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember",
                      lightHeader
                        ? "text-forest-950 hover:bg-forest-950/7 hover:text-forest-950"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                      active &&
                        (lightHeader
                          ? "bg-forest-950 text-parchment-50 shadow-warm"
                          : "bg-white/10 text-ember shadow-[0_0_28px_rgba(181,101,0,0.22)]")
                    )}
                  >
                    {t(item.key)}
                    {item.children && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 transition duration-300 group-hover:rotate-180" aria-hidden="true" />
                    )}
                  </Link>

                  {item.children && (
                    <div className="invisible absolute left-1/2 top-full -mt-2 w-56 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className={cn(
                        "overflow-hidden rounded-2xl p-1.5 shadow-cinematic",
                        lightHeader
                          ? "border border-forest-950/12 bg-[#fffaf0]"
                          : "border border-white/10 bg-forest-950/95 backdrop-blur-xl"
                      )}>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block rounded-xl px-4 py-2.5 text-sm font-medium transition",
                              lightHeader
                                ? "text-forest-950/70 hover:bg-forest-950/8 hover:text-forest-950"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            {child.label[locale as "vi" | "en"]}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {lightHeader ? (
              <Link
                href="/explore"
                className="hidden h-12 items-center gap-3 rounded-full bg-forest-950 px-7 text-sm font-bold text-parchment-50 shadow-warm transition hover:-translate-y-0.5 hover:bg-forest-900 lg:inline-flex"
              >
                <Coffee className="h-4 w-4" aria-hidden="true" />
                {tCommon("exploreNow")}
              </Link>
            ) : (
              <>
                <LocaleSwitcher locale={locale} pathname={pathname} solid={solid} onLoading={setLocaleLoading} />
                <CartDrawer solid={solid} />
              </>
            )}
            <MobileMenu solid={solid} onLoading={setLocaleLoading} />
          </div>
        </div>
      </header>
    </>
  );
}
