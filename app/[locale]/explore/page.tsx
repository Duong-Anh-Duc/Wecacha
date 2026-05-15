import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";
import Image from "next/image";
import {ArrowRight, Calendar, Coffee, Play, Leaf} from "lucide-react";
import {Reveal} from "@/components/motion/reveal";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Explore"});

  const tNav = await getTranslations({locale, namespace: "Nav"});

  return {
    title: t("title"),
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/explore`,
      languages: {
        vi: "/vi/explore",
        en: "/en/explore",
        "x-default": "/vi/explore"
      }
    },
    openGraph: {
      title: t("title"),
      description: t("intro"),
      images: [{url: `/og/image.png?locale=${locale}&title=${encodeURIComponent(t("title"))}&kicker=${encodeURIComponent(tNav("explore"))}`, width: 1200, height: 630}]
    }
  };
}

export default async function ExplorePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Explore"});
  const tNav = await getTranslations({locale, namespace: "Nav"});

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

  const bottomArticles = [
    {
      href: "/news/coffee-culture",
      title: t("coffeeCultureTitle"),
      desc: t("coffeeCultureDesc"),
      icon: Coffee
    },
    {
      href: "/news/events",
      title: t("eventsTitle"),
      desc: t("eventsDesc"),
      icon: Calendar
    },
    {
      href: "/news/recipes",
      title: t("recipesTitle"),
      desc: t("recipesDesc"),
      icon: Coffee
    }
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f0e6] pb-8 pt-28 text-[#142918]">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 4%, rgba(255,250,239,0.96), rgba(244,240,230,0.55) 34%, transparent 58%), radial-gradient(circle at 10% 12%, rgba(73,94,52,0.12), transparent 28%), radial-gradient(circle at 92% 18%, rgba(181,112,58,0.1), transparent 30%), linear-gradient(180deg, #f8f4eb 0%, #f1eadc 58%, #e9dfcf 100%)"
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(20,41,24,0.15) 1px, transparent 0)",
          backgroundSize: "34px 34px"
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[43%] overflow-hidden bg-[#0f381f]">
        <div className="absolute -top-[155px] -left-[12vw] h-[285px] w-[62vw] rounded-[52%] bg-[#0f381f]" />
        <div className="absolute -top-[118px] right-[-7vw] h-[250px] w-[45vw] rounded-[52%] bg-[#0f381f]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_0%,rgba(68,104,54,0.5),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(7,24,12,0.62),transparent_42%),linear-gradient(180deg,rgba(17,67,36,0.96),rgba(6,35,17,0.98))]" />
        <div className="absolute left-[46%] top-0 h-full w-px bg-white/5" />
        <div className="absolute left-[-5.5%] bottom-[-2%] h-[640px] w-[640px] opacity-100 [mask-image:radial-gradient(circle_at_bottom_left,black_58%,transparent_84%)]">
          <Image src="/explore_leaves.png" alt="" fill className="object-cover contrast-110 saturate-125" />
        </div>
        <div className="absolute right-[-7%] bottom-[-8%] h-[620px] w-[620px] opacity-95 [mask-image:radial-gradient(circle_at_bottom_right,black_44%,transparent_76%)]">
          <Image src="/explore_grinder.png" alt="" fill className="object-cover object-bottom" />
        </div>
      </div>

      <div className="pointer-events-none absolute -left-16 top-16 z-0 hidden h-[560px] w-[370px] opacity-[0.38] lg:block">
        <LeafSketch />
      </div>
      <div className="pointer-events-none absolute right-[-70px] top-8 z-0 hidden h-[660px] w-[420px] rotate-[-8deg] opacity-[0.4] lg:block">
        <LeafSketch />
      </div>
      <div className="pointer-events-none absolute left-[62%] top-10 z-0 hidden h-32 w-32 rotate-12 opacity-[0.28] lg:block">
        <LeafSprig />
      </div>
      <div className="pointer-events-none absolute left-[-34px] top-[270px] z-0 hidden h-52 w-28 opacity-80 lg:block">
        <span className="absolute left-8 top-9 h-8 w-5 rotate-[-24deg] rounded-[50%] bg-[#4f3322] shadow-[0_22px_32px_rgba(20,41,24,0.18)]" />
        <span className="absolute left-14 top-24 h-10 w-6 rotate-[-12deg] rounded-[50%] bg-[#7b4a2f] shadow-[0_22px_32px_rgba(20,41,24,0.18)]" />
        <span className="absolute left-1 top-0 h-28 w-28 rounded-full bg-[#d8dcc8]/45 blur-sm" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="pl-2 lg:pl-0">
          <Breadcrumbs
            homeLabel={tNav("home")}
            items={[{ label: tNav("explore") }]}
          />
        </div>

        {/* Top Section */}
        <div className="grid items-stretch gap-6 lg:grid-cols-12">
          
          {/* Featured Hero (Left) */}
          <div className="lg:col-span-8">
            <Reveal>
              <div className="group relative h-[560px] w-full overflow-hidden rounded-[2rem] shadow-[0_26px_80px_rgba(20,41,24,0.18)] lg:h-[610px]">
                <Image
                  src={imageLibrary.mountains}
                  alt="Giới thiệu"
                  fill
                  priority
                  className="scale-[1.03] object-cover contrast-105 saturate-110 transition-transform duration-[2s] ease-out group-hover:scale-[1.07]"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a0f]/78 via-[#0d1a0f]/36 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a0f]/46 via-transparent to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-12 md:p-16">
                  <div className="mb-7">
                    <span className="inline-block bg-[#b5703a] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                      {t("storyLabel")}
                    </span>
                  </div>
                  <h2 className="mb-5 max-w-[12em] font-serif text-[2.55rem] leading-[1.02] tracking-tight text-white drop-shadow-md sm:text-6xl lg:text-[5.15rem]">
                    {t("heroAbout")} <br />
                    {t("heroTitle1")} <br />
                    {t("heroTitle2")}
                  </h2>
                  <p className="mb-10 max-w-[31rem] text-[15px] font-medium leading-[1.75] text-[#f4f2ea] sm:text-[17px]">
                    {t("heroCopy1")} <br />
                    {t("heroCopy2")}
                  </p>

                  <Link href="/about" className="flex items-center gap-3 group/btn w-fit mt-auto">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#142918] shadow-md transition-transform group-hover/btn:scale-105">
                      <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                    </div>
                    <span className="text-[13px] font-bold text-white transition-colors group-hover/btn:text-[#f4f2ea]">
                      {t("watchJourney")}
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

          {/* Right List */}
          <div className="flex h-full flex-col justify-between gap-5 lg:col-span-4">
            {listArticles.map((article, i) => (
              <Reveal key={i} delay={0.2 + i * 0.15}>
                <Link href={article.href} className="group flex h-auto flex-col items-start gap-4 rounded-[1.5rem] border border-[#142918]/5 bg-[#fdfcfb] p-2 shadow-[0_16px_50px_rgba(20,41,24,0.07)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(20,41,24,0.12)] sm:min-h-[172px] sm:flex-row sm:items-stretch sm:gap-5 sm:p-2.5 lg:min-h-[180px]">
                  <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-[1rem] sm:h-auto sm:w-[170px] lg:w-[130px] xl:w-[160px]">
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
        </div>

        <div className="relative z-20 mt-10">
          <Reveal delay={0.6}>
            <div className="relative overflow-visible rounded-[2rem] border border-[#142918]/5 bg-[#fcfbfa] px-4 py-10 shadow-[0_20px_70px_rgba(20,41,24,0.1)] sm:px-8 lg:px-12 xl:py-12">
              
              {/* Decorative Overlapping Image - Left */}
              <div className="pointer-events-none absolute -left-[7rem] top-1/2 z-20 hidden h-[300px] w-[300px] -translate-y-1/2 mix-blend-multiply [mask-image:radial-gradient(circle_at_center,black_52%,transparent_76%)] lg:block">
                <Image src="/explore_latte.png" alt="Latte" fill className="object-contain" />
              </div>

              {/* Decorative Overlapping Image - Right */}
              <div className="pointer-events-none absolute -right-[5.8rem] bottom-[-3.4rem] z-20 hidden h-[390px] w-[390px] mix-blend-multiply [mask-image:radial-gradient(circle_at_center,black_54%,transparent_78%)] lg:block">
                <Image src="/explore_v60.png" alt="V60 Dripper" fill className="object-contain object-bottom" />
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

      </div>
    </main>
  );
}

function LeafSketch() {
  return (
    <svg viewBox="0 0 220 420" fill="none" className="h-full w-full">
      <path
        d="M112 404C95 319 100 244 126 176C143 132 171 88 202 34"
        stroke="#1f3a24"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {[
        ["118", "308", "-34", "78", "32"],
        ["96", "256", "28", "84", "34"],
        ["132", "214", "-30", "74", "30"],
        ["112", "168", "34", "88", "34"],
        ["152", "122", "-27", "78", "30"],
        ["169", "80", "32", "66", "25"]
      ].map(([cx, cy, rotate, rx, ry]) => (
        <g key={`${cx}-${cy}`} transform={`rotate(${rotate} ${cx} ${cy})`}>
          <path
            d={`M${Number(cx) - Number(rx) / 2} ${cy}C${Number(cx) - Number(rx) / 5} ${Number(cy) - Number(ry)} ${Number(cx) + Number(rx) / 5} ${Number(cy) - Number(ry)} ${Number(cx) + Number(rx) / 2} ${cy}C${Number(cx) + Number(rx) / 6} ${Number(cy) + Number(ry)} ${Number(cx) - Number(rx) / 5} ${Number(cy) + Number(ry)} ${Number(cx) - Number(rx) / 2} ${cy}Z`}
            stroke="#1f3a24"
            strokeWidth="1"
          />
          <path
            d={`M${Number(cx) - Number(rx) / 2 + 8} ${cy}C${Number(cx) - 8} ${Number(cy) - 4} ${Number(cx) + 8} ${Number(cy) - 4} ${Number(cx) + Number(rx) / 2 - 8} ${cy}`}
            stroke="#1f3a24"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}

function LeafSprig() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-full w-full">
      <path
        d="M18 96C42 72 63 48 92 18"
        stroke="#1f3a24"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M37 76C22 69 19 54 42 47C51 60 50 72 37 76Z" stroke="#1f3a24" />
      <path d="M57 56C42 47 43 31 67 28C74 42 70 53 57 56Z" stroke="#1f3a24" />
      <path d="M76 37C63 28 67 15 91 14C96 27 90 36 76 37Z" stroke="#1f3a24" />
    </svg>
  );
}
