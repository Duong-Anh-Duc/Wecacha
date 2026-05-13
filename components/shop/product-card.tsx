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
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content";
import {formatCurrency, localized} from "@/lib/content";

function productHighlights(product: Product, locale: Locale) {
  if (product.category === "gifts") {
    return locale === "vi"
      ? [
          {icon: Sparkles, label: "Thiết kế thủ công"},
          {icon: Gift, label: "Quà tặng ý nghĩa"},
          {icon: PackageCheck, label: "Hộp cao cấp"}
        ]
      : [
          {icon: Sparkles, label: "Handcrafted design"},
          {icon: Gift, label: "Meaningful gift"},
          {icon: PackageCheck, label: "Premium box"}
        ];
  }

  return [
    {
      icon: ShieldCheck,
      label:
        product.category === "phin"
          ? locale === "vi"
            ? "100% Robusta"
            : "100% Robusta"
          : locale === "vi"
            ? "100% Arabica"
            : "100% Arabica"
    },
    {icon: Flame, label: locale === "vi" ? "Rang mộc" : "Natural roast"},
    {
      icon: product.category === "phin" ? Coffee : MapPin,
      label:
        product.category === "phin"
          ? locale === "vi"
            ? "Đậm đà"
            : "Bold cup"
          : locale === "vi"
            ? "Nông trại Sơn La"
            : "Son La farms"
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
  return (
    <motion.article
      initial={{opacity: 0, y: 28}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-80px"}}
      whileHover={{y: -12}}
      transition={{duration: 0.62, ease: [0.16, 1, 0.3, 1]}}
      className="group relative flex min-h-[560px] overflow-hidden rounded-[26px] border border-ember/18 bg-[#0a1808] text-parchment-50 shadow-[0_26px_80px_rgba(0,0,0,0.28)] transition duration-500 hover:border-ember/45 hover:shadow-[0_34px_110px_rgba(243,167,52,0.18)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -inset-px rounded-[26px] bg-[radial-gradient(circle_at_50%_0%,rgba(243,167,52,0.22),transparent_42%),radial-gradient(circle_at_18%_80%,rgba(65,122,0,0.22),transparent_42%)]" />
      </div>

      <Link
        href={`/shop/${product.slug}`}
        className="absolute inset-0 block overflow-hidden"
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
      </Link>

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
          <span className="grid h-12 w-12 place-items-center rounded-full border border-parchment-50/24 bg-forest-950/42 text-parchment-50 backdrop-blur transition duration-300 group-hover:scale-110 group-hover:border-ember/80 group-hover:bg-ember/18 group-hover:text-ember">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        {product.category === "gifts" ? (
          <div className="mt-2 w-28 bg-forest-950/84 px-4 pb-7 pt-7 text-center text-sm font-black uppercase leading-5 text-parchment-50 shadow-[0_20px_44px_rgba(0,0,0,0.32)] [clip-path:polygon(0_0,100%_0,100%_100%,50%_82%,0_100%)]">
            {locale === "vi" ? "Quà tặng cao cấp" : "Premium gift"}
          </div>
        ) : null}

        <div className="mt-auto">
          <div className="mb-5 flex flex-wrap gap-2">
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

          <div className="flex items-start justify-between gap-4">
            <h3 className="font-serif text-3xl leading-tight text-parchment-50 sm:text-[2rem]">
              <Link
                href={`/shop/${product.slug}`}
                className="transition-colors hover:text-ember"
              >
                {localized(product.name, locale)}
              </Link>
            </h3>
            <p className="shrink-0 pt-2 text-lg font-black text-ember">
              {formatCurrency(product.price, locale)}
            </p>
          </div>

          <p className="mt-4 line-clamp-2 text-base font-medium leading-7 text-parchment-50/78">
            {localized(product.short, locale)}
          </p>

          <div
            className={
              product.category === "gifts"
                ? "mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-earth-500/48 bg-earth-900/34 p-3"
                : "mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-forest-600/42 bg-forest-950/48 p-3"
            }
          >
            {productHighlights(product, locale).map(({icon: Icon, label}) => (
              <div key={label} className="flex items-center gap-2 text-[11px] font-bold text-parchment-50/86">
                <Icon className="h-4 w-4 shrink-0 text-ember" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-5">
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

          <Link
            href={`/shop/${product.slug}`}
            className="mt-5 flex h-11 items-center justify-between rounded-xl px-2 text-sm font-bold text-parchment-100/80 transition duration-300 hover:bg-parchment-50/8 hover:text-ember"
          >
            <span className="inline-flex items-center gap-2">
              <Leaf className="h-4 w-4 text-forest-600 transition duration-300 group-hover:text-ember" aria-hidden="true" />
              {locale === "vi" ? "Khám phá ngay" : "Explore"} {localized(product.name, locale)}
            </span>
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
