"use client";

import {useEffect, useRef} from "react";
import Image from "next/image";
import {imageLibrary} from "@/lib/content";

export function GsapRoastSequence({
  title,
  copy,
  kicker
}: {
  title: string;
  copy: string;
  kicker: string;
}) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let cleanup = () => {};

    async function setup() {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".roast-frame",
          {scale: 0.92, opacity: 0.55},
          {
            scale: 1,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top 70%",
              end: "bottom 40%",
              scrub: 0.8
            }
          }
        );
      }, rootRef);

      cleanup = () => ctx.revert();
    }

    setup();
    return () => cleanup();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-forest-950 px-4 py-24 text-white sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 opacity-70">
        <Image
          src={imageLibrary.roasted}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-forest-950/78" />
      </div>
      <div className="roast-frame relative mx-auto max-w-5xl rounded-md border border-white/14 bg-white/8 p-8 backdrop-blur-sm sm:p-12">
        <p className="text-xs font-bold uppercase text-ember">{kicker}</p>
        <h2 className="mt-4 font-serif text-5xl leading-tight text-parchment-50 sm:text-6xl">
          {title}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{copy}</p>
      </div>
    </section>
  );
}
