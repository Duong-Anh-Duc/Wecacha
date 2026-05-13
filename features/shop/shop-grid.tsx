"use client";

import {useMemo, useState, useEffect} from "react";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  Bean,
  Disc,
  Coffee,
  Gift,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
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
const ITEMS_PER_PAGE = 3;

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
  const [currentPage, setCurrentPage] = useState(1);

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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, category, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCategoryIcon = (cat: CategoryMode, isActive: boolean) => {
    const imgClass = cn(
      "w-5 h-5 rounded-full object-cover shadow-sm transition-transform duration-300",
      isActive ? "scale-110 ring-2 ring-white/50" : "group-hover:scale-110"
    );

    switch (cat) {
      case "all": return <LayoutGrid className={cn("w-4 h-4", isActive ? "text-white" : "text-[#142918]/60 group-hover:text-[#142918]")} />;
      case "beans": return <Image src="/icons/beans.png" alt="Beans" width={20} height={20} className={imgClass} />;
      case "ground": return <Image src="/icons/ground.png" alt="Ground" width={20} height={20} className={imgClass} />;
      case "phin": return <Image src="/icons/phin.png" alt="Phin" width={20} height={20} className={imgClass} />;
      case "gifts": return <Image src="/icons/gift.png" alt="Gifts" width={20} height={20} className={imgClass} />;
      default: return null;
    }
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setSort("featured");
  };

  return (
    <div>
      <div className="bg-[#fcfbfa] rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#e5e0d8]">
        {/* Row 1: Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#b5703a]"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm hương vị cà phê bạn yêu thích..."
              className="pl-12 pr-10 h-12 rounded-xl bg-transparent border-[#e5e0d8] focus-visible:ring-[#b5703a] placeholder:text-forest-950/40 text-base"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-black/5 text-forest-950/40 hover:bg-black/10 hover:text-forest-950/60 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Select value={sort} onValueChange={(value) => setSort(value as SortMode)}>
            <SelectTrigger className="w-full sm:w-[160px] h-12 rounded-xl bg-[#8c5324] text-white border-none focus:ring-0 focus:ring-offset-0 px-4 flex justify-between items-center hover:bg-[#7a481f] transition-colors" aria-label={t("sort")}>
              <div className="flex items-center gap-2 font-medium">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Bộ lọc</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">{t("featured")}</SelectItem>
              <SelectItem value="priceAsc">{t("priceAsc")}</SelectItem>
              <SelectItem value="priceDesc">{t("priceDesc")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Row 2: Categories & Clear Button */}
        {!hideCategories && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
            <div className="no-scrollbar flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {categories.map((item) => (
                <button
                  key={item}
                  className={cn(
                    "group flex items-center gap-2 h-10 shrink-0 rounded-xl px-4 text-sm font-semibold transition-all duration-300",
                    category === item 
                      ? "bg-[#6c3a12] text-white shadow-md" 
                      : "bg-[#f4f2ea] text-[#142918]/70 hover:bg-[#e8e4d8] hover:text-[#142918]"
                  )}
                  onClick={() => setCategory(item)}
                >
                  {getCategoryIcon(item, category === item)}
                  {t(item)}
                </button>
              ))}
            </div>

            <button 
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm font-medium text-forest-950/50 hover:text-[#b5703a] transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="mt-8 grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
        {currentProducts.map((product) => (
          <ProductCard key={product.slug} product={product} locale={locale} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e0d8] bg-white text-forest-950 transition hover:bg-[#fcfbfa] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  currentPage === i + 1
                    ? "bg-[#b5703a] text-white shadow-md"
                    : "text-forest-950/60 hover:bg-black/5 hover:text-forest-950"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e0d8] bg-white text-forest-950 transition hover:bg-[#fcfbfa] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
