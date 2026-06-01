"use client";

import { useState } from "react";
import Image from "next/image";
import {cn} from "@/lib/utils";

type CommitmentCard = {
  key: string;
  title: string;
  copy: string;
  image: string;
};

export function CommitmentCards({
  cards,
  tone = "classic"
}: {
  cards: CommitmentCard[];
  tone?: "classic" | "green";
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isGreen = tone === "green";

  return (
    <div className="flex gap-4 h-[400px] sm:h-[500px] lg:h-[600px]">
      {cards.map(({key, title, copy, image}, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={key}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/10",
              isGreen ? "bg-brand-green" : "bg-forest-950"
            )}
            style={{
              flex: isActive ? "7 1 0%" : "1 1 0%",
              opacity: isActive ? 1 : 0.45,
              transition: "flex 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease",
            }}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-out"
              style={{ transform: isActive ? "scale(1)" : "scale(1.08)" }}
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={80}
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t to-transparent",
                isGreen ? "from-brand-green/90 via-brand-green/20" : "from-forest-950/90 via-forest-950/20"
              )}
            />
            {!isActive && (
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  isGreen ? "bg-brand-green/55" : "bg-forest-950/55"
                )}
              />
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
                {title}
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
                  {copy}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
