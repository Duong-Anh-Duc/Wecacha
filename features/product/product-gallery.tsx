"use client";

import {useCallback} from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useTranslations} from "next-intl";
import {Button} from "@/components/ui/button";

export function ProductGallery({
  images,
  alt
}: {
  images: string[];
  alt: string;
}) {
  const t = useTranslations("Common");
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true});
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative overflow-hidden rounded-md bg-forest-950 shadow-cinematic">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div className="relative aspect-[4/5] min-w-0 flex-[0_0_100%]" key={image}>
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(min-width: 1024px) 52vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/56 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-5 right-5 flex gap-2">
        <Button size="icon" variant="outline" onClick={scrollPrev} aria-label={t("prevImage")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" onClick={scrollNext} aria-label={t("nextImage")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
