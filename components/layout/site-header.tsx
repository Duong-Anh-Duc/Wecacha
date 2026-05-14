"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {motion} from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Coffee,
  Globe2,
  Leaf,
  Menu,
  PhoneCall,
  Search,
  Store
} from "lucide-react";
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

type DropdownItem = {
  href: string;
  label: Record<"vi" | "en", string>;
};

type NavItem = {
  href: string;
  key: string;
  icon: any;
  children?: DropdownItem[];
};

const navItems: NavItem[] = [
  { href: "/", key: "home", icon: Coffee },
  { 
    href: "/shop", 
    key: "shop", 
    icon: Store,
    children: [
      { href: "/shop", label: { vi: "Tất cả sản phẩm", en: "All Products" } },
      { href: "/shop/category/beans", label: { vi: "Cà phê hạt", en: "Whole Beans" } },
      { href: "/shop/category/phin", label: { vi: "Cà phê pha phin", en: "Phin Coffee" } },
      { href: "/shop/category/gifts", label: { vi: "Bộ quà tặng", en: "Gift Sets" } }
    ]
  },
  { 
    href: "/explore", 
    key: "explore", 
    icon: Globe2
  },
  { href: "/contact", key: "contact", icon: Leaf }
];

const drawerEase = [0.16, 1, 0.3, 1] as const;

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
  const lightHeader = false;

  return (
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
              {locale === "vi" ? "Khám phá ngay" : "Explore now"}
            </Link>
          ) : (
            <>
              <LocaleSwitcher locale={locale} pathname={pathname} solid={solid} />
              <CartDrawer solid={solid} />
            </>
          )}
          <MobileMenu solid={solid} />
        </div>
      </div>
    </header>
  );
}

const localeFlag: Record<Locale, string> = {vi: "🇻🇳", en: "🇬🇧"};

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
        "hidden h-10 items-center justify-center gap-1.5 rounded-full border border-white/28 bg-white/8 px-3 text-xs font-bold uppercase text-white backdrop-blur transition hover:bg-white/16 sm:inline-flex"
      )}
      aria-label={localeNames[nextLocale]}
    >
      <span className="text-base leading-none">{localeFlag[nextLocale]}</span>
      {nextLocale}
    </Link>
  );
}

