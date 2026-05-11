"use client";

import {motion, type HTMLMotionProps} from "framer-motion";
import {cn} from "@/lib/utils";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function Reveal({children, className, delay = 0, ...props}: RevealProps) {
  return (
    <motion.div
      initial={{opacity: 0, y: 34}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: "-80px"}}
      transition={{duration: 0.85, delay, ease: [0.16, 1, 0.3, 1]}}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
