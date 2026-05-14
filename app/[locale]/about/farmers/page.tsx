import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {imageLibrary} from "@/lib/content";
import type {Locale} from "@/i18n/routing";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  return {
    title: locale === "vi" ? "Người nông dân · Wecacha" : "Our Farmers · Wecacha",
    description: locale === "vi" ? "Gặp gỡ những người giữ mùa trên vùng núi Sơn La." : "Meet the season keepers in the mountains of Son La."
  };
}

export default async function FarmersPage({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "About"});

  return (
    <main className="bg-parchment-50 text-forest-950">
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={imageLibrary.harvest}
            alt="Coffee Harvest"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest-950/60" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center mt-20 text-white">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-ember">
              {t("farmersKicker")}
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl">
              {t("farmersTitle")}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                <Image
                  src={imageLibrary.village}
                  alt="Son La Village"
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
            <div className="flex flex-col justify-center">
              <Reveal delay={0.2}>
                <h2 className="font-serif text-3xl sm:text-5xl mb-6">
                  {t("farmersHandsTitle")}
                </h2>
                <div className="space-y-6 text-lg text-forest-950/70">
                  <p>{t("farmersPara1")}</p>
                  <p>{t("farmersPara2")}</p>
                  <div className="mt-8 border-l-2 border-ember pl-6 italic">
                    {t("farmersQuote")}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
