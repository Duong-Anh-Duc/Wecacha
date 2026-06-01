import type {Metadata} from "next";
import Image from "next/image";
import {notFound} from "next/navigation";
import {setRequestLocale, getTranslations} from "next-intl/server";
import {CinematicPageHero} from "@/components/sections/cinematic-page-hero";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {
  getExplorePageKeys,
  getPageContent,
  itemsForSection,
  localizedField,
  sectionByKey
} from "@/lib/content/cms";

type Props = {
  params: Promise<{locale: Locale; slug: string}>;
};

export async function generateStaticParams() {
  const pages = await getExplorePageKeys();
  return pages.map((page) => ({slug: page.slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const content = await getPageContent(`explore-${slug}`);
  const hero = sectionByKey(content, "hero");

  if (!content.page || !hero) {
    return {};
  }

  const title = localizedField(hero, "title", locale);
  const description = localizedField(hero, "copy", locale);
  const section = locale === "vi" ? "Khám phá" : "Explore";

  return {
    title: `${title} · ${section} · Wecacha`,
    description,
    openGraph: {
      title: `${title} · ${section} · Wecacha`,
      description,
      images: [{url: hero.media?.image}]
    }
  };
}

export default async function ExploreCategoryPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations({locale, namespace: "Nav"});
  const tCommon = await getTranslations({locale, namespace: "Common"});
  const content = await getPageContent(`explore-${slug}`);
  const hero = sectionByKey(content, "hero");
  const body = sectionByKey(content, "body");
  const blocks = itemsForSection(content, "body");

  if (!content.page || !hero) {
    notFound();
  }

  const title = localizedField(hero, "title", locale);

  return (
    <main className="bg-parchment-50">
      <CinematicPageHero
        kicker={localizedField(hero, "eyebrow", locale) || tNav("explore")}
        title={title}
        copy={localizedField(hero, "copy", locale)}
        image={hero.media?.image}
        imageAlt={title}
        scrollLabel={tCommon("scrollDown")}
        breadcrumbs={
          <Breadcrumbs
            homeLabel={tNav("home")}
            theme="dark"
            items={[
              {label: tNav("explore"), href: "/explore"},
              {label: title}
            ]}
          />
        }
      />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Reveal>
                <div className="space-y-12">
                  {blocks.map((block) => (
                    <div key={block.item_key}>
                      <h2 className="mb-4 font-serif text-3xl text-forest-950 sm:text-4xl">
                        {localizedField(block, "title", locale)}
                      </h2>
                      <p className="text-lg leading-relaxed text-forest-950/70">
                        {localizedField(block, "body", locale)}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-cinematic">
                <Image
                  src={body?.media?.image ?? hero.media?.secondaryImage ?? hero.media?.image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
