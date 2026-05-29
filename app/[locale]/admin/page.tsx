import type {ReactNode} from "react";
import {ArrowRight, CalendarDays, FileText, MapPinHouse, Package, ShoppingBag, UsersRound} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import {requireAdmin} from "@/lib/admin-auth";
import type {Locale} from "@/i18n/routing";

export const revalidate = 0;

type Registration = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  address: string | null;
  note: string | null;
};

const REPORT_TIME_ZONE = "Asia/Ho_Chi_Minh";

function getLocaleTag(locale: Locale) {
  return locale === "vi" ? "vi-VN" : "en-US";
}

function getDayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: REPORT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function getRecentActivity(registrations: Registration[], locale: Locale) {
  const localeTag = getLocaleTag(locale);
  const dayLabelFormatter = new Intl.DateTimeFormat(localeTag, {
    timeZone: REPORT_TIME_ZONE,
    weekday: "short",
    day: "2-digit",
    month: "2-digit"
  });

  const now = new Date();
  const days = Array.from({length: 7}, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    return {
      key: getDayKey(date),
      label: dayLabelFormatter.format(date)
    };
  });

  const counts = new Map<string, number>();

  registrations.forEach((registration) => {
    const key = getDayKey(new Date(registration.created_at));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return days.map((day) => ({
    ...day,
    count: counts.get(day.key) ?? 0
  }));
}

function formatDateTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(getLocaleTag(locale), {
    timeZone: REPORT_TIME_ZONE,
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default async function AdminDashboardPage({
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
    .select("id, created_at, name, phone, address, note")
    .order("created_at", {ascending: false});

  const [
    {count: articlesCount},
    {count: productsCount},
    {count: ordersCount}
  ] = await Promise.all([
    supabase.from("news_articles").select("id", {count: "exact", head: true}),
    supabase.from("products").select("id", {count: "exact", head: true}),
    supabase.from("orders").select("id", {count: "exact", head: true})
  ]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
        {t("loadError")} {error.message}
      </div>
    );
  }

  const registrations = (data as Registration[]) ?? [];
  const todayKey = getDayKey(new Date());
  const recentActivity = getRecentActivity(registrations, locale);
  const recentActivityKeys = new Set(recentActivity.map((day) => day.key));
  const totalCount = registrations.length;
  const todayCount = registrations.filter((item) => getDayKey(new Date(item.created_at)) === todayKey).length;
  const weekCount = registrations.filter((item) =>
    recentActivityKeys.has(getDayKey(new Date(item.created_at)))
  ).length;
  const withAddressCount = registrations.filter((item) => item.address?.trim()).length;
  const withNoteCount = registrations.filter((item) => item.note?.trim()).length;
  const missingAddressCount = totalCount - withAddressCount;
  const latestRegistrations = registrations.slice(0, 6);
  const peakDay = recentActivity.reduce(
    (current, day) => (day.count > current.count ? day : current),
    recentActivity[0] ?? {count: 0, label: "-", key: ""}
  );
  const maxBar = Math.max(...recentActivity.map((day) => day.count), 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-earth-700">
            {t("dashboardEyebrow")}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-forest-950 sm:text-4xl">
            {t("dashboardTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
            {t("dashboardDesc")}
          </p>
        </div>

        <Link
          href="/admin/registrations"
          className="inline-flex h-11 items-center gap-2 self-start rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-forest-950 transition hover:-translate-y-0.5 hover:border-earth-600/30 hover:text-earth-700"
        >
          {t("openRegistrations")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<UsersRound className="h-5 w-5" />}
          label={t("metricTotal")}
          value={totalCount}
          caption={t("metricTotalCaption")}
        />
        <SummaryCard
          icon={<CalendarDays className="h-5 w-5" />}
          label={t("metricToday")}
          value={todayCount}
          caption={t("metricTodayCaption")}
        />
        <SummaryCard
          icon={<CalendarDays className="h-5 w-5" />}
          label={t("metricLast7Days")}
          value={weekCount}
          caption={t("metricLast7DaysCaption")}
        />
        <SummaryCard
          icon={<MapPinHouse className="h-5 w-5" />}
          label={t("metricAddress")}
          value={withAddressCount}
          caption={t("metricAddressCaption")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<FileText className="h-5 w-5" />}
          label={t("articles")}
          value={articlesCount ?? 0}
          caption={t("metricArticlesCaption")}
        />
        <SummaryCard
          icon={<Package className="h-5 w-5" />}
          label={t("products")}
          value={productsCount ?? 0}
          caption={t("metricProductsCaption")}
        />
        <SummaryCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label={t("orders")}
          value={ordersCount ?? 0}
          caption={t("metricOrdersCaption")}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
            <div>
              <h3 className="font-serif text-2xl text-forest-950">{t("activityTitle")}</h3>
              <p className="mt-1 text-sm text-stone-500">{t("activityDesc")}</p>
            </div>
            <div className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
              {peakDay.count > 0 ? t("peakDay", {day: peakDay.label, count: peakDay.count}) : t("activityEmpty")}
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="flex h-56 items-end gap-3 sm:gap-4">
              {recentActivity.map((day) => {
                const height = day.count === 0 ? 8 : Math.max((day.count / maxBar) * 100, 18);

                return (
                  <div key={day.key} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                    <span className="text-xs font-semibold text-stone-400">{day.count}</span>
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-2xl bg-gradient-to-t from-earth-700 via-earth-600 to-amber-300 shadow-[0_12px_28px_rgba(181,101,0,0.18)]"
                        style={{height: `${height}%`}}
                      />
                    </div>
                    <span className="text-center text-[11px] font-medium leading-4 text-stone-500">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-100 px-6 py-5">
            <h3 className="font-serif text-2xl text-forest-950">{t("qualityTitle")}</h3>
            <p className="mt-1 text-sm text-stone-500">{t("qualityDesc")}</p>
          </div>

          <div className="space-y-5 px-6 py-6">
            <CompletionMeter
              label={t("qualityAddress")}
              value={withAddressCount}
              total={totalCount}
              accent="bg-earth-600"
            />
            <CompletionMeter
              label={t("qualityNote")}
              value={withNoteCount}
              total={totalCount}
              accent="bg-brand-green"
            />

            <div className="grid gap-3 pt-2 sm:grid-cols-2 xl:grid-cols-1">
              <InsightCard
                label={t("needsAddress")}
                value={missingAddressCount}
                caption={t("needsAddressDesc")}
              />
              <InsightCard
                label={t("latestCapture")}
                value={latestRegistrations[0] ? formatDateTime(latestRegistrations[0].created_at, locale) : "--"}
                caption={t("latestCaptureDesc")}
              />
            </div>
          </div>
        </section>
      </div>

      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-stone-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-2xl text-forest-950">{t("latestTitle")}</h3>
            <p className="mt-1 text-sm text-stone-500">{t("latestDesc")}</p>
          </div>
          <Link
            href="/admin/registrations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-earth-700 transition hover:text-earth-800"
          >
            {t("openRegistrations")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {latestRegistrations.length === 0 ? (
          <div className="px-6 py-16 text-center text-stone-400">{t("noRegistrations")}</div>
        ) : (
          <div className="divide-y divide-stone-100">
            {latestRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="grid gap-4 px-6 py-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(180px,0.8fr)_auto] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-forest-950">{registration.name}</p>
                  <p className="mt-1 text-sm text-stone-500">{registration.phone}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusChip
                    active={Boolean(registration.address?.trim())}
                    label={t("qualityAddress")}
                  />
                  <StatusChip
                    active={Boolean(registration.note?.trim())}
                    label={t("qualityNote")}
                  />
                </div>

                <div className="text-sm text-stone-500 sm:text-right">
                  {formatDateTime(registration.created_at, locale)}
                </div>

                {registration.note?.trim() ? (
                  <p className="sm:col-span-3 text-sm leading-6 text-stone-500">
                    {registration.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  caption
}: {
  icon: ReactNode;
  label: string;
  value: number;
  caption: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-earth-600/10 text-earth-700">
          {icon}
        </span>
        <span className="text-sm font-semibold uppercase tracking-[0.16em] text-stone-400">{label}</span>
      </div>
      <p className="mt-8 font-serif text-4xl text-forest-950">{value}</p>
      <p className="mt-3 text-sm leading-6 text-stone-500">{caption}</p>
    </div>
  );
}

function CompletionMeter({
  label,
  value,
  total,
  accent
}: {
  label: string;
  value: number;
  total: number;
  accent: string;
}) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-forest-950">{label}</span>
        <span className="text-sm text-stone-500">
          {value}/{total} · {percentage}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-stone-100">
        <div
          className={`h-2 rounded-full ${accent}`}
          style={{width: `${percentage}%`}}
        />
      </div>
    </div>
  );
}

function InsightCard({
  label,
  value,
  caption
}: {
  label: string;
  value: string | number;
  caption: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">{label}</p>
      <p className="mt-3 text-lg font-semibold text-forest-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-stone-500">{caption}</p>
    </div>
  );
}

function StatusChip({active, label}: {active: boolean; label: string}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-brand-green/12 text-brand-green"
          : "bg-stone-100 text-stone-500"
      }`}
    >
      {label}
    </span>
  );
}
