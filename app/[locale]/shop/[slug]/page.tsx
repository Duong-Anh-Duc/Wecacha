import Image from "next/image";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ArrowDownRight, MapPinned} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {JsonLd} from "@/components/seo/json-ld";
import {SectionHeading} from "@/components/sections/section-heading";
import {ProductCard} from "@/components/shop/product-card";
import {Badge} from "@/components/ui/badge";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {ProductBuyPanel} from "@/features/product/product-buy-panel";
import {ProductGallery} from "@/features/product/product-gallery";
import type {Locale} from "@/i18n/routing";
import {
  getProductBySlug,
  getRelatedProducts,
  localized,
  products
} from "@/lib/content";
import {productJsonLd} from "@/lib/seo";

type Props = {
  params: Promise<{locale: Locale; slug: string}>;
};

export function generateStaticParams() {
  return products.map((product) => ({slug: product.slug}));
}

const ogImageMap: Record<string, string> = {
  "/sp1.jpeg": "/og/sp1.jpg",
  "/sp2.jpeg": "/og/sp2.jpg",
  "/gift_box_brocade.png": "/og/gift.jpg",
  "/image5.jpeg": "/og/sp4.jpg"
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

  const ogImage = ogImageMap[product.images[0]] ?? product.images[0];

  return {
    title: localized(product.name, locale),
    description: localized(product.description, locale),
    alternates: {
      canonical: `/${locale}/shop/${slug}`,
      languages: {
        vi: `/vi/shop/${slug}`,
        en: `/en/shop/${slug}`,
        "x-default": `/vi/shop/${slug}`
      }
    },
    openGraph: {
      title: localized(product.name, locale),
      description: localized(product.description, locale),
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: localized(product.name, locale)
        }
      ]
    }
  };
}

