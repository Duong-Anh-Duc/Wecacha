import Image from "next/image";
import {ArrowUpRight, Flame, Leaf, ShieldCheck, Truck} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {CinematicImage} from "@/components/sections/cinematic-image";
import {SectionHeading} from "@/components/sections/section-heading";
import {ProductCard} from "@/components/shop/product-card";
import {Button} from "@/components/ui/button";
import {Reveal} from "@/components/motion/reveal";
import {CinematicHero} from "@/features/home/cinematic-hero";
import {RecentPurchasesMarquee} from "@/features/home/recent-purchases-marquee";
import {AnimatedStats} from "@/features/home/animated-stats";
import {JourneyCards} from "@/features/home/journey-cards";
import {TestimonialsCarousel} from "@/features/home/testimonials-carousel";
import {Link} from "@/i18n/navigation";
import type {Metadata} from "next";
import type {Locale} from "@/i18n/routing";
import {
  localized,
  products,
  storyChapters
} from "@/lib/content";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const isVi = locale === "vi";
  const title = isVi
    ? "Wecacha · Cà Phê Sơn La Rang Chậm Thủ Công"
    : "Wecacha · Handcrafted Slow Roast Son La Coffee";
  const description = isVi
    ? "Cà phê Sơn La rang thủ công, sinh trưởng giữa sương núi Tây Bắc 1.050m. Arabica nguyên chất, phin núi rừng và bộ quà thổ cẩm độc đáo. Giao hàng toàn quốc."
    : "Handcrafted Son La coffee from Vietnam's northwest highlands at 1,050m. Pure arabica, forest phin blends and unique brocade gift sets. Nationwide delivery.";
  const keywords = isVi
    ? "cà phê Sơn La, Wecacha, cà phê arabica Tây Bắc, cà phê rang thủ công, cà phê Mộc Châu, mua cà phê online Việt Nam"
    : "Son La coffee, Wecacha, arabica northwest Vietnam, slow roast coffee, Moc Chau coffee, buy Vietnamese coffee";

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        vi: "/vi",
        en: "/en",
        "x-default": "/vi"
      }
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: "Sơn La Coffee",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      type: "website",
      images: [
        {
          url: `/og/home.jpg`,
          width: 1200,
          height: 630,
          alt: isVi ? "Wecacha · Cà Phê Sơn La" : "Wecacha · Son La Coffee"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

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

      <RecentPurchasesMarquee />

      <section className="relative overflow-hidden bg-parchment-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Background image — right half only */}
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
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
            <AnimatedStats
              className="mt-9"
              stats={[
                {
                  icon: "leaf",
                  value: 1050,
                  suffix: "m+",
                  label: t("statAltLabel"),
                  caption: t("statAltCaption")
                },
                {
                  icon: "users",
                  value: 120,
                  suffix: "+",
                  label: t("statFarmersLabel"),
                  caption: t("statFarmersCaption")
                },
                {
                  icon: "flame",
                  value: 48,
                  suffix: "h+",
                  label: t("statRoastValue"),
                  caption: t("statRoastCaption")
                }
              ]}
            />
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
          <div className="group/promises relative mt-8 grid overflow-hidden rounded-2xl border border-white/10 bg-forest-950/48 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
            <span
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 animate-soft-sweep bg-gradient-to-r from-transparent via-parchment-50/16 to-transparent blur-sm"
              aria-hidden="true"
            />
            {[
              {
                icon: Leaf,
                title: t("promise1Title"),
                copy: t("promise1Copy")
              },
              {
                icon: Flame,
                title: t("promise2Title"),
                copy: t("promise2Copy")
              },
              {
                icon: Truck,
                title: t("promise3Title"),
                copy: t("promise3Copy")
              },
              {
                icon: ShieldCheck,
                title: t("promise4Title"),
                copy: t("promise4Copy")
              }
            ].map(({icon: Icon, title, copy}, index) => (
              <div key={title} className="group/promise relative flex items-center gap-4 rounded-xl p-3 transition duration-300 hover:bg-white/6">
                <span
                  className="pointer-events-none absolute inset-0 animate-small-sweep rounded-xl bg-gradient-to-r from-transparent via-white/8 to-transparent"
                  style={{animationDelay: `${index * 0.7}s`}}
                  aria-hidden="true"
                />
                <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 bg-forest-800/42 text-ember transition duration-300 group-hover/promise:scale-110 group-hover/promise:bg-ember/12 group-hover/promise:shadow-[0_0_28px_rgba(243,167,52,0.22)]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="relative">
                  <span className="block text-sm font-black uppercase tracking-[0.04em] text-parchment-50">
                    {title}
                  </span>
                  <span className="mt-1 block text-xs font-medium text-ember/84">
                    {copy}
                  </span>
                </span>
              </div>
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
    </main>
  );
}
