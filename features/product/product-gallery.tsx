"use client";

import {useState, useCallback} from "react";
import {useTranslations} from "next-intl";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {cn} from "@/lib/utils";

export function ProductGallery({
  images,
  alt
}: {
  images: string[];
  alt: string;
}) {
  const tCommon = useTranslations("Common");
  const safeImages = images.length ? images : ["/image.png"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    const nextIndex = selectedIndex === 0 ? safeImages.length - 1 : selectedIndex - 1;
    setSelectedIndex(nextIndex);
    if (emblaApi) emblaApi.scrollTo(nextIndex);
  }, [emblaApi, safeImages.length, selectedIndex]);

  const scrollNext = useCallback(() => {
    const nextIndex = selectedIndex === safeImages.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(nextIndex);
    if (emblaApi) emblaApi.scrollTo(nextIndex);
  }, [emblaApi, safeImages.length, selectedIndex]);

  const onThumbClick = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative mx-auto aspect-[2/3] w-full max-w-[calc((100vh-9rem)*0.6667)] overflow-hidden rounded-[24px] bg-[#f8f9f6]">
        <Image
          src={safeImages[selectedIndex] || safeImages[0]}
          alt=""
          fill
          aria-hidden="true"
          className="object-cover opacity-20 blur-2xl scale-110"
          sizes="(min-width: 1024px) 52vw, 100vw"
        />
        <Image
          src={safeImages[selectedIndex] || safeImages[0]}
          alt={`${alt} ${selectedIndex + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 52vw, 100vw"
        />
        {safeImages.length > 1 ? (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/86 text-[#142918] shadow-[0_10px_30px_rgba(20,41,24,0.18)] backdrop-blur transition hover:bg-white"
              aria-label={tCommon("prevImage")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/86 text-[#142918] shadow-[0_10px_30px_rgba(20,41,24,0.18)] backdrop-blur transition hover:bg-white"
              aria-label={tCommon("nextImage")}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3">
              {safeImages.map((image, index) => (
                <button
                  key={image}
                  onClick={() => onThumbClick(index)}
                  className={cn(
                    "relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                    selectedIndex === index
                      ? "border-[#a46131] opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
