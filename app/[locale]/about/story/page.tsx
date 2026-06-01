import Image from "next/image";
import Link from "next/link";
import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {CinematicImage} from "@/components/sections/cinematic-image";
import {SectionHeading} from "@/components/sections/section-heading";
import {Reveal} from "@/components/motion/reveal";
import {Button} from "@/components/ui/button";
import {ProductJourneyCarousel} from "@/features/story/product-journey-carousel";
import {GsapStoryConclusion} from "@/features/story/gsap-story-conclusion";
import {StoryChapterSlider, type StoryChapterSlide} from "@/features/story/story-chapter-slider";
import type {Locale} from "@/i18n/routing";
import {imageLibrary, localized, storyChapters} from "@/lib/content";
import {
  getPageContent,
  itemsForSection,
  localizedField,
  localizedValue,
  sectionByKey
} from "@/lib/content/cms";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const content = await getPageContent("story");
  const hero = sectionByKey(content, "hero");
  const t = await getTranslations({locale, namespace: "Story"});
  const title = localizedField(hero, "title", locale) || t("title");
  const description = localizedField(hero, "copy", locale) || t("intro");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/about/story`,
      languages: {
        vi: "/vi/about/story",
        en: "/en/about/story",
        "x-default": "/vi/about/story"
      }
    }
  };
}

const localeHref = (locale: Locale, href: string) => {
  if (href.startsWith("http")) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href;
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
};

export default async function StoryPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Story"});
  const common = await getTranslations({locale, namespace: "Common"});
  const tAbout = await getTranslations({locale, namespace: "About"});
  const content = await getPageContent("story");
  const hero = sectionByKey(content, "hero");
  const chaptersSection = sectionByKey(content, "chapters");
  const journeySection = sectionByKey(content, "journey_feature");
  const cultureBand = sectionByKey(content, "culture_band");
  const roastSection = sectionByKey(content, "roast_section");
  const conclusion = sectionByKey(content, "conclusion");
  const chapterItems = itemsForSection(content, "chapters");
  const journeyItems = itemsForSection(content, "journey_feature");
  const chapters: StoryChapterSlide[] = chapterItems.length > 0
    ? chapterItems.map((chapter) => ({
      id: chapter.item_key,
      eyebrow: localizedField(chapter, "label", locale),
      title: localizedField(chapter, "title", locale),
      body: localizedValue<string[]>(chapter.data?.paragraphs, locale, localizedField(chapter, "body", locale).split(/\n\n+/).filter(Boolean)),
      image: chapter.media?.image ?? "/sonla_mist_season.png",
      alt: localizedValue<string>(chapter.data?.alt, locale, localizedField(chapter, "title", locale))
    }))
    : storyChapters.map((chapter) => ({
      id: chapter.id,
      eyebrow: localized(chapter.eyebrow, locale),
      title: localized(chapter.title, locale),
      body: localized(chapter.body, locale),
      image: chapter.image,
      alt: localized(chapter.alt, locale)
    }));
  const discoverCards = journeyItems
    .filter((item) => item.type === "discover_card")
    .map((item) => ({
      title: localizedField(item, "title", locale),
      body: localizedField(item, "body", locale),
      href: item.href ?? "/explore",
      image: item.media?.image as string | undefined
    }));
  const newsCards = journeyItems
    .filter((item) => item.type === "news_card")
    .map((item) => ({
      title: localizedField(item, "title", locale),
      body: localizedField(item, "body", locale),
      href: item.href ?? "/news",
      icon: item.media?.icon as string | undefined
    }));
  const cultureImages = (cultureBand?.media?.images as string[] | undefined) ?? [
    imageLibrary.brocade,
    imageLibrary.campfire,
    imageLibrary.village
  ];

  return (
    <main className="bg-parchment-50">
      <section className="relative min-h-[92vh] overflow-hidden bg-forest-950 text-white">
        <div className="absolute inset-0 animate-drift-image will-change-transform">
          <Image
            src={hero?.media?.image ?? imageLibrary.hero}
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
              {localizedField(hero, "eyebrow", locale) || t("documentary")}
            </p>
            <h1 className="max-w-5xl font-serif text-6xl leading-[0.95] text-parchment-50 sm:text-7xl lg:text-8xl">
              {localizedField(hero, "title", locale) || t("title")}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72">
              {localizedField(hero, "copy", locale) || t("intro")}
            </p>
          </Reveal>
        </div>
      </section>

      <StoryChapterSlider
        locale={locale}
        fieldNotes={localizedField(chaptersSection, "eyebrow", locale) || t("fieldNotes")}
        quote={localizedField(chaptersSection, "quote", locale) || t("quote")}
        chapters={chapters}
      />

      <ProductJourneyCarousel
        locale={locale}
        kicker={localizedField(journeySection, "eyebrow", locale)}
        title={localizedField(journeySection, "title", locale)}
        body={localizedField(journeySection, "copy", locale)}
        ctaLabel={localizedField(journeySection, "cta_label", locale)}
        ctaHref={journeySection?.cta_href ?? "/explore"}
        image={journeySection?.media?.image ?? imageLibrary.hero}
        discoverLabel={localizedValue<string>(journeySection?.settings?.discoverLabel, locale, locale === "vi" ? "Khám phá" : "Explore")}
        newsLabel={localizedValue<string>(journeySection?.settings?.newsLabel, locale, locale === "vi" ? "Tin tức" : "News")}
        readLabel={localizedValue<string>(journeySection?.settings?.readLabel, locale, locale === "vi" ? "Đọc thêm" : "Read more")}
        discoverCards={discoverCards}
        newsCards={newsCards}
      />

      <section
        id={chapters[2]?.id ?? "culture"}
        className="relative overflow-hidden bg-forest-950 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="absolute inset-0 grid grid-cols-3 opacity-52">
          {cultureImages.map(
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
              {localizedField(cultureBand, "eyebrow", locale) || chapters[2]?.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-tight text-parchment-50 sm:text-6xl">
              {localizedField(cultureBand, "title", locale) || chapters[2]?.title}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
              {localizedField(cultureBand, "copy", locale) || chapters[2]?.body[0]}
            </p>
          </Reveal>
        </div>
      </section>

      <section id={chapters[3]?.id ?? "roast"} className="relative px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              kicker={localizedField(roastSection, "eyebrow", locale) || chapters[3]?.eyebrow}
              title={localizedField(roastSection, "title", locale) || chapters[3]?.title}
              copy={localizedField(roastSection, "copy", locale) || chapters[3]?.body[0]}
            />
            <p className="mt-5 max-w-2xl text-base leading-8 text-forest-950/68">
              {localizedValue<string>(roastSection?.settings?.extraCopy, locale, chapters[3]?.body[1] ?? "")}
            </p>
            <Button asChild className="mt-8" variant="forest">
              <Link href={localeHref(locale, roastSection?.cta_href ?? "/shop")}>
                {localizedField(roastSection, "cta_label", locale) || common("ctaShop")}
              </Link>
            </Button>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative mx-auto mt-12 max-w-lg lg:mt-0 lg:max-w-none">
              <CinematicImage
                src={roastSection?.media?.image ?? chapters[3]?.image ?? "/sonla_roastery.png"}
                alt={localizedValue<string>(roastSection?.media?.alt, locale, chapters[3]?.alt ?? "")}
                className="aspect-[4/5] w-4/5 rounded-2xl shadow-[0_20px_60px_rgba(76,52,20,0.15)]"
              />
              <div className="absolute -bottom-12 -right-4 w-[60%] sm:-right-8">
                <div className="rounded-2xl bg-parchment-50 p-2 shadow-[0_30px_90px_rgba(76,52,20,0.22)]">
                  <CinematicImage
                    src={roastSection?.media?.secondaryImage ?? imageLibrary.beansBowl}
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
        title={localizedField(conclusion, "title", locale) || tAbout("storyConclTitle")}
        copy={localizedField(conclusion, "copy", locale) || tAbout("storyConclCopy")}
        kicker={localizedField(conclusion, "eyebrow", locale) || tAbout("storyConclKicker")}
        image={conclusion?.media?.image ?? imageLibrary.coffeePour}
        locale={locale}
      />
    </main>
  );
}
