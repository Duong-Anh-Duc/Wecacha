import {getTranslations, setRequestLocale} from "next-intl/server";
import {OrdersTable, type OrderRow} from "@/components/admin/orders-table";
import {RefreshButton} from "@/components/admin/refresh-button";
import {RealtimeRefresh} from "@/components/admin/realtime-refresh";
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
    .select("id, created_at, status, customer_name, phone, city, ward, address, note, admin_note, subtotal, shipping, total, order_items(id, product_slug, product_name, image, weight, quantity, price, line_total)")
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className=" text-3xl text-forest-950">{t("ordersTitle")}</h2>
          <p className="mt-1 text-stone-500">{t("ordersDesc")}</p>
        </div>
        <RefreshButton />
      </div>

      <OrdersTable orders={orders} locale={locale} />
      <RealtimeRefresh
        table="orders"
        channelName="admin-orders-realtime"
        insertMessage={t("realtimeNewOrder")}
      />
    </div>
  );
}
