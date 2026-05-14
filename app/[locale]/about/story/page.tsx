import Image from "next/image";
import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {CinematicImage} from "@/components/sections/cinematic-image";
import {SectionHeading} from "@/components/sections/section-heading";
import {Reveal} from "@/components/motion/reveal";
import {Button} from "@/components/ui/button";
import {ProductJourneyCarousel} from "@/features/story/product-journey-carousel";
import {GsapStoryConclusion} from "@/features/story/gsap-story-conclusion";
import {StoryChapterSlider} from "@/features/story/story-chapter-slider";
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
  const tAbout = await getTranslations({locale, namespace: "About"});

  return (
    <main className="bg-parchment-50">
      <section className="relative min-h-[92vh] overflow-hidden bg-forest-950 text-white">
        <div className="absolute inset-0 animate-drift-image will-change-transform">
          <Image
            src={imageLibrary.hero}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />
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

      <StoryChapterSlider
        locale={locale}
        fieldNotes={t("fieldNotes")}
        quote={t("quote")}
      />

      <ProductJourneyCarousel locale={locale} />

      <section
        id={storyChapters[2].id}
        className="relative overflow-hidden bg-forest-950 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28"
      >
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

      <section id={storyChapters[3].id} className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
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
            <div className="relative mx-auto mt-12 max-w-lg lg:mt-0 lg:max-w-none">
              <CinematicImage
                src={storyChapters[3].image}
                alt={localized(storyChapters[3].alt, locale)}
                className="aspect-[4/5] w-4/5 rounded-2xl shadow-[0_20px_60px_rgba(76,52,20,0.15)]"
              />
              <div className="absolute -bottom-12 -right-4 w-[60%] sm:-right-8">
                <div className="rounded-2xl bg-parchment-50 p-2 shadow-[0_30px_90px_rgba(76,52,20,0.22)]">
                  <CinematicImage
                    src={imageLibrary.beansBowl}
                    alt="Freshly roasted coffee beans"
                    className="aspect-[4/3] rounded-xl"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <GsapStoryConclusion
        title={tAbout("storyConclTitle")}
        copy={tAbout("storyConclCopy")}
        kicker={tAbout("storyConclKicker")}
        locale={locale}
      />
    </main>
  );
}
