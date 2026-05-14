import Image from "next/image";
import {CheckCircle2, HeartHandshake, Leaf, ShieldCheck} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {SectionHeading} from "@/components/sections/section-heading";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  return {
    title: locale === "vi" ? "Giới thiệu · Wecacha Sơn La" : "About Us · Wecacha Son La",
    description: locale === "vi" ? "Câu chuyện thương hiệu, tầm nhìn và sứ mệnh của Wecacha Sơn La Coffee." : "Brand story, vision and mission of Wecacha Son La Coffee."
  };
}

export default async function AboutPage({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "About"});
  const tNav = await getTranslations({locale, namespace: "Nav"});

  return (
    <main className="bg-parchment-50">
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageLibrary.mountains}
            alt="Sơn La Mountains"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-forest-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-parchment-50 via-forest-950/40 to-transparent" />
        </div>

        <div className="absolute top-28 left-4 sm:left-6 lg:left-8 z-20 xl:left-12">
          <Breadcrumbs
            homeLabel={tNav("home")}
            theme="dark"
            items={[{ label: t("breadcrumb") }]}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 mt-20">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember mb-6">
              {t("kicker")}
            </p>
            <h1 className="font-serif text-5xl leading-[1.1] text-parchment-50 sm:text-7xl">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/80">
              {t("heroCopy")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. Brand Story Content */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-cinematic">
              <Image
                src={imageLibrary.farmer}
                alt="Coffee Farmer"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-forest-950/10" />
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-4xl leading-tight text-forest-950 sm:text-5xl">
                {t("harmonyTitle")}
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-forest-950/70">
                <p>{t("harmonyPara1")}</p>
                <p>{t("harmonyPara2")}</p>
                <p>{t("harmonyPara3")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Vision & Mission (Dark Section) */}
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

      {/* 4. Core Values */}
      <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            kicker={t("coreValuesKicker")}
            title={t("coreValuesTitle")}
            align="center"
          />

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal delay={0.1}>
              <div className="group h-full rounded-2xl border border-forest-950/10 bg-white p-8 text-center shadow-warm transition duration-500 hover:-translate-y-2 hover:shadow-cinematic">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-parchment-100 text-earth-700 transition group-hover:bg-earth-600 group-hover:text-white">
                  <HeartHandshake className="h-8 w-8" />
                </div>
                <h4 className="mt-6 font-serif text-2xl text-forest-950">
                  {t("value1Label")}
                </h4>
                <p className="mt-4 text-sm leading-6 text-forest-950/60">
                  {t("value1Copy")}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="group h-full rounded-2xl border border-forest-950/10 bg-white p-8 text-center shadow-warm transition duration-500 hover:-translate-y-2 hover:shadow-cinematic">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-parchment-100 text-earth-700 transition group-hover:bg-earth-600 group-hover:text-white">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h4 className="mt-6 font-serif text-2xl text-forest-950">
                  {t("value2Label")}
                </h4>
                <p className="mt-4 text-sm leading-6 text-forest-950/60">
                  {t("value2Copy")}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="group h-full rounded-2xl border border-forest-950/10 bg-white p-8 text-center shadow-warm transition duration-500 hover:-translate-y-2 hover:shadow-cinematic">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-parchment-100 text-earth-700 transition group-hover:bg-earth-600 group-hover:text-white">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="mt-6 font-serif text-2xl text-forest-950">
                  {t("value3Label")}
                </h4>
                <p className="mt-4 text-sm leading-6 text-forest-950/60">
                  {t("value3Copy")}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="group h-full rounded-2xl border border-forest-950/10 bg-white p-8 text-center shadow-warm transition duration-500 hover:-translate-y-2 hover:shadow-cinematic">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-parchment-100 text-earth-700 transition group-hover:bg-earth-600 group-hover:text-white">
                  <Leaf className="h-8 w-8" />
                </div>
                <h4 className="mt-6 font-serif text-2xl text-forest-950">
                  {t("value4Label")}
                </h4>
                <p className="mt-4 text-sm leading-6 text-forest-950/60">
                  {t("value4Copy")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. CTA Footer Block */}
      <section className="relative flex min-h-[50vh] items-center justify-center py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageLibrary.brocade}
            alt="Brocade pattern"
            fill
            className="object-cover opacity-30 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-forest-950/90" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <Reveal>
            <h2 className="font-serif text-4xl text-parchment-50 sm:text-5xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
              {t("ctaCopy")}
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex h-14 items-center justify-center rounded-full bg-earth-600 px-8 text-base font-bold text-white transition hover:bg-earth-700"
              >
                {t("ctaShop")}
              </Link>
              <Link
                href="/explore"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                {t("ctaJourney")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
