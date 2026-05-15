import Image from "next/image";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {TestimonialsCarousel} from "@/features/home/testimonials-carousel";
import type {Locale} from "@/i18n/routing";

export async function TestimonialsSection({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "Home"});

  return (
    <section className="relative overflow-hidden pt-32 pb-48 lg:pb-64 bg-forest-900">
      <div className="absolute inset-0 z-0">
        <Image src="/image5.jpeg" alt="" fill className="object-cover object-[center_30%]" sizes="100vw" quality={80} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a140c]/90 via-[#142918]/80 to-[#142918]/90" />
      </div>

      {/* Curved Bottom SVG Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
        <svg className="relative block w-full h-[80px] md:h-[150px] lg:h-[200px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C73.83,39.95,152.88,59.2,228.61,64.84,259.93,67.16,290.9,62.06,321.39,56.44Z" fill="#fcfbfa"></path>
        </svg>
      </div>

      <div className="relative z-20 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="flex flex-col items-center gap-1 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#b5703a]">
                <path d="M12 2C12 2 12 10 18 10C24 10 24 2 24 2C24 2 16 2 12 2Z" fill="currentColor"/>
                <path d="M12 2C12 2 12 10 6 10C0 10 0 2 0 2C0 2 8 2 12 2Z" fill="currentColor"/>
                <path d="M12 22V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b5703a]">
                {t("testimonialsKicker")}
              </span>
            </div>
            <h2 className="font-serif text-5xl md:text-[4rem] text-[#fcfbfa]">
              {t("testimonialsTitle")}
            </h2>
            <div className="w-8 h-[1px] bg-[#b5703a] mt-6" />
          </div>
        </Reveal>

        <div className="mt-12">
          <TestimonialsCarousel locale={locale} />
        </div>
      </div>
    </section>
  );
}
