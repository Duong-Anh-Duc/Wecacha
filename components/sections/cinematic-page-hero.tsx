import Image from "next/image";
import {ArrowDown, Sparkles} from "lucide-react";
import {Reveal} from "@/components/motion/reveal";
import {cn} from "@/lib/utils";

type CinematicPageHeroProps = {
  kicker: string;
  title: string;
  copy: string;
  image?: string;
  imageAlt: string;
  chips?: string[];
  fieldJournal?: string;
  scrollLabel?: string;
  align?: "left" | "center";
  className?: string;
  breadcrumbs?: React.ReactNode;
};

export function CinematicPageHero({
  kicker,
  title,
  copy,
  image = "/image1.jpeg",
  imageAlt,
  chips = [],
  fieldJournal = "Field journal",
  scrollLabel = "Scroll",
  align = "left",
  className,
  breadcrumbs
}: CinematicPageHeroProps) {
  return (
    <section
      className={cn(
        "relative min-h-[78vh] overflow-hidden bg-forest-950 px-4 pb-12 pt-24 text-white sm:px-6 sm:pt-32 lg:px-8 lg:pt-36 lg:pb-24",
        className
      )}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-cinema-overlay" />
      <div className="cinematic-vignette" />
      <div className="mist-layer" />
      <div className="light-leak" />

      <div className="relative z-10 mx-auto grid min-h-[calc(78vh-10rem)] max-w-7xl gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
        <Reveal
          className={cn(
            "max-w-4xl",
            align === "center" && "mx-auto text-center lg:col-span-2"
          )}
        >
          {breadcrumbs}
          <p className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ember">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {kicker}
          </p>
          <h1 className="text-balance font-serif text-4xl leading-[0.94] text-parchment-50 sm:text-6xl md:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:mt-7 sm:text-lg sm:leading-8">
            {copy}
          </p>
        </Reveal>

        {chips.length > 0 ? (
          <Reveal delay={0.14} className="hidden lg:block">
            <div className="cinematic-float rounded-md border border-white/18 bg-white/10 p-5 shadow-cinematic backdrop-blur-md">
              <p className="text-xs font-bold uppercase text-ember">
                {fieldJournal}
              </p>
              <div className="mt-5 grid gap-3">
                {chips.map((chip) => (
                  <div
                    key={chip}
                    className="rounded-md border border-white/12 bg-forest-950/34 px-4 py-3 font-serif text-2xl leading-tight text-parchment-50"
                  >
                    {chip}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-white/62 sm:flex">
        <span>{scrollLabel}</span>
        <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
      </div>
    </section>
  );
}
