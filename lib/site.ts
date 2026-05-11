import type {Locale} from "@/i18n/routing";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonlacoffee.vn";

export const siteConfig = {
  name: "Sơn La Coffee",
  email: "hello@sonlacoffee.vn",
  phone: "+84 912 345 678",
  zalo: "+84 912 345 678",
  facebook: "https://facebook.com/sonlacoffee",
  address: {
    vi: "Bản Áng, Mộc Châu, Sơn La",
    en: "Ang Village, Moc Chau, Son La"
  } satisfies Record<Locale, string>,
  coordinates: {
    lat: 20.829,
    lng: 104.678
  }
};

export const localeNames: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English"
};
