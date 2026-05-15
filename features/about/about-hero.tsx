import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";

export async function AboutHero({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "About"});
  const tNav = await getTranslations({locale, namespace: "Nav"});

  return (
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
  );
}