export default async function ProductDetailPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: "Product"});
  const tShop = await getTranslations({locale, namespace: "Shop"});
  const tNav = await getTranslations({locale, namespace: "Nav"});
  const related = getRelatedProducts(product.slug);

  return (
    <main className="bg-parchment-50">
      <JsonLd data={productJsonLd(product, locale)} />
      <section className="px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs 
            homeLabel={tNav("home")}
            items={[
              { label: tShop("title"), href: "/shop" },
              { label: localized(product.name, locale) }
            ]} 
          />
        </div>
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.12fr_0.88fr] mt-2">
          <Reveal>
            <ProductGallery
              images={product.images}
              alt={localized(product.name, locale)}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ProductBuyPanel product={product} />
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-parchment-50">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col lg:flex-row bg-[#fdfcf8] rounded-[32px] border border-[#142918]/[0.06] shadow-[0_8px_30px_rgba(20,41,24,0.03)] relative overflow-hidden min-h-[500px]">
              <div className="flex-1 z-10 p-8 lg:p-16 lg:pr-8 flex flex-col justify-center">
                <h2 className="font-serif text-3xl lg:text-[42px] leading-[1.15] text-[#142918] mb-12 max-w-md">
                  {t("whyLoveTitle", {name: localized(product.name, locale)})}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pr-4">
                  <div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#f0e6d6] text-[#6b4c2a] mb-5">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 0 1 8 0"/><path d="M12 8v8"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>
                    </div>
                    <h3 className="font-bold text-[16px] text-[#142918] mb-2">{t("boldFlavorTitle")}</h3>
                    <p className="text-[13px] text-[#142918]/70 leading-relaxed">{t("boldFlavorCopy")}</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#f0e6d6] text-[#6b4c2a] mb-5">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                    </div>
                    <h3 className="font-bold text-[16px] text-[#142918] mb-2">{t("naturalAromaTitle")}</h3>
                    <p className="text-[13px] text-[#142918]/70 leading-relaxed">{t("naturalAromaCopy")}</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#f0e6d6] text-[#6b4c2a] mb-5">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                    </div>
                    <h3 className="font-bold text-[16px] text-[#142918] mb-2">{t("perfectPhinTitle")}</h3>
                    <p className="text-[13px] text-[#142918]/70 leading-relaxed">{t("perfectPhinCopy")}</p>
                  </div>
                </div>
              </div>
              <div className="relative flex-1 min-h-[280px] lg:min-h-[520px]">
                <Image
                  src="/son_la_bg.png"
                  alt="Coffee berries"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
                {/* Mobile top fade */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#fdfcf8] to-transparent z-10 lg:hidden" />
                {/* Desktop left fade */}
                <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#fdfcf8] to-transparent z-10" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 bg-parchment-50">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-8">
          <Reveal>
            <div className="bg-[#fcfbfa] rounded-[24px] p-8 lg:p-10 border border-[#142918]/[0.06]">
              <h3 className="font-bold text-lg text-[#142918] mb-8">{t("infoHeading")}</h3>
              <div className="flex flex-col gap-5">
                {[
                  {label: t("origin"), value: localized(product.origin, locale)},
                  {label: t("altitude"), value: product.altitude},
                  {label: t("roast"), value: localized(product.roast, locale)},
                  {label: t("ingredient"), value: "100% Arabica"},
                  {label: t("notes"), value: localized(product.notes, locale).join(", ")},
                  {label: t("weight"), value: product.weight},
                  {label: t("expiry"), value: t("expiryValue")},
                  {label: t("storage"), value: t("storageValue")}
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4 items-start border-b border-[#142918]/[0.06] pb-5 last:border-0 last:pb-0">
                    <span className="font-bold text-[13px] text-[#142918]">{item.label}</span>
                    <span className="text-[14px] text-[#142918]/80 leading-relaxed">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-[#f8f6f0] rounded-[24px] p-8 lg:p-10 border border-[#142918]/[0.04]">
              <h3 className="font-bold text-lg text-[#142918] mb-8">{t("brew")}</h3>
              <ol className="flex flex-col gap-6 relative">
                {localized(product.brewGuide, locale).map((step, index) => (
                  <li className="flex gap-5 items-start relative z-10" key={index}>
                    <div className="w-8 h-8 rounded-full bg-[#e8e0d5] text-[#142918] flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <span className="pt-1.5 text-[14px] text-[#142918]/80 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
              
              <div className="mt-10 pt-8 border-t border-[#142918]/10 grid grid-cols-2 gap-4">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#142918]/10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a46131]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-[11px] text-[#142918]">{t("brewTime")}</p>
                    <p className="text-[11px] text-[#142918]/60 mt-0.5">{t("brewTimeValue")}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#142918]/10">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a46131]"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-[11px] text-[#142918]">{t("brewTemp")}</p>
                    <p className="text-[11px] text-[#142918]/60 mt-0.5">{t("brewTempValue")}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24 bg-parchment-50">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="bg-white rounded-[32px] p-8 lg:p-12 border border-[#142918]/[0.06] shadow-sm">
              <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-center">
                <div className="shrink-0 w-[200px]">
                  <h3 className="font-bold text-lg text-[#142918] mb-6">{t("reviewsTitle")}</h3>
                  <div className="flex items-end gap-2 mb-2 text-[#142918]">
                    <span className="font-serif text-5xl leading-none">4.9</span>
                    <span className="text-[#142918]/50 text-xl leading-none pb-1">/5</span>
                  </div>
                  <div className="flex text-[#f3a734] mb-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <p className="text-[13px] text-[#142918]/60 mb-8">{t("reviewCount", {count: 128})}</p>
                  
                  <button className="w-full py-3 rounded-xl border border-[#a46131] text-[#a46131] font-bold text-sm hover:bg-[#a46131]/5 transition-colors">
                    {t("viewAllReviews")}
                  </button>
                </div>
                
                <div className="flex-1 w-full overflow-hidden relative">
                  {/* Fading edges for the slider */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
                  
                  <div className="flex gap-4 pb-4 animate-marquee hover:[animation-play-state:paused] w-[max-content]">
                    {[
                      {name: "Nguyễn Minh T.", review: "Phin rất đẹp, cà phê pha ra đúng vị đậm đà, thơm mùi thảo mộc. Sẽ ủng hộ tiếp!"},
                      {name: "Trần Hoài An", review: "Giao hàng nhanh, đóng gói cẩn thận. Cà phê ngon, hậu ngọt sâu."},
                      {name: "Lê Văn Hùng", review: "Rất thích hương vị này, uống mỗi sáng tỉnh táo cả ngày."},
                      {name: "Nguyễn Minh T.", review: "Phin rất đẹp, cà phê pha ra đúng vị đậm đà, thơm mùi thảo mộc. Sẽ ủng hộ tiếp!"},
                      {name: "Trần Hoài An", review: "Giao hàng nhanh, đóng gói cẩn thận. Cà phê ngon, hậu ngọt sâu."},
                      {name: "Lê Văn Hùng", review: "Rất thích hương vị này, uống mỗi sáng tỉnh táo cả ngày."}
                    ].map((review, i) => (
                      <div key={i} className="min-w-[280px] w-[280px] bg-[#fdfcf8] border border-[#142918]/[0.08] rounded-2xl p-6 flex flex-col shadow-[0_2px_10px_rgba(20,41,24,0.02)]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#142918] shrink-0" />
                          <div>
                            <p className="font-bold text-[13px] text-[#142918]">{review.name}</p>
                            <p className="text-[10px] text-[#142918]/50">{t("verifiedBuyer")}</p>
                          </div>
                        </div>
                        <div className="flex text-[#f3a734] mb-3">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        </div>
                        <p className="text-[13px] text-[#142918]/70 leading-relaxed flex-1">
                          {review.review}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
