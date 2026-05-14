"use client";

import {useState, useCallback, useEffect} from "react";
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <div className="flex flex-col gap-4 sticky top-28 z-10">
      {/* Main Image */}
      <div className="relative aspect-[4/4.5] overflow-hidden rounded-[24px] bg-[#f8f9f6]">
        <Image
          src={images[selectedIndex] || images[0]}
          alt={`${alt} ${selectedIndex + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 52vw, 100vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="relative flex items-center gap-2">
          <button
            onClick={scrollPrev}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#142918]/10 bg-white text-[#142918]/70 hover:text-[#142918] hover:bg-[#f8f9f6] transition-colors"
            aria-label={tCommon("prevImage")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3">
              {images.map((image, index) => (
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
          
          <button
            onClick={scrollNext}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#142918]/10 bg-white text-[#142918]/70 hover:text-[#142918] hover:bg-[#f8f9f6] transition-colors"
            aria-label={tCommon("nextImage")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
