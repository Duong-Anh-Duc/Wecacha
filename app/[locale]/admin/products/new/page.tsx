import {setRequestLocale} from "next-intl/server";
import {redirect} from "next/navigation";
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
  redirect(`/${locale}/admin/products`);
}
