import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {CinematicPageHero} from "@/components/sections/cinematic-page-hero";
import {ShopGrid} from "@/features/shop/shop-grid";
import type {Locale} from "@/i18n/routing";
import {imageLibrary, products, type ProductCategory} from "@/lib/content";

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
  
  // Filter products by the current category slug
  const filteredProducts = products.filter(
    (product) => product.category === slug
  );

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
        kicker={t("shopKicker")}
        title={categoryTitle}
        copy={t("intro")}
        image={slug === "gifts" ? imageLibrary.packaging : (slug === "phin" ? imageLibrary.phin : imageLibrary.beansBowl)}
        imageAlt={categoryTitle}
        chips={[t("chip1"), t("chip2"), t("chip3")]}
        fieldJournal={common("fieldJournal")}
        scrollLabel={common("scrollDown")}
      />

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {filteredProducts.length > 0 ? (
            <ShopGrid products={filteredProducts} locale={locale} hideCategories={true} />
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-forest-950/60">
                {locale === "vi" 
                  ? "Đang cập nhật sản phẩm cho danh mục này." 
                  : "Updating products for this category."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
