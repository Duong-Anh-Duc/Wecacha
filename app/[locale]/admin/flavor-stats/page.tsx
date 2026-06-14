import {setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {requireAdmin} from "@/lib/admin-auth";
import {RefreshButton} from "@/components/admin/refresh-button";
import {AdminFlavorWheel} from "@/components/admin/admin-flavor-wheel";
import {flavorQuizzes, tx} from "@/features/flavor-quiz/flavor-quizzes";

export const revalidate = 0;

const GROUP_ORDER = [
  "floral",
  "fruity",
  "sourFermented",
  "green",
  "other",
  "roasted",
  "spicy",
  "nutty",
  "sweet"
];

export default async function FlavorStatsPage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const isVi = locale === "vi";
  const {supabase} = await requireAdmin(locale);

  // Count clicks + submits per flavor group (parallel, accurate at any volume).
  const queries = GROUP_ORDER.flatMap((key) => [
    supabase
      .from("flavor_wheel_events")
      .select("*", {count: "exact", head: true})
      .eq("flavor_key", key)
      .eq("type", "click")
      .then((r) => ({key, type: "click" as const, count: r.count ?? 0, error: r.error})),
    supabase
      .from("flavor_wheel_events")
      .select("*", {count: "exact", head: true})
      .eq("flavor_key", key)
      .eq("type", "submit")
      .then((r) => ({key, type: "submit" as const, count: r.count ?? 0, error: r.error}))
  ]);

  const results = await Promise.all(queries);
  const tableMissing = results.some(
    (r) => r.error && /relation .*flavor_wheel_events.* does not exist|could not find the table/i.test(r.error.message)
  );

  const stats = GROUP_ORDER.map((key) => {
    const clicks = results.find((r) => r.key === key && r.type === "click")?.count ?? 0;
    const submits = results.find((r) => r.key === key && r.type === "submit")?.count ?? 0;
    const name = flavorQuizzes[key] ? tx(flavorQuizzes[key].name, locale) : key;
    return {key, name, clicks, submits};
  }).sort((a, b) => b.clicks + b.submits - (a.clicks + a.submits));

  const totalClicks = stats.reduce((s, r) => s + r.clicks, 0);
  const totalSubmits = stats.reduce((s, r) => s + r.submits, 0);
  const maxVal = Math.max(1, ...stats.map((r) => Math.max(r.clicks, r.submits)));
  const countsMap = Object.fromEntries(
    stats.map((r) => [r.key, {clicks: r.clicks, submits: r.submits}])
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl text-forest-950">
            {isVi ? "Thống kê Gu cà phê" : "Coffee Taste Stats"}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-7 text-stone-500">
            {isVi
              ? "Số lượt khách chọn từng vị trên vòng tròn hương vị (click) và số lượt hoàn thành quiz (submit)."
              : "How many visitors selected each flavor on the wheel (clicks) and completed the quiz (submits)."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RefreshButton />
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-500 shadow-sm">
            {isVi ? "Tổng" : "Total"}: {totalClicks} {isVi ? "click" : "clicks"} · {totalSubmits} submit
          </div>
        </div>
      </div>

      {tableMissing ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-800">
          <p className="font-bold">
            {isVi ? "Chưa tạo bảng thống kê" : "Stats table not created yet"}
          </p>
          <p className="mt-1">
            {isVi
              ? "Hãy chạy file SQL "
              : "Run the SQL file "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[12px]">
              supabase/sql/flavor-wheel-events-migration.sql
            </code>
            {isVi ? " trong Supabase SQL Editor để bật tính năng này." : " in the Supabase SQL Editor to enable this."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
        <AdminFlavorWheel locale={locale} counts={countsMap} />
        <div className="overflow-hidden rounded-2xl border border-forest-950/10 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest-950/10 bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                <th className="px-5 py-3 font-bold">{isVi ? "Hương vị" : "Flavor"}</th>
                <th className="px-5 py-3 font-bold">{isVi ? "Lượt chọn (click)" : "Selections (click)"}</th>
                <th className="px-5 py-3 font-bold">{isVi ? "Hoàn thành (submit)" : "Completions (submit)"}</th>
                <th className="px-5 py-3 font-bold">{isVi ? "Tỉ lệ" : "Activity"}</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((row) => (
                <tr key={row.key} className="border-b border-forest-950/5 last:border-0">
                  <td className="px-5 py-3 font-bold text-forest-950">{row.name}</td>
                  <td className="px-5 py-3 text-forest-950/80">{row.clicks}</td>
                  <td className="px-5 py-3 text-forest-950/80">{row.submits}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-40 overflow-hidden rounded-full bg-stone-100">
                          <div
                            className="h-full rounded-full bg-[#a46131]"
                            style={{width: `${(row.clicks / maxVal) * 100}%`}}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-40 overflow-hidden rounded-full bg-stone-100">
                          <div
                            className="h-full rounded-full bg-[#17351f]"
                            style={{width: `${(row.submits / maxVal) * 100}%`}}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-5 border-t border-forest-950/10 bg-stone-50 px-5 py-3 text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#a46131]" /> {isVi ? "Lượt chọn" : "Selections"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#17351f]" /> {isVi ? "Hoàn thành quiz" : "Quiz completions"}
            </span>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
