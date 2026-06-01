import {Plus} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {ProductsTable, type ProductRow} from "@/components/admin/products-table";
import {RefreshButton} from "@/components/admin/refresh-button";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {requireAdmin} from "@/lib/admin-auth";

export const revalidate = 0;

export default async function ProductsAdminPage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Admin");
  const {supabase} = await requireAdmin(locale);

  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from("products")
      .select("id, slug, category, name_vi, short_vi, description_vi, price, original_price, weight, images, featured, is_visible, sort_order, created_at")
      .order("sort_order", {ascending: true})
      .order("created_at", {ascending: false}),
    supabase
      .from("product_categories")
      .select("slug, name_vi, name_en, sort_order, is_visible")
      .order("sort_order", {ascending: true})
  ]);

  if (productsResult.error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {t("loadError")} {productsResult.error.message}
      </div>
    );
  }

  const products = (productsResult.data as ProductRow[]) ?? [];
  const categories = categoriesResult.error ? [] : categoriesResult.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className=" text-3xl text-forest-950">{t("productsTitle")}</h2>
          <p className="mt-1 text-stone-500">{t("productsDesc")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RefreshButton />
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-ember px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-ember/90"
          >
            <Plus className="h-5 w-5" />
            {t("addProduct")}
          </Link>
        </div>
      </div>

      <ProductsTable products={products} locale={locale} categories={categories} />
    </div>
  );
}
