import type {Locale} from "@/i18n/routing";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = (configuredSiteUrl || "https://sonlaspecialtycoffee.vn").replace(/\/$/, "");

export const siteConfig = {
  name: "Sơn La Coffee",
  email: "hello@sonlacoffee.vn",
  phone: "0987 627 806",
  zalo: "0987627806",
  facebook: "https://facebook.com/sonlacoffee",
  maps: "https://maps.app.goo.gl/kwuB9yFNDjCFXqB99",
  openingHours: {
    vi: "Mở cửa: 7:00 - 22:00",
    en: "Open: 7:00 - 22:00",
    schema: "Mo-Su 07:00-22:00"
  },
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
