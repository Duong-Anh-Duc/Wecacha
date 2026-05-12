"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {ArrowDownRight, ArrowUpRight, MapPin} from "lucide-react";
import {motion, useScroll, useTransform} from "framer-motion";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {localized, products} from "@/lib/content";
import {cn} from "@/lib/utils";

export function ProductJourneyCarousel({locale}: {locale: Locale}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const {scrollYProgress} = useScroll({
    target: rootRef,
    offset: ["start start", "end end"]
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-48%"]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setActiveIndex(
        Math.min(products.length - 1, Math.round(latest * (products.length - 1)))
      );
    });
  }, [scrollYProgress]);

  return (
    <section
      ref={rootRef}
      className="relative border-y border-forest-950/10 bg-forest-950 px-4 py-20 text-white sm:px-6 lg:h-[300vh] lg:px-8 lg:py-0"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(181,101,0,0.2),transparent_28%),radial-gradient(circle_at_80%_76%,rgba(65,122,0,0.22),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:sticky lg:top-0 lg:h-screen lg:grid-cols-[0.52fr_1.48fr] lg:items-center lg:overflow-hidden">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ember">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {locale === "vi" ? "Từ câu chuyện đến từng sản phẩm" : "From story to each product"}
          </p>
          <h2 className="mt-5 font-serif text-5xl leading-[0.98] text-parchment-50 sm:text-6xl">
            {locale === "vi"
              ? "Mỗi túi cà phê có một đường đi riêng"
              : "Every bag has its own route"}
          </h2>
          <p className="mt-6 max-w-md leading-8 text-white/64">
            {locale === "vi"
              ? "Cuộn xuống để dải sản phẩm trượt ngang qua bốn hành trình, từ nương đến tách uống."
              : "Scroll down and the product strip glides through four routes, from farm to cup."}
          </p>
          <div className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <span className="h-px w-20 bg-white/18" />
            <span>{locale === "vi" ? "Đang trượt" : "Gliding"}</span>
            <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>

        <div className="min-w-0 overflow-visible lg:overflow-hidden">
          <motion.div
            style={{x}}
            className="grid gap-5 lg:flex lg:w-max lg:gap-6 lg:will-change-transform"
          >
            {products.map((product, index) => (
              <div key={product.slug} className="lg:w-[min(34vw,420px)]">
                <Link
                  href={`/shop/${product.slug}`}
                  className={cn(
                    "group flex h-full min-h-[560px] flex-col overflow-hidden rounded-2xl border bg-white/[0.06] shadow-cinematic transition duration-500 hover:-translate-y-2 hover:bg-white/[0.09]",
                    index === activeIndex ? "border-ember/45" : "border-white/10"
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={localized(product.name, locale)}
                      fill
                      loading="lazy"
                      className="object-cover transition duration-[1400ms] group-hover:scale-110"
                      sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 38vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/18 bg-forest-950/48 px-3 py-1 text-xs font-bold uppercase text-ember backdrop-blur">
                      {localized(product.origin, locale)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-3xl leading-tight text-parchment-50">
                      {localized(product.name, locale)}
                    </h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-white/62">
                      {localized(product.journey, locale)[0].body}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-sm font-bold text-ember">
                      <span>
                        {locale === "vi" ? "Xem hành trình" : "View journey"}
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
