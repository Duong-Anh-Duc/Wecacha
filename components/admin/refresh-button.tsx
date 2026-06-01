"use client";

import {useState, useTransition} from "react";
import {RefreshCw} from "lucide-react";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";

export function RefreshButton({className}: {className?: string}) {
  const router = useRouter();
  const t = useTranslations("Admin");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isPending, startTransition] = useTransition();

  function refresh() {
    setIsSpinning(true);
    startTransition(() => {
      router.refresh();
      window.setTimeout(() => setIsSpinning(false), 650);
    });
  }

  return (
    <button
      type="button"
      onClick={refresh}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-forest-950 shadow-sm transition hover:border-ember/40 hover:text-ember disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      <RefreshCw className={cn("h-4 w-4", isSpinning && "animate-spin")} />
      {t("refresh")}
    </button>
  );
}
