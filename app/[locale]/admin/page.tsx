import React, {type ReactNode} from "react";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  MapPinHouse,
  Package,
  ShoppingBag,
  UsersRound,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Calendar
} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Link} from "@/i18n/navigation";
import {requireAdmin} from "@/lib/admin-auth";
import type {Locale} from "@/i18n/routing";
import {cn} from "@/lib/utils";


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

function getWeekdayLabel(key: string, locale: Locale) {
  const date = new Date(key);
  const day = date.getDay();
  if (locale === "vi") {
    const days = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    return days[day];
  } else {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
  }
}

function getDateLabel(key: string) {
  const parts = key.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  return "";
}

function formatLatestTime(value: string) {
  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${hours}:${minutes} • ${day}/${month}`;
}

function formatFullDateTime(value: string) {
  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

export default async function AdminDashboardPage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Admin");
  const tCommon = await getTranslations("Common");
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

  // Custom Address trend (last 7 days)
  const addressCounts = new Map<string, number>();
  registrations.forEach((r) => {
    if (r.address?.trim()) {
      const key = getDayKey(new Date(r.created_at));
      addressCounts.set(key, (addressCounts.get(key) ?? 0) + 1);
    }
  });
  const addressTrend = recentActivity.map(day => addressCounts.get(day.key) ?? 0);

  // SVG Chart path mathematics
  const maxBar = Math.max(...recentActivity.map((day) => day.count), 1);
  const points = recentActivity.map((day, idx) => {
    const x = 50 + idx * 100;
    const y = 170 - (day.count / maxBar) * 110;
    return { x, y, count: day.count, key: day.key };
  });

  let chartLinePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + 50;
    const cp1y = p0.y;
    const cp2x = p1.x - 50;
    const cp2y = p1.y;
    chartLinePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }

  const chartAreaPath = `${chartLinePath} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Header section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-700">
            {t("dashboardEyebrow")}
          </p>
          <h2 className="mt-2 font-serif text-4xl text-forest-950">
            {t("dashboard")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500">
            {t("dashboardDesc")}
          </p>
        </div>

        {/* Dropdown 7 days */}
        <div className="inline-flex h-11 items-center gap-2 self-start rounded-xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 shadow-sm cursor-default">
          <Calendar className="h-4 w-4 text-stone-500" />
          <span>{t("metricLast7Days")}</span>
          <ChevronDown className="h-4 w-4 text-stone-400" />
        </div>
      </div>

      {/* Row 1 cards: Grid metrics */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<UsersRound className="h-6 w-6" />}
          label={t("metricTotal")}
          value={totalCount}
          caption={t("metricTotalCaption").replace(/\.$/, "")}
          iconColorClass="text-[#b56500]"
          sparklineData={recentActivity.map(d => d.count)}
        />
        <SummaryCard
          icon={<Send className="h-6 w-6" />}
          label={t("metricToday")}
          value={todayCount}
          caption={t("metricTodayCaption").replace(/\.$/, "")}
          iconColorClass="text-[#4A751D]"
          sparklineData={recentActivity.map((d, i) => (i === 6 ? todayCount : 0))}
        />
        <SummaryCard
          icon={<CalendarDays className="h-6 w-6" />}
          label={t("metricLast7Days")}
          value={weekCount}
          caption={t("metricLast7DaysCaption").replace(/\.$/, "")}
          iconColorClass="text-[#8B5A2B]"
          sparklineData={recentActivity.map(d => d.count)}
        />
        <SummaryCard
          icon={<MapPinHouse className="h-6 w-6" />}
          label={t("metricAddress")}
          value={withAddressCount}
          caption={t("metricAddressCaption").replace(/\.$/, "")}
          iconColorClass="text-[#b87d4b]"
          sparklineData={addressTrend}
        />
      </div>

      {/* Row 2: CMS Metrics */}
      <div className="grid gap-6 sm:grid-cols-3">
        <CmsCard
          icon={<FileText className="h-6 w-6" />}
          label={t("articles")}
          value={articlesCount ?? 0}
          caption={t("metricArticlesCaption").replace(/\.$/, "")}
          iconColor="text-[#4A751D]"
        />
        <CmsCard
          icon={<Package className="h-6 w-6" />}
          label={t("products")}
          value={productsCount ?? 0}
          caption={t("metricProductsCaption").replace(/\.$/, "")}
          iconColor="text-[#4A751D]"
        />
        <CmsCard
          icon={<ShoppingBag className="h-6 w-6" />}
          label={t("orders")}
          value={ordersCount ?? 0}
          caption={t("metricOrdersCaption").replace(/\.$/, "")}
          iconColor="text-[#4A751D]"
        />
      </div>

      {/* Row 3: Chart & Quality meters */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        {/* Chart card */}
        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
            <div>
              <h3 className="font-serif text-2xl text-forest-950">{t("activityTitle")}</h3>
              <p className="mt-1 text-xs text-stone-500">{t("activityDesc")}</p>
            </div>

            {/* Small Select dropdown in card header */}
            <div className="rounded-xl border border-stone-200 bg-stone-50/50 px-3 py-1.5 text-xs font-semibold text-stone-600 flex items-center gap-1.5">
              <span>{t("metricLast7Days")}</span>
              <ChevronDown className="h-3 w-3 text-stone-400" />
            </div>
          </div>

          {/* SVG line chart */}
          <div className="px-6 py-6 overflow-x-auto select-none">
            <div className="min-w-[600px] h-60 relative">
              <svg className="w-full h-full text-brand-green" viewBox="0 0 700 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A751D" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#4A751D" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal X-Axis line */}
                <line x1="50" y1="170" x2="650" y2="170" stroke="#e7e5e4" strokeWidth="1.5" />

                {/* Area path */}
                <path
                  d={chartAreaPath}
                  fill="url(#chart-area-grad)"
                />

                {/* Curve Line path */}
                <path
                  d={chartLinePath}
                  fill="none"
                  stroke="#4A751D"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points & Labels */}
                {points.map((p) => (
                  <g key={p.key}>
                    {/* Circle Dot */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="6"
                      fill="#4A751D"
                      stroke="white"
                      strokeWidth="2"
                      className="shadow-sm transition-transform hover:scale-125 cursor-pointer"
                    />

                    {/* Count value */}
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      className="text-xs font-bold fill-forest-950 font-sans"
                    >
                      {p.count}
                    </text>

                    {/* Weekday label */}
                    <text
                      x={p.x}
                      y={192}
                      textAnchor="middle"
                      className="text-xs font-medium fill-stone-500 font-sans"
                    >
                      {getWeekdayLabel(p.key, locale)}
                    </text>

                    {/* Date label */}
                    <text
                      x={p.x}
                      y={208}
                      textAnchor="middle"
                      className="text-[11px] font-semibold fill-stone-400 font-sans"
                    >
                      {getDateLabel(p.key)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </section>

        {/* Quality completion card */}
        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm flex flex-col justify-between">
          <div className="border-b border-stone-100 px-6 py-5">
            <h3 className="font-serif text-2xl text-forest-950">{t("qualityTitle")}</h3>
            <p className="mt-1 text-xs text-stone-500">{t("qualityDesc")}</p>
          </div>

          <div className="space-y-6 px-6 py-6 flex-1">
            <CompletionMeter
              label={t("qualityAddress")}
              value={withAddressCount}
              total={totalCount}
              accent="bg-[#4A751D]"
            />
            <CompletionMeter
              label={t("qualityNote")}
              value={withNoteCount}
              total={totalCount}
              accent="bg-[#4A751D]"
            />

            <div className="grid gap-4 pt-2 sm:grid-cols-2 xl:grid-cols-1">
              <QualityInsightCard
                label={t("needsAddress")}
                value={missingAddressCount}
                caption={t("needsAddressDesc")}
              />
              <QualityInsightCard
                icon={<Clock className="h-4.5 w-4.5 text-stone-500" />}
                label={t("latestCapture")}
                value={latestRegistrations[0] ? formatLatestTime(latestRegistrations[0].created_at) : "--"}
                caption={t("latestCaptureDesc")}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Row 4: Latest registrations list */}
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-stone-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-2xl text-forest-950">{t("latestTitle")}</h3>
            <p className="mt-1 text-xs text-stone-500">{t("latestDesc")}</p>
          </div>
          <Link
            href="/admin/registrations"
            className="inline-flex items-center gap-1 text-sm font-semibold text-earth-700 transition hover:text-earth-800"
          >
            <span>{t("openRegistrations")}</span>
            <ArrowRight className="h-4 w-4 animate-[pulse_2s_infinite]" />
          </Link>
        </div>

        {latestRegistrations.length === 0 ? (
          <div className="px-6 py-16 text-center text-stone-400">{t("noRegistrations")}</div>
        ) : (
          <div className="divide-y divide-stone-100">
            {latestRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="grid gap-4 px-6 py-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(180px,0.8fr)_auto] sm:items-center hover:bg-stone-50/20 transition-colors"
              >
                {/* Left section: Avatar + Name + Phone + Note */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                    <UsersRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-forest-950">{registration.name}</p>
                    <p className="mt-0.5 text-xs text-stone-500 font-medium">{registration.phone}</p>
                    <p className="mt-1 text-xs text-stone-400 capitalize">
                      {registration.note?.trim() ? (registration.note.includes("Demo") ? "Demo" : registration.note.slice(0, 30)) : "Demo"}
                    </p>
                  </div>
                </div>

                {/* Center section: Status badges */}
                <div className="flex flex-wrap gap-2.5">
                  {registration.address?.trim() ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600 stroke-white shrink-0" />
                      <span>{t("statusHasAddress")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 bg-stone-50/50 px-2.5 py-1 rounded-full border border-stone-100">
                      <AlertCircle className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                      <span>{t("statusNoAddress")}</span>
                    </div>
                  )}

                  {registration.note?.trim() ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600 stroke-white shrink-0" />
                      <span>{t("statusHasNote")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 bg-stone-50/50 px-2.5 py-1 rounded-full border border-stone-100">
                      <AlertCircle className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                      <span>{t("statusNoNote")}</span>
                    </div>
                  )}
                </div>

                {/* Right section: Calendar icon + Full date-time */}
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 sm:justify-end">
                  <Calendar className="h-4 w-4 text-stone-400 shrink-0" />
                  <span>{formatFullDateTime(registration.created_at)}</span>
                </div>
              </div>
            ))}

            {/* View all bottom interactive panel */}
            <div className="flex justify-center border-t border-stone-100 py-4 bg-stone-50/20">
              <Link
                href="/admin/registrations"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-2 text-xs font-bold text-stone-700 shadow-sm hover:bg-stone-50 hover:border-stone-300 transition"
              >
                <span>{tCommon("viewAll")}</span>
                <ChevronDown className="h-4 w-4 text-stone-400" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Sparkline({ data, colorClass = "text-brand-green" }: { data: number[]; colorClass?: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min;
  const width = 80;
  const height = 24;
  const padding = 1;

  // Map data to points
  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - min) / range) * (height - 2 * padding);
    return { x, y };
  });

  // Generate smooth bezier curve path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) / 2;
    const cp1y = p0.y;
    const cp2x = p1.x - (p1.x - p0.x) / 2;
    const cp2y = p1.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }

  // Generate closed area path for gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  // Unique id for linear gradient so they don't clash
  const gradId = `sparkline-grad-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <svg className={cn("w-20 h-8 opacity-90", colorClass)} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d={areaD}
        fill={`url(#${gradId})`}
      />
      <path
        d={pathD}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  caption,
  iconColorClass = "text-earth-700",
  sparklineData = [0, 0, 0, 0, 0, 0, 0]
}: {
  icon: React.ReactElement<{className?: string}>;
  label: string;
  value: number | string;
  caption: string;
  iconColorClass?: string;
  sparklineData?: number[];
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between min-h-[175px]">
      <div>
        <div className={cn("text-2xl mb-4", iconColorClass)}>
          {icon}
        </div>
        <h4 className="text-sm font-semibold text-stone-850">{label}</h4>
        <p className="mt-1 font-serif text-3xl font-bold text-forest-950">{value}</p>
      </div>

      <div className="flex items-end justify-between mt-4">
        <p className="text-[11px] leading-4 text-stone-500 max-w-[62%]">{caption}</p>
        <div className="shrink-0 -mb-1 select-none">
          <Sparkline data={sparklineData} colorClass={iconColorClass} />
        </div>
      </div>
    </div>
  );
}

function CmsCard({
  icon,
  label,
  value,
  caption,
  iconColor = "text-emerald-700"
}: {
  icon: React.ReactElement<{className?: string}>;
  label: string;
  value: number | string;
  caption: string;
  iconColor?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm min-h-[145px] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className={cn("text-emerald-700 text-xl", iconColor)}>{icon}</span>
          <span className="text-base font-semibold text-forest-950">{label}</span>
        </div>
        <p className="mt-4 font-serif text-4xl font-semibold text-forest-950">{value}</p>
      </div>
      <p className="mt-2 text-xs leading-5 text-stone-500 z-10">{caption}</p>

      {/* Faint Background Icon at bottom right */}
      <div className={cn("absolute right-4 bottom-2 pointer-events-none select-none w-16 h-16 flex items-center justify-center opacity-10", iconColor)}>
        {React.cloneElement(icon, {className: "w-16 h-16 stroke-[1]"})}
      </div>
    </div>
  );
}

function CompletionMeter({
  label,
  value,
  total,
  accent = "bg-[#4A751D]"
}: {
  label: string;
  value: number;
  total: number;
  accent?: string;
}) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-forest-950">{label}</span>
        <span className="text-xs font-semibold text-stone-500">
          {value}/{total} · {percentage}%
        </span>
      </div>
      <div className="h-3 rounded-full bg-stone-100 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ease-out ${accent}`}
          style={{width: `${percentage}%`}}
        />
      </div>
    </div>
  );
}

function QualityInsightCard({
  icon,
  label,
  value,
  caption
}: {
  icon?: ReactNode;
  label: string;
  value: string | number;
  caption: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-150 bg-stone-50/60 px-5 py-4 relative overflow-hidden flex flex-col justify-between min-h-[115px]">
      <div>
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-2 mt-2">
          {icon && <span className="text-forest-950">{icon}</span>}
          <p className="text-lg font-bold text-forest-950">{value}</p>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-4 text-stone-500">{caption}</p>
    </div>
  );
}
