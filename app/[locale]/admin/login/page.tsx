import {redirect} from "next/navigation";
import {setRequestLocale} from "next-intl/server";
import {AdminLoginForm} from "@/components/admin/admin-login-form";
import {getAdminSession} from "@/lib/admin-auth";
import type {Locale} from "@/i18n/routing";

export default async function AdminLoginPage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const {user} = await getAdminSession();

  if (user) {
    redirect(`/${locale}/admin`);
  }

  return <AdminLoginForm />;
}
