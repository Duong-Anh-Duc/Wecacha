import {getTranslations, setRequestLocale} from "next-intl/server";
import {OrdersTable, type OrderRow} from "@/components/admin/orders-table";
import type {Locale} from "@/i18n/routing";
import {requireAdmin} from "@/lib/admin-auth";

export const revalidate = 0;

export default async function OrdersAdminPage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Admin");
  const {supabase} = await requireAdmin(locale);

  const {data, error} = await supabase
    .from("orders")
    .select("id, created_at, status, customer_name, phone, city, ward, address, note, admin_note, subtotal, shipping, total, order_items(id, product_slug, product_name, quantity, price, line_total)")
    .order("created_at", {ascending: false});

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {t("loadError")} {error.message}
      </div>
    );
  }

  const orders = (data as OrderRow[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl text-forest-950">{t("ordersTitle")}</h2>
        <p className="mt-1 text-stone-500">{t("ordersDesc")}</p>
      </div>

      <OrdersTable orders={orders} locale={locale} />
    </div>
  );
}
