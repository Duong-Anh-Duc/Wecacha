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

      <section className="relative overflow-hidden bg-forest-950 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <Image
          src={product.images[1] ?? product.images[0]}
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover opacity-28"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(181,101,0,0.34),transparent_30%),linear-gradient(90deg,rgba(5,34,8,0.96),rgba(5,34,8,0.76),rgba(5,34,8,0.94))]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <Reveal>
            <div className="sticky top-28">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ember">
                <MapPinned className="h-4 w-4" aria-hidden="true" />
                {locale === "vi" ? "Hành trình sản phẩm" : "Product journey"}
              </p>
              <h2 className="mt-5 max-w-xl font-serif text-5xl leading-[0.98] text-parchment-50 sm:text-6xl">
                {locale === "vi"
                  ? "Mỗi túi cà phê có đường đi riêng"
                  : "Every bag has its own route"}
              </h2>
              <p className="mt-6 max-w-md leading-8 text-white/66">
                {locale === "vi"
                  ? "Từ vùng trồng, cách sơ chế đến nhịp rang, câu chuyện của sản phẩm này không trùng với bất kỳ dòng nào khác."
                  : "From origin and processing to roast rhythm, this product carries a story no other lot shares."}
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {localized(product.journey, locale).map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08}>
                <article className="group relative overflow-hidden rounded-xl border border-white/12 bg-white/[0.07] p-5 shadow-cinematic backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:bg-white/[0.1] sm:p-7">
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-ember via-earth-600 to-transparent opacity-75" />
                  <div className="flex gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/16 bg-parchment-50/10 font-serif text-2xl text-ember transition duration-500 group-hover:scale-110 group-hover:bg-earth-600 group-hover:text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ember">
                        {step.stage}
                      </p>
                      <h3 className="mt-2 font-serif text-3xl leading-tight text-parchment-50 sm:text-4xl">
                        {step.title}
                      </h3>
                      <p className="mt-4 max-w-2xl leading-8 text-white/68">
                        {step.body}
                      </p>
                    </div>
                    <ArrowDownRight className="ml-auto hidden h-6 w-6 shrink-0 text-white/28 transition duration-500 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:text-ember sm:block" />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
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
