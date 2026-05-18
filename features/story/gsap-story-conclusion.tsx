"use client";

import {useEffect, useRef} from "react";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";
import {Link} from "@/i18n/navigation";
import {imageLibrary} from "@/lib/content";

export function GsapStoryConclusion({
  title,
  copy,
  kicker,
  locale
}: {
  title: string;
  copy: string;
  kicker: string;
  locale: string;
}) {
  const tStory = useTranslations("Story");
  const containerRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cleanup = () => {};

    async function setup() {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.to(imageRef.current, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });

        gsap.fromTo(
          textRef.current,
          {y: 50, opacity: 0},
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            duration: 1.2,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%"
            }
          }
        );
      }, containerRef);

      cleanup = () => ctx.revert();
    }

    setup();
    return () => cleanup();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-forest-950 px-4 py-24 text-center sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 z-0">
        <div ref={imageRef} className="absolute -inset-y-[20%] inset-x-0 h-[140%] w-full">
          <Image
            src={imageLibrary.coffeePour}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-forest-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-forest-950" />
      </div>

      <div ref={textRef} className="relative z-10 mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember">
          {kicker}
        </p>
        <h2 className="mt-6 font-serif text-5xl leading-[1.1] text-parchment-50 sm:text-7xl">
          {title}
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-white/70">
          {copy}
        </p>
        <div className="mt-12 flex justify-center">
          {/* <Button
            asChild
            variant="forest"
            size="lg"
            className="h-14 min-w-[200px] rounded-full text-base"
          >
            <Link href="/shop">{tStory("tasteCta")}</Link>
          </Button> */}
        </div>
      </div>
    </section>
  );
}
