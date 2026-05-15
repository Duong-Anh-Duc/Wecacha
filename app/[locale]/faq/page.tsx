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

export async function generateMetadata({params}: {params: {locale: Locale}}): Promise<Metadata> {
  const {locale} = params;
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

export default function FAQPage({params}: {params: {locale: string}}) {
  setRequestLocale(params.locale);
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
    <div className="bg-[#030604] min-h-screen pt-24 pb-32 selection:bg-[#b5703a]/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cinematic Header */}
        <Reveal>
          <div className="relative w-full h-[40vh] sm:h-[50vh] rounded-[2rem] overflow-hidden mb-16 shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5">
            <Image 
              src="/faq-hero.png" 
              alt="FAQ Hero" 
              fill 
              className="object-cover" 
              sizes="100vw"
            />
            {/* Deep overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030604] via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-16 flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/10 mb-6 text-[#b5703a]">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl text-[#f4f2ea] drop-shadow-xl mb-4">
                {t("title")}
              </h1>
              <p className="text-white/70 max-w-2xl mx-auto text-lg font-light">
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
                <details className="group bg-[#081009] border border-white/5 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden shadow-lg transition-all hover:border-[#b5703a]/30">
                  <summary className="flex items-center justify-between p-6 sm:p-8 cursor-pointer select-none">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-[#b5703a] group-hover:bg-[#b5703a]/10 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg text-[#f4f2ea] group-hover:text-[#b5703a] transition-colors">
                        {faq.q}
                      </h3>
                    </div>
                    <ChevronDown className="w-5 h-5 text-white/40 transition-transform duration-300 group-open:rotate-180 group-open:text-[#b5703a]" />
                  </summary>
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 overflow-hidden text-white/60 leading-relaxed font-light origin-top opacity-0 translate-y-[-10px] transition-all duration-300 ease-out group-open:opacity-100 group-open:translate-y-0">
                    <div className="pl-14">
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
