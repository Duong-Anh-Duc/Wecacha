import {use} from "react";
import type {Metadata} from "next";
import {useTranslations} from "next-intl";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {routing} from "@/i18n/routing";
import type {Locale} from "@/i18n/routing";
import {ShieldCheck, RefreshCcw, AlertTriangle} from "lucide-react";
import {Reveal} from "@/components/motion/reveal";
import Image from "next/image";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "ReturnPolicy"});
  const tNav = await getTranslations({locale, namespace: "Nav"});
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/return-policy`,
      languages: {vi: "/vi/return-policy", en: "/en/return-policy", "x-default": "/vi/return-policy"}
    },
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      images: [{url: `/og/image.png?locale=${locale}&title=${encodeURIComponent(t("title"))}&kicker=${encodeURIComponent(tNav("returnPolicy"))}`, width: 1200, height: 630}]
    }
  };
}

export default function ReturnPolicyPage({params}: {params: Promise<{locale: string}>}) {
  setRequestLocale(use(params).locale);
  const t = useTranslations("ReturnPolicy");

  const policies = [
    {
      title: t("conditionTitle"),
      desc: t("conditionDesc"),
      icon: ShieldCheck,
      color: "text-[#8c6b4a]",
      bg: "bg-[#8c6b4a]"
    },
    {
      title: t("processTitle"),
      desc: t("processDesc"),
      icon: RefreshCcw,
      color: "text-[#2a5a31]",
      bg: "bg-[#2a5a31]"
    },
    {
      title: t("noteTitle"),
      desc: t("noteDesc"),
      icon: AlertTriangle,
      color: "text-[#b5703a]",
      bg: "bg-[#b5703a]"
    }
  ];

  return (
    <div className="bg-[#ede7d8] min-h-screen pt-32 pb-32 selection:bg-[#c1a063]/30 relative overflow-hidden">
      {/* Subtle paper texture */}
      <div className="absolute inset-0 z-0 bg-[url('/thai-pattern-bg.png')] opacity-[0.05] mix-blend-multiply pointer-events-none" />

      {/* Botanical decorations */}
      <div className="absolute top-[5%] -left-[5%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] opacity-[0.25] pointer-events-none -rotate-12 blur-[1px] z-0">
        <Image src="/explore_leaves.png" alt="" fill className="object-contain" sizes="400px" />
      </div>
      <div className="absolute bottom-[5%] -right-[5%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] opacity-[0.25] pointer-events-none rotate-12 blur-[2px] z-0">
        <Image src="/botanical-bg.png" alt="" fill className="object-contain scale-x-[-1] scale-y-[-1]" sizes="400px" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-20">
            <h1 className="font-serif text-4xl sm:text-6xl text-[#3a2010] drop-shadow-sm mb-6">
              {t("title")}
            </h1>
            <p className="text-[#8c6b4a] text-lg sm:text-xl font-light uppercase tracking-widest max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </Reveal>

        <div className="space-y-10 sm:space-y-12">
          {policies.map((policy, idx) => {
            const Icon = policy.icon;
            return (
              <Reveal key={idx} delay={0.1 * idx}>
                <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#18241b] to-[#111a14] shadow-xl border border-[#c1a063]/20 hover:border-[#c1a063]/40 transition-all duration-500 group overflow-hidden hover:-translate-y-2">
                  {/* Subtle noise texture */}
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-screen pointer-events-none" />
                  
                  {/* Large decorative number */}
                  <div className="absolute -right-4 -bottom-10 text-[10rem] font-serif font-bold text-[#c1a063]/[0.03] select-none pointer-events-none group-hover:text-[#c1a063]/[0.08] transition-colors duration-700 leading-none">
                    0{idx + 1}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start relative z-10">
                    <div className="relative shrink-0">
                      <div className="relative flex items-center justify-center w-16 h-16 rounded-full border border-[#c1a063]/30 bg-[#15201a] shadow-inner text-[#d4b97a] group-hover:scale-110 group-hover:bg-[#c1a063] group-hover:text-white transition-all duration-500">
                        <Icon className="w-7 h-7" strokeWidth={1.5} />
                      </div>
                      {/* Vertical line connecting cards (optional, but looks nice if we wanted a timeline, here we just keep it clean) */}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-serif text-2xl text-[#e8d5a5] mb-3 group-hover:text-white transition-colors duration-300">
                        {policy.title}
                      </h3>
                      <div className="w-10 h-px bg-[#c1a063]/30 mb-4 transition-all duration-500 group-hover:w-20 group-hover:bg-[#c1a063]/60" />
                      <p className="text-[#9ba8a0] text-[15px] sm:text-[16px] leading-[1.8] font-light transition-colors duration-500">
                        {policy.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
        
        <Reveal delay={0.4}>
          <div className="mt-16 text-center border-t border-[#c1a063]/15 pt-10 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#ede7d8] border border-[#c1a063]/20 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#8c6b4a]/40" />
             </div>
            <p className="text-[#8c6b4a]/70 text-sm italic">
              {t("tagline")}
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
