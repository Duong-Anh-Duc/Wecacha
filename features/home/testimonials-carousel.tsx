"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import {motion} from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import {useTranslations} from "next-intl";
import {cn} from "@/lib/utils";
import {testimonials, localized} from "@/lib/content";
import type {Locale} from "@/i18n/routing";

const AUTOPLAY_MS = 4500;

export function TestimonialsCarousel({locale}: {locale: Locale}) {
  const tCommon = useTranslations("Common");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    containScroll: false,
    slidesToScroll: 1
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      emblaApi?.scrollNext();
    }, AUTOPLAY_MS);
  }, [emblaApi, clearTimer]);

  useEffect(() => {
    if (!emblaApi) return;
    scheduleNext();
    return clearTimer;
  }, [emblaApi, scheduleNext, clearTimer]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setProgressKey((k) => k + 1);
      scheduleNext();
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, scheduleNext]);

  return (
    <div
      className="relative"
      onMouseEnter={clearTimer}
      onMouseLeave={scheduleNext}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex touch-pan-y items-center">
          {testimonials.map((item, index) => {
            const isActive = index === selectedIndex;
            return (
              <motion.figure
                key={item.name}
                animate={{
                  opacity: isActive ? 1 : 0.55,
                  scale: isActive ? 1 : 0.9
                }}
                transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
                onClick={() => emblaApi?.scrollTo(index)}
                className="min-w-0 flex-[0_0_88%] cursor-pointer pl-4 sm:flex-[0_0_65%] lg:flex-[0_0_46%]"
              >
                <div
                  className={cn(
                    "flex h-full flex-col rounded-2xl p-8 transition-colors duration-500",
                    isActive
                      ? "bg-parchment-50 shadow-cinematic"
                      : "bg-forest-800/70"
                  )}
                >
                  {/* Quote mark */}
                  <span
                    className={cn(
                      "font-serif text-5xl leading-none",
                      isActive ? "text-earth-600" : "text-earth-700/50"
                    )}
                    aria-hidden="true"
                  >
                    "
                  </span>

                  <blockquote
                    className={cn(
                      "mt-5 flex-1 font-serif text-2xl leading-snug",
                      isActive ? "text-forest-950" : "text-parchment-50/65"
                    )}
                  >
                    {localized(item.quote, locale)}
                  </blockquote>

                  <figcaption className="mt-8 flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <strong
                        className={cn(
                          "block text-sm font-bold",
                          isActive ? "text-forest-950" : "text-parchment-50/85"
                        )}
                      >
                        {item.name}
                      </strong>
                      <span
                        className={cn(
                          "text-xs",
                          isActive ? "text-forest-950/55" : "text-parchment-50/50"
                        )}
                      >
                        {localized(item.role, locale)}
                      </span>
                    </div>
                  </figcaption>
                </div>
              </motion.figure>
            );
          })}
        </div>
      </div>

      {/* Progress dots */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={tCommon("goToSlide", {index: index + 1})}
            className="relative h-1 overflow-hidden rounded-full bg-white/25 transition-[width] duration-300"
            style={{width: index === selectedIndex ? 40 : 8}}
          >
            {index === selectedIndex && (
              <motion.span
                key={progressKey}
                className="absolute inset-y-0 left-0 rounded-full bg-white"
                initial={{width: "0%"}}
                animate={{width: "100%"}}
                transition={{duration: AUTOPLAY_MS / 1000, ease: "linear"}}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
