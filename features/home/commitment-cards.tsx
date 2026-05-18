"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const cards = [
  {
    titleKey: "commit1Title" as const,
    copyKey:  "commit1Copy"  as const,
    image:    "/commit-altitude.png",
  },
  {
    titleKey: "commit2Title" as const,
    copyKey:  "commit2Copy"  as const,
    image:    "/commit-farmers.png",
  },
  {
    titleKey: "commit3Title" as const,
    copyKey:  "commit3Copy"  as const,
    image:    "/commit-roast.png",
  },
];

export function CommitmentCards() {
  const t = useTranslations("Home");
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex gap-4 h-[400px] sm:h-[500px] lg:h-[600px]">
      {cards.map(({ titleKey, copyKey, image }, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={titleKey}
            onClick={() => setActiveIndex(index)}
            className="relative overflow-hidden rounded-[2rem] bg-forest-950 cursor-pointer border border-white/10"
            style={{
              flex: isActive ? "7 1 0%" : "1 1 0%",
              opacity: isActive ? 1 : 0.45,
              transition: "flex 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease",
            }}
          >
            <Image
              src={image}
              alt={t(titleKey)}
              fill
              className="object-cover transition-transform duration-700 ease-out"
              style={{ transform: isActive ? "scale(1)" : "scale(1.08)" }}
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={80}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />
            {!isActive && (
              <div className="absolute inset-0 bg-forest-950/55 transition-opacity duration-500" />
            )}

            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
              <h3
                className="font-serif text-white leading-tight"
                style={{
                  fontSize: isActive ? "2.5rem" : "1.1rem",
                  transition: "font-size 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  whiteSpace: isActive ? "normal" : "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {t(titleKey)}
              </h3>
              <div
                style={{
                  maxHeight: isActive ? "120px" : "0px",
                  opacity: isActive ? 1 : 0,
                  transition: "max-height 0.5s ease, opacity 0.4s ease",
                }}
                className="overflow-hidden"
              >
                <p className="mt-4 text-base leading-relaxed text-white/80 pr-4">
                  {t(copyKey)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
