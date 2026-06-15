"use client";

import {useMemo, useState} from "react";
import {DatePicker} from "antd";
import dayjs from "dayjs";

const DAY_MS = 86_400_000;

function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}
function fmtKey(ms: number) {
  return new Date(ms).toISOString().slice(0, 10);
}
function fullLabel(key: string) {
  const [y, m, d] = key.split("-");
  return `${d}/${m}/${y}`;
}

export function SubmissionsTimeChart({
  dayCounts,
  defaultFrom,
  defaultTo,
  total,
  isVi
}: {
  dayCounts: Record<string, number>;
  defaultFrom: string;
  defaultTo: string;
  total: number;
  isVi: boolean;
}) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [hover, setHover] = useState<number | null>(null);

  const days = useMemo(() => {
    let start = parseKey(from);
    let end = parseKey(to);
    if (Number.isNaN(start) || Number.isNaN(end)) return [];
    if (end < start) [start, end] = [end, start];
    const out: {key: string; value: number}[] = [];
    for (let t = start; t <= end && out.length < 400; t += DAY_MS) {
      const k = fmtKey(t);
      out.push({key: k, value: dayCounts[k] ?? 0});
    }
    return out;
  }, [from, to, dayCounts]);

  const rangeTotal = days.reduce((s, d) => s + d.value, 0);
  const maxDaily = Math.max(1, ...days.map((d) => d.value));

  // Chart geometry — line/area chart with OX/OY axes (always shown, even at 0).
  const n = days.length;
  const padL = 38;
  const padR = 14;
  const padT = 14;
  const padB = 26;
  const H = 240;
  const innerH = H - padT - padB;
  const perDayW = n > 90 ? 9 : n > 45 ? 16 : n > 20 ? 30 : 48;
  const W = Math.max(560, padL + padR + n * perDayW);
  const innerW = W - padL - padR;
  const yStep = Math.max(1, Math.ceil(maxDaily / 4));
  const yMax = yStep * 4;
  const yTicks = [0, 1, 2, 3, 4].map((k) => k * yStep);
  const xAt = (i: number) => (n <= 1 ? padL + innerW / 2 : padL + (i / (n - 1)) * innerW);
  const yAt = (v: number) => padT + innerH - (v / yMax) * innerH;
  const linePath = days.map((d, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(d.value)}`).join(" ");
  const areaPath = `${linePath} L${xAt(n - 1)},${yAt(0)} L${xAt(0)},${yAt(0)} Z`;

  return (
    <div className="rounded-2xl border border-forest-950/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h3 className="text-base font-bold text-forest-950">
            {isVi ? "Lượt nộp form theo ngày" : "Form submissions per day"}
          </h3>
          <p className="mt-1 text-xs font-semibold text-stone-400">
            {isVi ? "Trong khoảng đã chọn" : "In selected range"}:{" "}
            <span className="font-black text-forest-950">{rangeTotal}</span>
            <span className="mx-1.5 text-stone-300">·</span>
            {isVi ? "Tổng" : "Total"}: <span className="font-black text-forest-950">{total}</span>
          </p>
        </div>

        <DatePicker.RangePicker
          value={[dayjs(from), dayjs(to)]}
          format="DD/MM/YYYY"
          allowClear={false}
          maxDate={dayjs(defaultTo)}
          size="large"
          placeholder={[isVi ? "Từ ngày" : "From", isVi ? "Đến ngày" : "To"]}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setFrom(dates[0].format("YYYY-MM-DD"));
              setTo(dates[1].format("YYYY-MM-DD"));
            }
          }}
        />
      </div>

      {days.length === 0 ? (
        <p className="mt-6 text-center text-sm font-medium text-stone-400">
          {isVi ? "Khoảng ngày không hợp lệ." : "Invalid date range."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto pb-1">
          <div className="relative" style={{width: W}} onMouseLeave={() => setHover(null)}>
          <svg width={W} height={H} className="block">
            <defs>
              <linearGradient id="submitArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Y gridlines + labels */}
            {yTicks.map((v) => (
              <g key={v}>
                <line x1={padL} y1={yAt(v)} x2={W - padR} y2={yAt(v)} stroke="#f0eee9" strokeWidth="1" />
                <text x={padL - 8} y={yAt(v) + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
                  {v}
                </text>
              </g>
            ))}

            {/* OY + OX axes */}
            <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke="#d6d3d1" strokeWidth="1.5" />
            <line x1={padL} y1={yAt(0)} x2={W - padR} y2={yAt(0)} stroke="#d6d3d1" strokeWidth="1.5" />

            {/* Area + line */}
            <path d={areaPath} fill="url(#submitArea)" />
            <path
              d={linePath}
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Hover guide line */}
            {hover !== null && (
              <line
                x1={xAt(hover)}
                y1={padT}
                x2={xAt(hover)}
                y2={yAt(0)}
                stroke="#16a34a"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.5"
              />
            )}

            {/* Dots on non-zero days */}
            {days.map((d, i) =>
              d.value > 0 ? (
                <circle key={d.key} cx={xAt(i)} cy={yAt(d.value)} r="4" fill="#15803d" stroke="#fff" strokeWidth="1.6" />
              ) : null
            )}

            {/* Highlight the hovered point */}
            {hover !== null && (
              <circle
                cx={xAt(hover)}
                cy={yAt(days[hover].value)}
                r="6"
                fill="#15803d"
                stroke="#fff"
                strokeWidth="2"
              />
            )}

            {/* Invisible hover columns — for every day, incl. zero days */}
            {days.map((d, i) => (
              <rect
                key={d.key}
                x={xAt(i) - innerW / Math.max(1, n) / 2}
                y={padT}
                width={innerW / Math.max(1, n)}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            ))}
          </svg>

          {hover !== null && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-forest-950 px-2.5 py-1.5 text-center shadow-lg"
              style={{left: xAt(hover), top: yAt(days[hover].value) - 12}}
            >
              <div className="text-[10px] font-semibold text-white/65">{fullLabel(days[hover].key)}</div>
              <div className="text-sm font-black text-white">
                {days[hover].value} {isVi ? "lượt nộp" : "submissions"}
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}
