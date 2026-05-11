import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {CinematicPageHero} from "@/components/sections/cinematic-page-hero";
import {ExploreExperience} from "@/features/explore/explore-experience";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Explore"});

  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/explore`,
      languages: {
        vi: "/vi/explore",
        en: "/en/explore",
        "x-default": "/vi/explore"
      }
    }
  };
}

export default async function ExplorePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Explore"});
  const common = await getTranslations({locale, namespace: "Common"});

  return (
    <main className="bg-parchment-50">
      <CinematicPageHero
        kicker={t("exploreKicker")}
        title={t("title")}
        copy={t("intro")}
        image={imageLibrary.mountains}
        imageAlt={t("mountainsAlt")}
        chips={[t("chip1"), t("chip2"), t("chip3")]}
        fieldJournal={common("fieldJournal")}
        scrollLabel={common("scrollDown")}
      />
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <ExploreExperience
            locale={locale}
            labels={{
              gallery: t("gallery"),
              reels: t("reels"),
              mapTitle: t("mapTitle"),
              mapLabel: t("mapLabel")
            }}
          />
        </div>
      </section>
    </main>
  );
}
