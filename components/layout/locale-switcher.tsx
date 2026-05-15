"use client";

import {useRouter} from "@/i18n/navigation";
import {localeNames} from "@/lib/site";
import {cn} from "@/lib/utils";
import type {Locale} from "@/i18n/routing";
import {localeFlag} from "./nav-config";

export function LocaleSwitcher({
  locale,
  pathname,
  solid,
  onLoading
}: {
  locale: Locale;
  pathname: string;
  solid: boolean;
  onLoading: (v: boolean) => void;
}) {
  const nextLocale = locale === "vi" ? "en" : "vi";
  const router = useRouter();

  function handleSwitch() {
    onLoading(true);
    router.replace(pathname, {locale: nextLocale, scroll: false});
  }

  return (
    <button
      onClick={handleSwitch}
      className={cn(
        "hidden h-10 items-center justify-center gap-2 rounded-full border border-white/28 bg-white/8 px-4 text-[13px] font-semibold text-white backdrop-blur transition hover:bg-white/16 sm:inline-flex"
      )}
      aria-label={localeNames[nextLocale]}
    >
      <span className="text-base leading-none">{localeFlag[nextLocale]}</span>
      {localeNames[nextLocale]}
    </button>
  );
}
