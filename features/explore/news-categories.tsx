import Image from "next/image";
import {ArrowRight, Calendar, Coffee} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";

export async function NewsCategories({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "Explore"});
  const tNav = await getTranslations({locale, namespace: "Nav"});

  const bottomArticles = [
    {href: "/news/coffee-culture", title: t("coffeeCultureTitle"), desc: t("coffeeCultureDesc"), icon: Coffee},
    {href: "/news/events", title: t("eventsTitle"), desc: t("eventsDesc"), icon: Calendar},
    {href: "/news/recipes", title: t("recipesTitle"), desc: t("recipesDesc"), icon: Coffee}
  ];

  return (
    <div className="relative z-20 mt-10">
      <Reveal delay={0.6}>
        <div className="relative overflow-visible rounded-[2rem] border border-[#142918]/5 bg-[#fcfbfa] px-4 py-10 shadow-[0_20px_70px_rgba(20,41,24,0.1)] sm:px-8 lg:px-12 xl:py-12">

          {/* Decorative Overlapping Image - Left */}
          <div className="pointer-events-none absolute -left-[7rem] top-1/2 z-20 hidden h-[300px] w-[300px] -translate-y-1/2 mix-blend-multiply [mask-image:radial-gradient(circle_at_center,black_52%,transparent_76%)] lg:block">
            <Image src="/explore_latte.png" alt="Latte" fill sizes="300px" className="object-contain" />
          </div>

          {/* Decorative Overlapping Image - Right */}
          <div className="pointer-events-none absolute -right-[5.8rem] bottom-[-3.4rem] z-20 hidden h-[390px] w-[390px] mix-blend-multiply [mask-image:radial-gradient(circle_at_center,black_54%,transparent_78%)] lg:block">
            <Image src="/explore_v60.png" alt="V60 Dripper" fill sizes="390px" className="object-contain object-bottom" />
          </div>

          {/* Faint sketched leaf decoration inside the card */}
          <div className="absolute right-32 top-0 opacity-10 pointer-events-none">
            <svg width="150" height="150" viewBox="0 0 100 100">
              <path d="M 10 90 Q 50 50 90 10 Q 50 10 10 50 Z" fill="none" stroke="#1c2a1c" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3 md:gap-0">
            {bottomArticles.map((article, idx) => {
              const Icon = article.icon;
              return (
                <div key={idx} className={`flex flex-col py-2 relative group px-2 sm:px-6 lg:px-12 ${idx === 2 ? "lg:pr-[8rem]" : ""}`}>
                  {/* Faint Divider Line */}
                  {idx > 0 && (
                    <>
                      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#1c2a1c]/15 to-transparent" />
                      <div className="md:hidden absolute left-10 right-10 top-[-1.25rem] h-[1px] bg-gradient-to-r from-transparent via-[#1c2a1c]/15 to-transparent" />
                    </>
                  )}

                  <div className="h-10 w-10 rounded-full bg-[#203823] flex items-center justify-center text-white mb-5 shadow-md transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <p className="text-[10px] font-bold text-[#b5703a] uppercase tracking-[0.15em] mb-2">{tNav("news")}</p>
                  <h3 className="font-serif text-[1.4rem] text-[#1c2a1c] mb-3 transition-colors group-hover:text-[#b5703a]">{article.title}</h3>
                  <p className="text-[13px] text-[#1c2a1c]/70 mb-8 min-h-[50px] leading-relaxed line-clamp-3">{article.desc}</p>

                  <Link href={article.href} className="text-[13px] font-bold flex items-center gap-2 group/link text-[#1c2a1c] hover:text-[#b5703a] transition-colors w-fit mt-auto">
                    {t("readMore")}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
