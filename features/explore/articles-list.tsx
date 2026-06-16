import Image from "next/image";
import Link from "next/link";
import {ArrowRight} from "lucide-react";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";
import {localizedField, type SiteSectionItem} from "@/lib/content/cms";

const localeHref = (locale: Locale, href?: string | null) => {
  const path = href ?? "/explore";
  return path.startsWith("http") ? path : `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
};

export async function ArticlesList({
  locale,
  items = []
}: {
  locale: Locale;
  items?: SiteSectionItem[];
}) {
  return (
    <div className="flex h-full flex-col justify-between gap-5 lg:col-span-4">
      {items.map((article, i) => (
        <Reveal key={article.item_key} delay={0.2 + i * 0.15}>
          <Link href={localeHref(locale, article.href)} className="group flex h-auto flex-col items-start gap-4 rounded-[1.5rem] border border-[#142918]/5 bg-[#fdfcfb] p-2 shadow-[0_16px_50px_rgba(20,41,24,0.07)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(20,41,24,0.12)] sm:min-h-[172px] sm:flex-row sm:items-stretch sm:gap-5 sm:p-2.5 lg:min-h-[180px]">
            <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-[1rem] sm:h-auto sm:w-[150px] md:w-[160px] lg:w-[170px] xl:w-[200px]">
              <Image
                src={article.media?.image ?? "/sonla_harvest.png"}
                alt={localizedField(article, "title", locale)}
                fill
                className="object-cover transition duration-[1.5s] group-hover:scale-105"
                sizes="(min-width: 1280px) 160px, (min-width: 1024px) 130px, (min-width: 640px) 170px, 100vw"
              />
            </div>
            <div className="min-w-0 flex-1 py-3 pr-2 sm:pr-0 sm:py-4 lg:py-3 xl:py-4 self-center">
              <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b5703a]">{localizedField(article, "label", locale)}</p>
              <h3 className="mb-2 font-serif text-[1.4rem] leading-[1.15] text-[#142918] transition-colors group-hover:text-[#b5703a] sm:text-[1.5rem] lg:text-[1.3rem] xl:text-[1.45rem]">{localizedField(article, "title", locale)}</h3>
              <p className="line-clamp-3 text-[12px] leading-[1.6] text-[#142918]/65 sm:text-[13px]">{localizedField(article, "body", locale)}</p>
            </div>
            <div className="hidden sm:flex h-9 w-9 shrink-0 mr-3 self-center rounded-full bg-[#142918] items-center justify-center text-white transition-all duration-300 group-hover:bg-[#b5703a] group-hover:scale-110 shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
