"use client";

import {useState} from "react";
import {CreditCard, Minus, Plus} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {AddToCartButton} from "@/components/cart/add-to-cart-button";
import {BuyNowButton} from "@/components/cart/buy-now-button";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content/types";
import {formatCurrency, localized} from "@/lib/content/helpers";

function tierLabel(tier: NonNullable<Product["priceTiers"]>[number]) {
  const range = [tier.minKg ? `${tier.minKg}kg` : "", tier.maxKg ? `${tier.maxKg}kg` : ""]
    .filter(Boolean)
    .join(" - ");
  return tier.attribute || range;
}

export function ProductBuyPanel({product}: {product: Product}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Common");
  const tProduct = useTranslations("Product");
  const firstTier = product.priceTiers?.[0];
  const hasWeightTiers = Boolean(product.priceTiers?.length);
  const minKg = firstTier?.minKg ?? 1;
  const maxKg = product.priceTiers?.reduce<number | undefined>((max, tier) => {
    if (!tier.maxKg) return max;
    return max === undefined ? tier.maxKg : Math.max(max, tier.maxKg);
  }, undefined);
  const [quantity, setQuantity] = useState(hasWeightTiers ? minKg : 1);
  const selectedTier = product.priceTiers?.find((tier) => {
    const matchesMin = tier.minKg ? quantity >= tier.minKg : true;
    const matchesMax = tier.maxKg ? quantity <= tier.maxKg : true;
    return matchesMin && matchesMax;
  }) ?? firstTier;
  const selectedPrice = selectedTier?.price ?? product.price;
  const selectedOption = selectedTier
    ? {
        id: `${product.slug}:${selectedTier.attribute || selectedTier.minKg || "tier"}-${selectedTier.maxKg || "up"}`,
        label: tierLabel(selectedTier),
        price: selectedPrice
      }
    : undefined;
  const totalPrice = selectedPrice * quantity;

  function updateQuantity(nextQuantity: number) {
    const normalized = Math.max(hasWeightTiers ? minKg : 1, Math.round(nextQuantity || minKg));
    setQuantity(maxKg ? Math.min(normalized, maxKg) : normalized);
  }

  return (
    <aside className="flex flex-col pt-2 relative z-0">
      <h1 className="font-serif text-[32px] lg:text-[42px] leading-[1.1] text-[#142918] mb-4">
        {localized(product.name, locale)}
      </h1>
      
      {localized(product.description, locale) ? (
        <p className="mb-6 w-full text-[14px] leading-[1.6] text-[#142918]/80 lg:max-w-[90%] lg:text-[15px]">
          {localized(product.description, locale)}
        </p>
      ) : null}

      {/* Price */}
      <div className="flex items-end gap-3 mb-8">
        <span className="text-[32px] lg:text-[38px] font-bold leading-none text-[#a46131]">
          {formatCurrency(selectedPrice, locale)}
        </span>
        {hasWeightTiers ? (
          <span className="pb-1 text-sm font-semibold text-[#142918]/58">/ kg</span>
        ) : null}
      </div>

      {product.priceTiers?.length ? (
        <div className="mb-8 rounded-2xl border border-[#142918]/10 bg-white p-4">
          <p className="mb-3 text-[13px] font-bold text-[#142918]">{tProduct("buyWeightPrice")}</p>
          <div className="space-y-2">
            {product.priceTiers.map((tier, index) => {
              const label = tierLabel(tier);
              const isSelected = selectedTier === tier;
              return (
                <button
                  key={`${tier.attribute}-${index}`}
                  type="button"
                  onClick={() => updateQuantity(tier.minKg ?? 1)}
                  className={
                    isSelected
                      ? "flex w-full items-center justify-between gap-3 rounded-xl border border-[#a46131] bg-[#fff8ed] px-3 py-2 text-left text-sm shadow-[0_0_0_3px_rgba(164,97,49,0.12)]"
                      : "flex w-full items-center justify-between gap-3 rounded-xl border border-transparent bg-[#f8f6f0] px-3 py-2 text-left text-sm transition hover:border-[#a46131]/30 hover:bg-[#fffaf2]"
                  }
                  aria-pressed={isSelected}
                >
                  <span className="font-semibold text-[#142918]/78">{label}</span>
                  <span className="font-bold text-[#a46131]">{formatCurrency(tier.price, locale)}/kg</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {(product.weight || product.baseUnit) ? (
        <div className="mb-8 grid gap-3 rounded-2xl border border-[#142918]/10 bg-white p-4 text-sm text-[#142918]/78 sm:grid-cols-2">
          {product.weight ? (
            <div>
              <p className="mb-1 text-[12px] font-bold text-[#142918]">{tProduct("weight")}</p>
              <p>{product.weight}</p>
            </div>
          ) : null}
          {product.baseUnit ? (
            <div>
              <p className="mb-1 text-[12px] font-bold text-[#142918]">{tProduct("packageSpec")}</p>
              <p>{product.baseUnit}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mb-8">
        <p className="mb-3 text-[13px] font-bold text-[#142918]">
          {hasWeightTiers ? tProduct("kgAmount") : t("quantity")}
        </p>
        <div className="flex gap-3 lg:gap-4">
          <div className="inline-flex h-12 lg:h-14 items-center rounded-xl border border-[#142918]/20 bg-white px-2">
            <button
              className="p-2 text-[#142918]/70 hover:text-[#142918] transition-colors"
              onClick={() => updateQuantity(quantity - 1)}
              aria-label={t("decreaseQty")}
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              value={quantity}
              onChange={(event) => updateQuantity(Number(event.target.value))}
              className="h-full w-14 bg-transparent text-center text-[15px] font-bold text-[#142918] outline-none"
              inputMode="numeric"
              min={hasWeightTiers ? minKg : 1}
              max={maxKg}
              type="number"
              aria-label={hasWeightTiers ? tProduct("kgAmount") : t("quantity")}
            />
            <button
              className="p-2 text-[#142918]/70 hover:text-[#142918] transition-colors"
              onClick={() => updateQuantity(quantity + 1)}
              aria-label={t("increaseQty")}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <AddToCartButton
            product={product}
            locale={locale}
            quantity={quantity}
            variant="default"
            selectedOption={selectedOption}
            className="flex-1 h-12 lg:h-14 bg-[#8e5b34] hover:bg-[#754827] text-white rounded-xl text-[14px] lg:text-[15px] font-bold shadow-[0_4px_14px_rgba(80,49,28,0.16)] transition-all hover:-translate-y-0.5 px-2"
            label={t("addToCart")}
          />
        </div>
        {hasWeightTiers ? (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f8f6f0] px-4 py-3 text-sm">
            <span className="font-semibold text-[#142918]/70">{tProduct("estimatedTotal")}</span>
            <span className="font-bold text-[#142918]">{formatCurrency(totalPrice, locale)}</span>
          </div>
        ) : null}
        <BuyNowButton
          product={product}
          quantity={quantity}
          variant="default"
          selectedOption={selectedOption}
          className="w-full h-12 lg:h-14 mt-4 rounded-xl bg-[#17351f] text-white text-[15px] lg:text-[16px] font-bold transition-all overflow-hidden relative group shadow-[0_8px_18px_rgba(20,41,24,0.18)] hover:bg-[#102817]"
        >
          <span className="relative flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            <span>{t("buyNow")}</span>
          </span>
        </BuyNowButton>
      </div>
    </aside>
  );
}
