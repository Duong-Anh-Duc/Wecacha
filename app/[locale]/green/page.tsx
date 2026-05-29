import {setRequestLocale} from "next-intl/server";
import type {Metadata} from "next";
import {HomePageView} from "@/features/home/home-page-view";
import type {Locale} from "@/i18n/routing";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const isVi = locale === "vi";
  const title = isVi
    ? "Wecacha · Trang Chủ Xanh"
    : "Wecacha · Green Home";
  const description = isVi
    ? "Biến thể trang chủ với tông xanh thương hiệu mới của Wecacha."
    : "Homepage variant with Wecacha's new green brand tone.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/green`,
      languages: {
        vi: "/vi/green",
        en: "/en/green",
        "x-default": "/vi/green"
      }
    }
  };
}

export default async function GreenHomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <HomePageView locale={locale} tone="green" />;
}
