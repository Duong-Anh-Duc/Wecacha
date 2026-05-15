import type {Locale} from "@/i18n/routing";
import type {Localized} from "./types";
import {products} from "./products";

export function localized<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string) {
  return products.filter((product) => product.slug !== slug).slice(0, 3);
}

export function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value);
}
