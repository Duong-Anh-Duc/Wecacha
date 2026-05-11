"use client";

import {useRef} from "react";
import Image from "next/image";
import {motion, useScroll, useTransform} from "framer-motion";

type Props = {
  image1: string;
  alt1: string;
  image2: string;
  alt2: string;
};

export function HomeImagePair({image1, alt1, image2, alt2}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 60]);

  return (
    <div ref={ref} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <motion.div
        style={{y: y1}}
        className="group relative aspect-[4/5] overflow-hidden rounded-md shadow-cinematic"
      >
        <Image
          src={image1}
          alt={alt1}
          fill
          quality={95}
          className="object-cover transition duration-[1600ms] ease-out group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
      </motion.div>

      <motion.div
        style={{y: y2}}
        className="group relative aspect-[4/5] overflow-hidden rounded-md shadow-cinematic"
      >
        <Image
          src={image2}
          alt={alt2}
          fill
          quality={95}
          className="object-cover transition duration-[1600ms] ease-out group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
      </motion.div>
    </div>
  );
}
