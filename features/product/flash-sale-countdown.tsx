"use client";

import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";
import {Zap} from "lucide-react";

type TimeParts = {h: string; m: string; s: string};

export function FlashSaleCountdown({
  remaining = 23,
  total = 30
}: {
  remaining?: number;
  total?: number;
}) {
  const t = useTranslations("Product");
  const [time, setTime] = useState<TimeParts | null>(null);

  useEffect(() => {
    function tick() {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0); // đếm ngược đến nửa đêm
      const diff = Math.max(0, end.getTime() - now.getTime());
      setTime({
        h: String(Math.floor(diff / 3_600_000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60_000) / 1000)).padStart(2, "0")
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const percent = Math.min(100, Math.max(0, Math.round((remaining / total) * 100)));

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#e65c00] to-[#ff8c00] px-5 py-4 shadow-[0_8px_24px_rgba(230,92,0,0.25)]">
      {/* Halftone dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
          backgroundSize: "14px 14px"
        }}
      />

      {/* Lightning flash overlay */}
      <div className="pointer-events-none absolute inset-0 animate-lightning bg-white" />

      {/* Lightning bolt streak */}
      <svg
        className="pointer-events-none absolute -top-2 right-[28%] h-20 w-12 animate-lightning"
        viewBox="0 0 40 80"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M24 0L6 44h12L14 80l22-50H22L24 0z"
          fill="#fff"
          style={{filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9))"}}
        />
      </svg>

      {/* Row 1: label + countdown */}
      <div className="relative flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-[14px] font-bold text-white">
          <Zap className="h-4 w-4 animate-bolt-flicker fill-white" />
          {t("flashEndsIn")}
        </span>
        <div className="flex items-center gap-1.5">
          {[time?.h ?? "--", time?.m ?? "--", time?.s ?? "--"].map((part, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="min-w-[34px] rounded-md bg-[#7a2e00]/60 px-1.5 py-1 text-center font-mono text-[16px] font-bold tabular-nums text-white">
                {part}
              </span>
              {i < 2 && <span className="text-[14px] font-bold text-white/80">:</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: progress bar (tỉ lệ suất còn lại) */}
      <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/35">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#ffd166] to-[#ffe7a8] transition-[width] duration-700 ease-out"
          style={{width: `${percent}%`}}
        />
      </div>

      {/* Row 3: slots left */}
      <p className="relative mt-2 text-right text-[13px] font-bold text-white">
        {t("flashSlots", {remaining, total})}
      </p>
    </div>
  );
}
