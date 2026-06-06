import Image from "next/image";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {Coffee, Leaf, Star, Sun} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {ProductsRealtimeRefresh} from "@/components/realtime/products-realtime-refresh";
import {JsonLd} from "@/components/seo/json-ld";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {ProductBuyPanel} from "@/features/product/product-buy-panel";
import {ProductGallery} from "@/features/product/product-gallery";
import type {Locale} from "@/i18n/routing";
import {
  getPageContent,
  getVisibleProductBySlug,
  getVisibleProductReviews,
  getVisibleProductSlugs,
  itemsForSection,
  localizedField,
  sectionByKey
} from "@/lib/content/cms";
import {localized} from "@/lib/content/helpers";
import {productJsonLd} from "@/lib/seo";

type Props = {
  params: Promise<{locale: Locale; slug: string}>;
};

export async function generateStaticParams() {
  const slugs = await getVisibleProductSlugs();
  return slugs.map((slug) => ({slug}));
}

const ogImageMap: Record<string, string> = {
  "/sp1.jpeg": "/og/sp1.jpg",
  "/sp2.jpeg": "/og/sp2.jpg",
  "/gift_box_brocade.png": "/og/gift.jpg",
  "/image5.jpeg": "/og/sp4.jpg"
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const product = await getVisibleProductBySlug(slug);

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
  const product = await getVisibleProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: "Product"});
  const tShop = await getTranslations({locale, namespace: "Shop"});
  const tNav = await getTranslations({locale, namespace: "Nav"});
  const [content, reviews] = await Promise.all([
    getPageContent("product-detail"),
    getVisibleProductReviews(product.slug)
  ]);
  const benefitsSection = sectionByKey(content, "benefits");
  const benefitItems = itemsForSection(content, "benefits");
  const reviewsSection = sectionByKey(content, "reviews");
  const repeatedReviews = reviews.length > 0 ? [...reviews, ...reviews] : [];
  const rating = Number(reviewsSection?.settings?.rating ?? 4.9);
  const reviewCount = Number(reviewsSection?.settings?.reviewCount ?? reviews.length);
  const benefitIcons = {
    sun: Sun,
    leaf: Leaf,
    coffee: Coffee
  };
  const benefitTitleTemplate = localizedField(benefitsSection, "title", locale);
  const benefitTitle = benefitTitleTemplate
    ? benefitTitleTemplate.replace("{name}", localized(product.name, locale))
    : t("whyLoveTitle", {name: localized(product.name, locale)});

  return (
    <main className="bg-parchment-50">
      <ProductsRealtimeRefresh />
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
                  {benefitTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pr-4">
                  {benefitItems.map((item) => {
                    const Icon = benefitIcons[item.media?.icon as keyof typeof benefitIcons] ?? Star;
                    return (
                      <div key={item.item_key}>
                        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#f0e6d6] text-[#6b4c2a] mb-5">
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <h3 className="font-bold text-[16px] text-[#142918] mb-2">{localizedField(item, "title", locale)}</h3>
                        <p className="text-[13px] text-[#142918]/70 leading-relaxed">{localizedField(item, "body", locale)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="relative flex-1 min-h-[280px] lg:min-h-[520px]">
                <Image
                  src={benefitsSection?.media?.image ?? "/son_la_bg.png"}
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
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="bg-[#fcfbfa] rounded-[24px] p-8 lg:p-10 border border-[#142918]/[0.06]">
              <h3 className="font-bold text-lg text-[#142918] mb-8">{t("infoHeading")}</h3>
              <div className="flex flex-col gap-5">
                {[
                  {label: t("productInfo"), value: localized(product.description, locale)},
                  {label: t("weight"), value: product.weight},
                  {label: t("packageSpec"), value: product.baseUnit}
                ].filter((item) => item.value).map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4 items-start border-b border-[#142918]/[0.06] pb-5 last:border-0 last:pb-0">
                    <span className="font-bold text-[13px] text-[#142918]">{item.label}</span>
                    <span className="text-[14px] text-[#142918]/80 leading-relaxed">{item.value}</span>
                  </div>
                ))}
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
                  <h3 className="font-bold text-lg text-[#142918] mb-6">
                    {localizedField(reviewsSection, "title", locale) || t("reviewsTitle")}
                  </h3>
                  <div className="flex items-end gap-2 mb-2 text-[#142918]">
                    <span className="font-serif text-5xl leading-none">{rating.toFixed(1)}</span>
                    <span className="text-[#142918]/50 text-xl leading-none pb-1">/5</span>
                  </div>
                  <div className="flex text-[#f3a734] mb-3">
                    {Array.from({length: 5}).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-[13px] text-[#142918]/60 mb-8">{t("reviewCount", {count: reviewCount})}</p>
                  
                  <button className="w-full py-3 rounded-xl border border-[#a46131] text-[#a46131] font-bold text-sm hover:bg-[#a46131]/5 transition-colors">
                    {t("viewAllReviews")}
                  </button>
                </div>
                
                <div className="flex-1 w-full overflow-hidden relative">
                  {/* Fading edges for the slider */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
                  
                  <div className="flex gap-4 pb-4 animate-marquee hover:[animation-play-state:paused] w-[max-content]">
                    {repeatedReviews.map((review, i) => (
                      <div key={`${review.review_key}-${i}`} className="min-w-[280px] w-[280px] bg-[#fdfcf8] border border-[#142918]/[0.08] rounded-2xl p-6 flex flex-col shadow-[0_2px_10px_rgba(20,41,24,0.02)]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#142918] shrink-0" />
                          <div>
                            <p className="font-bold text-[13px] text-[#142918]">{localizedField(review, "name", locale)}</p>
                            <p className="text-[10px] text-[#142918]/50">{t("verifiedBuyer")}</p>
                          </div>
                        </div>
                        <div className="flex text-[#f3a734] mb-3">
                          {Array.from({length: Math.round(review.rating)}).map((_, index) => (
                            <Star key={index} className="h-3 w-3 fill-current" aria-hidden="true" />
                          ))}
                        </div>
                        <p className="text-[13px] text-[#142918]/70 leading-relaxed flex-1">
                          {localizedField(review, "review", locale)}
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
