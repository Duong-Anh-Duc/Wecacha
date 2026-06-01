"use client";

import {useState} from "react";
import Image from "next/image";
import {Button, Drawer, Tag} from "antd";
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
  original_price?: number | null;
  weight?: string | null;
  images?: string[] | null;
  featured?: boolean | null;
  is_visible?: boolean | null;
};

export function ProductPreviewButton({
  product,
  categories,
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
  const category = categories.find((item) => item.slug === product.category);
  const image = product.images?.[0];

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
            <div className="flex flex-wrap gap-2">
              <Tag color="green">{product.is_visible ? t("visible") : t("hidden")}</Tag>
              {product.featured ? <Tag color="gold">{t("featured")}</Tag> : null}
              <Tag>{category?.name_vi ?? product.category}</Tag>
            </div>

            <div>
              <h3 className=" text-3xl leading-tight text-forest-950">{product.name_vi}</h3>
              {product.short_vi ? (
                <p className="mt-2 text-sm leading-6 text-stone-600">{product.short_vi}</p>
              ) : null}
            </div>

            <div className="flex items-end gap-3">
              <p className="text-2xl font-bold text-ember">{formatCurrency(product.price, locale as "vi" | "en")}</p>
              {product.original_price ? (
                <p className="pb-1 text-sm text-stone-400 line-through">
                  {formatCurrency(product.original_price, locale as "vi" | "en")}
                </p>
              ) : null}
            </div>

            {product.weight ? (
              <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
                <span className="font-semibold text-forest-950">{t("weight")}:</span> {product.weight}
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
