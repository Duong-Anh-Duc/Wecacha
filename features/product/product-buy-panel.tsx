"use client";

import {useState} from "react";
import {Minus, Plus, Star, ShieldCheck, Truck, Headphones, Droplet, Coffee, AlertCircle, ShoppingBag} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {AddToCartButton} from "@/components/cart/add-to-cart-button";
import {BuyNowButton} from "@/components/cart/buy-now-button";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content";
import {formatCurrency, localized} from "@/lib/content";

export function ProductBuyPanel({product}: {product: Product}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Common");
  const tProduct = useTranslations("Product");
  const [quantity, setQuantity] = useState(1);

  return (
    <aside className="flex flex-col pt-2 relative z-0">
      {/* Rating & Badge */}
      <div className="flex items-center gap-3 mb-4 text-[#142918]">
        <div className="flex items-center gap-1.5 font-bold text-sm">
          <span>4.9</span>
          <div className="flex text-[#f3a734]">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
          </div>
          <span className="text-[#142918]/60 font-medium px-1">|</span>
          <span className="text-[#142918]/70 font-medium">{tProduct("reviewCount", {count: 128})}</span>
        </div>
        {product.featured && (
          <span className="bg-[#417a22] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm">
            {tProduct("bestseller")}
          </span>
        )}
      </div>

      <h1 className="font-serif text-[42px] leading-[1.1] text-[#142918] mb-4">
        {localized(product.name, locale)}
      </h1>
      
      <p className="text-[15px] leading-[1.6] text-[#142918]/80 mb-6 max-w-[90%]">
        {localized(product.description, locale)}
      </p>

      {/* Price */}
      <div className="flex items-end gap-3 mb-8 relative group">
        {product.originalPrice && (
          <span className="text-[20px] font-medium text-[#142918]/40 line-through mb-1 relative">
            {formatCurrency(product.originalPrice, locale)}
          </span>
        )}
        <div className="relative">
          {/* Lửa cháy (Glow effect) */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ff4d00] to-[#ffaa00] opacity-0 group-hover:opacity-20 blur-xl transition duration-500 rounded-full" />
          <span className="text-[38px] font-bold text-[#e65c00] leading-none drop-shadow-[0_2px_10px_rgba(230,92,0,0.25)] relative z-10 transition duration-300 group-hover:text-[#ff4500]">
            {formatCurrency(product.price, locale)}
          </span>
        </div>
        {product.originalPrice && (
          <span className="bg-gradient-to-r from-[#ff4d00] to-[#ffaa00] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2 shadow-sm animate-pulse">
            -22%
          </span>
        )}
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex flex-col items-center justify-center gap-1.5 bg-white border border-[#142918]/10 rounded-2xl w-[120px] h-[72px]">
          <Coffee className="w-5 h-5 text-[#142918]/70" />
          <span className="text-[9px] font-bold text-[#142918]">{tProduct("arabicaPill")}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 bg-white border border-[#142918]/10 rounded-2xl w-[120px] h-[72px]">
          <Droplet className="w-5 h-5 text-[#142918]/70" />
          <span className="text-[9px] font-bold text-[#142918]">{tProduct("naturalRoastFull")}</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 bg-white border border-[#142918]/10 rounded-2xl w-[120px] h-[72px]">
          <AlertCircle className="w-5 h-5 text-[#142918]/70" />
          <span className="text-[9px] font-bold text-[#142918]">{tProduct("noPreservatives")}</span>
        </div>
      </div>

      {/* Add to Cart Actions */}
      <div className="mb-8">
        <p className="mb-3 text-[13px] font-bold text-[#142918]">{t("quantity")}</p>
        <div className="flex gap-4">
          <div className="inline-flex h-12 items-center rounded-xl border border-[#142918]/20 bg-white px-2">
            <button
              className="p-2 text-[#142918]/70 hover:text-[#142918] transition-colors"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label={t("decreaseQty")}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-10 text-center font-bold text-[15px]">{quantity}</span>
            <button
              className="p-2 text-[#142918]/70 hover:text-[#142918] transition-colors"
              onClick={() => setQuantity((value) => value + 1)}
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
            className="flex-1 h-12 bg-[#a46131] hover:bg-[#8e5227] text-white rounded-xl text-[15px] font-bold shadow-[0_4px_14px_rgba(164,97,49,0.25)] transition-all hover:-translate-y-0.5"
            label={t("addToCart")}
          />
        </div>
        <BuyNowButton 
          product={product} 
          quantity={quantity} 
          variant="default"
          className="w-full h-14 mt-4 rounded-xl bg-gradient-to-r from-[#ff5100] to-[#cc2900] text-white text-[16px] font-bold transition-all overflow-hidden relative group animate-fire" 
        >
          {/* Shimmer effect inside the fire button */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative flex items-center gap-2">
            🔥 {t("buyNow")}
          </span>
        </BuyNowButton>
      </div>

      {/* Trust Badges */}
      <div className="flex gap-4 p-4 rounded-2xl bg-white/50 border border-[#142918]/5">
        <div className="flex gap-3 flex-1 items-start">
          <Truck className="w-5 h-5 text-[#142918]/80 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-[#142918] leading-tight">{tProduct("freeShippingTitle")}</p>
            <p className="text-[10px] text-[#142918]/60 mt-0.5">{tProduct("freeShippingDesc")}</p>
          </div>
        </div>
        <div className="flex gap-3 flex-1 items-start">
          <ShieldCheck className="w-5 h-5 text-[#142918]/80 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-[#142918] leading-tight">{tProduct("easyReturnTitle")}</p>
            <p className="text-[10px] text-[#142918]/60 mt-0.5">{tProduct("easyReturnDesc")}</p>
          </div>
        </div>
        <div className="flex gap-3 flex-1 items-start">
          <Headphones className="w-5 h-5 text-[#142918]/80 shrink-0" />
          <div>
            <p className="text-[11px] font-bold text-[#142918] leading-tight">{tProduct("supportTitle")}</p>
            <p className="text-[10px] text-[#142918]/60 mt-0.5">{tProduct("supportDesc")}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
