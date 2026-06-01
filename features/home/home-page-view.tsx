import {getTranslations} from "next-intl/server";
import {CinematicHero} from "@/features/home/cinematic-hero";
import {OriginStorySection} from "@/features/home/origin-story-section";
import {CultureSection} from "@/features/home/culture-section";
import {CoreValuesSection} from "@/features/home/core-values-section";
import {ArabicaProductsSection} from "@/features/home/arabica-products-section";
import {CommitmentSection} from "@/features/home/commitment-section";
import type {Locale} from "@/i18n/routing";
import {getPageContent, itemsForSection, localizedField, localizedValue, sectionByKey} from "@/lib/content/cms";

export async function HomePageView({
  locale,
  tone = "classic"
}: {
  locale: Locale;
  tone?: "classic" | "green";
}) {
  const t = await getTranslations({locale, namespace: "Home"});
  const content = await getPageContent("home");
  const hero = sectionByKey(content, "hero");

  return (
    <main>
      <CinematicHero
        locale={locale}
        kicker={localizedField(hero, "eyebrow", locale) || t("kicker")}
        title={localizedField(hero, "title", locale) || t("heroTitle")}
        copy={localizedField(hero, "copy", locale) || t("heroCopy")}
        primary={localizedField(hero, "cta_label", locale) || t("ctaPrimary")}
        secondary={
          localizedValue(hero?.settings?.secondaryCta, locale, t("ctaSecondary"))
        }
        primaryHref={hero?.cta_href ?? "/contact"}
        secondaryHref={hero?.settings?.secondaryCta?.href ?? "/explore"}
        scrollLabel={localizedValue(hero?.settings?.scrollLabel, locale, t("scroll"))}
        media={hero?.media}
        tone={tone}
      />
      <OriginStorySection
        locale={locale}
        tone={tone}
        section={sectionByKey(content, "origin_story")}
        items={itemsForSection(content, "origin_story")}
      />
      <CultureSection
        locale={locale}
        tone={tone}
        section={sectionByKey(content, "culture")}
      />
      <CoreValuesSection
        locale={locale}
        section={sectionByKey(content, "core_values")}
        items={itemsForSection(content, "core_values")}
      />
      <ArabicaProductsSection
        locale={locale}
        tone={tone}
        section={sectionByKey(content, "featured_product_cards")}
        items={itemsForSection(content, "featured_product_cards")}
      />
      <CommitmentSection
        locale={locale}
        tone={tone}
        section={sectionByKey(content, "commitment")}
        items={itemsForSection(content, "commitment")}
      />
    </main>
  );
}
