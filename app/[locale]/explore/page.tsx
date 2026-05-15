import type {Metadata} from "next";
import Image from "next/image";
import {getTranslations, setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {ExploreHeroCard} from "@/features/explore/explore-hero-card";
import {ArticlesList} from "@/features/explore/articles-list";
import {NewsCategories} from "@/features/explore/news-categories";
import {LeafSketch, LeafSprig} from "@/features/explore/leaf-sketches";

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
  const tNav = await getTranslations({locale, namespace: "Nav"});

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
        <div className="pl-2 lg:pl-0">
          <Breadcrumbs
            homeLabel={tNav("home")}
            items={[{ label: tNav("explore") }]}
          />
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-12">
          <ExploreHeroCard locale={locale} />
          <ArticlesList locale={locale} />
        </div>

        <NewsCategories locale={locale} />
      </div>
    </main>
  );
}
