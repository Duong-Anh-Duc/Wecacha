import {getTranslations} from "next-intl/server";
import {CinematicImage} from "@/components/sections/cinematic-image";
import {SectionHeading} from "@/components/sections/section-heading";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";
import {cn} from "@/lib/utils";
import {localizedField, type SiteSection} from "@/lib/content/cms";

export async function CultureSection({
  locale,
  tone = "classic",
  section
}: {
  locale: Locale;
  tone?: "classic" | "green";
  section?: SiteSection | null;
}) {
  const t = await getTranslations({locale, namespace: "Home"});
  const isGreen = tone === "green";

  return (
    <section
      className={cn(
        "relative overflow-hidden px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-32",
        isGreen ? "bg-brand-green" : "bg-forest-950"
      )}
    >
      <div className="absolute inset-0 opacity-40">
        <CinematicImage
          src={section?.media?.background ?? "/image3.jpeg"}
          alt=""
          className="h-full rounded-none shadow-none"
          sizes="100vw"
        />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <Reveal>
          <SectionHeading
            light
            kicker={localizedField(section, "eyebrow", locale) || t("cultureKicker")}
            title={localizedField(section, "title", locale) || t("cultureTitle")}
            copy={localizedField(section, "copy", locale) || t("cultureCopy")}
          />
        </Reveal>
        <Reveal delay={0.15}>
          <blockquote className="border-y border-white/10 py-10 font-serif text-3xl sm:text-4xl leading-snug text-parchment-50 italic">
            "{localizedField(section, "quote", locale) || t("cultureQuote")}"
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
