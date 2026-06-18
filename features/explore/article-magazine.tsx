"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {ArrowUpRight, ChevronLeft, ChevronRight} from "lucide-react";
import {AnimatePresence, motion} from "framer-motion";
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

const PER_PAGE = 4;

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
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (next: number) => {
    setDirection(next > page ? 1 : -1);
    setPage(next);
  };

  const pick = (a: NewsArticle) => ({
    title: (isVi ? a.title_vi : a.title_en) || a.title_vi,
    intro: (isVi ? a.intro_vi : a.intro_en) || a.intro_vi || "",
    img: a.image_url || imageLibrary.coffeePour,
    href: `/${locale}/news/${a.slug}`,
    date: formatDate(a.published_at)
  });

  if (articles.length === 0) return null;

  const totalPages = Math.max(1, Math.ceil(articles.length / PER_PAGE));
  const current = Math.min(page, totalPages - 1);
  const visible = articles.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  return (
    <section className="relative z-20 mt-10">
      <Reveal delay={0.2}>
        <div className="overflow-hidden rounded-[2rem] border border-[#142918]/5 bg-[#fcfbfa] px-4 py-8 shadow-[0_20px_70px_rgba(20,41,24,0.1)] sm:px-8 lg:px-10">
          {/* Header */}
          <div className="mb-7 border-b border-[#142918]/10 pb-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#b5703a]">
              {newsLabel}
            </p>
            <h2 className="font-serif text-2xl text-[#1c2a1c] sm:text-3xl">
              {isVi ? "Tin tức & Bài viết" : "News & Articles"}
            </h2>
          </div>

          {/* 4 cards per page */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{opacity: 0, x: direction >= 0 ? "100%" : "-100%"}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: direction >= 0 ? "-100%" : "100%"}}
                transition={{
                  x: {duration: 0.6, ease: [0.16, 1, 0.3, 1]},
                  opacity: {duration: 0.35, ease: "easeOut"}
                }}
                className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4"
              >
                {visible.map((article) => {
                  const a = pick(article);
                  return (
                    <Link
                      key={article.slug}
                      href={a.href}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#142918]/8 bg-white shadow-[0_8px_30px_rgba(20,41,24,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#142918]/12 hover:shadow-[0_20px_55px_rgba(20,41,24,0.12)]"
                    >
                      <div className="relative aspect-[16/11] w-full overflow-hidden">
                        <Image
                          src={a.img}
                          alt={a.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-[#142918]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f4f0e6] backdrop-blur-sm">
                          {newsLabel}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        {a.date && (
                          <time className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4a751d]">
                            {a.date}
                          </time>
                        )}
                        <h3 className="mb-2 font-serif text-[1.15rem] leading-[1.28] text-[#1c2a1c] transition-colors group-hover:text-[#b5703a] line-clamp-2">
                          {a.title}
                        </h3>
                        {a.intro && (
                          <p className="mb-4 line-clamp-2 text-[12.5px] leading-[1.6] text-[#142918]/55">
                            {a.intro}
                          </p>
                        )}
                        <span className="mt-auto inline-flex items-center gap-1.5 text-[12px] font-bold text-[#142918]/70 transition-colors group-hover:text-[#b5703a]">
                          {isVi ? "Đọc tiếp" : "Read more"}
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-9 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => goTo(Math.max(0, current - 1))}
                disabled={current === 0}
                aria-label={isVi ? "Trang trước" : "Previous page"}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#142918]/12 text-[#1c2a1c] transition-colors hover:border-[#4a751d] hover:bg-[#4a751d]/5 hover:text-[#4a751d] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#142918]/12 disabled:hover:bg-transparent disabled:hover:text-[#1c2a1c]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({length: totalPages}).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${isVi ? "Trang" : "Page"} ${i + 1}`}
                  aria-current={i === current ? "page" : undefined}
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[13px] font-bold transition-colors ${
                    i === current
                      ? "bg-[#142918] text-[#f4f0e6] shadow-[0_6px_18px_rgba(20,41,24,0.25)]"
                      : "border border-[#142918]/12 text-[#1c2a1c] hover:border-[#4a751d] hover:bg-[#4a751d]/5 hover:text-[#4a751d]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goTo(Math.min(totalPages - 1, current + 1))}
                disabled={current === totalPages - 1}
                aria-label={isVi ? "Trang sau" : "Next page"}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#142918]/12 text-[#1c2a1c] transition-colors hover:border-[#4a751d] hover:bg-[#4a751d]/5 hover:text-[#4a751d] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#142918]/12 disabled:hover:bg-transparent disabled:hover:text-[#1c2a1c]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