function MobileMenu({solid}: {solid?: boolean}) {
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
      <SheetContent
        side="right"
        className="w-[min(94vw,430px)] overflow-hidden rounded-l-[30px] border-l border-parchment-300/80 bg-[radial-gradient(circle_at_18%_8%,rgba(181,101,0,0.08),transparent_28%),linear-gradient(135deg,#fffaf0_0%,#f8efd9_56%,#fff8ea_100%)] p-0"
      >
        <motion.div
          className="pointer-events-none absolute -bottom-8 -right-11 h-72 w-52 opacity-55"
          initial={{opacity: 0, x: 34, y: 28, rotate: -4}}
          animate={{opacity: 0.55, x: 0, y: 0, rotate: 0}}
          transition={{duration: 1.1, ease: drawerEase}}
        >
          <CoffeeBotanical className="h-full w-full" />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-earth-500/8 blur-3xl"
          animate={{scale: [1, 1.14, 1], opacity: [0.55, 0.9, 0.55]}}
          transition={{duration: 5.5, repeat: Infinity, ease: "easeInOut"}}
        />
        <motion.div
          className="relative flex min-h-full flex-col px-7 pb-7 pt-7"
          initial={{opacity: 0, y: 18}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.7, ease: drawerEase}}
        >
          <SheetHeader className="border-b border-earth-700/14 pb-7 pr-12">
            <SheetTitle className="sr-only">Wecacha Sơn La Coffee</SheetTitle>
            <motion.div
              initial={{opacity: 0, y: 14}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.72, delay: 0.08, ease: drawerEase}}
            >
              <Link
                href="/"
                className="group flex items-center gap-3"
                aria-label="Wecacha Sơn La Coffee"
              >
                <span className="relative flex h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full border border-earth-700/14 bg-parchment-100 shadow-warm transition duration-500 group-hover:scale-105 group-hover:shadow-cinematic">
                  <Image
                    src="/image.png"
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="72px"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-serif text-[2.45rem] leading-none text-forest-950">
                    Wecacha
                  </span>
                  <span className="mt-3 block text-[12px] font-bold uppercase tracking-[0.32em] text-forest-950/78">
                    Sơn La Coffee
                  </span>
                </span>
              </Link>
            </motion.div>
          </SheetHeader>

          <motion.nav
            className="mt-7 grid gap-0"
            aria-label="Mobile"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {transition: {staggerChildren: 0.075, delayChildren: 0.16}}
            }}
          >
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                variants={{
                  hidden: {opacity: 0, x: 28, filter: "blur(6px)"},
                  show: {opacity: 1, x: 0, filter: "blur(0px)"}
                }}
                transition={{duration: 0.68, ease: drawerEase}}
                whileHover={{x: active ? 0 : 6}}
                whileTap={{scale: 0.985}}
              >
                <SheetClose asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex min-h-[86px] items-center gap-5 border-b border-earth-700/14 px-1 text-forest-950 transition duration-500",
                      "hover:bg-forest-950/[0.03]",
                      active && "my-2 min-h-[78px] rounded-xl border border-earth-700/18 bg-parchment-50/58 px-4 text-earth-700 shadow-[0_18px_45px_rgba(76,52,20,0.08)]",
                      item.children && !active && "border-none min-h-[72px]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest-950/6 text-forest-800 transition duration-500 group-hover:scale-110 group-hover:bg-earth-600/10 group-hover:text-earth-700",
                        active && "bg-transparent text-earth-700"
                      )}
                    >
                      <Icon className="h-7 w-7 transition duration-500 group-hover:-rotate-6" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 font-serif text-[clamp(2rem,8.5vw,2.65rem)] leading-none">
                      {t(item.key)}
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "h-6 w-6 shrink-0 rotate-45 opacity-75 transition duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1.5",
                        active && "rotate-0 text-earth-700"
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </SheetClose>
                
                {item.children && (
                  <div className="mb-4 ml-16 mr-4 flex flex-col gap-1 border-b border-earth-700/14 pb-5">
                    {item.children.map((child) => (
                      <SheetClose asChild key={child.href}>
                        <Link 
                          href={child.href}
                          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-forest-950/60 transition hover:bg-forest-950/5 hover:text-earth-700"
                        >
                          {child.label[locale as "vi" | "en"]}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
          </motion.nav>

          <motion.div
            className="relative z-10 mt-8 grid grid-cols-2 gap-3"
            initial={{opacity: 0, y: 18}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, delay: 0.52, ease: drawerEase}}
          >
            <SheetClose asChild>
              <Button asChild variant="forest" className="h-14 rounded-lg text-base shadow-warm hover:shadow-cinematic">
                <Link href="/shop">
                  <Store className="h-5 w-5" aria-hidden="true" />
                  {t("shop")}
                </Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                asChild
                variant="light"
                className="h-14 rounded-lg border-forest-800/45 bg-parchment-50/62 text-base text-forest-800"
              >
                <Link href="/contact">
                  <PhoneCall className="h-5 w-5" aria-hidden="true" />
                  {t("contact")}
                </Link>
              </Button>
            </SheetClose>
          </motion.div>

          <motion.div
            className="relative z-10 mt-9 flex items-center gap-4"
            initial={{opacity: 0, scaleX: 0.82}}
            animate={{opacity: 1, scaleX: 1}}
            transition={{duration: 0.7, delay: 0.62, ease: drawerEase}}
          >
            <span className="h-px flex-1 border-t border-dashed border-earth-700/18" />
            <span className="text-earth-600">
              <Coffee className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="h-px flex-1 border-t border-dashed border-earth-700/18" />
          </motion.div>

          <motion.div
            className="relative z-10 mt-6"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, delay: 0.7, ease: drawerEase}}
          >
            <SheetClose asChild>
              <Link
                href={pathname}
                locale={nextLocale}
                className="inline-flex h-[52px] items-center gap-3 rounded-full border border-earth-700/12 bg-parchment-50/72 px-5 py-3 text-base font-bold text-forest-800 shadow-[0_12px_36px_rgba(76,52,20,0.06)] transition duration-500 hover:-translate-y-0.5 hover:bg-parchment-50 hover:shadow-warm"
              >
                <span className="text-xl leading-none">{localeFlag[nextLocale]}</span>
                {localeNames[nextLocale]}
              </Link>
            </SheetClose>
          </motion.div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

function CoffeeBotanical({className}: {className?: string}) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 320"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M160 318C154 248 151 181 184 107"
        stroke="#315B1B"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M176 187C137 190 109 210 92 243C130 246 164 226 176 187Z"
        fill="#759652"
        stroke="#315B1B"
        strokeWidth="2"
      />
      <path
        d="M193 138C151 136 122 153 101 187C143 194 180 174 193 138Z"
        fill="#88A967"
        stroke="#315B1B"
        strokeWidth="2"
      />
      <path
        d="M201 83C164 85 136 102 118 132C154 137 190 116 201 83Z"
        fill="#91AD70"
        stroke="#315B1B"
        strokeWidth="2"
      />
      <path
        d="M162 232C193 238 209 259 215 289C181 286 160 266 162 232Z"
        fill="#6F8E50"
        stroke="#315B1B"
        strokeWidth="2"
      />
      <path
        d="M171 165C205 166 225 181 237 211C201 216 177 197 171 165Z"
        fill="#7E9D5E"
        stroke="#315B1B"
        strokeWidth="2"
      />
      {[0, 1, 2, 3, 4].map((item) => (
        <circle
          key={item}
          cx={[174, 191, 202, 183, 207][item]}
          cy={[264, 252, 274, 284, 296][item]}
          r="9"
          fill="#B56500"
          stroke="#7A3F00"
          strokeWidth="2"
        />
      ))}
      <circle cx="141" cy="54" r="8" fill="#F4EEE0" stroke="#B56500" strokeWidth="2" />
      <path
        d="M134 55C114 39 112 20 131 4C149 22 151 41 134 55Z"
        fill="#FAF6E8"
        stroke="#B56500"
        strokeWidth="1.5"
      />
      <path
        d="M148 57C171 48 184 58 188 81C164 85 151 76 148 57Z"
        fill="#FAF6E8"
        stroke="#B56500"
        strokeWidth="1.5"
      />
      <path
        d="M141 66C134 91 118 99 96 87C104 65 120 58 141 66Z"
        fill="#FAF6E8"
        stroke="#B56500"
        strokeWidth="1.5"
      />
    </svg>
  );
}
