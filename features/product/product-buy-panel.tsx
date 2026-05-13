"use client";

import {useState} from "react";
import {Minus, Plus} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {AddToCartButton} from "@/components/cart/add-to-cart-button";
import {BuyNowButton} from "@/components/cart/buy-now-button";
import {Button} from "@/components/ui/button";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content";
import {formatCurrency, localized} from "@/lib/content";

export function ProductBuyPanel({product}: {product: Product}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Common");
  const productT = useTranslations("Product");
  const [quantity, setQuantity] = useState(1);

  return (
    <aside className="sticky top-28 rounded-md border border-forest-950/10 bg-parchment-50 p-5 shadow-warm">
      <p className="text-xs font-bold uppercase text-earth-600">
        {product.weight}
      </p>
      <h1 className="mt-3 font-serif text-5xl leading-tight text-forest-950">
        {localized(product.name, locale)}
      </h1>
      <p className="mt-4 text-base leading-7 text-forest-950/68">
        {localized(product.description, locale)}
      </p>
      <p className="mt-6 text-2xl font-bold text-earth-700">
        {formatCurrency(product.price, locale)}
      </p>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold">{t("quantity")}</p>
        <div className="inline-flex items-center rounded-full border border-forest-950/14">
          <button
            className="p-3"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label={t("decreaseQty")}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-10 text-center font-semibold">{quantity}</span>
          <button
            className="p-3"
            onClick={() => setQuantity((value) => value + 1)}
            aria-label={t("increaseQty")}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-3">
        <AddToCartButton
          product={product}
          locale={locale}
          quantity={quantity}
          variant="light"
          className="w-full h-12 text-sm font-bold border-forest-950/20"
        />
        <BuyNowButton 
          product={product} 
          quantity={quantity} 
          variant="default"
          className="w-full h-12 text-sm font-bold bg-[#b5703a] hover:bg-[#9a5d2e] border-none text-white shadow-md" 
        />
      </div>

      <div className="mt-7 grid gap-3 border-t border-forest-950/12 pt-5 text-sm text-forest-950/68">
        <p>
          <strong className="text-forest-950">{productT("origin")}:</strong>{" "}
          {localized(product.origin, locale)}
        </p>
        <p>
          <strong className="text-forest-950">{productT("altitude")}:</strong>{" "}
          {product.altitude}
        </p>
        <p>
          <strong className="text-forest-950">{productT("roast")}:</strong>{" "}
          {localized(product.roast, locale)}
        </p>
      </div>
    </aside>
  );
}
