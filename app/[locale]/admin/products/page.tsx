import {Plus} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {ProductsTable, type ProductRow} from "@/components/admin/products-table";
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

  const {data, error} = await supabase
    .from("products")
    .select("id, slug, category, name_vi, price, original_price, weight, images, featured, is_visible, sort_order, created_at")
    .order("sort_order", {ascending: true})
    .order("created_at", {ascending: false});

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {t("loadError")} {error.message}
      </div>
    );
  }

  const products = (data as ProductRow[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-forest-950">{t("productsTitle")}</h2>
          <p className="mt-1 text-stone-500">{t("productsDesc")}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-ember px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-ember/90"
        >
          <Plus className="h-5 w-5" />
          {t("addProduct")}
        </Link>
      </div>

      <ProductsTable products={products} locale={locale} />
    </div>
  );
}
