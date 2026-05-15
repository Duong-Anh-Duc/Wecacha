import {CheckCircle2, HeartHandshake, Leaf, ShieldCheck} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {SectionHeading} from "@/components/sections/section-heading";
import type {Locale} from "@/i18n/routing";

export async function CoreValuesSection({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "About"});

  const values = [
    {icon: HeartHandshake, label: t("value1Label"), copy: t("value1Copy")},
    {icon: ShieldCheck, label: t("value2Label"), copy: t("value2Copy")},
    {icon: CheckCircle2, label: t("value3Label"), copy: t("value3Copy")},
    {icon: Leaf, label: t("value4Label"), copy: t("value4Copy")}
  ];

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker={t("coreValuesKicker")}
          title={t("coreValuesTitle")}
          align="center"
        />

        <div className="relative mt-16">
          {/* Animated connection line (desktop only) */}
          <div className="hidden lg:block absolute top-[64px] left-[12.5%] right-[12.5%] h-[2px] bg-earth-600/20 z-0">
            {/* The moving light */}
            <div className="absolute top-0 left-0 h-full w-full overflow-hidden">
              <div className="h-full w-[30%] bg-gradient-to-r from-transparent via-earth-600 to-transparent animate-[flow_4s_linear_infinite] shadow-[0_0_10px_#b5703a]" />
            </div>
            
            {/* Arrows pointing to the next card */}
            <div className="absolute top-1/2 left-[33.33%] -translate-x-1/2 -translate-y-1/2 text-earth-600/50 bg-parchment-50 rounded-full px-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
            <div className="absolute top-1/2 left-[66.66%] -translate-x-1/2 -translate-y-1/2 text-earth-600/50 bg-parchment-50 rounded-full px-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>

          <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({icon: Icon, label, copy}, idx) => (
              <Reveal key={label} delay={0.1 + idx * 0.1}>
                <div 
                  className="group h-full rounded-2xl border border-forest-950/10 bg-white/90 backdrop-blur-sm p-8 text-center shadow-warm transition duration-500 lg:animate-card-glow"
                  style={{ animationDelay: `${0.8 + idx * 0.9}s` }}
                >
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-parchment-100 text-earth-700 transition duration-500 group-hover:bg-earth-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(181,112,58,0.5)]">
                    <Icon className="relative z-10 h-8 w-8" />
                  </div>
                  <h4 className="mt-6 font-serif text-2xl text-forest-950">
                    {label}
                  </h4>
                  <p className="mt-4 text-sm leading-6 text-forest-950/60">
                    {copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
