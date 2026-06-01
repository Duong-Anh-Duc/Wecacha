"use client";

import Image from "next/image";
import {motion} from "framer-motion";
import {ArrowUpRight, Coffee, Menu, PhoneCall, Store} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {Link, usePathname, useRouter} from "@/i18n/navigation";
import {localeNames} from "@/lib/site";
import {cn} from "@/lib/utils";
import type {Locale} from "@/i18n/routing";
import {drawerEase, localeFlag, navItems} from "./nav-config";

export function MobileMenu({onLoading}: {solid?: boolean; onLoading: (v: boolean) => void}) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const nextLocale = locale === "vi" ? "en" : "vi";
  const router = useRouter();
  const isGreenHome = pathname === "/green";

  function handleMobileSwitch() {
    onLoading(true);
    router.replace(pathname, {locale: nextLocale, scroll: false});
  }

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
        className={cn(
          "w-[min(94vw,430px)] overflow-hidden rounded-l-[30px] p-0",
          isGreenHome
            ? "border-l border-brand-green/40 bg-[radial-gradient(circle_at_18%_8%,rgba(74,117,29,0.18),transparent_28%),linear-gradient(135deg,#edf4e2_0%,#dce9c9_56%,#f4f8eb_100%)]"
            : "border-l border-parchment-300/80 bg-[radial-gradient(circle_at_18%_8%,rgba(181,101,0,0.08),transparent_28%),linear-gradient(135deg,#fffaf0_0%,#f8efd9_56%,#fff8ea_100%)]"
        )}
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
          className={cn(
            "pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full blur-3xl",
            isGreenHome ? "bg-brand-green/12" : "bg-earth-500/8"
          )}
          animate={{scale: [1, 1.14, 1], opacity: [0.55, 0.9, 0.55]}}
          transition={{duration: 5.5, repeat: Infinity, ease: "easeInOut"}}
        />
        <motion.div
          className="relative flex h-full flex-col overflow-y-auto px-7 pb-7 pt-7"
          initial={{opacity: 0, y: 18}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.7, ease: drawerEase}}
        >
          <SheetHeader className={cn("pb-7 pr-12", isGreenHome ? "border-b border-brand-green/18" : "border-b border-earth-700/14")}>
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
                  <span className={cn("block truncate font-serif text-[2.45rem] leading-none", isGreenHome ? "text-brand-green" : "text-forest-950")}>
                    Wecacha
                  </span>
                  <span className={cn("mt-3 block text-[12px] font-bold uppercase tracking-[0.32em]", isGreenHome ? "text-brand-green/78" : "text-forest-950/78")}>
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
                      "group flex min-h-[86px] w-full items-center gap-5 px-2 text-forest-950 transition duration-500 outline-none",
                      isGreenHome ? "hover:bg-brand-green/[0.06] focus-visible:bg-brand-green/[0.06]" : "hover:bg-forest-950/[0.03] focus-visible:bg-forest-950/[0.03]",
                      active && (isGreenHome ? "text-brand-green" : "text-earth-700"),
                      item.children && "min-h-[72px]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-forest-800 transition duration-500 group-hover:scale-110",
                        isGreenHome ? "bg-brand-green/8 group-hover:bg-brand-green/16 group-hover:text-brand-green" : "bg-forest-950/6 group-hover:bg-earth-600/10 group-hover:text-earth-700",
                        active && (isGreenHome ? "bg-brand-green/16 text-brand-green" : "bg-earth-600/10 text-earth-700")
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
                        active && (isGreenHome ? "rotate-0 text-brand-green" : "rotate-0 text-earth-700")
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </SheetClose>

                {item.children && (
                  <div className="mb-4 ml-16 mr-4 flex flex-col gap-1 pb-5">
                    {item.children.map((child) => (
                      <SheetClose asChild key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            "rounded-lg px-4 py-2.5 text-sm font-semibold text-forest-950/60 transition",
                            isGreenHome ? "hover:bg-brand-green/8 hover:text-brand-green" : "hover:bg-forest-950/5 hover:text-earth-700"
                          )}
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
            className="relative z-10 mt-8 grid grid-cols-1 gap-3"
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
                className={cn(
                  "h-14 rounded-lg bg-parchment-50/62 text-base text-forest-800",
                  isGreenHome ? "border-brand-green/45 text-brand-green" : "border-forest-800/45"
                )}
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
            className="relative z-10 mt-6 flex justify-center pb-8"
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, delay: 0.7, ease: drawerEase}}
          >
            <SheetClose asChild>
              <button
                onClick={handleMobileSwitch}
                className={cn(
                  "inline-flex h-[52px] items-center gap-3 rounded-full bg-parchment-50/72 px-6 py-3 text-[15px] font-bold shadow-[0_12px_36px_rgba(76,52,20,0.06)] transition duration-500 hover:-translate-y-0.5 hover:bg-parchment-50 hover:shadow-warm",
                  isGreenHome ? "border border-brand-green/18 text-brand-green" : "border border-earth-700/12 text-forest-800"
                )}
              >
                <span className="text-[22px] leading-none">{localeFlag[nextLocale]}</span>
                {localeNames[nextLocale]}
              </button>
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
