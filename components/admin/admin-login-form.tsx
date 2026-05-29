"use client";

import {useActionState} from "react";
import {Coffee, Lock} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {loginAdmin} from "@/actions/auth-actions";
import type {Locale} from "@/i18n/routing";

export function AdminLoginForm() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Admin");

  const boundLogin = loginAdmin.bind(null, locale);
  const [state, action, isPending] = useActionState(boundLogin, undefined);

  return (
    <div className="min-h-screen bg-forest-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-ember/20 bg-ember/10">
            <Coffee className="h-8 w-8 text-ember" />
          </div>
          <h1 className="font-serif text-3xl text-parchment-50">{t("loginTitle")}</h1>
          <p className="mt-2 text-sm text-white/50">{t("loginDesc")}</p>
        </div>

        <form action={action} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">
              {t("email")}
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/25 transition focus:border-ember focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-ember/30"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">
              {t("password")}
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/25 transition focus:border-ember focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-ember/30"
              placeholder="••••••••"
            />
          </div>

          {state?.error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {t("loginError")}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="flex h-13 w-full items-center justify-center gap-2.5 rounded-xl bg-ember py-3.5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(181,101,0,0.3)] transition-all hover:-translate-y-0.5 hover:bg-ember/90 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {isPending ? t("loggingIn") : t("loginButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
