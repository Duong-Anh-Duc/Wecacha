import Image from "next/image";
import {Reveal} from "@/components/motion/reveal";
import {imageLibrary} from "@/lib/content";
import {Flame, Clock, Droplets} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import {getTranslations} from "next-intl/server";
import {getPageContent, itemsForSection, localizedField, sectionByKey} from "@/lib/content/cms";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const content = await getPageContent("about-philosophy");
  const hero = sectionByKey(content, "hero");
  const body = sectionByKey(content, "body");
  return {
    title: localizedField(hero, "title", locale) || (locale === "vi" ? "Triết lý rang · Wecacha" : "Roasting Philosophy · Wecacha"),
    description: localizedField(body, "copy", locale) || (locale === "vi" ? "Khám phá nghệ thuật rang cà phê đặc sản tại Sơn La." : "Discover the art of specialty coffee roasting in Son La.")
  };
}

export default async function PhilosophyPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Philosophy"});
  const content = await getPageContent("about-philosophy");
  const hero = sectionByKey(content, "hero");
  const body = sectionByKey(content, "body");
  const principles = itemsForSection(content, "body");
  const paragraphs = (localizedField(body, "copy", locale) || `${t("respectPara1")}\n\n${t("respectPara2")}`)
    .split(/\n\n+/)
    .filter(Boolean);
  const iconMap = {
    flame: Flame,
    clock: Clock,
    droplets: Droplets
  };

  return (
    <main className="bg-forest-950 text-parchment-50">
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={hero?.media?.image ?? imageLibrary.coffeeRoast}
            alt="Coffee Roasting"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-forest-950/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center mt-20">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-ember">
              {localizedField(hero, "eyebrow", locale) || t("heatKicker")}
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl">
              {localizedField(hero, "title", locale) || t("heroTitle")}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h2 className="font-serif text-3xl sm:text-5xl">
                {localizedField(body, "title", locale) || t("respectTitle")}
              </h2>
              <div className="mt-8 space-y-6 text-lg text-white/70">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="grid gap-6 sm:grid-cols-2">
                {(principles.length > 0 ? principles : [
                  {item_key: "heat_control", media: {icon: "flame"}, title_vi: t("heatControlLabel"), title_en: t("heatControlLabel"), body_vi: t("heatControlDesc"), body_en: t("heatControlDesc")},
                  {item_key: "time", media: {icon: "clock"}, title_vi: t("timeLabel"), title_en: t("timeLabel"), body_vi: t("timeDesc"), body_en: t("timeDesc")},
                  {item_key: "cooling", media: {icon: "droplets"}, title_vi: t("coolingLabel"), title_en: t("coolingLabel"), body_vi: t("coolingDesc"), body_en: t("coolingDesc")}
                ]).map((principle, index) => {
                  const Icon = iconMap[principle.media?.icon as keyof typeof iconMap] ?? Flame;
                  return (
                    <div key={principle.item_key} className={`rounded-2xl bg-white/5 p-6 backdrop-blur ${index === 2 ? "sm:col-span-2" : ""}`}>
                      <Icon className="h-8 w-8 text-ember mb-4" />
                      <h3 className="font-serif text-xl mb-2">{localizedField(principle, "title", locale)}</h3>
                      <p className="text-sm text-white/60">{localizedField(principle, "body", locale)}</p>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
