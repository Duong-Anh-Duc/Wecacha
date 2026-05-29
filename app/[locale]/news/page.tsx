import type {Metadata} from "next";
import {setRequestLocale, getTranslations} from "next-intl/server";
import {CinematicPageHero} from "@/components/sections/cinematic-page-hero";
import {Reveal} from "@/components/motion/reveal";
import {imageLibrary} from "@/lib/content";
import type {Locale} from "@/i18n/routing";
import {Link} from "@/i18n/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Cache for 60s

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const isVi = locale === "vi";
  const title = isVi ? "Tin Tức Cà Phê Sơn La · Wecacha" : "Son La Coffee News · Wecacha";
  const description = isVi
    ? "Cập nhật những câu chuyện mới nhất về cà phê, sự kiện và công thức pha chế đặc biệt từ vùng núi Sơn La Tây Bắc."
    : "Latest stories about coffee, events and special brewing recipes from the mountains of Son La, northwest Vietnam.";

  return {
    title,
    description,
    keywords: isVi
      ? "tin tức cà phê, sự kiện cà phê Sơn La, công thức pha cà phê, văn hóa cà phê Việt Nam"
      : "coffee news, Son La coffee events, coffee brewing recipes, Vietnamese coffee culture",
    alternates: {
      canonical: `/${locale}/news`,
      languages: {
        vi: "/vi/news",
        en: "/en/news",
        "x-default": "/vi/news"
      }
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/news`,
      siteName: "Sơn La Coffee",
      locale: isVi ? "vi_VN" : "en_US",
      type: "website",
      images: [
        {
          url: `/og/image.png?locale=${locale}`,
          width: 1200,
          height: 630,
          alt: isVi ? "Tin tức Wecacha" : "Wecacha News"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function NewsIndexPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "News"});
  const tCommon = await getTranslations({locale, namespace: "Common"});
  const isVi = locale === "vi";

  // Lấy dữ liệu bài viết từ Supabase
  const { data: articles } = await supabase
    .from("news_articles")
    .select("slug, title_vi, title_en, image_url")
    .eq("is_visible", true)
    .in("placement", ["news", "both"])
    .order("sort_order", { ascending: true })
    .order("published_at", { ascending: false });

  const displayArticles = articles || [];

  return (
    <main className="bg-parchment-50">
      <CinematicPageHero
        kicker={t("kicker")}
        title={t("title")}
        copy={t("copy")}
        image={imageLibrary.cup}
        imageAlt="News"
        scrollLabel={t("scrollLabel")}
      />

      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {displayArticles.map((article, i) => {
              const title = isVi ? article.title_vi : article.title_en;
              const imgUrl = article.image_url || imageLibrary.coffeePour;
              
              return (
                <Reveal key={article.slug} delay={i * 0.1}>
                  <Link href={`/news/${article.slug}`} className="group block overflow-hidden rounded-2xl bg-white shadow-warm">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image 
                        src={imgUrl} 
                        alt={title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    </div>
                    <div className="p-8 text-center">
                      <h3 className="font-serif text-2xl text-forest-950 transition-colors group-hover:text-ember">{title}</h3>
                      <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-forest-950/50 group-hover:text-ember/70 transition-colors">
                        {tCommon("readMore")} →
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          
          {displayArticles.length === 0 && (
            <div className="text-center text-forest-950/50 py-12">
              {t("empty")}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
