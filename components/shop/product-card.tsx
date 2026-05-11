"use client";

import Image from "next/image";
import {ArrowRight, ArrowUpRight} from "lucide-react";
import {AddToCartButton} from "@/components/cart/add-to-cart-button";
import {BuyNowButton} from "@/components/cart/buy-now-button";
import {Button} from "@/components/ui/button";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content";
import {formatCurrency, localized} from "@/lib/content";

export function ProductCard({
  product,
  locale
}: {
  product: Product;
  locale: Locale;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-forest-950/10 bg-parchment-50 text-forest-950 shadow-warm transition duration-500 hover:-translate-y-1 hover:shadow-cinematic">
      {/* Image */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-[4/3] shrink-0 overflow-hidden bg-parchment-100"
      >
        <Image
          src={product.images[0]}
          alt={localized(product.name, locale)}
          fill
          className="object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.06]"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
        {/* Weight badge */}
        <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full border border-forest-950/20 bg-parchment-50/90 px-3 py-1 text-xs font-semibold text-forest-950 backdrop-blur">
          <span className="text-[10px]">⊘</span>
          {product.weight.toUpperCase()}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {/* Flavor notes */}
        <div className="flex flex-wrap gap-2">
          {localized(product.notes, locale)
            .slice(0, 3)
            .map((note) => (
              <span
                key={note}
                className="rounded-full border border-forest-950/18 px-3 py-1 text-xs text-forest-950/70"
              >
                {note}
              </span>
            ))}
        </div>

        {/* Name + price */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <h3 className="font-serif text-2xl leading-tight">
            <Link href={`/shop/${product.slug}`} className="hover:text-earth-600 transition-colors">
              {localized(product.name, locale)}
            </Link>
          </h3>
          <p className="shrink-0 pt-1 text-sm font-bold text-earth-600">
            {formatCurrency(product.price, locale)}
          </p>
        </div>

        {/* Description */}
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-forest-950/62">
          {localized(product.short, locale)}
        </p>

        {/* Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
          <AddToCartButton
            product={product}
            locale={locale}
            variant="outline"
            className="w-full border-forest-950/25 px-2 text-[13px] text-forest-950 hover:bg-forest-950/6 sm:text-sm"
          />
          <BuyNowButton
            product={product}
            className="w-full bg-earth-600 px-2 text-[13px] text-white hover:bg-earth-700 sm:text-sm"
          />
        </div>

        {/* Link */}
        <Button
          asChild
          variant="ghost"
          className="mt-3 h-9 w-full text-forest-950/55 hover:bg-forest-950/5 hover:text-earth-600"
        >
          <Link href={`/shop/${product.slug}`}>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            {localized(product.name, locale)}
            <ArrowRight className="ml-auto h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
