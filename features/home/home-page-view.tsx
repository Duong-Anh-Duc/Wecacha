import {getTranslations} from "next-intl/server";
import {CinematicHero} from "@/features/home/cinematic-hero";
import {OriginStorySection} from "@/features/home/origin-story-section";
import {CultureSection} from "@/features/home/culture-section";
import {CoreValuesSection} from "@/features/home/core-values-section";
import {ArabicaProductsSection} from "@/features/home/arabica-products-section";
import {CommitmentSection} from "@/features/home/commitment-section";
import type {Locale} from "@/i18n/routing";

export async function HomePageView({
  locale,
  tone = "classic"
}: {
  locale: Locale;
  tone?: "classic" | "green";
}) {
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
        tone={tone}
      />
      <OriginStorySection locale={locale} tone={tone} />
      <CultureSection locale={locale} tone={tone} />
      <CoreValuesSection locale={locale} />
      <ArabicaProductsSection locale={locale} tone={tone} />
      <CommitmentSection locale={locale} tone={tone} />
    </main>
  );
}
