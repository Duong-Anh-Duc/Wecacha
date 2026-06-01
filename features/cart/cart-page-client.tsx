"use client";

import {useMemo, useState} from "react";
import Image from "next/image";
import {motion} from "framer-motion";
import {Minus, Plus, Trash2} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useCartStore, getCartTotals} from "@/features/cart/cart-store";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {formatCurrency} from "@/lib/content/helpers";

export function CartPageClient() {
  const locale = useLocale() as Locale;
  const common = useTranslations("Common");
  const t = useTranslations("Cart");
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);
  const totals = getCartTotals(items);
  const discount = useMemo(
    () => (applied && totals.subtotal > 0 ? Math.round(totals.subtotal * 0.1) : 0),
    [applied, totals.subtotal]
  );
  const grandTotal = totals.total - discount;

  if (items.length === 0) {
    return (
      <div className="rounded-md border border-forest-950/10 bg-parchment-100 p-10 text-center shadow-warm">
        <p className="font-serif text-4xl text-forest-950">
          {common("emptyCart")}
        </p>
        <Button asChild className="mt-6" variant="forest">
          <Link href="/shop">{common("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="grid gap-4">
        {items.map((item, index) => (
          <motion.article
            key={item.slug}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.45, delay: index * 0.04}}
            className="grid gap-5 rounded-md border border-forest-950/10 bg-parchment-100 p-4 shadow-warm sm:grid-cols-[140px_1fr]"
          >
            <div className="relative aspect-square overflow-hidden rounded-md bg-forest-950">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="140px"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
              <div>
                <h2 className="font-serif text-3xl leading-tight text-forest-950">
                  {item.name}
                </h2>
                <p className="mt-2 text-sm text-forest-950/58">{item.weight}</p>
                <p className="mt-4 font-semibold text-earth-700">
                  {formatCurrency(item.price, locale)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <button
                  aria-label={common("removeItem")}
                  className="rounded-full p-2 text-forest-950/56 transition hover:bg-forest-950/8 hover:text-forest-950"
                  onClick={() => removeItem(item.slug)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className="inline-flex items-center rounded-full border border-forest-950/14 bg-white/54">
                  <button
                    className="p-3"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    aria-label={common("decreaseQty")}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-10 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    className="p-3"
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    aria-label={common("increaseQty")}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <aside className="h-fit rounded-md border border-forest-950/10 bg-forest-950 p-6 text-white shadow-cinematic">
        <h2 className="font-serif text-4xl">{common("total")}</h2>
        <div className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between text-white/68">
            <span>{common("subtotal")}</span>
            <span>{formatCurrency(totals.subtotal, locale)}</span>
          </div>
          <div className="flex justify-between text-white/68">
            <span>{t("shipping")}</span>
            <span>{formatCurrency(totals.shipping, locale)}</span>
          </div>
          <div className="flex justify-between text-white/68">
            <span>{t("discount")}</span>
            <span>-{formatCurrency(discount, locale)}</span>
          </div>
          <div className="border-t border-white/14 pt-4 text-lg font-bold text-ember">
            <div className="flex justify-between">
              <span>{common("total")}</span>
              <span>{formatCurrency(grandTotal, locale)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Input
            value={promo}
            onChange={(event) => setPromo(event.target.value)}
            placeholder={t("promo")}
            className="border-white/14 bg-white/90"
          />
          <Button
            variant="outline"
            onClick={() => setApplied(promo.trim().length > 0)}
          >
            {t("apply")}
          </Button>
        </div>
        <Button asChild className="mt-6 w-full" variant="default">
          <Link href="/checkout">{t("checkout")}</Link>
        </Button>
      </aside>
    </div>
  );
}
