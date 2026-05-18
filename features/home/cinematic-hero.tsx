"use client";

import {motion, useScroll, useTransform} from "framer-motion";
import {ArrowDown, Play, ShoppingBag} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Link} from "@/i18n/navigation";
import {heroVideo, imageLibrary} from "@/lib/content";

type Props = {
  kicker: string;
  title: string;
  copy: string;
  primary: string;
  secondary: string;
  scrollLabel: string;
};

export function CinematicHero({
  kicker,
  title,
  copy,
  primary,
  secondary,
  scrollLabel
}: Props) {
  const {scrollY} = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 60]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.06]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-forest-950 text-white">
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{y, scale}}
      >
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={imageLibrary.heroPoster}
        >
          <source src={heroVideo} type="video/mp4" />
          <source src={heroVideo} type="video/quicktime" />
        </video>
      </motion.div>
      <div className="absolute inset-0 bg-cinema-overlay" />
      <div className="cinematic-vignette" />
      <div className="mist-layer" />
      <div className="light-leak" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col px-4 pb-28 pt-32 sm:px-6 sm:pt-40 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 38, filter: "blur(10px)"}}
          animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
          transition={{duration: 1.4, ease: [0.16, 1, 0.3, 1]}}
          className="my-auto max-w-4xl py-14 px-8 sm:px-14 rounded-[2.5rem] bg-forest-950/25 backdrop-blur-md border border-white/10 shadow-2xl"
        >
          <p className="mb-6 text-sm font-bold tracking-widest uppercase text-ember">
            {kicker}
          </p>
          <h1 className="text-balance font-serif text-5xl leading-[1.05] text-parchment-50 sm:text-7xl lg:text-[5.5rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg sm:leading-8">
            {copy}
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-base tracking-wide shadow-warm transition-transform hover:-translate-y-1">
              <Link href="/contact">
                <ShoppingBag className="h-5 w-5 mr-2" aria-hidden="true" />
                {primary}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-base tracking-wide border-white/30 hover:bg-white/10 hover:border-white transition-all hover:-translate-y-1">
              <Link href="/explore">
                <Play className="h-5 w-5 mr-2" aria-hidden="true" />
                {secondary}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-[80px] left-1/2 z-10 flex w-full max-w-[280px] -translate-x-1/2 flex-col items-center gap-3 text-center text-xs uppercase text-white/56">
        <span>{scrollLabel}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/22">
          <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
