import type {Metadata} from "next";
import {useTranslations} from "next-intl";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {routing} from "@/i18n/routing";
import type {Locale} from "@/i18n/routing";
import {FileText, Database, ShieldCheck, Mail} from "lucide-react";
import {Reveal} from "@/components/motion/reveal";
import Image from "next/image";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: Locale}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "PrivacyPolicy"});
  
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {vi: "/vi/privacy", en: "/en/privacy", "x-default": "/vi/privacy"}
    }
  };
}

export default async function PrivacyPolicyPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "PrivacyPolicy"});

  const policies = [
    {
      title: t("section1Title"),
      desc: t("section1Desc"),
      icon: Database,
      color: "text-[#38bdf8]",
      bg: "bg-[#38bdf8]"
    },
    {
      title: t("section2Title"),
      desc: t("section2Desc"),
      icon: FileText,
      color: "text-[#4ade80]",
      bg: "bg-[#4ade80]"
    },
    {
      title: t("section3Title"),
      desc: t("section3Desc"),
      icon: ShieldCheck,
      color: "text-[#fbbf24]",
      bg: "bg-[#fbbf24]"
    },
    {
      title: t("section4Title"),
      desc: t("section4Desc"),
      icon: Mail,
      color: "text-[#f472b6]",
      bg: "bg-[#f472b6]"
    }
  ];

  return (
    <div className="bg-[#030604] min-h-screen pt-32 pb-32 selection:bg-[#b5703a]/30 relative overflow-hidden">
      {/* Background cinematic effects */}
      <div className="absolute inset-0 z-0">
        <Image src="/image3.jpeg" alt="" fill className="object-cover object-center opacity-40" quality={80} priority />
        <div className="absolute inset-0 bg-[#030604]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030604]/80 via-[#030604]/50 to-[#030604]/90" />
      </div>
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#38bdf8]/10 mix-blend-screen rounded-full filter blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#fbbf24]/10 mix-blend-screen rounded-full filter blur-[150px] pointer-events-none z-0" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-20">
            <h1 className="font-serif text-4xl sm:text-6xl text-[#f4f2ea] drop-shadow-xl mb-6">
              {t("title")}
            </h1>
            <p className="text-[#b5703a] text-lg sm:text-xl font-light uppercase tracking-widest max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </Reveal>

        <div className="space-y-12">
          {policies.map((policy, idx) => {
            const Icon = policy.icon;
            return (
              <Reveal key={idx} delay={0.1 * idx}>
                <div className="relative p-8 sm:p-10 rounded-[2rem] bg-[#081009]/80 backdrop-blur-xl border border-white/5 hover:border-white/15 transition-all duration-500 group overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                  <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-${policy.color.replace('text-', '')}/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                    <div className="relative shrink-0">
                      <div className={`absolute inset-0 ${policy.bg} opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity duration-500`} />
                      <div className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 shadow-xl ${policy.color} group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className="w-8 h-8 drop-shadow-md" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-[#f4f2ea] mb-4 group-hover:text-[#f4f2ea] transition-colors">
                        {policy.title}
                      </h3>
                      <p className="text-white/60 text-[15px] sm:text-[16px] leading-[1.8] font-light group-hover:text-white/80 transition-colors duration-500">
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
          <div className="mt-16 text-center border-t border-white/10 pt-10">
            <p className="text-white/40 text-sm">
              Wecacha - Kiến tạo thay đổi, tiếp nối tinh hoa.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
