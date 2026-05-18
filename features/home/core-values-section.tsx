"use client";

import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { Leaf, Compass, Heart, Mountain } from "lucide-react";

const icons = [Leaf, Compass, Heart, Mountain];

const values = [
  { titleKey: "coreVal1Title" as const, copyKey: "coreVal1Copy" as const, bgImage: "/core-val-1.png" },
  { titleKey: "coreVal2Title" as const, copyKey: "coreVal2Copy" as const, bgImage: "/core-val-2.png" },
  { titleKey: "coreVal3Title" as const, copyKey: "coreVal3Copy" as const, bgImage: "/core-val-3.png" },
  { titleKey: "coreVal4Title" as const, copyKey: "coreVal4Copy" as const, bgImage: "/core-val-4.png" },
];

export function CoreValuesSection({ locale: _ }: { locale: Locale }) {
  const t = useTranslations("Home");

  return (
    <div className="px-2 py-8 sm:px-6 lg:px-8">
      {/* Outer dark frame wrapper to match the screenshot's 'framed' look */}
      <section className="relative overflow-hidden rounded-[2rem] border-[12px] border-[#1a1a1a] bg-[#ebe6d9] shadow-2xl max-w-[1400px] mx-auto">
        {/* Inner Gold Trim */}
        <div className="absolute inset-0 z-10 pointer-events-none border-[3px] border-[#c1a063]/60 m-2 rounded-[1.5rem]" />
        
        {/* Texture Overlay */}
        <div className="absolute inset-0 z-0 bg-[url('/thai-pattern-bg.png')] opacity-[0.06] mix-blend-multiply pointer-events-none" />

        {/* 3D Golden Vines Framing */}
        <div className="absolute inset-y-0 left-0 z-20 w-[200px] lg:w-[350px] opacity-90 pointer-events-none">
          <Image 
            src="/golden-vines.png" 
            alt="" 
            fill 
            className="object-contain object-left scale-110 drop-shadow-2xl" 
          />
        </div>
        <div className="absolute inset-y-0 right-0 z-20 w-[200px] lg:w-[350px] opacity-90 pointer-events-none">
          <Image 
            src="/golden-vines.png" 
            alt="" 
            fill 
            className="object-contain object-right scale-110 rotate-180 drop-shadow-2xl" 
          />
        </div>
        
        <div className="relative z-30 mx-auto w-full px-8 py-20 lg:px-24">
          <Reveal>
            <div className="mb-10 text-center relative">
              <h2 className="font-serif text-[2.5rem] md:text-[3.8rem] leading-[1.1] text-[#5c3a21] drop-shadow-sm">
                {t("coreValuesTitle").split(" – ")[0]} <br />
                <span className="text-[#5c3a21]/90">– {t("coreValuesTitle").split(" – ")[1]}</span>
              </h2>
            </div>
            {/* Elegant Double Gold Divider */}
            <div className="w-full flex items-center justify-center gap-4 mb-16 px-10">
              <div className="h-[2px] w-full bg-[#c1a063]/40" />
              <div className="h-[4px] w-full bg-[#c1a063]/60 rounded-full max-w-[40%]" />
              <div className="h-[2px] w-full bg-[#c1a063]/40" />
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-40">
            {values.map(({ titleKey, copyKey, bgImage }, i) => {
              const Icon = icons[i];
              return (
                <Reveal key={titleKey} delay={i * 0.15}>
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    className="group flex h-full flex-col bg-[#7a8b75] rounded-[2.5rem] p-3 shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-[2.5px] border-[#c1a063] relative overflow-hidden transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
                  >
                    {/* Subtle inner noise texture for the green card */}
                    <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />

                    <div className="relative z-10">
                      {/* Capsule-shaped Image with Gold Border */}
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[2.2rem] rounded-b-[4.5rem] border-b-[5px] border-[#c1a063] shadow-inner bg-black/20">
                        <Image
                          src={bgImage}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110 saturate-[0.9]"
                          sizes="(max-width: 768px) 100vw, 25vw"
                          quality={80}
                        />
                      </div>
                      
                      {/* Icon placed below image on the left */}
                      <div className="mt-6 ml-4">
                        <div className="text-[#e2c78a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                          <Icon className="h-9 w-9" strokeWidth={1.8} aria-hidden="true" />
                        </div>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="mt-4 px-4 pb-6 flex flex-col flex-1 relative z-10">
                      <h3 className="font-serif text-[1.3rem] leading-snug text-[#3f2512] mb-3 font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.1)]">
                        {t(titleKey)}
                      </h3>
                      <p className="text-[13px] leading-[1.6] text-[#1a1a1a] font-medium flex-1">
                        {t(copyKey)}
                      </p>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
