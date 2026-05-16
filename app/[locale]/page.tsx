import {getTranslations, setRequestLocale} from "next-intl/server";
import {CinematicHero} from "@/features/home/cinematic-hero";
// import {RecentPurchasesMarquee} from "@/features/home/recent-purchases-marquee";
import {OriginStorySection} from "@/features/home/origin-story-section";
import {CultureSection} from "@/features/home/culture-section";
import {FeaturedProductsSection} from "@/features/home/featured-products-section";
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
    ? "Wecacha · Cà Phê Sơn La Rang Chậm Thủ Công"
    : "Wecacha · Handcrafted Slow Roast Son La Coffee";
  const description = isVi
    ? "Cà phê Sơn La rang thủ công, sinh trưởng giữa sương núi Tây Bắc 1.050m. Arabica nguyên chất, phin núi rừng và bộ quà thổ cẩm độc đáo. Giao hàng toàn quốc."
    : "Handcrafted Son La coffee from Vietnam's northwest highlands at 1,050m. Pure arabica, forest phin blends and unique brocade gift sets. Nationwide delivery.";
  const keywords = isVi
    ? "cà phê Sơn La, Wecacha, cà phê arabica Tây Bắc, cà phê rang thủ công, cà phê Mộc Châu, mua cà phê online Việt Nam"
    : "Son La coffee, Wecacha, arabica northwest Vietnam, slow roast coffee, Moc Chau coffee, buy Vietnamese coffee";

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
  const common = await getTranslations({locale, namespace: "Common"});

  return (
    <main>
      <CinematicHero
        kicker={t("kicker")}
        title={t("heroTitle")}
        copy={t("heroCopy")}
        primary={common("ctaShop")}
        secondary={common("ctaStory")}
        scrollLabel={t("scroll")}
      />
      {/* <RecentPurchasesMarquee /> — tạm ẩn */}
      <OriginStorySection locale={locale} />
      <CultureSection locale={locale} />
      <FeaturedProductsSection locale={locale} />
      <JourneysSection locale={locale} />
      <TestimonialsSection locale={locale} />
    </main>
  );
}
