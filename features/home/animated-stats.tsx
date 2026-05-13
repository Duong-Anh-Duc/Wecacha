"use client";

import {useEffect, useRef, useState} from "react";
import {Flame, Leaf, UsersRound} from "lucide-react";
import {motion, useInView, useMotionValue, useSpring} from "framer-motion";
import {cn} from "@/lib/utils";

type Stat = {
  icon?: "leaf" | "users" | "flame";
  value: number;
  suffix?: string;
  label: string;
  caption: string;
};

const statIcons = {
  leaf: Leaf,
  users: UsersRound,
  flame: Flame
};

function CountNumber({value, suffix = ""}: {value: number; suffix?: string}) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 28,
    stiffness: 90
  });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  return (
    <span>
      {display.toLocaleString("vi-VN")}
      {suffix}
    </span>
  );
}

export function AnimatedStats({
  stats,
  className
}: {
  stats: Stat[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {once: true, margin: "-80px"});

  return (
    <div
      ref={ref}
      className={cn(
        "grid overflow-hidden rounded-md border border-forest-950/10 bg-parchment-100/78 shadow-warm sm:grid-cols-3",
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          stat={stat}
          index={index}
          isInView={isInView}
        />
      ))}
    </div>
  );
}

function StatCard({
  stat,
  index,
  isInView
}: {
  stat: Stat;
  index: number;
  isInView: boolean;
}) {
  const Icon = stat.icon ? statIcons[stat.icon] : null;

  return (
    <motion.div
      initial={{opacity: 0, y: 18}}
      animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 18}}
      transition={{duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1]}}
      className="overflow-hidden border-forest-950/10 p-5 sm:border-l sm:p-6 first:sm:border-l-0"
    >
      <div className="mb-5 flex h-12 items-center">
        {Icon ? (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-earth-600/10 text-earth-700 ring-1 ring-earth-700/18">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="max-w-full font-serif text-[clamp(2rem,2.6vw,3rem)] leading-[0.95] text-earth-700">
        {isInView ? <CountNumber value={stat.value} suffix={stat.suffix} /> : "0"}
      </p>
      <p className="mt-3 text-sm font-bold uppercase tracking-[0.12em] text-forest-950">
        {stat.label}
      </p>
      <p className="mt-2 text-sm leading-6 text-forest-950/58">{stat.caption}</p>
    </motion.div>
  );
}
