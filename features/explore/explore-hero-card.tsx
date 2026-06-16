import Image from "next/image";
import Link from "next/link";
import {ArrowRight, Leaf} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";
import type {NewsArticle} from "./article-magazine";

export async function ExploreHeroCard({
  locale,
  article
}: {
  locale: Locale;
  article?: NewsArticle | null;
}) {
  const t = await getTranslations({locale, namespace: "Explore"});
  const isVi = locale === "vi";
  const title = article
    ? (isVi ? article.title_vi : article.title_en) || article.title_vi
    : [t("heroAbout"), t("heroTitle1"), t("heroTitle2")].join(" ");
  const copy = article ? (isVi ? article.intro_vi : article.intro_en) || article.intro_vi || "" : "";
  const image = article?.image_url ?? "/sonla_mist_season.png";
  const href = article ? `/${locale}/news/${article.slug}` : `/${locale}/about`;

  return (
    <div className="lg:col-span-8">
      <Reveal>
        <div className="group relative h-[300px] w-full overflow-hidden rounded-[2rem] shadow-[0_26px_80px_rgba(20,41,24,0.18)] sm:h-[440px] md:h-[540px] lg:h-[610px]">
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="scale-[1.03] object-cover contrast-105 saturate-110 transition-transform duration-[2s] ease-out group-hover:scale-[1.07]"
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a0f]/78 via-[#0d1a0f]/36 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0f]/46 via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-12 md:p-16">
            <div className="mb-7">
              <span className="inline-block bg-[#b5703a] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                {t("storyLabel")}
              </span>
            </div>
            <h2 className="mb-5 max-w-[12em] font-serif text-2xl leading-[1.05] tracking-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-[3.6rem] line-clamp-4">
              {title}
            </h2>
            {copy && (
              <p className="mb-6 max-w-[31rem] text-xs font-medium leading-[1.75] text-[#f4f2ea] line-clamp-3 sm:mb-10 sm:text-[15px] lg:text-[17px]">
                {copy}
              </p>
            )}

            <Link href={href} className="flex items-center gap-3 group/btn w-fit mt-auto">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#142918] shadow-md transition-transform group-hover/btn:scale-105">
                <ArrowRight className="h-4 w-4" />
              </div>
              <span className="text-[13px] font-bold text-white transition-colors group-hover/btn:text-[#f4f2ea]">
                {isVi ? "Đọc bài viết" : "Read article"}
              </span>
            </Link>
          </div>

          {/* Circular Stamp Decoration */}
          <div className="absolute bottom-12 right-12 hidden h-[180px] w-[180px] items-center justify-center opacity-80 md:flex">
            <div className="absolute inset-0 rounded-full border border-white/20 animate-[spin_30s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-white/20 border-dashed animate-[spin_25s_linear_infinite_reverse]" />
            <svg className="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100">
              <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text className="text-[8px] font-bold uppercase tracking-[0.3em]" fill="rgba(255,255,255,0.9)">
                <textPath href="#circlePath" startOffset="0%">
                  WECACHA COFFEE • WECACHA COFFEE •
                </textPath>
              </text>
            </svg>
            <Leaf className="w-10 h-10 text-white absolute" />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
