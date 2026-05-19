import Image from "next/image";
import {ArrowRight} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";

export async function ArticlesList({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "Explore"});

  const listArticles = [
    {
      href: "/explore/farm",
      title: t("farmTitle"),
      desc: t("farmDesc"),
      image: imageLibrary.beansBowl,
      date: t("exploreLabel")
    },
    {
      href: "/explore/processing",
      title: t("processingTitle"),
      desc: t("processingDesc"),
      image: imageLibrary.roasted,
      date: t("exploreLabel")
    },
    {
      href: "/explore/culture",
      title: t("cultureArticleTitle"),
      desc: t("cultureArticleDesc"),
      image: imageLibrary.village,
      date: t("exploreLabel")
    }
  ];

  return (
    <div className="flex h-full flex-col justify-between gap-5 lg:col-span-4">
      {listArticles.map((article, i) => (
        <Reveal key={i} delay={0.2 + i * 0.15}>
          <Link href={article.href} className="group flex h-auto flex-col items-start gap-4 rounded-[1.5rem] border border-[#142918]/5 bg-[#fdfcfb] p-2 shadow-[0_16px_50px_rgba(20,41,24,0.07)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(20,41,24,0.12)] sm:min-h-[172px] sm:flex-row sm:items-stretch sm:gap-5 sm:p-2.5 lg:min-h-[180px]">
            <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-[1rem] sm:h-auto sm:w-[150px] md:w-[160px] lg:w-[170px] xl:w-[200px]">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition duration-[1.5s] group-hover:scale-105"
                sizes="(min-width: 1280px) 160px, (min-width: 1024px) 130px, (min-width: 640px) 170px, 100vw"
              />
            </div>
            <div className="min-w-0 flex-1 py-3 pr-2 sm:pr-0 sm:py-4 lg:py-3 xl:py-4 self-center">
              <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#b5703a]">{article.date}</p>
              <h3 className="mb-2 font-serif text-[1.4rem] leading-[1.15] text-[#142918] transition-colors group-hover:text-[#b5703a] sm:text-[1.5rem] lg:text-[1.3rem] xl:text-[1.45rem]">{article.title}</h3>
              <p className="line-clamp-3 text-[12px] leading-[1.6] text-[#142918]/65 sm:text-[13px]">{article.desc}</p>
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
