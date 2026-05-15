import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";

export async function VisionMissionSection({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "About"});

  return (
    <section className="bg-forest-950 px-4 py-24 text-parchment-50 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Vision */}
          <Reveal>
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-earth-600/20 blur-2xl" />
              <h3 className="relative font-serif text-4xl text-white">
                {t("visionTitle")}
              </h3>
              <p className="mt-6 text-lg leading-8 text-white/70">
                {t("visionCopy")}
              </p>
            </div>
          </Reveal>

          {/* Mission */}
          <Reveal delay={0.2}>
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-ember/20 blur-2xl" />
              <h3 className="relative font-serif text-4xl text-white">
                {t("missionTitle")}
              </h3>
              <p className="mt-6 text-lg leading-8 text-white/70">
                {t("missionTagline")}
              </p>
              <ul className="mt-6 space-y-4 text-base text-white/70">
                <li className="flex gap-3">
                  <span className="text-ember">•</span>
                  <span>{t("missionBullet1")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-ember">•</span>
                  <span>{t("missionBullet2")}</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-ember">•</span>
                  <span>{t("missionBullet3")}</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
