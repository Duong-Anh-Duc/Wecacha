"use client";

import Image from "next/image";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Leaf,
  X,
  Tag,
  ChevronRight,
  Lock,
  ShieldCheck,
  Truck,
  RefreshCw
} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {useCartStore, getCartTotals} from "@/features/cart/cart-store";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {formatCurrency} from "@/lib/content";

export function CartDrawer({solid}: {solid?: boolean}) {
  const locale = useLocale() as Locale;
  const tCommon = useTranslations("Common");
  const tNav = useTranslations("Nav");
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totals = getCartTotals(items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const freeShippingThreshold = 300000;
  const progressPercent = Math.min((totals.subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - totals.subtotal, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          id="global-cart-icon"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/28 bg-white/8 text-white backdrop-blur transition hover:bg-white/16"
          aria-label={tNav("cart")}
        >
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          {count > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-earth-600 px-1 text-[11px] font-bold text-white">
              {count}
            </span>
          ) : null}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-[#fdfcf8] border-none p-0 flex flex-col shadow-2xl">
        <SheetTitle className="sr-only">Giỏ hàng</SheetTitle>
        <div className="px-6 pt-8 pb-4 bg-gradient-to-b from-[#fdfcf8] to-transparent z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-[2.5rem] leading-none text-[#142918] mb-2 tracking-tight">Giỏ hàng</h2>
              <p className="flex items-center text-[13px] font-medium text-[#142918]/70">
                <Leaf className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                {count} sản phẩm trong giỏ
              </p>
            </div>
            <SheetClose asChild>
              <button className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white border border-[#142918]/10 text-[#142918]/60 hover:text-[#142918] transition-colors shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </SheetClose>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center pb-20">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f2f6ee] text-[#2c5338]">
                <ShoppingBag className="h-9 w-9" aria-hidden="true" />
              </div>
              <p className="text-base text-[#142918]/70 mb-6">
                {tCommon("emptyCart")}
              </p>
              <SheetClose asChild>
                <Button asChild className="h-12 rounded-xl bg-[#1a3320] text-white hover:bg-[#112215] px-8">
                  <Link href="/shop">{tCommon("continueShopping")}</Link>
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.slug} className="bg-white rounded-[24px] p-3 mb-4 flex gap-4 shadow-[0_4px_20px_rgba(20,41,24,0.03)] border border-[#142918]/[0.06] relative">
                  <div className="relative w-[110px] h-[120px] rounded-[18px] overflow-hidden shrink-0 bg-[#f8f9f6]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="110px" />
                    <div className="absolute bottom-1.5 right-1.5 bg-white/95 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1.5 text-[9px] font-bold text-[#142918] shadow-sm">
                      <Leaf className="w-3 h-3 text-[#2c5338]" />
                      <span className="leading-[1.1]">100%<br />NGUYÊN CHẤT</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col py-1">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="bg-[#f0e6d6] text-[#6b4c2a] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">Cà phê hạt rang</span>
                      <button onClick={() => removeItem(item.slug)} className="w-8 h-8 flex items-center justify-center rounded-full border border-blue-600/20 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors -mr-1 -mt-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-bold text-[#142918] text-[15px] leading-tight line-clamp-1 mb-1">{item.name}</h3>
                    <p className="text-xs text-[#142918]/60 mb-2">{item.weight}</p>
                    <p className="text-[10px] text-[#142918]/60 flex items-center gap-1.5 mb-3 line-clamp-1">
                      <Leaf className="w-3 h-3 shrink-0 opacity-70" />
                      Chua thanh • Hương trái cây • Hậu ngọt
                    </p>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex items-center rounded-xl border border-[#142918]/15 h-[34px]">
                        <button onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="w-[34px] h-full flex items-center justify-center text-[#142918]/70 hover:text-[#142918]">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center text-[#142918]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="w-[34px] h-full flex items-center justify-center text-[#142918]/70 hover:text-[#142918]">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-bold text-[15px] text-[#142918]">{formatCurrency(item.price, locale)}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-between bg-white rounded-[20px] p-3 mb-8 shadow-[0_4px_20px_rgba(20,41,24,0.02)] border border-[#142918]/[0.04]">
                <div className="flex items-center gap-2.5 flex-1 justify-center border-r border-[#142918]/10 pr-2">
                  <ShieldCheck className="w-5 h-5 text-[#142918] shrink-0" />
                  <div className="text-[10px] leading-tight">
                    <p className="text-[#142918]">Sản phẩm</p>
                    <p className="font-bold text-[#2c5338]">chính hãng</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 flex-1 justify-center border-r border-[#142918]/10 px-2">
                  <Truck className="w-5 h-5 text-[#142918] shrink-0" />
                  <div className="text-[10px] leading-tight">
                    <p className="text-[#142918]">Giao hàng</p>
                    <p className="font-bold text-[#2c5338]">nhanh chóng</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 flex-1 justify-center pl-2">
                  <RefreshCw className="w-5 h-5 text-[#142918] shrink-0" />
                  <div className="text-[10px] leading-tight">
                    <p className="text-[#142918]">Đổi trả</p>
                    <p className="font-bold text-[#2c5338]">dễ dàng</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="bg-white rounded-t-[32px] p-6 shadow-[0_-12px_40px_rgba(20,41,24,0.06)] border-t border-[#142918]/5 z-20">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center text-[#142918]/80 text-[15px] font-medium">
                <Tag className="w-4 h-4 mr-2.5" />
                Tạm tính
              </div>
              <div className="text-[22px] font-bold text-[#142918]">{formatCurrency(totals.subtotal, locale)}</div>
            </div>
            
            <div className="bg-[#f5f8f2] rounded-2xl p-4 mb-5 border border-[#2c5338]/[0.08]">
              <div className="flex gap-2.5 text-[11px] mb-3 items-center">
                <Truck className="w-4 h-4 text-[#2c5338] shrink-0" />
                <p className="text-[#142918]/80">
                  <strong className="text-[#142918]">Miễn phí giao hàng</strong> cho đơn từ {formatCurrency(freeShippingThreshold, locale)}
                </p>
              </div>
              <div className="h-1.5 w-full bg-[#e2eadc] rounded-full overflow-hidden mb-2.5">
                <div 
                  className="h-full bg-gradient-to-r from-[#417a22] to-[#5b9e34] rounded-full transition-all duration-1000 ease-out" 
                  style={{width: `${progressPercent}%`}} 
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#142918]/70 font-medium">
                <p>Còn <strong className="text-[#142918]">{formatCurrency(remainingForFreeShipping, locale)}</strong> để được miễn phí</p>
                <p>{formatCurrency(freeShippingThreshold, locale)}</p>
              </div>
            </div>
            
            <SheetClose asChild>
              <Button asChild className="w-full h-[56px] bg-[#1a3320] hover:bg-[#112215] text-white rounded-[18px] text-[15px] font-medium flex justify-between items-center px-6 shadow-[0_8px_20px_rgba(26,51,32,0.2)] transition-all hover:-translate-y-1">
                <Link href="/checkout">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-[18px] h-[18px] opacity-90"/> 
                    <span>Thanh toán ngay</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                    {formatCurrency(totals.subtotal, locale)} 
                    <ChevronRight className="w-[18px] h-[18px] opacity-80"/>
                  </div>
                </Link>
              </Button>
            </SheetClose>
            
            <div className="flex items-center justify-center gap-2 mt-5 text-[#142918]/50 text-[11px] font-medium">
              <Lock className="w-3.5 h-3.5" />
              Thanh toán an toàn, bảo mật
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
