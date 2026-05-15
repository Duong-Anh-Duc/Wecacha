import type {Locale} from "@/i18n/routing";
import {AboutHero} from "@/features/about/about-hero";
import {BrandStorySection} from "@/features/about/brand-story-section";
import {VisionMissionSection} from "@/features/about/vision-mission-section";
import {CoreValuesSection} from "@/features/about/core-values-section";
import {AboutCtaSection} from "@/features/about/about-cta-section";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  const isVi = locale === "vi";
  const title = isVi ? "Giới thiệu · Wecacha Sơn La" : "About Us · Wecacha Son La";
  const description = isVi
    ? "Câu chuyện thương hiệu, tầm nhìn và sứ mệnh của Wecacha Sơn La Coffee."
    : "Brand story, vision and mission of Wecacha Son La Coffee.";
  const ogTitle = isVi ? "Giới thiệu Wecacha" : "About Wecacha";
  const ogKicker = isVi ? "Câu chuyện thương hiệu" : "Brand story";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {vi: "/vi/about", en: "/en/about", "x-default": "/vi/about"}
    },
    openGraph: {
      title,
      description,
      images: [{url: `/og/image.png?locale=${locale}&title=${encodeURIComponent(ogTitle)}&kicker=${encodeURIComponent(ogKicker)}`, width: 1200, height: 630}]
    }
  };
}

export default async function AboutPage({params}: Props) {
  const {locale} = await params;

  return (
    <main className="bg-parchment-50">
      <AboutHero locale={locale} />
      <BrandStorySection locale={locale} />
      <VisionMissionSection locale={locale} />
      <CoreValuesSection locale={locale} />
      <AboutCtaSection locale={locale} />
    </main>
  );
}
