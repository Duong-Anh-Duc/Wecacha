"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/reveal";
import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { Leaf, Compass, Heart, Mountain } from "lucide-react";

const icons = [Leaf, Compass, Heart, Mountain];
const numerals = ["01", "02", "03", "04"];

const values = [
  { titleKey: "coreVal1Title" as const, copyKey: "coreVal1Copy" as const, bgImage: "/core-val-1.png" },
  { titleKey: "coreVal2Title" as const, copyKey: "coreVal2Copy" as const, bgImage: "/core-val-2.png" },
  { titleKey: "coreVal3Title" as const, copyKey: "coreVal3Copy" as const, bgImage: "/core-val-3.png" },
  { titleKey: "coreVal4Title" as const, copyKey: "coreVal4Copy" as const, bgImage: "/core-val-4.png" },
];

export function CoreValuesSection({ locale: _ }: { locale: Locale }) {
  const t = useTranslations("Home");

  return (
    <div className="px-3 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#ede7d8] max-w-[1400px] mx-auto shadow-[0_4px_48px_rgba(50,25,8,0.10)]">
        {/* Subtle paper texture */}
        <div className="absolute inset-0 z-0 bg-[url('/thai-pattern-bg.png')] opacity-[0.05] mix-blend-multiply pointer-events-none" />

<div className="relative z-20 mx-auto w-full px-8 py-16 lg:px-24 xl:px-32">
          {/* Heading */}
          <Reveal>
            <header className="mb-14 text-center">
              <p className="mb-4 font-serif text-[#a0764a] text-[0.65rem] tracking-[0.35em] uppercase">
                Triết lý cốt lõi
              </p>
              <h2 className="font-serif text-[1.9rem] sm:text-[2.4rem] md:text-[3.8rem] leading-[1.08] text-[#3a2010]">
                {t("coreValuesTitle").split(" – ")[0]}
              </h2>
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="h-px w-14 bg-[#c1a063]/45" />
                <span className="font-serif italic text-[1.15rem] md:text-[1.55rem] text-[#7a5035]">
                  {t("coreValuesTitle").split(" – ")[1]}
                </span>
                <div className="h-px w-14 bg-[#c1a063]/45" />
              </div>
            </header>
          </Reveal>

          {/* Cards — alternate cards offset down for staggered rhythm */}
          <div className="grid gap-5 sm:grid-cols-2 sm:items-start lg:grid-cols-4">
            {values.map(({ titleKey, copyKey, bgImage }, i) => {
              const Icon = icons[i];
              const isOffset = i % 2 !== 0;
              return (
                <Reveal key={titleKey} delay={i * 0.12}>
                  <div className={`group relative z-30 ${isOffset ? "lg:mt-10" : ""}`}>
                    {/* Editorial numeral */}
                    <div className="absolute -top-5 left-5 z-20 select-none font-serif text-[2rem] font-bold leading-none text-[#c1a063]/45 transition-colors duration-500 group-hover:text-[#c1a063]/70 pointer-events-none">
                      {numerals[i]}
                    </div>

                    {/* Arch card */}
                    <div className="relative flex flex-col overflow-hidden rounded-t-[9rem] rounded-b-[1.5rem] border border-[#c1a063]/15 bg-[#15201a] shadow-[0_10px_32px_rgba(0,0,0,0.22)] transition-all duration-700 group-hover:-translate-y-3 group-hover:border-[#c1a063]/45 group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.36)]">

                      {/* Image Area */}
                      <div className="relative w-full">
                        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-[8.5rem]">
                          <Image
                            src={bgImage}
                            alt=""
                            fill
                            className="object-cover saturate-[0.88] brightness-[0.95] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            quality={80}
                          />
                          {/* Gradient: clear at top, fades into card bg at bottom */}
                          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-[#15201a]/95" />
                        </div>

                        {/* Icon bridge between image and text */}
                        <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-[#c1a063]/35 bg-[#15201a] shadow-md transition-all duration-500 group-hover:border-[#c1a063] group-hover:bg-[#c1a063]">
                          <Icon
                            className="h-[18px] w-[18px] text-[#d4b97a] transition-colors duration-500 group-hover:text-[#15201a]"
                            strokeWidth={1.5}
                            aria-hidden
                          />
                        </div>
                      </div>

                      {/* Text */}
                      <div className="flex flex-col items-center px-5 pb-8 pt-9 text-center">
                        <h3 className="mb-3 font-serif text-[1.08rem] font-medium leading-snug text-[#e4cfa2] md:text-[1.15rem]">
                          {t(titleKey)}
                        </h3>
                        <div className="mb-4 h-px w-8 bg-[#c1a063]/35 transition-all duration-500 group-hover:w-16 group-hover:bg-[#c1a063]/65" />
                        <p className="text-[12.5px] font-light leading-[1.72] text-[#7e9488]">
                          {t(copyKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
