"use client";

import {useState} from "react";
import Image from "next/image";
import {MapPin, Play} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import type {Locale} from "@/i18n/routing";
import {
  exploreCards,
  heroVideo,
  imageLibrary,
  localized,
  mapLocations
} from "@/lib/content";
import {cn} from "@/lib/utils";

const reels = [
  {
    title: {vi: "Sương lướt qua nương", en: "Mist across the farm"},
    poster: imageLibrary.farm,
    src: heroVideo
  },
  {
    title: {vi: "Ánh lửa sau mùa hái", en: "Firelight after harvest"},
    poster: imageLibrary.campfire,
    src: "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4"
  }
];

export function ExploreExperience({
  locale,
  labels
}: {
  locale: Locale;
  labels: {
    gallery: string;
    reels: string;
    mapTitle: string;
    mapLabel: string;
  };
}) {
  const [selected, setSelected] = useState<(typeof exploreCards)[number] | null>(
    null
  );
  const [activeLocation, setActiveLocation] = useState(mapLocations[0].id);

  const active = mapLocations.find((location) => location.id === activeLocation);

  return (
    <div className="grid gap-20">
      <section>
        <h2 className="font-serif text-4xl text-forest-950">{labels.gallery}</h2>
        <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-4">
          {exploreCards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => setSelected(card)}
              className={cn(
                "mb-5 block w-full break-inside-avoid overflow-hidden rounded-md bg-forest-950 text-left text-white shadow-warm transition duration-500 hover:-translate-y-1 hover:shadow-cinematic",
                index % 2 === 0 ? "min-h-96" : "min-h-80"
              )}
            >
              <div className="relative h-72">
                <Image
                  src={card.image}
                  alt={localized(card.title, locale)}
                  fill
                  className="object-cover transition duration-[1400ms] hover:scale-[1.05]"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase text-ember">
                  {localized(card.topic, locale)}
                </p>
                <h3 className="mt-2 font-serif text-3xl leading-tight">
                  {localized(card.title, locale)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  {localized(card.body, locale)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-4xl text-forest-950">{labels.reels}</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {reels.map((reel) => (
            <div
              key={localized(reel.title, locale)}
              className="relative aspect-[9/13] overflow-hidden rounded-md bg-forest-950 shadow-cinematic sm:aspect-video"
            >
              <video
                className="h-full w-full object-cover"
                poster={reel.poster}
                muted
                loop
                playsInline
                controls
                preload="metadata"
              >
                <source src={reel.src} type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/72 via-transparent to-transparent" />
              <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-center gap-3 text-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/14 backdrop-blur">
                  <Play className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-serif text-3xl leading-tight">
                  {localized(reel.title, locale)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-forest-950 shadow-cinematic">
          <Image
            src={imageLibrary.mountains}
            alt=""
            fill
            className="object-cover opacity-[0.62]"
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,rgba(6,31,7,0.82))]" />
          <svg
            className="absolute inset-8 h-[calc(100%-4rem)] w-[calc(100%-4rem)] text-ember/42"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <path
              d="M15 72 C28 40 41 52 50 31 C58 13 76 23 85 44 C92 61 74 74 54 70 C39 67 29 84 15 72Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            />
          </svg>
          {mapLocations.map((location) => (
            <button
              key={location.id}
              className={cn(
                "absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/32 bg-white/14 text-white backdrop-blur transition",
                activeLocation === location.id && "scale-110 bg-earth-600"
              )}
              style={{left: `${location.x}%`, top: `${location.y}%`}}
              onMouseEnter={() => setActiveLocation(location.id)}
              onClick={() => setActiveLocation(location.id)}
              aria-label={localized(location.name, locale)}
            >
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </button>
          ))}
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-earth-600">{labels.mapLabel}</p>
          <h2 className="mt-3 font-serif text-5xl leading-tight text-forest-950">
            {labels.mapTitle}
          </h2>
          {active ? (
            <div className="mt-7 rounded-md border border-forest-950/10 bg-parchment-100 p-6 shadow-warm">
              <h3 className="font-serif text-3xl text-forest-950">
                {localized(active.name, locale)}
              </h3>
              <p className="mt-3 leading-7 text-forest-950/66">
                {localized(active.note, locale)}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent>
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>{localized(selected.title, locale)}</SheetTitle>
                <SheetDescription>
                  {localized(selected.topic, locale)}
                </SheetDescription>
              </SheetHeader>
              <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-md">
                <Image
                  src={selected.image}
                  alt={localized(selected.title, locale)}
                  fill
                  className="object-cover"
                  sizes="430px"
                />
              </div>
              <p className="mt-6 text-base leading-8 text-forest-950/70">
                {localized(selected.body, locale)}
              </p>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
