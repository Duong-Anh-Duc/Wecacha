"use client";

import {ShoppingBag} from "lucide-react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {useCartStore} from "@/features/cart/cart-store";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content";
import {localized} from "@/lib/content";

type Props = {
  product: Product;
  locale: Locale;
  quantity?: number;
  variant?: "default" | "forest" | "outline" | "light";
  label?: string;
  className?: string;
};

export function AddToCartButton({
  product,
  locale,
  quantity = 1,
  variant = "default",
  label,
  className
}: Props) {
  const t = useTranslations("Common");
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Button
      className={className}
      variant={variant}
      onClick={() =>
        addItem(
          {
            slug: product.slug,
            name: localized(product.name, locale),
            price: product.price,
            image: product.images[0],
            weight: product.weight
          },
          quantity
        )
      }
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {label ?? t("addToCart")}
    </Button>
  );
}
