"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import {motion} from "framer-motion";
import type {UseEmblaCarouselType} from "embla-carousel-react";
import useEmblaCarousel from "embla-carousel-react";
import {useTranslations} from "next-intl";
import {cn} from "@/lib/utils";
import {testimonials, localized} from "@/lib/content";
import type {Locale} from "@/i18n/routing";

const AUTOPLAY_MS = 4500;
type EmblaApi = NonNullable<UseEmblaCarouselType[1]>;

export function TestimonialsCarousel({locale}: {locale: Locale}) {
  const tCommon = useTranslations("Common");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    containScroll: false,
    slidesToScroll: 1,
    duration: 36,
    skipSnaps: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tweenValues, setTweenValues] = useState<number[]>([]);
  const [progressKey, setProgressKey] = useState(0);
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

      return Math.max(0, 1 - Math.abs(diffToTarget) * 3.2);
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
      setProgressKey((k) => k + 1);
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
      className="relative"
      onMouseEnter={clearTimer}
      onMouseLeave={scheduleNext}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex touch-pan-y items-center">
          {testimonials.map((item, index) => {
            const isActive = index === selectedIndex;
            const tween = tweenValues[index] ?? (isActive ? 1 : 0);
            const opacity = 0.34 + tween * 0.66;
            const scale = 0.88 + tween * 0.12;
            const translateY = (1 - tween) * 20;
            const blur = (1 - tween) * 1.8;
            return (
              <figure
                key={item.name}
                onClick={() => emblaApi?.scrollTo(index)}
                className="min-w-0 flex-[0_0_88%] cursor-pointer pl-4 sm:flex-[0_0_65%] lg:flex-[0_0_46%]"
              >
                <div
                  style={{
                    opacity,
                    transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                    filter: `blur(${blur}px)`
                  }}
                  className={cn(
                    "will-change-transform flex h-full flex-col rounded-2xl p-8 transition-[background-color,box-shadow,filter,opacity,transform] duration-300 ease-out",
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
              </figure>
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
