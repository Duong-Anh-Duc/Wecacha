"use client";

import {useMemo, useState} from "react";
import {Search, SlidersHorizontal} from "lucide-react";
import {useTranslations} from "next-intl";
import {ProductCard} from "@/components/shop/product-card";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import type {Locale} from "@/i18n/routing";
import type {Product, ProductCategory} from "@/lib/content";
import {localized} from "@/lib/content";
import {cn} from "@/lib/utils";

type SortMode = "featured" | "priceAsc" | "priceDesc";
type CategoryMode = "all" | ProductCategory;

const categories: CategoryMode[] = ["all", "beans", "ground", "phin", "gifts"];

export function ShopGrid({
  products,
  locale,
  hideCategories = false
}: {
  products: Product[];
  locale: Locale;
  hideCategories?: boolean;
}) {
  const t = useTranslations("Shop");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryMode>("all");
  const [sort, setSort] = useState<SortMode>("featured");

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const haystack = [
        localized(product.name, locale),
        localized(product.short, locale),
        localized(product.description, locale),
        ...localized(product.notes, locale)
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalized || haystack.includes(normalized));
    });

    return result.sort((a, b) => {
      if (sort === "priceAsc") return a.price - b.price;
      if (sort === "priceDesc") return b.price - a.price;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [category, locale, products, query, sort]);

  return (
    <div>
      <div className="grid gap-4 rounded-md border border-forest-950/10 bg-parchment-100/72 p-4 shadow-warm lg:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <span className="sr-only">{t("search")}</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-950/48"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search")}
            className="pl-10"
          />
        </label>

        <Select value={sort} onValueChange={(value) => setSort(value as SortMode)}>
          <SelectTrigger className="w-full lg:w-56" aria-label={t("sort")}>
            <SlidersHorizontal className="mr-2 h-4 w-4 text-earth-600" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">{t("featured")}</SelectItem>
            <SelectItem value="priceAsc">{t("priceAsc")}</SelectItem>
            <SelectItem value="priceDesc">{t("priceDesc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!hideCategories && (
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              className={cn(
                "h-10 shrink-0 rounded-full border border-forest-950/12 px-4 text-sm font-semibold text-forest-950/66 transition hover:border-earth-600 hover:text-forest-950",
                category === item && "border-earth-600 bg-earth-600 text-white"
              )}
              onClick={() => setCategory(item)}
            >
              {t(item)}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.slug} product={product} locale={locale} />
        ))}
      </div>
    </div>
  );
}
