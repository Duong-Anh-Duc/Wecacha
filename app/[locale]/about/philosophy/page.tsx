import Image from "next/image";
import {Reveal} from "@/components/motion/reveal";
import {imageLibrary} from "@/lib/content";
import {Flame, Clock, Droplets} from "lucide-react";
import type {Locale} from "@/i18n/routing";
import {getTranslations} from "next-intl/server";

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  return {
    title: locale === "vi" ? "Triết lý rang · Wecacha" : "Roasting Philosophy · Wecacha",
    description: locale === "vi" ? "Khám phá nghệ thuật rang cà phê đặc sản tại Sơn La." : "Discover the art of specialty coffee roasting in Son La."
  };
}

export default async function PhilosophyPage({params}: {params: Promise<{locale: Locale}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Philosophy"});

  return (
    <main className="bg-forest-950 text-parchment-50">
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageLibrary.coffeeRoast}
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
              {t("heatKicker")}
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl">
              {t("heroTitle")}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h2 className="font-serif text-3xl sm:text-5xl">
                {t("respectTitle")}
              </h2>
              <div className="mt-8 space-y-6 text-lg text-white/70">
                <p>
                  {t("respectPara1")}
                </p>
                <p>
                  {t("respectPara2")}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur">
                  <Flame className="h-8 w-8 text-ember mb-4" />
                  <h3 className="font-serif text-xl mb-2">{t("heatControlLabel")}</h3>
                  <p className="text-sm text-white/60">{t("heatControlDesc")}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur">
                  <Clock className="h-8 w-8 text-ember mb-4" />
                  <h3 className="font-serif text-xl mb-2">{t("timeLabel")}</h3>
                  <p className="text-sm text-white/60">{t("timeDesc")}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur sm:col-span-2">
                  <Droplets className="h-8 w-8 text-ember mb-4" />
                  <h3 className="font-serif text-xl mb-2">{t("coolingLabel")}</h3>
                  <p className="text-sm text-white/60">{t("coolingDesc")}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
