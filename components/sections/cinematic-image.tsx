import Image from "next/image";
import {cn} from "@/lib/utils";

type CinematicImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function CinematicImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw"
}: CinematicImageProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-md bg-forest-950 shadow-cinematic",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition duration-[1600ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/48 via-transparent to-earth-700/12" />
      <div className="light-leak opacity-50" />
    </div>
  );
}
