import Image from "next/image";
import Link from "next/link";
import {ArrowUpRight, Calendar} from "lucide-react";
import {Reveal} from "@/components/motion/reveal";
import {imageLibrary} from "@/lib/content";
import type {Locale} from "@/i18n/routing";

export type NewsArticle = {
  slug: string;
  title_vi: string;
  title_en: string;
  intro_vi: string | null;
  intro_en: string | null;
  image_url: string | null;
  published_at: string | null;
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export function ArticleMagazine({
  locale,
  articles = []
}: {
  locale: Locale;
  articles?: NewsArticle[];
}) {
  const isVi = locale === "vi";
  const newsLabel = isVi ? "Tin tức" : "News";
  const pick = (a: NewsArticle) => ({
    title: (isVi ? a.title_vi : a.title_en) || a.title_vi,
    img: a.image_url || imageLibrary.coffeePour,
    href: `/${locale}/news/${a.slug}`,
    date: formatDate(a.published_at)
  });

  if (articles.length === 0) return null;

  const featured = articles.slice(0, 2);
  const notable = articles.slice(0, 4);

  return (
    <section className="relative z-20 mt-10">
      <Reveal delay={0.2}>
        <div className="overflow-hidden rounded-[2rem] border border-[#142918]/5 bg-[#fcfbfa] px-4 py-8 shadow-[0_20px_70px_rgba(20,41,24,0.1)] sm:px-8 lg:px-10">
          {/* Header */}
          <div className="mb-7 flex items-end justify-between gap-4 border-b border-[#142918]/10 pb-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b5703a]">
                {newsLabel}
              </p>
              <h2 className="font-serif text-2xl text-[#1c2a1c] sm:text-3xl">
                {isVi ? "Tin tức & Bài viết" : "News & Articles"}
              </h2>
            </div>
            <Link
              href={`/${locale}/news`}
              className="group inline-flex shrink-0 items-center gap-1.5 text-[13px] font-bold text-[#1c2a1c] transition-colors hover:text-[#b5703a]"
            >
              {isVi ? "Xem tất cả" : "View all"}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
            {/* Featured cards — 2 large */}
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
              {featured.map((article) => {
                const a = pick(article);
                return (
                  <Link
                    key={article.slug}
                    href={a.href}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#142918]/8 bg-white shadow-[0_10px_40px_rgba(20,41,24,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(20,41,24,0.12)]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={a.img}
                        alt={a.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col gap-3 p-5">
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1c2a1c]/55">
                        <Calendar className="h-3.5 w-3.5 text-[#4a751d]" />
                        {a.date && <span>{a.date}</span>}
                        <span className="text-[#142918]/20">|</span>
                        <span className="text-[#4a751d]">{newsLabel}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold uppercase leading-snug tracking-tight text-[#1c2a1c] line-clamp-2 transition-colors group-hover:text-[#b5703a]">
                        {a.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Notable news sidebar */}
            <div className="lg:border-l lg:border-[#142918]/10 lg:pl-8">
              <h3 className="mb-5 font-serif text-xl font-bold text-[#4a751d]">
                {isVi ? "Tin tức đáng chú ý" : "Notable news"}
              </h3>
              <div className="flex flex-col divide-y divide-[#142918]/10">
                {notable.map((article) => {
                  const a = pick(article);
                  return (
                    <Link key={article.slug} href={a.href} className="group flex gap-3 py-4 first:pt-0">
                      <div className="relative h-[4.5rem] w-[6.5rem] shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={a.img}
                          alt={a.title}
                          fill
                          sizes="104px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#1c2a1c]/50">
                          <Calendar className="h-3 w-3 text-[#4a751d]" />
                          {a.date && <span>{a.date}</span>}
                          <span className="text-[#142918]/20">|</span>
                          <span className="text-[#4a751d]">{newsLabel}</span>
                        </div>
                        <h4 className="text-sm font-bold uppercase leading-snug tracking-tight text-[#1c2a1c] line-clamp-2 transition-colors group-hover:text-[#b5703a]">
                          {a.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
