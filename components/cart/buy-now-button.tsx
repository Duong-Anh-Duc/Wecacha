"use client";

import {CreditCard} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {useCartStore} from "@/features/cart/cart-store";
import {useRouter} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content/types";
import {localized} from "@/lib/content/helpers";

export function BuyNowButton({
  product,
  quantity = 1,
  variant = "forest",
  className,
  label,
  children
}: {
  product: Product;
  quantity?: number;
  variant?: "default" | "forest" | "outline" | "light" | "ghost";
  className?: string;
  label?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Common");
  const router = useRouter();
  const setBuyNow = useCartStore((state) => state.setBuyNow);

  return (
    <Button
      className={className}
      variant={variant}
      onClick={() => {
        setBuyNow(
          {
            slug: product.slug,
            name: localized(product.name, locale),
            price: product.price,
            image: product.images[0],
            weight: product.weight
          },
          quantity
        );
        router.push("/checkout?mode=buynow");
      }}
    >
      {children ? children : (
        <>
          <CreditCard className="h-4 w-4" aria-hidden="true" />
          {label ?? t("buyNow")}
        </>
      )}
    </Button>
  );
}
