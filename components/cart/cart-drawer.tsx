"use client";

import Image from "next/image";
import {Minus, Plus, ShoppingBag, Trash2} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {useCartStore, getCartTotals} from "@/features/cart/cart-store";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {formatCurrency} from "@/lib/content";
import {cn} from "@/lib/utils";

export function CartDrawer({solid}: {solid?: boolean}) {
  const locale = useLocale() as Locale;
  const tCommon = useTranslations("Common");
  const tNav = useTranslations("Nav");
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totals = getCartTotals(items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{tNav("cart")}</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex h-[calc(100%-7rem)] flex-col">
          {items.length === 0 ? (
            <div className="grid flex-1 place-items-center text-center">
              <div>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest-800/10">
                  <ShoppingBag className="h-7 w-7" aria-hidden="true" />
                </div>
                <p className="text-sm text-forest-950/62">
                  {tCommon("emptyCart")}
                </p>
                <Button asChild className="mt-5" variant="forest">
                  <Link href="/shop">{tCommon("continueShopping")}</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="no-scrollbar flex-1 space-y-4 overflow-auto pr-1">
                {items.map((item) => (
                  <div
                    className="grid grid-cols-[72px_1fr] gap-4 border-b border-forest-950/10 pb-4"
                    key={item.slug}
                  >
                    <div className="relative h-20 overflow-hidden rounded-md bg-forest-800/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </div>
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium leading-5">{item.name}</p>
                          <p className="mt-1 text-xs text-forest-950/58">
                            {item.weight}
                          </p>
                        </div>
                        <button
                          aria-label={tCommon("removeItem")}
                          className="rounded-full p-1 text-forest-950/52 transition hover:bg-forest-900/8 hover:text-forest-950"
                          onClick={() => removeItem(item.slug)}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-forest-950/12">
                          <button
                            className="p-2"
                            aria-label={tCommon("decreaseQty")}
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            className="p-2"
                            aria-label={tCommon("increaseQty")}
                            onClick={() =>
                              updateQuantity(item.slug, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatCurrency(item.price * item.quantity, locale)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-forest-950/12 pt-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span>{tCommon("subtotal")}</span>
                  <strong>{formatCurrency(totals.subtotal, locale)}</strong>
                </div>
                <Button asChild className="w-full bg-[#142918] hover:bg-[#1a3320] text-white shadow-md border-none hover:-translate-y-0.5 transition-all">
                  <Link href="/checkout">{tCommon("buyNow")}</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
