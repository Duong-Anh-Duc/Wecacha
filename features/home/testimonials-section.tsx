import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {TestimonialsCarousel} from "@/features/home/testimonials-carousel";
import type {Locale} from "@/i18n/routing";

export async function TestimonialsSection({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "Home"});

  return (
    <section className="relative overflow-hidden pt-24 pb-32 lg:pb-40 bg-parchment-50">
      <div className="absolute inset-0 z-0 opacity-15">
        <Image src="/image5.jpeg" alt="" fill className="object-cover object-[center_30%] grayscale" sizes="100vw" quality={80} />
        <div className="absolute inset-0 bg-gradient-to-b from-parchment-50/50 to-parchment-50/90" />
      </div>

      <div className="relative z-20 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="flex flex-col items-center gap-2 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-ember">
                <path d="M12 2C12 2 12 10 18 10C24 10 24 2 24 2C24 2 16 2 12 2Z" fill="currentColor"/>
                <path d="M12 2C12 2 12 10 6 10C0 10 0 2 0 2C0 2 8 2 12 2Z" fill="currentColor"/>
                <path d="M12 22V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest text-ember">
                {t("testimonialsKicker")}
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-6xl text-forest-950">
              {t("testimonialsTitle")}
            </h2>
            <div className="w-12 h-1 bg-ember mt-8 rounded-full" />
          </div>
        </Reveal>

        <div className="mt-12">
          <TestimonialsCarousel locale={locale} />
        </div>
      </div>
    </section>
  );
}
