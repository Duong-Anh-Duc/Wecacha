import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {CinematicImage} from "@/components/sections/cinematic-image";
import {CinematicPageHero} from "@/components/sections/cinematic-page-hero";
import {Reveal} from "@/components/motion/reveal";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {ShopGrid} from "@/features/shop/shop-grid";
import type {Locale} from "@/i18n/routing";
import {
  getPageContent,
  getVisibleProducts,
  localizedField,
  localizedValue,
  sectionByKey
} from "@/lib/content/cms";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Shop"});

  const isVi = locale === "vi";
  return {
    title: t("title"),
    description: t("intro"),
    keywords: isVi
      ? "mua hạt cà phê đặc sản arabica sơn la, cà phê arabica sơn la giá tốt, wecacha shop, arabica rang mộc sơn la, hạt cà phê người thái, đặt mua cà phê tây bắc"
      : "buy specialty arabica coffee son la, wecacha shop, arabica son la roasted beans, thai highland coffee order, northwest vietnam arabica",
    alternates: {
      canonical: `/${locale}/shop`,
      languages: {
        vi: "/vi/shop",
        en: "/en/shop",
        "x-default": "/vi/shop"
      }
    }
  };
}

export default async function ShopPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Shop"});
  const common = await getTranslations({locale, namespace: "Common"});
  const tNav = await getTranslations({locale, namespace: "Nav"});
  const [content, products] = await Promise.all([
    getPageContent("shop"),
    getVisibleProducts()
  ]);
  const hero = sectionByKey(content, "hero");
  const mediaStrip = sectionByKey(content, "media_strip");

  return (
    <main className="bg-parchment-50">
      <CinematicPageHero
        kicker={localizedField(hero, "eyebrow", locale) || t("shopKicker")}
        title={localizedField(hero, "title", locale) || t("title")}
        copy={localizedField(hero, "copy", locale) || t("intro")}
        image={hero?.media?.image}
        imageAlt={t("farmImageAlt")}
        chips={localizedValue(hero?.settings?.chips, locale, [t("chip1"), t("chip2"), t("chip3")])}
        fieldJournal={common("fieldJournal")}
        scrollLabel={common("scrollDown")}
        breadcrumbs={
          <Breadcrumbs 
            homeLabel={tNav("home")}
            theme="dark"
            items={[{ label: t("title") }]} 
          />
        }
      />

      <section className="bg-forest-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="film-strip mx-auto grid max-w-7xl grid-cols-3 gap-2 sm:gap-3 md:grid-cols-5">
          {((mediaStrip?.media?.images as string[] | undefined) ?? []).map(
            (image, index) => (
              <Reveal delay={index * 0.04} key={image}>
                <CinematicImage
                  src={image}
                  alt=""
                  className="cinematic-float aspect-[4/3] rounded-sm shadow-none"
                  sizes="(min-width: 1024px) 20vw, 33vw"
                />
              </Reveal>
            )
          )}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <ShopGrid products={products} locale={locale} />
        </div>
      </section>
    </main>
  );
}
