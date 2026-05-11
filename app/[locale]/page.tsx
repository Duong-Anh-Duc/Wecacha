import Image from "next/image";
import {ArrowUpRight, Flame, Leaf, MapPinned} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {CinematicImage} from "@/components/sections/cinematic-image";
import {SectionHeading} from "@/components/sections/section-heading";
import {ProductCard} from "@/components/shop/product-card";
import {Button} from "@/components/ui/button";
import {Reveal} from "@/components/motion/reveal";
import {CinematicHero} from "@/features/home/cinematic-hero";
import {JourneyCards} from "@/features/home/journey-cards";
import {TestimonialsCarousel} from "@/features/home/testimonials-carousel";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {
  imageLibrary,
  journeys,
  localized,
  products,
  storyChapters
} from "@/lib/content";

type Props = {
  params: Promise<{locale: Locale}>;
};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Home"});
  const common = await getTranslations({locale, namespace: "Common"});
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <main>
      <CinematicHero
        kicker={t("kicker")}
        title={t("heroTitle")}
        copy={t("heroCopy")}
        primary={common("ctaShop")}
        secondary={common("ctaStory")}
        scrollLabel={t("scroll")}
      />

      <section className="relative overflow-hidden bg-parchment-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Background image — right half only */}
        <div className="absolute inset-y-0 right-0 w-1/2">
          <Image src="/image1.jpeg" alt="" fill className="object-cover" sizes="50vw" quality={80} />
          <div className="absolute inset-0 bg-parchment-50/60" />
        </div>
        {/* Botanical decoration */}
        <div className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 select-none opacity-[0.07]" aria-hidden="true">
          <svg width="240" height="520" viewBox="0 0 240 520" fill="none">
            <path d="M120 510 Q90 420 75 320 Q55 200 100 110 Q115 75 120 10" stroke="#3d5a1e" strokeWidth="1.5" fill="none"/>
            <ellipse cx="85" cy="210" rx="65" ry="28" transform="rotate(-35 85 210)" fill="#3d5a1e"/>
            <ellipse cx="100" cy="320" rx="72" ry="26" transform="rotate(22 100 320)" fill="#3d5a1e"/>
            <ellipse cx="72" cy="155" rx="48" ry="20" transform="rotate(-55 72 155)" fill="#3d5a1e"/>
            <ellipse cx="108" cy="400" rx="60" ry="22" transform="rotate(38 108 400)" fill="#3d5a1e"/>
            <ellipse cx="65" cy="270" rx="52" ry="18" transform="rotate(-18 65 270)" fill="#3d5a1e"/>
            <ellipse cx="95" cy="90" rx="38" ry="15" transform="rotate(-70 95 90)" fill="#3d5a1e"/>
          </svg>
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              kicker={t("originKicker")}
              title={t("storyTitle")}
              copy={t("storyCopy")}
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {icon: Leaf, label: t("statAltValue"), value: t("statAltLabel")},
                {icon: Flame, label: t("statRoastValue"), value: t("statRoastLabel")},
                {icon: MapPinned, label: t("statOriginValue"), value: t("statOriginLabel")}
              ].map((item) => (
                <div key={item.label} className="border-t border-forest-950/14 pt-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-earth-600/10">
                    <item.icon className="h-5 w-5 text-earth-600" aria-hidden="true" />
                  </div>
                  <p className="mt-4 font-serif text-2xl leading-tight">{item.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-forest-950/48">{item.value}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Arch image */}
          <Reveal delay={0.15} className="flex justify-center lg:justify-end">
            <div
              className="relative w-full max-w-[400px] overflow-hidden shadow-cinematic"
              style={{aspectRatio: "3/4", borderRadius: "9999px 9999px 20px 20px"}}
            >
              <Image
                src="/image2.jpeg"
                alt={t("farmerAlt")}
                fill
                quality={95}
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-forest-950 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 opacity-45">
          <CinematicImage
            src="/image3.jpeg"
            alt=""
            className="h-full rounded-none shadow-none"
            sizes="100vw"
          />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <Reveal>
            <SectionHeading
              light
              kicker={t("cultureKicker")}
              title={t("cultureTitle")}
              copy={t("cultureCopy")}
            />
          </Reveal>
          <Reveal delay={0.15}>
            <blockquote className="border-y border-white/14 py-8 font-serif text-3xl leading-tight text-parchment-50">
              {localized(storyChapters[2].body, locale)[0]}
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="bg-forest-900 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <SectionHeading
                light
                kicker={t("shopSectionKicker")}
                title={t("productsTitle")}
              />
            </Reveal>
            <Button asChild variant="outline">
              <Link href="/shop">
                {common("viewAll")}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              kicker={t("journeysKicker")}
              title={t("journeysTitle")}
              align="center"
            />
          </Reveal>
          <div className="mt-12">
            <JourneyCards locale={locale} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-forest-900 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0">
          <Image src="/image5.jpeg" alt="" fill className="object-cover" sizes="100vw" quality={80} />
          <div className="absolute inset-0 bg-forest-950/70" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              light
              kicker={t("testimonialsKicker")}
              title={t("testimonialsTitle")}
              align="center"
            />
          </Reveal>
          <div className="mt-10">
            <TestimonialsCarousel locale={locale} />
          </div>
        </div>
      </section>
    </main>
  );
}
