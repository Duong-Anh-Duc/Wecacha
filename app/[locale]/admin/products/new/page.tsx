import {ArrowLeft} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {ProductForm} from "@/components/admin/product-form";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {requireAdmin} from "@/lib/admin-auth";

export default async function NewProductPage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const t = await getTranslations("Admin");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-stone-600 shadow-sm transition hover:bg-stone-200 hover:text-forest-950"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backProducts")}
        </Link>
        <div>
          <h2 className="font-serif text-3xl text-forest-950">{t("newProductTitle")}</h2>
          <p className="mt-1 text-stone-500">{t("newProductDesc")}</p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
