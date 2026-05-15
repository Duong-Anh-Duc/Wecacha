import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {SectionHeading} from "@/components/sections/section-heading";
import {Reveal} from "@/components/motion/reveal";
import {AnimatedStats} from "@/features/home/animated-stats";
import type {Locale} from "@/i18n/routing";

export async function OriginStorySection({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "Home"});

  return (
    <section className="relative overflow-hidden bg-parchment-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      {/* Background image — right half only */}
      <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <Image src="/image1.jpeg" alt="" fill className="object-cover" sizes="50vw" quality={80} />
        <div className="absolute inset-0 bg-parchment-50/60" />
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

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            kicker={t("originKicker")}
            title={t("storyTitle")}
            copy={t("storyCopy")}
          />
          <AnimatedStats
            className="mt-9"
            stats={[
              {
                icon: "leaf",
                value: 1050,
                suffix: "m+",
                label: t("statAltLabel"),
                caption: t("statAltCaption")
              },
              {
                icon: "users",
                value: 120,
                suffix: "+",
                label: t("statFarmersLabel"),
                caption: t("statFarmersCaption")
              },
              {
                icon: "flame",
                value: 48,
                suffix: "h+",
                label: t("statRoastValue"),
                caption: t("statRoastCaption")
              }
            ]}
          />
        </Reveal>

        {/* Arch image */}
        <Reveal delay={0.15} className="flex justify-center lg:justify-end">
          <div
            className="relative w-full max-w-[400px] overflow-hidden shadow-cinematic"
            style={{aspectRatio: "3/4", borderRadius: "9999px 9999px 20px 20px"}}
          >
            <Image
              src="/image2.jpeg"
              alt={t("farmerAlt")}
              fill
              quality={95}
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 90vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
