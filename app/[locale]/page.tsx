import {getTranslations, setRequestLocale} from "next-intl/server";
import {CinematicHero} from "@/features/home/cinematic-hero";
import {OriginStorySection} from "@/features/home/origin-story-section";
import {CultureSection} from "@/features/home/culture-section";
import {CoreValuesSection} from "@/features/home/core-values-section";
import {ArabicaProductsSection} from "@/features/home/arabica-products-section";
import {CommitmentSection} from "@/features/home/commitment-section";
import {JourneysSection} from "@/features/home/journeys-section";
import {TestimonialsSection} from "@/features/home/testimonials-section";
import type {Metadata} from "next";
import type {Locale} from "@/i18n/routing";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const isVi = locale === "vi";
  const title = isVi
    ? "Wecacha · Hạt Cà Phê Đặc Sản Arabica Sơn La – Arabica Tinh Hoa Người Thái"
    : "Wecacha · Specialty Arabica Coffee Son La – The Essence of Thai Culture";
  const description = isVi
    ? "Hạt cà phê đặc sản Arabica Sơn La rang mộc nguyên bản, được người Thái chăm sóc tỉ mẩn trên độ cao 1.050m. Hương hoa rừng, vị chua thanh, hậu vị ngọt dịu kéo dài. Wecacha – Arabica tinh hoa người Thái."
    : "Specialty Arabica coffee from Son La, Vietnam — hand-harvested by Thai farmers at 1,050m altitude. Natural forest flower notes, clean acidity, sweet lingering finish. Wecacha – Arabica, the essence of Thai culture.";
  const keywords = isVi
    ? "hạt cà phê đặc sản arabica sơn la, cà phê arabica sơn la, arabica tây bắc, wecacha, cà phê rang mộc nguyên bản, người thái sơn la, specialty coffee việt nam"
    : "specialty arabica coffee son la, arabica son la vietnam, thai highland arabica, wecacha coffee, unflavored roasted arabica, northwest vietnam coffee";

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
  const t = await getTranslations({locale, namespace: "Home"});

  return (
    <main>
      <CinematicHero
        kicker={t("kicker")}
        title={t("heroTitle")}
        copy={t("heroCopy")}
        primary={t("ctaPrimary")}
        secondary={t("ctaSecondary")}
        scrollLabel={t("scroll")}
      />
      <OriginStorySection locale={locale} />
      <CultureSection locale={locale} />
      <CoreValuesSection locale={locale} />
      <ArabicaProductsSection locale={locale} />
      <CommitmentSection locale={locale} />
      {/* <JourneysSection locale={locale} /> */}
      {/* <TestimonialsSection locale={locale} /> */}
    </main>
  );
}
