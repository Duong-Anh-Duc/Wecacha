import {LoaderCircle} from "lucide-react";
import {getTranslations} from "next-intl/server";

export default async function AdminLoading() {
  const t = await getTranslations("Admin");

  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white px-8 py-7 text-forest-950 shadow-sm">
        <LoaderCircle className="h-8 w-8 animate-spin text-ember" />
        <p className="text-sm font-semibold">{t("routeLoading")}</p>
      </div>
    </div>
  );
}
