import {getTranslations} from "next-intl/server";
import {CinematicImage} from "@/components/sections/cinematic-image";
import {SectionHeading} from "@/components/sections/section-heading";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";
import {localized, storyChapters} from "@/lib/content";

export async function CultureSection({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "Home"});

  return (
    <section className="relative overflow-hidden bg-forest-950 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
      <div className="absolute inset-0 opacity-45">
        <CinematicImage
          src="/image3.jpeg"
          alt=""
          className="h-full rounded-none shadow-none"
          sizes="100vw"
        />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <Reveal>
          <SectionHeading
            light
            kicker={t("cultureKicker")}
            title={t("cultureTitle")}
            copy={t("cultureCopy")}
          />
        </Reveal>
        <Reveal delay={0.15}>
          <blockquote className="border-y border-white/14 py-8 font-serif text-3xl leading-tight text-parchment-50">
            {localized(storyChapters[2].body, locale)[0]}
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
