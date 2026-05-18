"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { testimonials, localized } from "@/lib/content";
import type { Locale } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, Award, Coffee } from "lucide-react";

const AUTOPLAY_MS = 4000;
type EmblaApi = NonNullable<UseEmblaCarouselType[1]>;

export function TestimonialsCarousel({ locale }: { locale: Locale }) {
  const tCommon = useTranslations("Common");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    containScroll: false,
    slidesToScroll: 1,
    duration: 35,
    skipSnaps: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tweenValues, setTweenValues] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateTweenValues = useCallback((api: EmblaApi) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const snaps = api.scrollSnapList();

    const values = snaps.map((snap, index) => {
      let diffToTarget = snap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = snap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = snap + (1 - scrollProgress);
          }
        });
      }

      // Tweak multiplier to adjust how fast cards fade out on sides
      return Math.max(0, 1 - Math.abs(diffToTarget) * 1.8);
    });

    setTweenValues(values);
  }, []);

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
    updateTweenValues(emblaApi);
    scheduleNext();
    return clearTimer;
  }, [emblaApi, scheduleNext, clearTimer, updateTweenValues]);

  useEffect(() => {
    if (!emblaApi) return;
    const onScroll = () => updateTweenValues(emblaApi);
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      scheduleNext();
      updateTweenValues(emblaApi);
    };
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onScroll);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, scheduleNext, updateTweenValues]);

  return (
    <div
      className="relative max-w-[1200px] mx-auto"
      onMouseEnter={clearTimer}
      onMouseLeave={scheduleNext}
    >
      <div className="overflow-hidden py-10" ref={emblaRef}>
        <div className="-ml-4 flex touch-pan-y items-center">
          {testimonials.map((item, index) => {
            const isActive = index === selectedIndex;
            // Provide a fallback value if tweenValues isn't ready
            const tween = tweenValues[index] ?? (isActive ? 1 : 0);

            // For active: scale 1, blur 0, opacity 1
            // For inactive: scale 0.85, blur 4px, opacity 0.5
            const scale = 0.85 + tween * 0.15;
            const blur = (1 - tween) * 4;
            const opacity = 0.4 + tween * 0.6;

            return (
              <div
                key={`${item.name}-${index}`}
                onClick={() => emblaApi?.scrollTo(index)}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_65%] md:flex-[0_0_60%] lg:flex-[0_0_55%] pl-4 cursor-pointer"
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  filter: `blur(${blur}px)`
                }}
              >
                <div
                  className={cn(
                    "relative flex flex-col h-full rounded-[2.5rem] p-8 sm:p-12 transition-colors duration-500 overflow-hidden border",
                    isActive
                      ? "bg-white shadow-xl border-stone-200"
                      : "bg-parchment-100/50 border-stone-300/50"
                  )}
                >
                  {/* Subtle watermarked graphic on top right */}
                  <div className={cn(
                    "absolute -right-10 -top-10 w-64 h-64 opacity-[0.03] transition-opacity duration-500 pointer-events-none",
                    isActive ? "opacity-[0.05]" : "opacity-[0.03]"
                  )}>
                    <svg viewBox="0 0 100 100" fill="currentColor" className={isActive ? "text-forest-950" : "text-stone-900"}>
                      <path d="M50 0 C70 30 90 40 100 60 C80 60 70 80 50 100 C30 80 20 60 0 60 C10 40 30 30 50 0 Z" />
                    </svg>
                  </div>

                  {/* Large Quote Mark */}
                  <div className="font-serif text-6xl leading-none text-[#b5703a] mb-6">
                    “
                  </div>

                  <blockquote
                    className={cn(
                      "flex-1 font-serif text-[1.4rem] sm:text-[1.7rem] leading-[1.6] mb-12",
                      isActive ? "text-forest-950" : "text-stone-600"
                    )}
                  >
                    {localized(item.quote, locale)}
                  </blockquote>

                  <div className="mt-auto flex items-end justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white/20">
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div>
                        <strong
                          className={cn(
                            "block text-base font-bold",
                            isActive ? "text-forest-950" : "text-stone-700"
                          )}
                        >
                          {item.name}
                        </strong>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isActive ? "text-forest-950/60" : "text-stone-500"
                          )}
                        >
                          {localized(item.role, locale)}
                        </span>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full shadow-sm whitespace-nowrap",
                      isActive ? "bg-parchment-50 border border-stone-200 text-forest-950" : "bg-white/50 border border-stone-200/50 text-stone-600"
                    )}>
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", isActive ? "bg-forest-950 text-white" : "bg-stone-300 text-white")}>
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider">{tCommon("loyalCustomer")}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls Container */}
      <div className="flex items-center justify-center mt-8 px-4">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-3">
          {testimonials.map((_, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={tCommon("goToSlide", { index: index + 1 })}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  isActive
                    ? "bg-ember scale-125 shadow-[0_0_10px_rgba(181,112,58,0.5)]"
                    : "bg-transparent border border-stone-400 hover:border-forest-950"
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
