import {useTranslations} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {routing} from "@/i18n/routing";
import {ShieldCheck, RefreshCcw, AlertTriangle} from "lucide-react";
import {Reveal} from "@/components/motion/reveal";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default function ReturnPolicyPage({params}: {params: {locale: string}}) {
  setRequestLocale(params.locale);
  const t = useTranslations("ReturnPolicy");

  const policies = [
    {
      title: t("conditionTitle"),
      desc: t("conditionDesc"),
      icon: ShieldCheck,
      color: "text-[#4ade80]"
    },
    {
      title: t("processTitle"),
      desc: t("processDesc"),
      icon: RefreshCcw,
      color: "text-[#38bdf8]"
    },
    {
      title: t("noteTitle"),
      desc: t("noteDesc"),
      icon: AlertTriangle,
      color: "text-[#fbbf24]"
    }
  ];

  return (
    <div className="bg-[#030604] min-h-screen pt-32 pb-32 selection:bg-[#b5703a]/30 relative overflow-hidden">
      {/* Background cinematic effects */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#b5703a]/10 mix-blend-screen rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#2a5a31]/10 mix-blend-screen rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

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
                <div className="relative p-8 sm:p-10 rounded-[2rem] bg-[#081009]/80 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-colors group overflow-hidden">
                  {/* Subtle highlight line at top */}
                  <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-${policy.color.replace('text-', '')}/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/5 shrink-0 shadow-lg ${policy.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl text-[#f4f2ea] mb-4 group-hover:text-[#b5703a] transition-colors">
                        {policy.title}
                      </h3>
                      <p className="text-white/60 text-[15px] sm:text-[16px] leading-[1.8] font-light">
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
              Sơn La Coffee - Cà phê đặc sản Việt Nam.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
