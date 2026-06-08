"use client";

import {useState} from "react";
import {CreditCard, Minus, Package, Percent, Plus, Scale, Tag} from "lucide-react";
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

function bulkTierLabel(tier: NonNullable<Product["bulkPriceTiers"]>[number]) {
  const min = Number(tier.minKg || 0);
  const max = Number(tier.maxKg || 0);
  if (min > 0 && max > 0) return `${min}kg - ${max}kg`;
  if (min > 0) return `>= ${min}kg`;
  if (max > 0) return `<= ${max}kg`;
  return "";
}

export function ProductBuyPanel({
  product,
  showPurchaseActions = true
}: {
  product: Product;
  showPurchaseActions?: boolean;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Common");
  const tProduct = useTranslations("Product");
  const firstTier = product.priceTiers?.[0];
  const hasSizeOptions = Boolean(product.priceTiers?.length);
  const bulkPriceTiers = (product.bulkPriceTiers ?? []).filter(
    (tier) => Number(tier.price || 0) > 0 && (Number(tier.minKg || 0) > 0 || Number(tier.maxKg || 0) > 0)
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedTier, setSelectedTier] = useState(firstTier);
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
    setQuantity(Math.max(1, Math.round(nextQuantity || 1)));
  }

  // Parse weight to kg to check bulk discount tier
  function parseWeightKg(attribute?: string, minKg?: number) {
    if (minKg && minKg > 0) return minKg;
    if (!attribute) return 0;
    const match = attribute.match(/(\d+(?:\.\d+)?)\s*(kg|g)/i);
    if (match) {
      const val = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      return unit === "kg" ? val : val / 1000;
    }
    return 0;
  }

  // Parse weight from product.weight (e.g. "250g", "2 x 250g")
  function parseProductWeightKg(weightStr?: string) {
    if (!weightStr) return 0.25; // default 250g
    const multiplication = weightStr.match(/(\d+)\s*x\s*(\d+(?:\.\d+)?)\s*(kg|g)/i);
    if (multiplication) {
      const count = parseInt(multiplication[1]);
      const val = parseFloat(multiplication[2]);
      const unit = multiplication[3].toLowerCase();
      const unitWeight = unit === "kg" ? val : val / 1000;
      return count * unitWeight;
    }
    const match = weightStr.match(/(\d+(?:\.\d+)?)\s*(kg|g)/i);
    if (match) {
      const val = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      return unit === "kg" ? val : val / 1000;
    }
    return 0.25;
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

      <div className="mb-6 rounded-2xl bg-[#fff8ed] px-5 py-4">
        <span className="text-[32px] lg:text-[38px] font-bold leading-none text-[#a46131]">
          {formatCurrency(selectedPrice, locale)}
        </span>
      </div>

      {(product.priceTiers?.length || bulkPriceTiers.length || product.weight || product.baseUnit) ? (
        <div className="mb-8 rounded-2xl border border-[#142918]/10 bg-white p-5 lg:p-6 shadow-[0_4px_20px_rgba(20,41,24,0.02)] space-y-6">
          {/* Section 1: Chọn khối lượng */}
          {product.priceTiers?.length ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-[#a46131]" />
                <span className="text-[13px] font-bold tracking-wide text-[#142918]/70 uppercase">
                  {tProduct("selectWeight")}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {product.priceTiers.map((tier, index) => {
                  const label = tierLabel(tier);
                  const isSelected = selectedTier === tier;
                  return (
                    <button
                      key={`${tier.attribute}-${index}`}
                      type="button"
                      onClick={() => setSelectedTier(tier)}
                      className={`
                        relative flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300
                        ${isSelected
                          ? "border-[#a46131] bg-[#fff8ed] shadow-[0_0_0_3px_rgba(164,97,49,0.12)]"
                          : "border-[#142918]/10 bg-[#fbfaf6] hover:border-[#a46131]/40 hover:bg-[#fffaf2]/50"
                        }
                      `}
                      aria-pressed={isSelected}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`
                          flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-200
                          ${isSelected ? "border-[#a46131] bg-[#a46131]" : "border-[#142918]/20 bg-white"}
                        `}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="font-bold text-[#142918]">{label}</span>
                      </div>
                      <span className="whitespace-nowrap font-bold text-[#a46131]">
                        {formatCurrency(tier.price, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Divider 1 */}
          {product.priceTiers?.length && (bulkPriceTiers.length || product.baseUnit) ? (
            <div className="border-t border-[#142918]/8 my-5" />
          ) : null}

          {/* Section 2: Giá theo khối lượng mua */}
          {bulkPriceTiers.length ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-[#17351f]" />
                <span className="text-[13px] font-bold tracking-wide text-[#142918]/70 uppercase">
                  {tProduct("buyWeightPrice")}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {bulkPriceTiers.map((tier, index) => {
                  const label = bulkTierLabel(tier);
                  return (
                    <div
                      key={`${label}-${index}`}
                      className="relative flex min-h-[74px] items-center justify-between gap-3 rounded-xl border border-[#142918]/5 bg-[#f8f6f0] px-4 py-3 text-sm transition-all duration-300"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="min-w-0 whitespace-nowrap font-semibold text-[#142918]/78">
                          {label}
                        </span>
                      </div>
                      <div className="flex shrink-0 flex-col items-end">
                        <span className="whitespace-nowrap font-bold text-[#a46131]">
                          {tProduct("perKgPrice", {price: formatCurrency(tier.price, locale)})}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Divider 2 */}
          {bulkPriceTiers.length && product.baseUnit ? (
            <div className="border-t border-[#142918]/8 my-5" />
          ) : null}

          {/* Section 3: Quy cách đóng gói */}
          {product.baseUnit ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[#3170a4]" />
                <span className="text-[13px] font-bold tracking-wide text-[#142918]/70 uppercase">
                  {tProduct("packageSpec")}
                </span>
              </div>
              <div className="rounded-xl border border-[#142918]/5 bg-[#fbfaf6] px-4 py-3 text-sm font-semibold leading-relaxed text-[#142918]">
                {tProduct("packagedAs", {unit: product.baseUnit})}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {showPurchaseActions ? (
        <div className="mb-8">
          <p className="mb-3 text-[13px] font-bold text-[#142918]">
            {t("quantity")}
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
                min={1}
                type="number"
                aria-label={t("quantity")}
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
          {hasSizeOptions ? (
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
      ) : null}
    </aside>
  );
}
