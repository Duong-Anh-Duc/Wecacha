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
  items = []
}: {
  locale: Locale;
  tone?: "classic" | "green";
  section?: SiteSection | null;
  items?: SiteSectionItem[];
}) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const isGreen = tone === "green";

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

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-7 md:gap-8">
          {items.map((item, i) => (
            <Reveal key={item.item_key} delay={i * 0.12}>
              <div className="relative overflow-hidden rounded-[2.5rem] border border-parchment-100/20 p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-2 hover:border-ember/60 hover:shadow-[0_20px_40px_rgba(181,112,58,0.2)] group bg-black">
                
                {/* Product Background Image inside Card */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={item.media?.image ?? "/product-specialty.png"} 
                    alt={localizedField(item, "title", locale)} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    sizes="(max-width: 768px) 100vw, 50vw" 
                    quality={80} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1412]/95 via-[#1a1412]/70 to-[#1a1412]/30 group-hover:from-[#1a1412]/90 transition-colors duration-500" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10">
                  <span className="absolute right-0 top-0 rounded-full bg-ember px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    {localizedField(item, "label", locale)}
                  </span>

                  <div className="mb-8 pr-20">
                  <p className="text-xs font-bold uppercase tracking-widest text-ember">
                    {localizedField(item, "subtitle", locale)}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl text-parchment-50">
                    {localizedField(item, "title", locale)}
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/50">
                      {localizedValue(section?.settings?.profileLabel, locale, t("prodProfileLabel"))}
                    </p>
                    <p className="flex items-start gap-2 text-base leading-relaxed text-white/80">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-ember" aria-hidden="true" />
                      {localizedValue(item.data?.profile, locale, "")}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/50">
                      {localizedValue(section?.settings?.storyLabel, locale, t("prodStoryLabel"))}
                    </p>
                    <p className="text-base leading-relaxed text-white/70">
                      {localizedField(item, "body", locale)}
                    </p>
                  </div>
                </div>

                  <div className="mt-10">
                    <Link
                      href={localeHref(locale, section?.settings?.cta?.href ?? "/contact")}
                      className="inline-flex h-12 items-center gap-2 rounded-xl bg-ember px-8 text-sm font-semibold tracking-wide text-white transition hover:bg-ember/90 hover:scale-105"
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
