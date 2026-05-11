"use client";

import {useState} from "react";
import Image from "next/image";
import {ChevronRight} from "lucide-react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {journeys, localized} from "@/lib/content";

export function JourneyCards({locale}: {locale: Locale}) {
  const t = useTranslations("Nav");
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex gap-3 h-[320px] sm:h-[420px] lg:h-[520px]">
      {journeys.map((journey, index) => {
        const isActive = index === activeIndex;
        const title = localized(journey.title, locale);
        const body = localized(journey.body, locale);

        return (
          <div
            key={title}
            onClick={() => setActiveIndex(index)}
            className="relative overflow-hidden rounded-md bg-forest-950 cursor-pointer"
            style={{
              flex: isActive ? "7 1 0%" : "1 1 0%",
              opacity: isActive ? 1 : 0.45,
              transition: "flex 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease"
            }}
          >
            <Image
              src={journey.image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-out"
              style={{transform: isActive ? "scale(1)" : "scale(1.08)"}}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />
            {!isActive && (
              <div className="absolute inset-0 bg-forest-950/55 transition-opacity duration-500" />
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3
                className="font-serif text-white leading-tight"
                style={{
                  fontSize: isActive ? "1.75rem" : "1rem",
                  transition: "font-size 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              >
                {title}
              </h3>
              <div
                style={{
                  maxHeight: isActive ? "100px" : "0px",
                  opacity: isActive ? 1 : 0,
                  transition: "max-height 0.5s ease, opacity 0.4s ease"
                }}
                className="overflow-hidden"
              >
                <p className="mt-2 text-sm leading-6 text-white/70">{body}</p>
                <Link
                  href={journey.href}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ember hover:text-ember/80 transition-colors"
                >
                  {t("explore")} <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
