import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {SectionHeading} from "@/components/sections/section-heading";
import {Reveal} from "@/components/motion/reveal";
import {AnimatedStats} from "@/features/home/animated-stats";
import type {Locale} from "@/i18n/routing";
import {cn} from "@/lib/utils";
import {localizedField, type SiteSection, type SiteSectionItem} from "@/lib/content/cms";

export async function OriginStorySection({
  locale,
  tone = "classic",
  section,
  items = []
}: {
  locale: Locale;
  tone?: "classic" | "green";
  section?: SiteSection | null;
  items?: SiteSectionItem[];
}) {
  const t = await getTranslations({locale, namespace: "Home"});
  const isGreen = tone === "green";
  const media = section?.media ?? {};
  const stats = items
    .filter((item) => item.type === "stat")
    .map((item) => ({
      icon: item.media?.icon as "mountain" | "map" | "award" | undefined,
      value: Number(item.data?.value ?? 0),
      suffix: typeof item.data?.suffix === "string" ? item.data.suffix : undefined,
      decimals: typeof item.data?.decimals === "number" ? item.data.decimals : undefined,
      label: localizedField(item, "title", locale),
      caption: localizedField(item, "body", locale)
    }));

  return (
    <section className="relative overflow-hidden bg-parchment-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      {/* Background image — right half only */}
      <div className="absolute inset-y-0 right-0 hidden w-1/3 lg:block">
        <Image src={media.background ?? "/image1.jpeg"} alt="" fill className="object-cover opacity-20" sizes="33vw" quality={80} />
        <div className="absolute inset-0 bg-gradient-to-l from-parchment-50/50 to-parchment-50" />
      </div>
      {/* Botanical decoration */}
      <div className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 select-none opacity-[0.07]" aria-hidden="true">
        <svg width="240" height="520" viewBox="0 0 240 520" fill="none">
          <path d="M120 510 Q90 420 75 320 Q55 200 100 110 Q115 75 120 10" stroke="#3d5a1e" strokeWidth="1.5" fill="none"/>
          <ellipse cx="85" cy="210" rx="65" ry="28" transform="rotate(-35 85 210)" fill="#3d5a1e"/>
          <ellipse cx="100" cy="320" rx="72" ry="26" transform="rotate(22 100 320)" fill="#3d5a1e"/>
          <ellipse cx="72" cy="155" rx="48" ry="20" transform="rotate(-55 72 155)" fill="#3d5a1e"/>
          <ellipse cx="108" cy="400" rx="60" ry="22" transform="rotate(38 108 400)" fill="#3d5a1e"/>
          <ellipse cx="65" cy="270" rx="52" ry="18" transform="rotate(-18 65 270)" fill="#3d5a1e"/>
          <ellipse cx="95" cy="90" rx="38" ry="15" transform="rotate(-70 95 90)" fill="#3d5a1e"/>
        </svg>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-8 sm:gap-12 lg:gap-16 lg:grid-cols-2">
        <Reveal className="relative z-10 lg:pr-10">
          <SectionHeading
            kicker={localizedField(section, "eyebrow", locale) || t("originKicker")}
            title={localizedField(section, "title", locale) || t("storyTitle")}
            copy={localizedField(section, "copy", locale) || t("storyCopy")}
          />
          <blockquote className="mt-8 border-l-2 border-ember pl-6 font-serif text-2xl italic leading-relaxed text-forest-950/80">
            "{localizedField(section, "quote", locale) || t("storyQuote")}"
          </blockquote>
          <AnimatedStats
            className="mt-9"
            stats={stats.length > 0 ? stats : [
              {
                icon: "mountain",
                value: 1200,
                suffix: "m+",
                label: t("statAltLabel"),
                caption: t("statAltCaption")
              },
              {
                icon: "map",
                value: 24300,
                suffix: " ha",
                label: t("statFarmersLabel"),
                caption: t("statFarmersCaption")
              },
              {
                icon: "award",
                value: 47.9,
                suffix: "%",
                decimals: 1,
                label: t("statRoastValue"),
                caption: t("statRoastCaption")
              }
            ]}
          />
        </Reveal>

        <Reveal delay={0.15} className="relative z-0 mt-12 lg:mt-0">
          <div className="relative w-full max-w-[550px] ml-auto">
            {/* Main image */}
            <div className="relative z-10 aspect-[3/4] w-4/5 ml-auto overflow-hidden rounded-[2.5rem] shadow-2xl">
              <Image
                src={media.primary ?? "/image2.jpeg"}
                alt={t("farmerAlt")}
                fill
                quality={95}
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>
            {/* Overlapping small image */}
            <div className="absolute bottom-16 left-0 z-20 aspect-[4/3] w-[55%] overflow-hidden rounded-[2rem] shadow-2xl border-[6px] border-parchment-50">
              <Image
                src={media.secondary ?? "/image1.jpeg"}
                alt="Coffee processing"
                fill
                quality={80}
                className="object-cover"
                sizes="30vw"
              />
            </div>
            {/* Soft glow behind */}
            <div
              className={cn(
                "absolute -inset-10 z-0 rounded-full blur-3xl",
                isGreen ? "bg-brand-green/5" : "bg-forest-950/5"
              )}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
