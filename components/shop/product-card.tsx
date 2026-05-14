"use client";

import Image from "next/image";
import {motion} from "framer-motion";
import {
  ArrowRight,
  Coffee,
  Flame,
  Gift,
  Heart,
  Leaf,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import {AddToCartButton} from "@/components/cart/add-to-cart-button";
import {BuyNowButton} from "@/components/cart/buy-now-button";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content";
import {formatCurrency, localized} from "@/lib/content";

function productHighlights(product: Product, t: ReturnType<typeof useTranslations<"Product">>) {
  if (product.category === "gifts") {
    return [
      {icon: Sparkles, label: t("handicrafted")},
      {icon: Gift, label: t("meaningfulGift")},
      {icon: PackageCheck, label: t("premiumBox")}
    ];
  }

  return [
    {
      icon: ShieldCheck,
      label: product.category === "phin" ? "100% Robusta" : "100% Arabica"
    },
    {icon: Flame, label: t("naturalRoast")},
    {
      icon: product.category === "phin" ? Coffee : MapPin,
      label: product.category === "phin" ? t("boldCup") : t("sonLaFarms")
    }
  ];
}

export function ProductCard({
  product,
  locale
}: {
  product: Product;
  locale: Locale;
}) {
  const tProduct = useTranslations("Product");
  return (
    <motion.article
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-40px"}}
      transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-[#0a180a] shadow-[0_12px_44px_rgba(4,14,4,0.38)] transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_24px_88px_rgba(251,191,36,0.22)] border border-[#142918]/60"
    >
      <div className="absolute inset-0 z-0 h-full w-full opacity-60 mix-blend-screen transition duration-1000 ease-in-out group-hover:scale-105 group-hover:opacity-100">
        <div className="absolute -inset-px rounded-[26px] bg-[radial-gradient(circle_at_50%_0%,rgba(243,167,52,0.22),transparent_42%),radial-gradient(circle_at_18%_80%,rgba(65,122,0,0.22),transparent_42%)]" />
      </div>

      <div
        className="absolute inset-0 z-10 block overflow-hidden"
        aria-label={localized(product.name, locale)}
      >
        <Image
          src={product.images[0]}
          alt={localized(product.name, locale)}
          fill
          quality={95}
          loading="lazy"
          className="object-cover object-center contrast-110 saturate-115 transition duration-[1600ms] ease-out group-hover:scale-[1.035]"
          sizes="(min-width: 1536px) 34vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,18,4,0)_0%,rgba(4,18,4,0.04)_34%,rgba(7,12,5,0.68)_62%,rgba(7,10,4,0.96)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-[radial-gradient(circle_at_50%_12%,rgba(181,101,0,0.16),transparent_44%)]" />

      <div className="relative z-10 flex min-h-full w-full flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-xl bg-parchment-50 px-3 py-2 text-sm font-black uppercase text-forest-950 shadow-[0_12px_24px_rgba(0,0,0,0.2)]">
            {product.category === "gifts" ? (
              <Gift className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Coffee className="h-4 w-4" aria-hidden="true" />
            )}
            {product.weight.toUpperCase()}
          </span>
        </div>

        {product.category === "gifts" ? (
          <div className="mt-2 w-28 bg-forest-950/84 px-4 pb-7 pt-7 text-center text-sm font-black uppercase leading-5 text-parchment-50 shadow-[0_20px_44px_rgba(0,0,0,0.32)] [clip-path:polygon(0_0,100%_0,100%_100%,50%_82%,0_100%)]">
            {tProduct("premiumGift")}
          </div>
        ) : null}

        <div className="mt-auto">
          <div className="mb-5 flex min-h-[32px] flex-wrap items-start gap-2">
            {localized(product.notes, locale)
              .slice(0, 3)
              .map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-parchment-50/20 bg-parchment-50/10 px-3 py-1.5 text-xs font-semibold text-parchment-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur"
                >
                  {note}
                </span>
              ))}
          </div>

          <div className="flex min-h-[76px] items-start justify-between gap-4 sm:min-h-[80px]">
            <h3 className="line-clamp-2 font-serif text-3xl leading-tight text-parchment-50 sm:text-[2rem]">
              <span className="transition-colors group-hover:text-ember">
                {localized(product.name, locale)}
              </span>
            </h3>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              {product.originalPrice && product.originalPrice > product.price ? (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-white/50 line-through">
                    {formatCurrency(product.originalPrice, locale)}
                  </span>
                  <span className="rounded-md bg-red-500/20 px-1.5 py-0.5 text-[10px] font-extrabold text-red-400">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </div>
              ) : null}
              <div className="animate-pulse rounded-xl border border-ember/60 bg-ember/10 px-3 py-1.5 shadow-[0_0_16px_rgba(243,167,52,0.4)] backdrop-blur-md">
                <p className="text-[17px] font-black text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]">
                  {formatCurrency(product.price, locale)}
                </p>
              </div>
            </div>
          </div>

          <div
            className={
              product.category === "gifts"
                ? "mt-6 flex min-h-[76px] flex-wrap items-center gap-3 rounded-xl border border-earth-500/50 bg-earth-900/30 p-3 sm:min-h-[84px]"
                : "mt-6 flex min-h-[76px] flex-wrap items-center gap-3 rounded-xl border border-forest-600/40 bg-forest-950/50 p-3 sm:min-h-[84px]"
            }
          >
            {productHighlights(product, tProduct).map(({icon: Icon, label}) => (
              <div key={label} className="flex items-center gap-2 text-[11px] font-bold text-parchment-50/90">
                <Icon className="h-4 w-4 shrink-0 text-ember" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-2 gap-3 relative z-30">
            <AddToCartButton
              product={product}
              locale={locale}
              variant="default"
              className="h-11 w-full rounded-2xl px-3 text-[13px] font-semibold"
            />
            <BuyNowButton
              product={product}
              variant="forest"
              className="h-11 w-full rounded-2xl px-3 text-[13px] font-semibold"
            />
          </div>

          <div
            className="mt-3 flex h-11 items-center justify-between rounded-xl px-2 text-sm font-bold text-ember animate-pulse drop-shadow-[0_0_6px_rgba(243,167,52,0.4)] transition duration-300 group-hover:bg-parchment-50/8 group-hover:text-amber-400 group/explore"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ember transition duration-300 group-hover/explore:scale-125 group-hover:text-amber-400" aria-hidden="true" />
              {tProduct("exploreNow")} {localized(product.name, locale)}
            </span>
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover/explore:translate-x-2" aria-hidden="true" />
          </div>
        </div>
        
        {/* Stretched link to make the entire card clickable */}
        <Link href={`/shop/${product.slug}`} className="absolute inset-0 z-20" aria-label={localized(product.name, locale)} />
      </div>
    </motion.article>
  );
}
