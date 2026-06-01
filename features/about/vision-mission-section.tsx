import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";
import {
  itemsForSection,
  localizedField,
  localizedValue,
  type PageContent,
  type SiteSectionItem
} from "@/lib/content/cms";

export async function VisionMissionSection({
  locale,
  content
}: {
  locale: Locale;
  content?: PageContent;
}) {
  const t = await getTranslations({locale, namespace: "About"});
  const items = content ? itemsForSection(content, "vision_mission") : [];
  const itemByKey = (key: string) => items.find((item) => item.item_key === key);
  const vision = itemByKey("vision");
  const mission = itemByKey("mission");
  const missionBullets = localizedValue<string[]>(
    (mission as SiteSectionItem | undefined)?.data?.bullets,
    locale,
    [t("missionBullet1"), t("missionBullet2"), t("missionBullet3")]
  );

  return (
    <section className="bg-forest-950 px-4 py-24 text-parchment-50 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Vision */}
          <Reveal>
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-earth-600/20 blur-2xl" />
              <h3 className="relative font-serif text-4xl text-white">
                {localizedField(vision, "title", locale) || t("visionTitle")}
              </h3>
              <p className="mt-6 text-lg leading-8 text-white/70">
                {localizedField(vision, "body", locale) || t("visionCopy")}
              </p>
            </div>
          </Reveal>

          {/* Mission */}
          <Reveal delay={0.2}>
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-ember/20 blur-2xl" />
              <h3 className="relative font-serif text-4xl text-white">
                {localizedField(mission, "title", locale) || t("missionTitle")}
              </h3>
              <p className="mt-6 text-lg leading-8 text-white/70">
                {localizedField(mission, "body", locale) || t("missionTagline")}
              </p>
              <ul className="mt-6 space-y-4 text-base text-white/70">
                {missionBullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="text-ember">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
