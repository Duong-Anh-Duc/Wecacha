import type {Locale} from "@/i18n/routing";
import {AboutHero} from "@/features/about/about-hero";
import {BrandStorySection} from "@/features/about/brand-story-section";
import {VisionMissionSection} from "@/features/about/vision-mission-section";
import {CoreValuesSection} from "@/features/about/core-values-section";
import {AboutCtaSection} from "@/features/about/about-cta-section";
import {getPageContent, itemsForSection, localizedField, sectionByKey} from "@/lib/content/cms";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  const content = await getPageContent("about");
  const hero = sectionByKey(content, "hero");
  const isVi = locale === "vi";
  const title = localizedField(hero, "title", locale) || (isVi ? "Giới thiệu · Wecacha Sơn La" : "About Us · Wecacha Son La");
  const description = localizedField(hero, "copy", locale) || (isVi
    ? "Câu chuyện thương hiệu, tầm nhìn và sứ mệnh của Wecacha Sơn La Coffee."
    : "Brand story, vision and mission of Wecacha Son La Coffee.");
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
  const content = await getPageContent("about");

  return (
    <main className="bg-parchment-50">
      <AboutHero locale={locale} section={sectionByKey(content, "hero")} />
      <BrandStorySection
        locale={locale}
        section={sectionByKey(content, "brand_story")}
        items={itemsForSection(content, "brand_story")}
      />
      <VisionMissionSection locale={locale} content={content} />
      <CoreValuesSection
        locale={locale}
        section={sectionByKey(content, "core_values")}
        items={itemsForSection(content, "core_values")}
      />
      <AboutCtaSection locale={locale} section={sectionByKey(content, "cta")} />
    </main>
  );
}
