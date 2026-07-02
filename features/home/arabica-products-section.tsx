import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";
import Image from "next/image";
import type { Locale } from "@/i18n/routing";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  localizedField,
  localizedValue,
  type SiteSection,
  type SiteSectionItem
} from "@/lib/content/cms";
import {localized} from "@/lib/content/helpers";
import type {Product} from "@/lib/content/types";

const localeHref = (locale: Locale, href: string) => {
  if (href.startsWith("http")) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href;
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
};

export async function ArabicaProductsSection({
  locale,
  tone = "classic",
  section,
  items = [],
  products = []
}: {
  locale: Locale;
  tone?: "classic" | "green";
  section?: SiteSection | null;
  items?: SiteSectionItem[];
  products?: Product[];
}) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const isGreen = tone === "green";
  const homeProducts = (products.some((product) => product.featured)
    ? products.filter((product) => product.featured)
    : products
  ).slice(0, 4);
  const productCards = homeProducts.map((product) => {
    const productName = localized(product.name, locale);
    return {
      key: product.slug,
      title: productName,
      subtitle: localized(product.origin, locale) || product.weight,
      label: product.baseUnit || product.weight,
      profile: localized(product.notes, locale).join(", ") || localized(product.short, locale),
      body: localized(product.description, locale),
      image: product.images[0] ?? "/product-specialty.png",
      href: `/shop/${product.slug}`
    };
  });
  const cmsCards = items.map((item) => ({
    key: item.item_key,
    title: localizedField(item, "title", locale),
    subtitle: localizedField(item, "subtitle", locale),
    label: localizedField(item, "label", locale),
    profile: localizedValue(item.data?.profile, locale, ""),
    body: localizedField(item, "body", locale),
    image: item.media?.image ?? "/product-specialty.png",
    href: section?.settings?.cta?.href ?? "/contact"
  }));
  const cards = productCards.length > 0 ? productCards : cmsCards;

  return (
    <section
      className={cn(
        "relative overflow-hidden px-4 py-24 text-white sm:px-6 lg:px-8 lg:py-32",
        isGreen ? "bg-brand-green" : "bg-forest-950"
      )}
    >
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={section?.media?.background ?? "/premium-coffee-bg.png"} 
          alt="" 
          fill 
          className="object-cover opacity-30 mix-blend-luminosity" 
          sizes="100vw" 
          quality={80} 
        />
        <div
          className={cn(
            "absolute inset-0",
            isGreen
              ? "bg-gradient-to-b from-brand-green/80 via-brand-green/60 to-brand-green/95"
              : "bg-gradient-to-b from-forest-950/80 via-forest-950/60 to-forest-950/95"
          )}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            light
            kicker={localizedField(section, "eyebrow", locale) || t("productsKicker")}
            title={localizedField(section, "title", locale) || t("productsTitle2")}
            copy={localizedField(section, "copy", locale) || t("productsCopy")}
            className="mb-16"
          />
        </Reveal>

        <div
          className={cn(
            "grid items-stretch gap-6 sm:grid-cols-2 sm:gap-7 md:gap-8",
            cards.length <= 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          )}
        >
          {cards.map((item, i) => (
            <Reveal key={item.key} delay={i * 0.12} className="h-full">
              <div className="group relative flex h-full min-h-[600px] overflow-hidden rounded-[2.5rem] border border-parchment-100/20 bg-black p-6 shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-2 hover:border-ember/60 hover:shadow-[0_20px_40px_rgba(181,112,58,0.2)]">
                
                {/* Product Background Image inside Card */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={item.image} 
                    alt="" 
                    fill 
                    aria-hidden="true"
                    className="scale-110 object-cover opacity-55 blur-xl transition-transform duration-700 group-hover:scale-[1.14]"
                    sizes="(max-width: 768px) 100vw, 50vw" 
                    quality={80} 
                  />
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
                    sizes="(max-width: 768px) 100vw, 50vw" 
                    quality={80} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1412]/82 via-[#1a1412]/22 to-[#1a1412]/10 group-hover:from-[#1a1412]/76 transition-colors duration-500" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 flex w-full flex-col">
                  <span className="absolute right-0 top-0 rounded-full bg-ember px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    {item.label}
                  </span>

                  <div className="pr-14 drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
                  <p className="text-xs font-bold uppercase tracking-widest text-ember">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight text-parchment-50">
                    {item.title}
                  </h3>
                </div>

                <div className="mt-auto space-y-4 rounded-2xl border border-white/10 bg-[#120f0c]/54 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/50">
                      {localizedValue(section?.settings?.profileLabel, locale, t("prodProfileLabel"))}
                    </p>
                    <p className="line-clamp-2 flex items-start gap-2 text-sm leading-relaxed text-white/86">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden="true" />
                      {item.profile}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/50">
                      {localizedValue(section?.settings?.storyLabel, locale, t("prodStoryLabel"))}
                    </p>
                    <p className="line-clamp-3 text-sm leading-relaxed text-white/74">
                      {item.body}
                    </p>
                  </div>
                </div>

                  <div className="pt-4">
                    <Link
                      href={localeHref(locale, item.href)}
                      className="inline-flex h-12 items-center gap-2 rounded-xl bg-ember px-8 text-sm font-semibold tracking-wide text-white shadow-[0_14px_34px_rgba(181,112,58,0.32)] transition hover:bg-ember/90 hover:scale-105"
                    >
                      {localizedValue(section?.settings?.cta, locale, t("prodCta"))}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
