import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {CinematicPageHero} from "@/components/sections/cinematic-page-hero";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {ShopGrid} from "@/features/shop/shop-grid";
import type {Locale} from "@/i18n/routing";
import type {ProductCategory} from "@/lib/content/types";
import {
  getPageContent,
  getVisibleProductsByCategory,
  localizedField,
  localizedValue,
  sectionByKey
} from "@/lib/content/cms";

type Props = {
  params: Promise<{locale: Locale; slug: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  const t = await getTranslations({locale, namespace: "Shop"});
  
  const titleMap: Record<string, string> = {
    beans: t("beans"),
    phin: t("phin"),
    gifts: t("gifts"),
    ground: t("ground")
  };
  
  const categoryTitle = titleMap[slug] || t("title");

  return {
    title: `${categoryTitle} · Wecacha`,
    description: t("intro"),
    alternates: {
      canonical: `/${locale}/shop/category/${slug}`,
    }
  };
}

export default async function CategoryPage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Shop"});
  const common = await getTranslations({locale, namespace: "Common"});
  const tNav = await getTranslations({locale, namespace: "Nav"});
  const category = slug as ProductCategory;
  const [content, filteredProducts] = await Promise.all([
    getPageContent("shop"),
    getVisibleProductsByCategory(category)
  ]);
  const hero = sectionByKey(content, "hero");

  const titleMap: Record<string, string> = {
    beans: t("beans"),
    phin: t("phin"),
    gifts: t("gifts"),
    ground: t("ground")
  };

  const categoryTitle = titleMap[slug] || t("title");

  return (
    <main className="bg-parchment-50">
      <CinematicPageHero
        kicker={localizedField(hero, "eyebrow", locale) || t("shopKicker")}
        title={categoryTitle}
        copy={localizedField(hero, "copy", locale) || t("intro")}
        image={hero?.media?.image}
        imageAlt={categoryTitle}
        chips={localizedValue(hero?.settings?.chips, locale, [t("chip1"), t("chip2"), t("chip3")])}
        fieldJournal={common("fieldJournal")}
        scrollLabel={common("scrollDown")}
        breadcrumbs={
          <Breadcrumbs 
            homeLabel={tNav("home")}
            theme="dark"
            items={[
              { label: t("title"), href: "/shop" },
              { label: categoryTitle }
            ]} 
          />
        }
      />

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {filteredProducts.length > 0 ? (
            <ShopGrid products={filteredProducts} locale={locale} hideCategories={true} />
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-forest-950/60">
                {t("categoryEmpty")}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
