import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";

export async function BrandStorySection({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "About"});

  return (
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
  );
}
