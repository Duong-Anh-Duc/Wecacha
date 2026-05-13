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

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 38}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 1.1, ease: [0.16, 1, 0.3, 1]}}
          className="max-w-4xl"
        >
          <p className="mb-5 text-xs font-bold uppercase text-ember">
            {kicker}
          </p>
          <h1 className="text-balance font-serif text-5xl leading-[1.05] text-parchment-50 sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg sm:leading-8">
            {copy}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/shop">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {primary}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">
                <Play className="h-5 w-5" aria-hidden="true" />
                {secondary}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-xs uppercase text-white/56">
        <span>{scrollLabel}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/22">
          <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
