"use client";

import {useState} from "react";
import Image from "next/image";
import {Button, Drawer} from "antd";
import {Eye} from "lucide-react";
import {useTranslations} from "next-intl";
import {formatCurrency} from "@/lib/content/helpers";
import type {ProductCategoryOption} from "./product-form";

export type ProductPreviewData = {
  slug: string;
  category: string;
  name_vi: string;
  short_vi?: string | null;
  description_vi?: string | null;
  price: number;
  price_tiers?: {
    attribute?: string;
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
  const image = product.images?.[0];
  const tiers = product.price_tiers?.length ? product.price_tiers : [{attribute: product.weight ?? "", price: product.price}];

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
        size="default"
      >
        <div className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
            <div className="relative aspect-[4/3]">
              {image ? (
                <Image src={image} alt={product.name_vi} fill sizes="420px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-stone-400">
                  {t("noProductImage")}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className=" text-3xl leading-tight text-forest-950">{product.name_vi}</h3>
            </div>

            <div className="space-y-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-sm font-semibold text-forest-950">{t("priceTiers")}</p>
              {tiers.map((tier, index) => {
                const range = [tier.minKg ? `${tier.minKg}kg` : "", tier.maxKg ? `${tier.maxKg}kg` : ""]
                  .filter(Boolean)
                  .join(" - ");
                return (
                  <div key={`${tier.attribute}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-stone-600">{tier.attribute || range || "—"}</span>
                    <span className="font-bold text-ember">{formatCurrency(Number(tier.price ?? 0), locale as "vi" | "en")}</span>
                  </div>
                );
              })}
            </div>

            {(product.weight || product.base_unit) ? (
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
                {product.weight ? (
                  <p><span className="font-semibold text-forest-950">{t("weight")}:</span> {product.weight}</p>
                ) : null}
                {product.base_unit ? (
                  <p><span className="font-semibold text-forest-950">{t("packageSpec")}:</span> {product.base_unit}</p>
                ) : null}
              </div>
            ) : null}

            {product.description_vi ? (
              <div className="rounded-xl border border-stone-200 bg-white px-4 py-3">
                <p className="text-sm leading-6 text-stone-600">{product.description_vi}</p>
              </div>
            ) : null}
          </div>
        </div>
      </Drawer>
    </>
  );
}
