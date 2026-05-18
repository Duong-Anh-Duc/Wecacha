import {getTranslations} from "next-intl/server";
import {SectionHeading} from "@/components/sections/section-heading";
import {Reveal} from "@/components/motion/reveal";
import {JourneyCards} from "@/features/home/journey-cards";
import type {Locale} from "@/i18n/routing";

export async function JourneysSection({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "Home"});

  return (
    <section className="bg-forest-950 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            light
            kicker={t("journeysKicker")}
            title={t("journeysTitle")}
            align="center"
          />
        </Reveal>
        <div className="mt-12">
          <JourneyCards locale={locale} />
        </div>
      </div>
    </section>
  );
}
