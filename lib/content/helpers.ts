import type {Locale} from "@/i18n/routing";
import type {Localized} from "./types";

export function localized<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

export function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value);
}
