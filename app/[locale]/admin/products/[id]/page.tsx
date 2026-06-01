import {ArrowLeft} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {ProductForm} from "@/components/admin/product-form";
import {ProductPreviewButton} from "@/components/admin/product-preview-button";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {requireAdmin} from "@/lib/admin-auth";

export const revalidate = 0;

export default async function EditProductPage({
  params
}: {
  params: Promise<{locale: Locale; id: string}>;
}) {
  const {locale, id} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Admin");
  const {supabase} = await requireAdmin(locale);

  const [productResult, categoriesResult] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single(),
    supabase
      .from("product_categories")
      .select("slug, name_vi, name_en")
      .order("sort_order", {ascending: true})
  ]);

  if (productResult.error || !productResult.data) {
    notFound();
  }

  const data = productResult.data;
  const categories = categoriesResult.error ? [] : categoriesResult.data ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link
          href="/admin/products"
          className="inline-flex h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-stone-600 shadow-sm transition hover:bg-stone-200 hover:text-forest-950"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backProducts")}
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className=" text-3xl text-forest-950">{t("editProductTitle")}</h2>
            <p className="mt-1 text-stone-500">{t("editProductDesc")}</p>
          </div>
          <ProductPreviewButton product={data} categories={categories} locale={locale} />
        </div>
      </div>

      <ProductForm initialData={data} categories={categories} />
    </div>
  );
}
