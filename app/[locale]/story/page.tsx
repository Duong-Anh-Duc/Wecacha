import Image from "next/image";
import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {CinematicImage} from "@/components/sections/cinematic-image";
import {SectionHeading} from "@/components/sections/section-heading";
import {Reveal} from "@/components/motion/reveal";
import {Button} from "@/components/ui/button";
import {GsapRoastSequence} from "@/features/story/gsap-roast-sequence";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {imageLibrary, localized, storyChapters} from "@/lib/content";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Story"});

  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/story`,
      languages: {
        vi: "/vi/story",
        en: "/en/story",
        "x-default": "/vi/story"
      }
    }
  };
}

export default async function StoryPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Story"});
  const common = await getTranslations({locale, namespace: "Common"});

  return (
    <main className="bg-parchment-50">
      <section className="relative min-h-[92vh] overflow-hidden bg-forest-950 text-white">
        <Image
          src={imageLibrary.hero}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="cinematic-vignette" />
        <div className="mist-layer" />
        <div className="light-leak" />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-end px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <Reveal>
            <p className="mb-5 text-xs font-bold uppercase text-ember">
              {t("documentary")}
            </p>
            <h1 className="max-w-5xl font-serif text-6xl leading-[0.95] text-parchment-50 sm:text-7xl lg:text-8xl">
              {t("title")}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72">
              {t("intro")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <Reveal>
            <div className="sticky top-28">
              <p className="text-xs font-bold uppercase text-earth-600">
                {t("fieldNotes")}
              </p>
              <blockquote className="mt-5 font-serif text-4xl leading-tight text-forest-950 sm:text-5xl">
                {t("quote")}
              </blockquote>
            </div>
          </Reveal>
          <div className="grid gap-14">
            {storyChapters.slice(0, 2).map((chapter, index) => (
              <Reveal key={chapter.id} delay={index * 0.08}>
                <article className="grid gap-7 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                  <CinematicImage
                    src={chapter.image}
                    alt={localized(chapter.alt, locale)}
                    className="aspect-[4/3]"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase text-earth-600">
                      {localized(chapter.eyebrow, locale)}
                    </p>
                    <h2 className="mt-3 font-serif text-4xl leading-tight text-forest-950 sm:text-5xl">
                      {localized(chapter.title, locale)}
                    </h2>
                    <div className="mt-5 space-y-5 text-base leading-8 text-forest-950/68">
                      {localized(chapter.body, locale).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-forest-950 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 grid grid-cols-3 opacity-52">
          {[imageLibrary.brocade, imageLibrary.campfire, imageLibrary.village].map(
            (src) => (
              <div className="relative" key={src}>
                <Image src={src} alt="" fill className="object-cover" sizes="33vw" />
              </div>
            )
          )}
          <div className="absolute inset-0 bg-forest-950/72" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="text-xs font-bold uppercase text-ember">
              {localized(storyChapters[2].eyebrow, locale)}
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-tight text-parchment-50 sm:text-6xl">
              {localized(storyChapters[2].title, locale)}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
              {localized(storyChapters[2].body, locale)[0]}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              kicker={localized(storyChapters[3].eyebrow, locale)}
              title={localized(storyChapters[3].title, locale)}
              copy={localized(storyChapters[3].body, locale)[0]}
            />
            <p className="mt-5 max-w-2xl text-base leading-8 text-forest-950/68">
              {localized(storyChapters[3].body, locale)[1]}
            </p>
            <Button asChild className="mt-8" variant="forest">
              <Link href="/shop">{common("ctaShop")}</Link>
            </Button>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="grid grid-cols-2 gap-3">
              <CinematicImage
                src={imageLibrary.roasted}
                alt={localized(storyChapters[3].alt, locale)}
                className="aspect-[4/5]"
              />
              <div className="grid gap-3">
                <CinematicImage
                  src={imageLibrary.cup}
                  alt={t("coffeeCupAlt")}
                  className="aspect-square"
                />
                <CinematicImage
                  src={imageLibrary.brocade}
                  alt={t("brocadeAlt")}
                  className="aspect-square"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <GsapRoastSequence
        title={localized(storyChapters[3].title, locale)}
        copy={localized(storyChapters[3].body, locale)[1]}
        kicker={t("slowRoastKicker")}
      />
    </main>
  );
}
