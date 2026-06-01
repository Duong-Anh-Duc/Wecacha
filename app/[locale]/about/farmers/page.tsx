import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {imageLibrary} from "@/lib/content";
import type {Locale} from "@/i18n/routing";
import {getPageContent, localizedField, sectionByKey} from "@/lib/content/cms";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  const content = await getPageContent("about-farmers");
  const hero = sectionByKey(content, "hero");
  const body = sectionByKey(content, "body");
  return {
    title: localizedField(hero, "title", locale) || (locale === "vi" ? "Người nông dân · Wecacha" : "Our Farmers · Wecacha"),
    description: localizedField(body, "copy", locale) || (locale === "vi" ? "Gặp gỡ những người giữ mùa trên vùng núi Sơn La." : "Meet the season keepers in the mountains of Son La.")
  };
}

export default async function FarmersPage({params}: Props) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "About"});
  const content = await getPageContent("about-farmers");
  const hero = sectionByKey(content, "hero");
  const body = sectionByKey(content, "body");
  const paragraphs = (localizedField(body, "copy", locale) || `${t("farmersPara1")}\n\n${t("farmersPara2")}`)
    .split(/\n\n+/)
    .filter(Boolean);

  return (
    <main className="bg-parchment-50 text-forest-950">
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={hero?.media?.image ?? imageLibrary.harvest}
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
              {localizedField(hero, "eyebrow", locale) || t("farmersKicker")}
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl">
              {localizedField(hero, "title", locale) || t("farmersTitle")}
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
                  src={body?.media?.image ?? imageLibrary.village}
                  alt="Son La Village"
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
            <div className="flex flex-col justify-center">
              <Reveal delay={0.2}>
                <h2 className="font-serif text-3xl sm:text-5xl mb-6">
                  {localizedField(body, "title", locale) || t("farmersHandsTitle")}
                </h2>
                <div className="space-y-6 text-lg text-forest-950/70">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <div className="mt-8 border-l-2 border-ember pl-6 italic">
                    {localizedField(body, "quote", locale) || t("farmersQuote")}
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
