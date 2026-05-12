"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {ArrowDownRight, ArrowUpRight, Coffee} from "lucide-react";
import {motion, useScroll, useTransform} from "framer-motion";
import type {Locale} from "@/i18n/routing";
import {localized, storyChapters} from "@/lib/content";
import {cn} from "@/lib/utils";

type StoryChapterSliderProps = {
  locale: Locale;
  fieldNotes: string;
  quote: string;
};

export function StoryChapterSlider({
  locale,
  fieldNotes,
  quote
}: StoryChapterSliderProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const {scrollYProgress} = useScroll({
    target: rootRef,
    offset: ["start start", "end end"]
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-54%"]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true); // default true to match SSR mostly, but x is 0 at top anyway

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setActiveIndex(
        Math.min(storyChapters.length - 1, Math.round(latest * (storyChapters.length - 1)))
      );
    });
  }, [scrollYProgress]);

  function jumpTo(index: number) {
    const root = rootRef.current;
    if (!root) return;

    const max = storyChapters.length - 1;
    const target = root.offsetTop + (root.offsetHeight - window.innerHeight) * (index / max);
    window.scrollTo({top: target, behavior: "smooth"});
  }

  return (
    <section
      ref={rootRef}
      style={{ position: "relative" }}
      className="relative bg-parchment-50 px-4 py-20 sm:px-6 lg:h-[320vh] lg:px-8 lg:py-0"
    >
      <div className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full bg-forest-600/20 blur-[100px] animate-drift" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-earth-600/15 blur-[120px] animate-drift" style={{ animationDelay: '-8s' }} />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:sticky lg:top-0 lg:h-screen lg:grid-cols-[0.58fr_1.42fr] lg:items-center lg:overflow-hidden">
        <aside>
          <div className="rounded-2xl border border-forest-950/10 bg-parchment-100/78 p-6 shadow-warm backdrop-blur sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-earth-600">
              <Coffee className="h-4 w-4" aria-hidden="true" />
              {fieldNotes}
            </p>
            <blockquote className="mt-5 font-serif text-3xl leading-tight text-forest-950 sm:text-4xl">
              {quote}
            </blockquote>

            <div className="mt-8 grid gap-2">
              {storyChapters.map((chapter, index) => {
                const active = index === activeIndex;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => jumpTo(index)}
                    className={cn(
                      "group flex items-center justify-between rounded-lg border px-3 py-3 text-left text-sm font-bold transition duration-300",
                      active
                        ? "border-earth-600/24 bg-earth-600/9 text-earth-700"
                        : "border-transparent text-forest-950/64 hover:border-forest-950/10 hover:bg-forest-950/5 hover:text-forest-950"
                    )}
                  >
                    <span>
                      {String(index + 1).padStart(2, "0")} ·{" "}
                      {localized(chapter.eyebrow, locale)}
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                        active ? "opacity-100" : "opacity-35"
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-forest-950/48">
              <span>{locale === "vi" ? "Cuộn để trượt" : "Scroll to glide"}</span>
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
        </aside>

        <div className="min-w-0 overflow-visible lg:overflow-hidden">
          <motion.div
            style={{ x: isDesktop ? x : 0 }}
            className="grid gap-5 lg:flex lg:w-max lg:gap-6 lg:will-change-transform"
          >
            {storyChapters.map((chapter, index) => (
              <article id={chapter.id} key={chapter.id} className="flex flex-col lg:w-[min(72vw,850px)]">
                <div className="group grid w-full flex-1 min-h-[620px] overflow-hidden rounded-2xl border border-forest-950/10 bg-parchment-50/74 shadow-[0_24px_80px_rgba(19,74,0,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-warm lg:grid-rows-[320px_1fr]">
                  <div className="relative overflow-hidden">
                    <Image
                      src={chapter.image}
                      alt={localized(chapter.alt, locale)}
                      fill
                      loading="lazy"
                      className="object-cover transition duration-[1400ms] group-hover:scale-105"
                      sizes="(min-width: 1280px) 52vw, (min-width: 1024px) 72vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/72 via-forest-950/12 to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full border border-white/22 bg-forest-950/34 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ember backdrop-blur">
                      {localized(chapter.eyebrow, locale)}
                    </span>
                  </div>
                  <div className="flex flex-col p-6 sm:p-8">
                    <h2 className="font-serif text-4xl leading-[1.02] text-forest-950 sm:text-5xl">
                      {localized(chapter.title, locale)}
                    </h2>
                    <div className="mt-6 space-y-5 text-base leading-8 text-forest-950/68">
                      {localized(chapter.body, locale).map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center gap-2 pt-8 text-xs font-bold uppercase tracking-[0.16em] text-earth-600">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span className="h-px flex-1 bg-earth-600/20" />
                      <span>Wecacha field note</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
