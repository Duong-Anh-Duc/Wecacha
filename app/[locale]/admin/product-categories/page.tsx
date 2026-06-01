import {getTranslations, setRequestLocale} from "next-intl/server";
import {ProductCategoriesManager, type ProductCategoryRow} from "@/components/admin/product-categories-manager";
import type {Locale} from "@/i18n/routing";
import {requireAdmin} from "@/lib/admin-auth";

export const revalidate = 0;

export default async function ProductCategoriesPage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Admin");
  const {supabase} = await requireAdmin(locale);

  const {data, error} = await supabase
    .from("product_categories")
    .select("slug, name_vi, name_en, sort_order, is_visible")
    .order("sort_order", {ascending: true});

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {t("loadError")} {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl text-forest-950">{t("categoriesTitle")}</h2>
        <p className="mt-1 text-stone-500">{t("categoriesPageDesc")}</p>
      </div>

      <ProductCategoriesManager categories={(data as ProductCategoryRow[]) ?? []} />
    </div>
  );
}
