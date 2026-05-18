import type {Locale} from "@/i18n/routing";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const siteConfig = {
  name: "Sơn La Coffee",
  email: "hello@sonlacoffee.vn",
  phone: "0983 538 814",
  zalo: "0983538814",
  facebook: "https://facebook.com/sonlacoffee",
  address: {
    vi: "101 D6 Trần Huy Liệu, Giảng Võ, Ba Đình, Hà Nội",
    en: "101 D6 Tran Huy Lieu, Giang Vo, Ba Dinh, Hanoi"
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
