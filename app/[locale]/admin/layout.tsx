"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { LayoutDashboard, Users, FileText, Coffee, LogOut } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { logoutAdmin } from "@/actions/auth-actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Admin");

  const isRegistrations = pathname.includes("/admin/registrations");
  const isArticles = pathname.includes("/admin/articles");

  const handleLogout = async () => {
    await logoutAdmin(locale);
  };

  return (
    <div className="flex min-h-screen bg-stone-100">
      <aside className="w-64 bg-forest-950 text-stone-300 flex flex-col">
        <div className="p-6 flex items-center gap-3 text-parchment-50 border-b border-white/10">
          <Coffee className="h-6 w-6 text-ember" />
          <span className="font-serif text-xl font-bold">{t("cms")}</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/registrations"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isRegistrations ? "bg-ember text-white" : "hover:bg-white/10 hover:text-white"
            }`}
          >
            <Users className="h-5 w-5" />
            <span className="font-medium">{t("registrations")}</span>
          </Link>

          <Link
            href="/admin/articles"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              isArticles ? "bg-ember text-white" : "hover:bg-white/10 hover:text-white"
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="font-medium">{t("articles")}</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/" className="block text-sm text-center text-stone-400 hover:text-white transition">
            {t("backHome")}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center px-8 shadow-sm">
          <h1 className="text-lg font-bold text-forest-950 flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-ember" />
            {t("systemTitle")}
          </h1>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
