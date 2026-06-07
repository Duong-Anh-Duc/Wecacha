import {getTranslations, setRequestLocale} from "next-intl/server";
import {Tabs} from "antd";
import {ProductAttributesManager, type ProductAttributeRow} from "@/components/admin/product-attributes-manager";
import {ProductCategoriesManager, type ProductCategoryRow} from "@/components/admin/product-categories-manager";
import {RefreshButton} from "@/components/admin/refresh-button";
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

  const [categoriesResult, attributesResult] = await Promise.all([
    supabase
      .from("product_categories")
      .select("slug, name_vi, name_en, sort_order, is_visible")
      .order("sort_order", {ascending: true}),
    supabase
      .from("product_attributes")
      .select("id, name, sort_order, is_visible")
      .order("sort_order", {ascending: true})
  ]);

  if (categoriesResult.error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {t("loadError")} {categoriesResult.error.message}
      </div>
    );
  }

  const attributes = attributesResult.error ? [] : ((attributesResult.data as ProductAttributeRow[]) ?? []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className=" text-3xl text-forest-950">{t("productSettingsTitle")}</h2>
          <p className="mt-1 text-stone-500">{t("productSettingsDesc")}</p>
        </div>
        <RefreshButton />
      </div>

      <Tabs
        items={[
          {
            key: "categories",
            label: t("categoriesTitle"),
            children: <ProductCategoriesManager categories={(categoriesResult.data as ProductCategoryRow[]) ?? []} />
          },
          {
            key: "attributes",
            label: t("attributesTitle"),
            children: attributesResult.error ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-700">
                {t("attributesTableMissing")}
              </div>
            ) : (
              <ProductAttributesManager attributes={attributes} />
            )
          }
        ]}
      />
    </div>
  );
}
