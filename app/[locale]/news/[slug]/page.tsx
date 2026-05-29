import type {Metadata} from "next";
import {setRequestLocale, getTranslations} from "next-intl/server";
import {CinematicPageHero} from "@/components/sections/cinematic-page-hero";
import {Reveal} from "@/components/motion/reveal";
import {JsonLd} from "@/components/seo/json-ld";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";
import {newsArticleJsonLd} from "@/lib/seo";
import {siteUrl} from "@/lib/site";
import Image from "next/image";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const revalidate = 60;

function parseArticleDate(dateStr: string): string {
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) return parsed.toISOString().split("T")[0];
  } catch (e) {}
  return new Date().toISOString().split("T")[0];
}

type Props = {
  params: Promise<{locale: Locale; slug: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const isVi = locale === "vi";

  const { data } = await supabase
    .from("news_articles")
    .select("title_vi, title_en, intro_vi, intro_en, image_url")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!data) return { title: "Not Found" };

  const title = isVi ? data.title_vi : data.title_en;
  const desc = isVi ? data.intro_vi : data.intro_en;
  const section = isVi ? "Tin Tức" : "News";
  const fullTitle = `${title} · ${section} · Wecacha`;

  return {
    title: fullTitle,
    description: desc,
    openGraph: {
      title: fullTitle,
      description: desc,
      images: [{ url: data.image_url || imageLibrary.coffeePour }]
    }
  };
}

export default async function NewsCategoryPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const isVi = locale === "vi";
  const tNav = await getTranslations({locale, namespace: "Nav"});
  const tCommon = await getTranslations({locale, namespace: "Common"});

  const { data } = await supabase
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!data) return notFound();

  const title = isVi ? data.title_vi : data.title_en;
  const intro = isVi ? data.intro_vi : data.intro_en;
  const content = isVi ? data.content_vi : data.content_en;
  
  const paragraphs = content.split('\n').filter((p: string) => p.trim() !== '');

  const articleUrl = `${siteUrl}/${locale}/news/${slug}`;
  const articleJsonLd = newsArticleJsonLd({
    title: title,
    description: intro,
    datePublished: parseArticleDate(data.published_at),
    image: data.secondary_image_url || data.image_url || imageLibrary.coffeePour,
    url: articleUrl,
    locale
  });

  const formattedDate = new Date(data.published_at).toLocaleDateString(
    isVi ? "vi-VN" : "en-US", 
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <main className="bg-parchment-50">
      <JsonLd data={articleJsonLd} />
      <CinematicPageHero
        kicker={tNav("news")}
        title={title}
        copy={intro}
        image={data.image_url || imageLibrary.coffeePour}
        imageAlt={title}
        scrollLabel={tCommon("scrollDown")}
        breadcrumbs={
          <Breadcrumbs
            homeLabel={tNav("home")}
            theme="dark"
            items={[
              { label: tNav("news") },
              { label: title }
            ]} 
          />
        }
      />
      
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <article className="prose prose-lg prose-stone mx-auto">
              <header className="mb-12 text-center">
                <h1 className="mb-4 font-serif text-4xl text-forest-950 sm:text-5xl leading-tight">
                  {title}
                </h1>
                <p className="text-sm font-bold uppercase tracking-widest text-ember">
                  {formattedDate}
                </p>
              </header>

              {data.secondary_image_url && (
                <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-warm">
                  <Image
                    src={data.secondary_image_url}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-6 text-forest-950/80">
                {paragraphs.map((para: string, idx: number) => (
                  <p key={idx} className="whitespace-pre-line leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
