"use client";

import Image from "next/image";
import Link from "next/link";
import {motion} from "framer-motion";
import {
  ArrowRight,
  Coffee,
  Gift,
  Sparkles
} from "lucide-react";
import {AddToCartButton} from "@/components/cart/add-to-cart-button";
import {BuyNowButton} from "@/components/cart/buy-now-button";
import {useTranslations} from "next-intl";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content/types";
import {formatCurrency, localized} from "@/lib/content/helpers";

export function ProductCard({
  product,
  locale
}: {
  product: Product;
  locale: Locale;
}) {
  const tProduct = useTranslations("Product");
  const image = product.images[0] ?? "/image.png";
  const unitLabel = product.weight ? product.weight.toUpperCase() : product.baseUnit;
  const productName = localized(product.name, locale);
  const productDescription = localized(product.description, locale);
  return (
    <motion.article
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-40px"}}
      transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
      className="group relative flex h-full min-h-[430px] flex-col overflow-hidden rounded-[2rem] border border-[#142918]/60 bg-[#0a180a] shadow-[0_12px_44px_rgba(4,14,4,0.38)] transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_24px_88px_rgba(251,191,36,0.22)] sm:min-h-[460px]"
    >
      <div className="absolute inset-0 z-0 h-full w-full opacity-60 mix-blend-screen transition duration-1000 ease-in-out group-hover:scale-105 group-hover:opacity-100">
        <div className="absolute -inset-px rounded-[26px] bg-[radial-gradient(circle_at_50%_0%,rgba(243,167,52,0.22),transparent_42%),radial-gradient(circle_at_18%_80%,rgba(65,122,0,0.22),transparent_42%)]" />
      </div>

      <div
        className="absolute inset-0 z-10 block overflow-hidden"
        aria-label={productName}
      >
        <Image
          src={image}
          alt=""
          fill
          aria-hidden="true"
          quality={80}
          loading="lazy"
          className="scale-110 object-cover object-center opacity-55 blur-xl transition duration-[1600ms] ease-out group-hover:scale-[1.13] group-hover:opacity-70"
          sizes="(min-width: 1536px) 34vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <Image
          src={image}
          alt={productName}
          fill
          quality={95}
          loading="lazy"
          className="object-cover object-center contrast-110 saturate-115 transition duration-[1600ms] ease-out group-hover:scale-[1.02]"
          sizes="(min-width: 1536px) 34vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,18,4,0)_0%,rgba(4,18,4,0.04)_34%,rgba(7,12,5,0.68)_62%,rgba(7,10,4,0.96)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] bg-[radial-gradient(circle_at_50%_12%,rgba(181,101,0,0.16),transparent_44%)]" />

      <div className="relative z-10 flex min-h-full w-full flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          {unitLabel ? (
            <span className="inline-flex max-w-[48%] items-center gap-2 rounded-xl bg-parchment-50 px-3 py-2 text-sm font-black uppercase text-forest-950 shadow-[0_12px_24px_rgba(0,0,0,0.2)]">
              {product.category === "gifts" ? (
                <Gift className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <Coffee className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              <span className="truncate">{unitLabel}</span>
            </span>
          ) : null}
        </div>

        {product.category === "gifts" ? (
          <div className="mt-2 w-28 bg-forest-950/84 px-4 pb-7 pt-7 text-center text-sm font-black uppercase leading-5 text-parchment-50 shadow-[0_20px_44px_rgba(0,0,0,0.32)] [clip-path:polygon(0_0,100%_0,100%_100%,50%_82%,0_100%)]">
            {tProduct("premiumGift")}
          </div>
        ) : null}

        <div className="mt-auto min-w-0">
          <div className="grid min-h-[108px] grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <h3 className="line-clamp-2 min-w-0 break-words font-serif text-[2rem] leading-[1.08] text-parchment-50 sm:text-[2.15rem]">
              <span className="transition-colors group-hover:text-ember">
                {productName}
              </span>
            </h3>
            <div className="flex min-w-0 justify-start sm:justify-end">
              <div className="max-w-full rounded-xl border border-ember/60 bg-ember/10 px-3 py-1.5 shadow-[0_0_16px_rgba(243,167,52,0.4)] backdrop-blur-md">
                <p className="truncate text-[15px] font-black leading-6 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)] sm:text-[16px]">
                  {formatCurrency(product.price, locale)}
                </p>
              </div>
            </div>
          </div>

          {productDescription ? (
            <div className="mt-4 min-h-[68px] overflow-hidden rounded-xl border border-forest-600/40 bg-forest-950/50 p-3 text-sm leading-[1.55] text-parchment-50/90">
              <p
                className="overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2
                }}
                title={productDescription}
              >
                {productDescription}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-4 min-w-0">
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
            <span className="inline-flex min-w-0 items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-ember transition duration-300 group-hover/explore:scale-125 group-hover:text-amber-400" aria-hidden="true" />
              <span className="truncate">
                {tProduct("exploreNow")} {productName}
              </span>
            </span>
            <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition duration-300 group-hover/explore:translate-x-2" aria-hidden="true" />
          </div>
        </div>
        
        {/* Stretched link to make the entire card clickable */}
        <Link href={`/${locale}/shop/${product.slug}`} className="absolute inset-0 z-20" aria-label={productName} />
      </div>
    </motion.article>
  );
}
