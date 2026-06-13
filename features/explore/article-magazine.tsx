import Image from "next/image";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
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
  const pick = (a: NewsArticle) => ({
    title: (isVi ? a.title_vi : a.title_en) || a.title_vi,
    intro: (isVi ? a.intro_vi : a.intro_en) || a.intro_vi || "",
    img: a.image_url || imageLibrary.coffeePour,
    href: `/${locale}/news/${a.slug}`,
    date: formatDate(a.published_at)
  });

  if (articles.length === 0) return null;

  const featured = articles[0];
  // Distribute the remaining articles evenly between the two side columns,
  // overflow goes into the dense 5-per-row grid below.
  const side = articles.slice(1, 9);
  const leftList = side.filter((_, i) => i % 2 === 0);
  const rightList = side.filter((_, i) => i % 2 === 1);
  const moreGrid = articles.slice(9);

  const f = pick(featured);

  const SideItem = ({article}: {article: NewsArticle}) => {
    const a = pick(article);
    return (
      <Link href={a.href} className="group flex gap-3 py-3 first:pt-0">
        <div className="relative h-16 w-[5.5rem] shrink-0 overflow-hidden rounded-lg">
          <Image
            src={a.img}
            alt={a.title}
            fill
            sizes="88px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-snug text-[#1c2a1c] line-clamp-3 transition-colors group-hover:text-[#b5703a]">
            {a.title}
          </h3>
          {a.date && <p className="mt-1 text-[11px] font-medium text-[#1c2a1c]/45">{a.date}</p>}
        </div>
      </Link>
    );
  };

  return (
    <section className="relative z-20 mt-10">
      <Reveal delay={0.2}>
        <div className="overflow-hidden rounded-[2rem] border border-[#142918]/5 bg-[#fcfbfa] px-4 py-8 shadow-[0_20px_70px_rgba(20,41,24,0.1)] sm:px-8 lg:px-10">
          {/* Header */}
          <div className="mb-7 flex items-end justify-between gap-4 border-b border-[#142918]/10 pb-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b5703a]">
                {isVi ? "Tin tức" : "News"}
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

          {/* VietnamNet-style magazine grid */}
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left list */}
            <div className="order-2 flex flex-col divide-y divide-[#142918]/10 lg:order-1 lg:col-span-3 lg:border-r lg:border-[#142918]/10 lg:pr-6">
              {leftList.map((article) => (
                <SideItem key={article.slug} article={article} />
              ))}
            </div>

            {/* Featured center */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <Link href={f.href} className="group block">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                  <Image
                    src={f.img}
                    alt={f.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
                <h3 className="mt-4 font-serif text-2xl leading-tight text-[#1c2a1c] transition-colors group-hover:text-[#b5703a] sm:text-[1.75rem]">
                  {f.title}
                </h3>
                {f.intro && (
                  <p className="mt-2 text-sm leading-relaxed text-[#1c2a1c]/70 line-clamp-3">{f.intro}</p>
                )}
                {f.date && <p className="mt-3 text-[11px] font-medium text-[#1c2a1c]/45">{f.date}</p>}
              </Link>
            </div>

            {/* Right sidebar */}
            <div className="order-3 flex flex-col divide-y divide-[#142918]/10 lg:col-span-3 lg:border-l lg:border-[#142918]/10 lg:pl-6">
              {rightList.map((article) => (
                <SideItem key={article.slug} article={article} />
              ))}
            </div>
          </div>

          {/* Dense grid — at least 5 per row on desktop */}
          {moreGrid.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-[#142918]/10 pt-7 sm:grid-cols-3 lg:grid-cols-5">
              {moreGrid.map((article) => {
                const a = pick(article);
                return (
                  <Link key={article.slug} href={a.href} className="group">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                      <Image
                        src={a.img}
                        alt={a.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-[#1c2a1c] line-clamp-2 transition-colors group-hover:text-[#b5703a]">
                      {a.title}
                    </h3>
                    {a.date && <p className="mt-1 text-[11px] font-medium text-[#1c2a1c]/45">{a.date}</p>}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
