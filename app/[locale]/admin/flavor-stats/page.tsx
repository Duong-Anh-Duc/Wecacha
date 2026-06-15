import {getTranslations, setRequestLocale} from "next-intl/server";
import type {Locale} from "@/i18n/routing";
import {requireAdmin} from "@/lib/admin-auth";
import {RefreshButton} from "@/components/admin/refresh-button";
import {getFlavorCounts} from "@/actions/flavor-actions";
import {wheelGroups} from "@/features/flavor-quiz/wheel-data";
import {flavorQuizzes, tx} from "@/features/flavor-quiz/flavor-quizzes";
import {FlavorStatsTree} from "@/components/admin/flavor-stats-tree";

export const revalidate = 0;

export default async function FlavorStatsPage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const isVi = locale === "vi";
  const t = await getTranslations({locale, namespace: "FlavorQuiz"});
  const {supabase} = await requireAdmin(locale);

  // Probe whether the events table exists.
  const probe = await supabase.from("flavor_wheel_events").select("id", {head: true, count: "exact"});
  const tableMissing = Boolean(
    probe.error && /does not exist|could not find the table/i.test(probe.error.message)
  );

  const counts = tableMissing ? {} : await getFlavorCounts();
  const c = (key: string) => counts[key] ?? {clicks: 0, submits: 0};

  // Build the 3-level tree (group → family → leaf) in wheel order.
  const groupsTree = wheelGroups.map((group) => ({
    key: group.key,
    label: flavorQuizzes[group.key] ? tx(flavorQuizzes[group.key].name, locale) : group.key,
    color: group.color,
    ...c(group.key),
    families: group.children.map((child) => ({
      key: child.id,
      label: t(child.labelKey),
      color: child.color,
      ...c(child.id),
      leaves: child.leaves.map((leaf) => ({
        key: leaf,
        label: t(`wheel.${leaf}`),
        color: child.color,
        ...c(leaf)
      }))
    }))
  }));

  const totalClicks = wheelGroups.reduce((s, g) => s + c(g.key).clicks, 0);

  // Total submits per main group (group + its families + leaves) for the donut chart.
  const groupSubmitTotals = groupsTree.map((g) => ({
    key: g.key,
    label: g.label,
    color: g.color,
    value:
      g.submits +
      g.families.reduce((fs, f) => fs + f.submits + f.leaves.reduce((ls, l) => ls + l.submits, 0), 0)
  }));
  const totalSubmits = groupSubmitTotals.reduce((s, d) => s + d.value, 0);

  // Donut slices (stroke-dasharray technique).
  const R = 70;
  const CIRC = 2 * Math.PI * R;
  let acc = 0;
  const donutSlices = groupSubmitTotals
    .filter((d) => d.value > 0)
    .map((d) => {
      const frac = totalSubmits > 0 ? d.value / totalSubmits : 0;
      const slice = {
        ...d,
        frac,
        dash: frac * CIRC,
        gap: CIRC - frac * CIRC,
        offset: -acc * CIRC
      };
      acc += frac;
      return slice;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl text-forest-950">
            {isVi ? "Thống kê Gu cà phê" : "Coffee Taste Stats"}
          </h2>
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
          <p className="font-bold">{isVi ? "Chưa tạo bảng thống kê" : "Stats table not created yet"}</p>
          <p className="mt-1">
            {isVi ? "Hãy chạy file SQL " : "Run the SQL file "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[12px]">
              supabase/sql/flavor-wheel-events-migration.sql
            </code>
            {isVi ? " trong Supabase SQL Editor để bật tính năng này." : " in the Supabase SQL Editor to enable this."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Donut chart — submit distribution per main flavor group */}
          <div className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-forest-950">
              {isVi ? "Tỉ lệ hoàn thành quiz theo nhóm" : "Quiz submits by group"}
            </h3>
            {totalSubmits === 0 ? (
              <p className="mt-6 text-center text-sm font-medium text-stone-400">
                {isVi ? "Chưa có lượt hoàn thành quiz nào." : "No quiz submits yet."}
              </p>
            ) : (
              <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
                <div className="relative shrink-0">
                  <svg width="180" height="180" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r={R} fill="none" stroke="#f1efe9" strokeWidth="26" />
                    {donutSlices.map((s) => (
                      <circle
                        key={s.key}
                        cx="100"
                        cy="100"
                        r={R}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="26"
                        strokeDasharray={`${s.dash} ${s.gap}`}
                        strokeDashoffset={s.offset}
                        transform="rotate(-90 100 100)"
                      />
                    ))}
                  </svg>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-serif text-3xl font-black text-forest-950">{totalSubmits}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wide text-stone-400">submit</span>
                  </div>
                </div>
                <div className="grid w-full grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {donutSlices.map((s) => (
                    <div key={s.key} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{backgroundColor: s.color}} />
                        <span className="truncate font-semibold text-forest-950/80">{s.label}</span>
                      </span>
                      <span className="shrink-0 font-bold text-forest-950">
                        {s.value}{" "}
                        <span className="text-xs font-semibold text-stone-400">
                          ({Math.round(s.frac * 100)}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <FlavorStatsTree groups={groupsTree} isVi={isVi} />
        </div>
      )}
    </div>
  );
}
