import {ArrowLeft} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {RegistrationsTable, type RegistrationRow} from "@/components/admin/registrations-table";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {requireAdmin} from "@/lib/admin-auth";

export const revalidate = 0;

export default async function RegistrationsPage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Admin");
  const {supabase} = await requireAdmin(locale);

  const {data, error} = await supabase
    .from("experience_registrations")
    .select("id, created_at, name, phone, address, note, status, admin_note")
    .order("created_at", {ascending: false});

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {t("loadError")} {error.message}
      </div>
    );
  }

  const registrations = (data as RegistrationRow[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/admin"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-stone-600 shadow-sm transition hover:bg-stone-200 hover:text-forest-950"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backDashboard")}
          </Link>
          <div>
            <h2 className="font-serif text-3xl text-forest-950">{t("registrationsTitle")}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-7 text-stone-500">
              {t("registrationsDesc")}
            </p>
          </div>
        </div>

        <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-500 shadow-sm">
          {t("registrationsCount", {count: registrations.length})}
        </div>
      </div>

      <RegistrationsTable registrations={registrations} locale={locale} />
    </div>
  );
}
