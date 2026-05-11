import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {JsonLd} from "@/components/seo/json-ld";
import {SectionHeading} from "@/components/sections/section-heading";
import {ProductCard} from "@/components/shop/product-card";
import {Badge} from "@/components/ui/badge";
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

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

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
      images: [{url: product.images[0], width: 1200, height: 900}]
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
  const related = getRelatedProducts(product.slug);

  return (
    <main className="bg-parchment-50">
      <JsonLd data={productJsonLd(product, locale)} />
      <section className="px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.12fr_0.88fr]">
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

      <section className="border-y border-forest-950/10 bg-paper-grain px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">
          {[
            {label: t("origin"), value: localized(product.origin, locale)},
            {label: t("altitude"), value: product.altitude},
            {label: t("roast"), value: localized(product.roast, locale)},
            {label: t("notes"), value: localized(product.notes, locale).join(", ")}
          ].map((item) => (
            <Reveal key={item.label}>
              <div className="border-t border-forest-950/14 pt-4">
                <p className="text-xs font-bold uppercase text-earth-600">
                  {item.label}
                </p>
                <p className="mt-3 font-serif text-2xl leading-tight text-forest-950">
                  {item.value}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <SectionHeading
              kicker={t("farmer")}
              title={localized(product.name, locale)}
              copy={localized(product.farmerStory, locale)}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-md bg-forest-950 p-7 text-white shadow-cinematic">
              <p className="text-xs font-bold uppercase text-ember">{t("brew")}</p>
              <ol className="mt-6 grid gap-4">
                {localized(product.brewGuide, locale).map((step, index) => (
                  <li className="flex gap-4" key={step}>
                    <Badge className="h-8 w-8 justify-center border-white/14 bg-white/10 px-0 text-white">
                      {index + 1}
                    </Badge>
                    <span className="pt-1 text-white/72">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-forest-900 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading light kicker={tShop("shopKicker")} title={t("related")} />
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
