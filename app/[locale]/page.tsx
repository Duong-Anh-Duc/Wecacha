import {setRequestLocale} from "next-intl/server";
import {HomePageView} from "@/features/home/home-page-view";
import type {Metadata} from "next";
import type {Locale} from "@/i18n/routing";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const isVi = locale === "vi";
  const title = isVi
    ? "Wecacha · Hạt Cà Phê Đặc Sản Arabica Sơn La – Tinh Hoa Người Thái"
    : "Wecacha · Specialty Arabica Coffee Son La – The Essence of Thai Culture";
  const description = isVi
    ? "Mua hạt cà phê đặc sản Arabica Sơn La rang mộc nguyên bản – được người Thái chăm sóc tỉ mẩn trên độ cao 1.050m. Hương hoa rừng, vị chua thanh, hậu vị ngọt dịu kéo dài. Wecacha – Arabica tinh hoa người Thái Tây Bắc."
    : "Buy specialty Arabica coffee from Son La, Vietnam — hand-harvested by Thai farmers at 1,050m altitude. Natural forest flower notes, clean acidity, sweet lingering finish. Wecacha – the essence of Thai highland culture.";
  const keywords = isVi
    ? "hạt cà phê đặc sản arabica sơn la, cà phê arabica sơn la, arabica tinh hoa người thái, mua cà phê arabica sơn la, arabica tây bắc, wecacha, cà phê rang mộc nguyên bản, người thái sơn la, specialty coffee việt nam, cà phê sơn la ngon, arabica sơn la mua ở đâu, cà phê đặc sản tây bắc"
    : "specialty arabica coffee son la, arabica son la vietnam, thai highland arabica, buy arabica son la, wecacha coffee, unflavored roasted arabica, northwest vietnam specialty coffee, son la arabica beans";

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        vi: "/vi",
        en: "/en",
        "x-default": "/vi"
      }
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: "Sơn La Coffee",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      type: "website",
      images: [
        {
          url: `/og/home.jpg`,
          width: 1200,
          height: 630,
          alt: isVi ? "Wecacha · Cà Phê Sơn La" : "Wecacha · Son La Coffee"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return <HomePageView locale={locale} tone="classic" />;
}
