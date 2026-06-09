"use client";

import {useState} from "react";
import {Button, Drawer, Tabs} from "antd";
import {Eye} from "lucide-react";
import {useTranslations} from "next-intl";
import {ProductCard} from "@/components/shop/product-card";
import {ProductBuyPanel} from "@/features/product/product-buy-panel";
import {ProductGallery} from "@/features/product/product-gallery";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content/types";
import {localized} from "@/lib/content/helpers";
import type {ProductCategoryOption} from "./product-form";

export type ProductPreviewData = {
  slug: string;
  category: string;
  name_vi: string;
  name_en?: string | null;
  short_vi?: string | null;
  short_en?: string | null;
  description_vi?: string | null;
  description_en?: string | null;
  farmer_story_vi?: string | null;
  farmer_story_en?: string | null;
  price: number;
  price_tiers?: {
    attribute?: string;
    minKg?: number;
    maxKg?: number;
    price?: number;
  }[] | null;
  bulk_price_tiers?: {
    minKg?: number;
    maxKg?: number;
    price?: number;
  }[] | null;
  original_price?: number | null;
  weight?: string | null;
  base_unit?: string | null;
  images?: string[] | null;
  featured?: boolean | null;
  is_visible?: boolean | null;
};

export function ProductPreviewButton({
  product,
  categories: _categories,
  locale,
  compact = false
}: {
  product: ProductPreviewData;
  categories: ProductCategoryOption[];
  locale: string;
  compact?: boolean;
}) {
  const t = useTranslations("Admin");
  const [open, setOpen] = useState(false);
  const previewLocale = locale as Locale;
  const previewProduct: Product = {
    slug: product.slug,
    category: product.category,
    name: {
      vi: product.name_vi,
      en: product.name_en || product.name_vi
    },
    short: {
      vi: product.short_vi || "",
      en: product.short_en || product.short_vi || ""
    },
    description: {
      vi: product.description_vi || "",
      en: product.description_en || product.description_vi || ""
    },
    farmerStory: {
      vi: product.farmer_story_vi || "",
      en: product.farmer_story_en || product.farmer_story_vi || ""
    },
    journey: {vi: [], en: []},
    brewGuide: {vi: [], en: []},
    price: product.price,
    priceTiers: (product.price_tiers ?? []).map((tier) => ({
      attribute: tier.attribute || "",
      minKg: tier.minKg,
      maxKg: tier.maxKg,
      price: Number(tier.price ?? 0)
    })),
    bulkPriceTiers: (product.bulk_price_tiers ?? []).map((tier) => ({
      minKg: tier.minKg,
      maxKg: tier.maxKg,
      price: Number(tier.price ?? 0)
    })),
    originalPrice: product.original_price ?? undefined,
    weight: product.weight || "",
    baseUnit: product.base_unit || undefined,
    altitude: "",
    roast: {vi: "", en: ""},
    origin: {vi: "", en: ""},
    notes: {vi: [], en: []},
    images: product.images?.length ? product.images : ["/image.png"],
    featured: Boolean(product.featured)
  };

  return (
    <>
      <Button
        type={compact ? "text" : "default"}
        icon={<Eye className="h-4 w-4" />}
        onClick={() => setOpen(true)}
        className={compact ? "text-[#4A751D] hover:!bg-transparent hover:!text-forest-950" : undefined}
      >
        {compact ? null : t("previewProduct")}
      </Button>

      <Drawer
        title={t("previewProduct")}
        open={open}
        onClose={() => setOpen(false)}
        size="min(1120px, calc(100vw - 32px))"
      >
        <Tabs
          defaultActiveKey="detail"
          items={[
            {
              key: "detail",
              label: t("previewDetail"),
              children: (
                <div className="rounded-[28px] bg-parchment-50 p-4 sm:p-6">
                  <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                    <ProductGallery
                      images={previewProduct.images}
                      alt={localized(previewProduct.name, previewLocale)}
                    />
                    <ProductBuyPanel product={previewProduct} showPurchaseActions={false} />
                  </div>
                </div>
              )
            },
            {
              key: "card",
              label: t("previewCard"),
              children: (
                <div className="mx-auto max-w-[430px] py-2">
                  <ProductCard product={previewProduct} locale={previewLocale} />
                </div>
              )
            }
          ]}
        />
      </Drawer>
    </>
  );
}
