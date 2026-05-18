"use client";

import { useActionState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Coffee, Lock } from "lucide-react";
import { loginAdmin } from "@/actions/auth-actions";
import type { Locale } from "@/i18n/routing";

export default function AdminLoginPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Admin");

  const boundLogin = loginAdmin.bind(null, locale);
  const [state, action, isPending] = useActionState(boundLogin, undefined);

  return (
    <div className="min-h-screen bg-forest-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ember/10 border border-ember/20 mb-4">
            <Coffee className="w-8 h-8 text-ember" />
          </div>
          <h1 className="font-serif text-3xl text-parchment-50">{t("loginTitle")}</h1>
          <p className="mt-2 text-sm text-white/50">{t("loginDesc")}</p>
        </div>

        {/* Form */}
        <form action={action} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">
              {t("email")}
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/25 focus:border-ember focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-ember/30 transition"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">
              {t("password")}
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/25 focus:border-ember focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-ember/30 transition"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {t("loginError")}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-13 flex items-center justify-center gap-2.5 rounded-xl bg-ember hover:bg-ember/90 text-white font-bold text-[15px] shadow-[0_8px_24px_rgba(181,101,0,0.3)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 py-3.5"
          >
            <Lock className="w-4 h-4" />
            {isPending ? t("loggingIn") : t("loginButton")}
          </button>
        </form>
      </div>
    </div>
  );
}
