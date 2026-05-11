"use client";

import {CreditCard} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {useCartStore} from "@/features/cart/cart-store";
import {useRouter} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content";
import {localized} from "@/lib/content";

export function BuyNowButton({
  product,
  quantity = 1,
  className
}: {
  product: Product;
  quantity?: number;
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Common");
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      className={className}
      variant="forest"
      onClick={() => {
        addItem(
          {
            slug: product.slug,
            name: localized(product.name, locale),
            price: product.price,
            image: product.images[0],
            weight: product.weight
          },
          quantity
        );
        router.push("/checkout");
      }}
    >
      <CreditCard className="h-4 w-4" aria-hidden="true" />
      {t("buyNow")}
    </Button>
  );
}
