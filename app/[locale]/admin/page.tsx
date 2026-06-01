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
    <div className="space-y-8 max-w-7xl mx-auto px-1 bg-[#fafafa]">
      {/* Header section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-6 rounded-2xl border border-stone-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#4A751D] border border-emerald-100/50">
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
              <div className="rounded-[1px] bg-[#4A751D] w-1.5 h-1.5" />
              <div className="rounded-[1px] bg-[#4A751D] w-1.5 h-1.5" />
              <div className="rounded-[1px] bg-[#4A751D] w-1.5 h-1.5" />
              <div className="rounded-[1px] bg-[#4A751D] w-1.5 h-1.5" />
            </div>
          </div>
          <div>
            <h2 className="font-sans text-2xl font-black tracking-tight text-forest-950">
              {t("dashboard")}
            </h2>
            <p className="mt-1 text-xs font-semibold text-stone-500">
              {t("dashboardDesc")}
            </p>
          </div>
        </div>

        {/* Dropdown 7 days */}
        <div className="inline-flex h-9 items-center gap-2 self-start rounded-xl border border-stone-250/70 bg-white px-3.5 text-xs font-bold text-stone-700 shadow-sm transition-all duration-200 hover:border-stone-300 hover:bg-stone-50/50 cursor-pointer">
          <Calendar className="h-3.5 w-3.5 text-stone-500" />
          <span>{t("metricLast7Days")}</span>
          <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
        </div>
      </div>

      {/* Row 1 cards: Grid metrics */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<UsersRound className="h-5 w-5" />}
          label={t("metricTotal")}
          value={totalCount}
          caption={t("metricTotalCaption").replace(/\.$/, "")}
          iconColorClass="text-[#4A751D]"
          sparklineData={recentActivity.map(d => d.count)}
        />
        <SummaryCard
          icon={<Send className="h-5 w-5" />}
          label={t("metricToday")}
          value={todayCount}
          caption={t("metricTodayCaption").replace(/\.$/, "")}
          iconColorClass="text-[#4A751D]"
          sparklineData={recentActivity.map((d, i) => (i === 6 ? todayCount : 0))}
        />
        <SummaryCard
          icon={<CalendarDays className="h-5 w-5" />}
          label={t("metricLast7Days")}
          value={weekCount}
          caption={t("metricLast7DaysCaption").replace(/\.$/, "")}
          iconColorClass="text-[#4A751D]"
          sparklineData={recentActivity.map(d => d.count)}
        />
        <SummaryCard
          icon={<MapPinHouse className="h-5 w-5" />}
          label={t("metricAddress")}
          value={withAddressCount}
          caption={t("metricAddressCaption").replace(/\.$/, "")}
          iconColorClass="text-[#4A751D]"
          sparklineData={addressTrend}
        />
      </div>

      {/* Row 2: CMS Metrics */}
      <div className="grid gap-6 sm:grid-cols-3">
        <CmsCard
          icon={<FileText className="h-5 w-5" />}
          label={t("articles")}
          value={articlesCount ?? 0}
          caption={t("metricArticlesCaption").replace(/\.$/, "")}
          iconColor="text-[#4A751D]"
        />
        <CmsCard
          icon={<Package className="h-5 w-5" />}
          label={t("products")}
          value={productsCount ?? 0}
          caption={t("metricProductsCaption").replace(/\.$/, "")}
          iconColor="text-[#4A751D]"
        />
        <CmsCard
          icon={<ShoppingBag className="h-5 w-5" />}
          label={t("orders")}
          value={ordersCount ?? 0}
          caption={t("metricOrdersCaption").replace(/\.$/, "")}
          iconColor="text-[#4A751D]"
        />
      </div>

      {/* Row 3: Chart & Quality meters */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        {/* Chart card */}
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.015)] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4.5">
            <div>
              <h3 className="font-sans text-base font-bold text-stone-900">{t("activityTitle")}</h3>
              <p className="mt-0.5 text-xs text-stone-400 font-semibold">{t("activityDesc")}</p>
            </div>

            {/* Small Select dropdown in card header */}
            <div className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-bold text-stone-600 flex items-center gap-1.5 transition hover:bg-stone-50 cursor-pointer shadow-sm">
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
                    <stop offset="0%" stopColor="#4A751D" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#4A751D" stopOpacity="0.0" />
                  </linearGradient>
                  <style>{`
                    @keyframes pulse-ring {
                      0% { transform: scale(0.7); opacity: 0.9; }
                      80%, 100% { transform: scale(2.2); opacity: 0; }
                    }
                    .pulse-indicator {
                      animation: pulse-ring 2s cubic-bezier(0.25, 0, 0, 1) infinite;
                    }
                  `}</style>
                </defs>

                {/* Horizontal reference Gridlines */}
                <line x1="50" y1="115" x2="650" y2="115" stroke="#f4f3ed" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="50" y1="60" x2="650" y2="60" stroke="#f4f3ed" strokeWidth="1" strokeDasharray="4 4" />

                {/* Horizontal X-Axis line */}
                <line x1="50" y1="170" x2="650" y2="170" stroke="#e7e5e4" strokeWidth="1.5" />

                {/* Vertical helper gridlines under each point */}
                {points.map((p) => (
                  <line
                    key={`grid-vert-${p.key}`}
                    x1={p.x}
                    y1={p.y}
                    x2={p.x}
                    y2={170}
                    stroke="#f4f3ed"
                    strokeWidth="1.2"
                    strokeDasharray="2 3"
                  />
                ))}

                {/* Area path */}
                <path
                  d={chartAreaPath}
                  fill="url(#chart-area-grad)"
                />

                {/* Glow behind main curve line */}
                <path
                  d={chartLinePath}
                  fill="none"
                  stroke="#4A751D"
                  strokeWidth="5"
                  strokeOpacity="0.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
                {points.map((p) => {
                  const isPeak = p.count > 0 && p.key === peakDay.key;
                  return (
                    <g key={p.key} className="group/point">
                      {/* Vertical interaction column */}
                      <line
                        x1={p.x}
                        y1={30}
                        x2={p.x}
                        y2={170}
                        stroke="transparent"
                        strokeWidth="20"
                        className="cursor-pointer"
                      />

                      {/* Pulse Ring for Peak point */}
                      {isPeak && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="12"
                          fill="#4A751D"
                          fillOpacity="0.25"
                          className="pulse-indicator"
                          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                        />
                      )}

                      {/* Outer halo */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="8"
                        fill="#4A751D"
                        fillOpacity="0.12"
                        className="transition-all duration-300 group-hover/point:scale-150 group-hover/point:fill-opacity-25"
                      />

                      {/* Inner circle dot */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4.5"
                        fill="#4A751D"
                        stroke="white"
                        strokeWidth="2"
                        className="shadow-sm transition-all duration-300 group-hover/point:scale-110"
                      />

                      {/* Count value tooltip on hover */}
                      <g className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <rect
                          x={p.x - 18}
                          y={p.y - 32}
                          width="36"
                          height="20"
                          rx="6"
                          fill="#162C11"
                          className="shadow-md"
                        />
                        <text
                          x={p.x}
                          y={p.y - 18}
                          textAnchor="middle"
                          className="text-[10px] font-bold fill-white font-sans"
                        >
                          {p.count}
                        </text>
                      </g>

                      {/* Normal count display when not hovered */}
                      <text
                        x={p.x}
                        y={p.y - 12}
                        textAnchor="middle"
                        className="text-xs font-bold fill-forest-950 font-sans group-hover/point:opacity-0 transition-opacity duration-200"
                      >
                        {p.count}
                      </text>

                      {/* Weekday label */}
                      <text
                        x={p.x}
                        y={192}
                        textAnchor="middle"
                        className="text-xs font-bold fill-stone-500 font-sans transition-colors group-hover/point:fill-forest-900"
                      >
                        {getWeekdayLabel(p.key, locale)}
                      </text>

                      {/* Date label */}
                      <text
                        x={p.x}
                        y={208}
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-stone-400 font-sans transition-colors group-hover/point:fill-forest-600"
                      >
                        {getDateLabel(p.key)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </section>

        {/* Quality completion card */}
        <section className="overflow-hidden rounded-3xl border border-stone-220/80 bg-white/90 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.015)] flex flex-col justify-between">
          <div className="flex flex-col border-b border-stone-100/80 bg-stone-50/40 px-6 py-5">
            <h3 className=" text-xl font-bold text-forest-950">{t("qualityTitle")}</h3>
            <p className="mt-1 text-xs font-semibold text-stone-400">{t("qualityDesc")}</p>
          </div>

          <div className="space-y-6 px-6 py-6 flex-1">
            <CompletionMeter
              label={t("qualityAddress")}
              value={withAddressCount}
              total={totalCount}
              accent="bg-gradient-to-r from-forest-800 to-[#609c24]"
            />
            <CompletionMeter
              label={t("qualityNote")}
              value={withNoteCount}
              total={totalCount}
              accent="bg-gradient-to-r from-forest-800 to-[#609c24]"
            />

            <div className="grid gap-4 pt-2 sm:grid-cols-2 xl:grid-cols-1">
              <QualityInsightCard
                icon={<AlertCircle className="h-4.5 w-4.5 text-amber-600 animate-pulse" />}
                label={t("needsAddress")}
                value={missingAddressCount}
                caption={t("needsAddressDesc")}
              />
              <QualityInsightCard
                icon={<Clock className="h-4.5 w-4.5 text-[#4A751D] shrink-0" />}
                label={t("latestCapture")}
                value={latestRegistrations[0] ? formatLatestTime(latestRegistrations[0].created_at) : "--"}
                caption={t("latestCaptureDesc")}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Row 4: Latest registrations list */}
      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.015)]">
        <div className="flex flex-col gap-3 border-b border-stone-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-sans text-base font-bold text-stone-900">{t("latestTitle")}</h3>
            <p className="mt-0.5 text-xs text-stone-400 font-semibold">{t("latestDesc")}</p>
          </div>
          <Link
            href="/admin/registrations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A751D] hover:underline"
          >
            <span>{t("openRegistrations")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {latestRegistrations.length === 0 ? (
          <div className="px-6 py-16 text-center text-stone-400 font-medium">{t("noRegistrations")}</div>
        ) : (
          <div className="w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-stone-200/60 text-stone-500 text-[10px] font-bold uppercase tracking-wider bg-stone-50/50">
                    <th className="w-20 px-6 py-3 font-extrabold">STT</th>
                    <th className="px-6 py-3 font-extrabold">
                      <div className="flex items-center gap-1">
                        <span>Người gửi</span>
                        <span className="text-stone-400 text-[9px]">⇅</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 font-extrabold">
                      <div className="flex items-center gap-1">
                        <span>Số điện thoại</span>
                        <span className="text-stone-400 text-[9px]">▾</span>
                      </div>
                    </th>
                    <th className="px-6 py-3 font-extrabold">Trạng thái</th>
                    <th className="px-6 py-3 font-extrabold">Ghi chú</th>
                    <th className="px-6 py-3 font-extrabold">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {latestRegistrations.map((registration, index) => {
                    return (
                      <tr key={registration.id} className="hover:bg-stone-50/30 transition-colors group">
                        <td className="px-6 py-3.5 text-sm font-bold text-stone-400">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-sm font-bold text-forest-950 group-hover:text-[#4A751D] transition-colors">
                            {registration.name}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-sm font-bold text-stone-500 tracking-tight">
                          {registration.phone}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex flex-wrap gap-2">
                            {registration.address?.trim() ? (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-850 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/50">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span>{t("statusHasAddress")}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-50 px-2.5 py-0.5 rounded-full border border-stone-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />
                                <span>{t("statusNoAddress")}</span>
                              </div>
                            )}

                            {registration.note?.trim() ? (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-850 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/50">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <span>{t("statusHasNote")}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-850 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100/50">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                <span>{t("statusNoNote")}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-sm text-stone-600">
                          {registration.note?.trim() ? (
                            <span className="italic font-medium">"{registration.note}"</span>
                          ) : (
                            <span className="text-xs text-stone-400 italic font-medium">Chưa ghi chú</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-xs font-bold text-stone-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-stone-300" />
                            <span>{formatFullDateTime(registration.created_at)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* View all bottom interactive panel */}
            <div className="flex justify-center border-t border-stone-100 py-4 bg-stone-50/10">
              <Link
                href="/admin/registrations"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-5 py-2 text-xs font-bold text-stone-700 shadow-sm hover:bg-stone-50 hover:border-stone-300 transition-all duration-200"
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
  const lastPoint = points[points.length - 1];

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
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="1.5"
        fill="currentColor"
      />
    </svg>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  caption,
  iconColorClass = "text-[#4A751D]",
  sparklineData = [0, 0, 0, 0, 0, 0, 0]
}: {
  icon: React.ReactElement<{className?: string}>;
  label: string;
  value: number | string;
  caption: string;
  iconColorClass?: string;
  sparklineData?: number[];
}) {
  const bgClass = "bg-[#4A751D]/6 border-[#4A751D]/10";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 flex flex-col justify-between min-h-[155px] shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-stone-300 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 shadow-inner group-hover:scale-105", bgClass, iconColorClass)}>
              {React.cloneElement(icon, { className: "h-4.5 w-4.5 stroke-[2]" })}
            </div>
            <h4 className="text-xs font-bold text-stone-700 tracking-tight">{label}</h4>
          </div>
        </div>
        <p className="mt-3.5 font-sans text-3.5xl font-black tracking-tight text-forest-950 tabular-nums">
          {value}
        </p>
      </div>

      <div className="flex items-end justify-between mt-4">
        <p className="text-[11px] leading-4 text-stone-500 font-medium max-w-[62%]">{caption}</p>
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
  iconColor = "text-[#4A751D]"
}: {
  icon: React.ReactElement<{className?: string}>;
  label: string;
  value: number | string;
  caption: string;
  iconColor?: string;
}) {
  const bgClass = "bg-[#4A751D]/6 border-[#4A751D]/10";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.015)] min-h-[135px] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-stone-300">
      <div>
        <div className="flex items-center gap-2">
          <div className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300 shadow-inner", bgClass, iconColor)}>
            {React.cloneElement(icon, { className: "h-4 w-4 stroke-[2]" })}
          </div>
          <span className="text-xs font-bold text-stone-800 tracking-tight">{label}</span>
        </div>
        <p className="mt-3.5 font-sans text-3.5xl font-black tracking-tight text-forest-950 tabular-nums">
          {value}
        </p>
      </div>
      <p className="mt-2 text-[11px] leading-4 text-stone-500 font-medium z-10">{caption}</p>

      {/* Large Outline Background Icon at bottom right */}
      <div className={cn("absolute right-4 bottom-2 pointer-events-none select-none w-16 h-16 flex items-center justify-center opacity-20 transition-all duration-500 ease-out group-hover:scale-105", iconColor)}>
        {React.cloneElement(icon, { className: "w-16 h-16 stroke-[0.75]" })}
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
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-stone-850 tracking-tight">{label}</span>
        <span className="text-[11px] font-bold text-[#4A751D] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50 shadow-sm shrink-0">
          {value}/{total} · {percentage}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-stone-100 border border-stone-200/20 overflow-hidden relative">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", accent)}
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
    <div className="rounded-xl border border-stone-200 bg-[#fafafa]/50 p-4.5 relative overflow-hidden flex flex-col justify-between min-h-[110px] transition-all duration-200 hover:border-stone-300">
      <div>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-2 mt-2">
          {icon && <span className="text-[#4A751D]">{icon}</span>}
          <p className="text-base font-black text-forest-950">{value}</p>
        </div>
      </div>
      <p className="mt-2 text-[10px] leading-4 text-stone-500 font-semibold">{caption}</p>
    </div>
  );
}
