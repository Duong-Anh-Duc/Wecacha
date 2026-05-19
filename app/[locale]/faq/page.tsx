import {use} from "react";
import type {Metadata} from "next";
import {useTranslations} from "next-intl";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {routing} from "@/i18n/routing";
import type {Locale} from "@/i18n/routing";
import Image from "next/image";
import {ChevronDown, Coffee, HelpCircle, Flame, Leaf, Package} from "lucide-react";
import {Reveal} from "@/components/motion/reveal";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Faq"});
  const tNav = await getTranslations({locale, namespace: "Nav"});
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/faq`,
      languages: {vi: "/vi/faq", en: "/en/faq", "x-default": "/vi/faq"}
    },
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      images: [{url: `/og/image.png?locale=${locale}&title=${encodeURIComponent(t("title"))}&kicker=${encodeURIComponent(tNav("support"))}`, width: 1200, height: 630}]
    }
  };
}

export default function FAQPage({params}: {params: Promise<{locale: string}>}) {
  setRequestLocale(use(params).locale);
  const t = useTranslations("Faq");

  // Re-creating the accordion client-side to make it beautiful with HTML details/summary
  // combined with Tailwind peer utilities for pure CSS animation, keeping it lightweight
  const faqs = [
    { q: t("q1"), a: t("a1"), icon: Leaf },
    { q: t("q2"), a: t("a2"), icon: Flame },
    { q: t("q3"), a: t("a3"), icon: Package },
    { q: t("q4"), a: t("a4"), icon: Coffee }
  ];

  return (
    <div className="bg-[#ede7d8] min-h-screen pt-24 pb-32 selection:bg-[#c1a063]/30 relative overflow-hidden">
      {/* Subtle paper texture */}
      <div className="absolute inset-0 z-0 bg-[url('/thai-pattern-bg.png')] opacity-[0.05] mix-blend-multiply pointer-events-none" />

      {/* Botanical decorations */}
      <div className="absolute top-[5%] -left-[5%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] opacity-[0.25] pointer-events-none -rotate-12 blur-[1px]">
        <Image src="/explore_leaves.png" alt="" fill className="object-contain" sizes="400px" />
      </div>
      <div className="absolute bottom-[5%] -right-[5%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] opacity-[0.25] pointer-events-none rotate-12 blur-[2px]">
        <Image src="/botanical-bg.png" alt="" fill className="object-contain scale-x-[-1] scale-y-[-1]" sizes="400px" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cinematic Header */}
        <Reveal>
          <div className="relative w-full h-[40vh] sm:h-[50vh] rounded-[2.5rem] overflow-hidden mb-16 shadow-[0_20px_60px_rgba(50,25,8,0.15)] border border-[#c1a063]/20">
            <Image
              src="/faq-hero.png"
              alt="FAQ Hero"
              fill
              priority
              className="object-cover saturate-[0.9]"
              sizes="100vw"
            />
            {/* Deep overlay matching the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16 flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/30 backdrop-blur-md border border-white/20 mb-6 text-[#e8d5a5] shadow-lg">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl text-[#fdfbf7] drop-shadow-xl mb-4">
                {t("title")}
              </h1>
              <p className="text-[#e8d5a5]/90 max-w-2xl mx-auto text-lg font-light drop-shadow-md">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </Reveal>

        {/* FAQ Accordions */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            const Icon = faq.icon;
            return (
              <Reveal key={idx} delay={0.1 * idx}>
                <details className="group bg-[#fdfbf7] border border-[#c1a063]/20 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-sm transition-all hover:shadow-md hover:border-[#c1a063]/40">
                  <summary className="flex items-center justify-between p-6 sm:p-8 cursor-pointer select-none bg-gradient-to-r from-transparent to-[#f4f0e6]/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#18241b] text-[#e8d5a5] shadow-sm group-hover:bg-[#c1a063] group-hover:text-white transition-colors duration-300 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif font-medium text-[1.1rem] sm:text-xl text-[#3a2010] group-hover:text-[#8c6b4a] transition-colors">
                        {faq.q}
                      </h3>
                    </div>
                    <div className="ml-4 shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#ede7d8] text-[#8c6b4a] group-open:bg-[#c1a063] group-open:text-white transition-all duration-300">
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
                    </div>
                  </summary>
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 overflow-hidden text-[#5c4a3d] leading-relaxed font-light origin-top opacity-0 translate-y-[-10px] transition-all duration-300 ease-out group-open:opacity-100 group-open:translate-y-0">
                    <div className="sm:ml-[60px] ml-[52px] pt-4 border-t border-[#c1a063]/15">
                      {faq.a}
                    </div>
                  </div>
                </details>
              </Reveal>
            )
          })}
        </div>
      </div>
    </div>
  );
}
