import Image from "next/image";
import Link from "next/link";
import {ArrowRight} from "lucide-react";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";
import type {NewsArticle} from "./article-magazine";

export async function ArticlesList({
  locale,
  articles = []
}: {
  locale: Locale;
  articles?: NewsArticle[];
}) {
  const isVi = locale === "vi";
  return (
    <div className="flex h-full flex-col justify-between gap-5 lg:col-span-4">
      {articles.map((article, i) => {
        const title = (isVi ? article.title_vi : article.title_en) || article.title_vi;
        const intro = (isVi ? article.intro_vi : article.intro_en) || article.intro_vi || "";
        const image = article.image_url ?? "/sonla_harvest.png";
        const href = `/${locale}/news/${article.slug}`;
        return (
          <Reveal key={article.slug} delay={0.2 + i * 0.15}>
            <Link href={href} className="group flex h-auto flex-col items-start gap-4 rounded-[1.5rem] border border-[#142918]/5 bg-[#fdfcfb] p-2 shadow-[0_16px_50px_rgba(20,41,24,0.07)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(20,41,24,0.12)] sm:min-h-[172px] sm:flex-row sm:items-stretch sm:gap-5 sm:p-2.5 lg:min-h-[180px]">
              <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-[1rem] sm:h-auto sm:w-[150px] md:w-[160px] lg:w-[170px] xl:w-[200px]">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition duration-[1.5s] group-hover:scale-105"
                  sizes="(min-width: 1280px) 160px, (min-width: 1024px) 130px, (min-width: 640px) 170px, 100vw"
                />
              </div>
              <div className="min-w-0 flex-1 py-3 pr-2 sm:pr-0 sm:py-4 lg:py-3 xl:py-4 self-center">
                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b5703a]">{isVi ? "Khám phá" : "Explore"}</p>
                <h3 className="mb-2 font-serif text-[1.4rem] leading-[1.15] text-[#142918] transition-colors group-hover:text-[#b5703a] line-clamp-2 sm:text-[1.5rem] lg:text-[1.3rem] xl:text-[1.45rem]">{title}</h3>
                <p className="line-clamp-3 text-[12px] leading-[1.6] text-[#142918]/65 sm:text-[13px]">{intro}</p>
              </div>
              <div className="hidden sm:flex h-9 w-9 shrink-0 mr-3 self-center rounded-full bg-[#142918] items-center justify-center text-white transition-all duration-300 group-hover:bg-[#b5703a] group-hover:scale-110 shadow-sm">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
