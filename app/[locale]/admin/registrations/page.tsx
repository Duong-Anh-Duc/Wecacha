import { supabase } from "@/lib/supabase";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

type Registration = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  address: string | null;
  note: string | null;
};

export default async function RegistrationsPage() {
  const t = await getTranslations("Admin");

  const { data, error } = await supabase
    .from("experience_registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
        {t("loadError")} {error.message}
      </div>
    );
  }

  const registrations = (data as Registration[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-forest-950 font-serif">{t("registrationsTitle")}</h2>
        <p className="text-stone-500 mt-1">{t("registrationsDesc")}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-500 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">{t("colName")}</th>
                <th className="px-6 py-4">{t("colPhone")}</th>
                <th className="px-6 py-4">{t("colAddress")}</th>
                <th className="px-6 py-4">{t("colNote")}</th>
                <th className="px-6 py-4">{t("colRegisteredAt")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                    {t("noRegistrations")}
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-stone-50/50 transition">
                    <td className="px-6 py-4 font-medium text-forest-950">{reg.name}</td>
                    <td className="px-6 py-4">{reg.phone}</td>
                    <td className="px-6 py-4">{reg.address || <span className="text-stone-400 italic">{t("noValue")}</span>}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={reg.note || ""}>
                      {reg.note || <span className="text-stone-400 italic">{t("noValue")}</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(reg.created_at).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
