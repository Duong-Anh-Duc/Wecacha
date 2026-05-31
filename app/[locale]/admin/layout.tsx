"use client";

import {useEffect, useState, type ReactNode} from "react";
import {App as AntApp, ConfigProvider, Dropdown, Modal} from "antd";
import {
  ChevronDown,
  Coffee,
  FileText,
  Home,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingBag,
  UserRound,
  Users
} from "lucide-react";
import {useLocale, useTranslations} from "next-intl";
import {usePathname} from "next/navigation";
import {logoutAdmin} from "@/actions/auth-actions";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {cn} from "@/lib/utils";

export default function AdminLayout({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations("Admin");
  const isLoginPage = pathname.includes("/admin/login");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (isLoginPage) {
      document.body.classList.remove("admin-shell-active");
      return;
    }

    document.body.classList.add("admin-shell-active");

    return () => {
      document.body.classList.remove("admin-shell-active");
    };
  }, [isLoginPage]);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  if (isLoginPage) {
    return children;
  }

  const isDashboard = pathname.endsWith("/admin");
  const isRegistrations = pathname.includes("/admin/registrations");
  const isArticles = pathname.includes("/admin/articles");
  const isProducts = pathname.includes("/admin/products");
  const isOrders = pathname.includes("/admin/orders");

  const handleLogout = async () => {
    await logoutAdmin(locale);
  };

  const handleNavigateStart = (href: string) => {
    const targetPath = href === "/" ? `/${locale}` : `/${locale}${href}`;

    if (pathname !== targetPath) {
      setPendingHref(href);
    }
  };

  const isRouteLoading = Boolean(pendingHref);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#b56500",
          colorInfo: "#4A751D",
          borderRadius: 12,
          fontFamily: "var(--font-sans)"
        },
        components: {
          Table: {
            headerBg: "#fafaf8",
            headerColor: "#57534e",
            rowHoverBg: "#fafaf8"
          },
          Button: {
            primaryShadow: "none"
          }
        }
      }}
    >
      <AntApp>
        <div className="admin-shell flex h-dvh overflow-hidden bg-[#f7f6f1]">
      <aside
        className={cn(
          "relative hidden h-full shrink-0 border-r border-white/10 bg-forest-950 text-stone-300 transition-[width] duration-200 ease-out lg:flex lg:flex-col",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-white/10 py-6 text-parchment-50 px-6",
            isSidebarCollapsed && "justify-center px-3"
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Coffee className="h-6 w-6 shrink-0 text-ember" />
            <span className={cn("truncate font-serif text-xl font-bold", isSidebarCollapsed && "sr-only")}>
              {t("cms")}
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <AdminNavLink
            href="/admin"
            label={t("dashboard")}
            active={isDashboard}
            collapsed={isSidebarCollapsed}
            onNavigateStart={handleNavigateStart}
            icon={<LayoutDashboard className="h-5 w-5" />}
          />
          <AdminNavLink
            href="/admin/registrations"
            label={t("registrations")}
            active={isRegistrations}
            collapsed={isSidebarCollapsed}
            onNavigateStart={handleNavigateStart}
            icon={<Users className="h-5 w-5" />}
          />
          <AdminNavLink
            href="/admin/articles"
            label={t("articles")}
            active={isArticles}
            collapsed={isSidebarCollapsed}
            onNavigateStart={handleNavigateStart}
            icon={<FileText className="h-5 w-5" />}
          />
          <AdminNavLink
            href="/admin/products"
            label={t("products")}
            active={isProducts}
            collapsed={isSidebarCollapsed}
            onNavigateStart={handleNavigateStart}
            icon={<Package className="h-5 w-5" />}
          />
          <AdminNavLink
            href="/admin/orders"
            label={t("orders")}
            active={isOrders}
            collapsed={isSidebarCollapsed}
            onNavigateStart={handleNavigateStart}
            icon={<ShoppingBag className="h-5 w-5" />}
          />
        </nav>

      </aside>

      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-5 shadow-sm sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((value) => !value)}
              className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-50 hover:text-forest-950 shadow-sm"
              aria-label={isSidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="h-4.5 w-4.5" /> : <PanelLeftClose className="h-4.5 w-4.5" />}
            </button>

            <h1 className="flex items-center gap-2 text-lg font-bold text-forest-950">
              <LayoutDashboard className="h-5 w-5 text-ember" />
              {t("systemTitle")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 lg:hidden">
              <AdminNavLink
                href="/admin"
                label={t("dashboard")}
                active={isDashboard}
                compact
                onNavigateStart={handleNavigateStart}
                icon={<LayoutDashboard className="h-4 w-4" />}
              />
              <AdminNavLink
                href="/admin/registrations"
                label={t("registrations")}
                active={isRegistrations}
                compact
                onNavigateStart={handleNavigateStart}
                icon={<Users className="h-4 w-4" />}
              />
              <AdminNavLink
                href="/admin/articles"
                label={t("articles")}
                active={isArticles}
                compact
                onNavigateStart={handleNavigateStart}
                icon={<FileText className="h-4 w-4" />}
              />
              <AdminNavLink
                href="/admin/products"
                label={t("products")}
                active={isProducts}
                compact
                onNavigateStart={handleNavigateStart}
                icon={<Package className="h-4 w-4" />}
              />
              <AdminNavLink
                href="/admin/orders"
                label={t("orders")}
                active={isOrders}
                compact
                onNavigateStart={handleNavigateStart}
                icon={<ShoppingBag className="h-4 w-4" />}
              />
            </div>

            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              menu={{
                items: [
                  {
                    key: "home",
                    icon: <Home className="h-4 w-4 text-[#4A751D]" />,
                    label: <Link href="/">{t("home")}</Link>
                  },
                  {
                    type: "divider"
                  },
                  {
                    key: "logout",
                    danger: true,
                    icon: <LogOut className="h-4 w-4" />,
                    label: t("logout"),
                    onClick: () => setIsLogoutConfirmOpen(true)
                  }
                ]
              }}
            >
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-stone-200 bg-[#fafaf8] px-2.5 text-sm font-semibold text-forest-950 transition-colors hover:border-ember/40 hover:text-ember"
                aria-label={t("profileMenu")}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest-950 text-parchment-50">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="hidden sm:inline">{t("adminProfile")}</span>
                <ChevronDown className="h-4 w-4 text-stone-400" />
              </button>
            </Dropdown>
          </div>
        </header>

        {isRouteLoading ? (
          <div className="pointer-events-none absolute left-1/2 top-20 z-30 -translate-x-1/2">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-forest-950 shadow-lg">
              <LoaderCircle className="h-4 w-4 animate-spin text-ember" />
              {t("routeLoading")}
            </div>
          </div>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f7f6f1] p-5 sm:p-8">
          {children}
        </div>
      </main>
        <Modal
          title={t("logoutConfirmTitle")}
          open={isLogoutConfirmOpen}
          onOk={handleLogout}
          onCancel={() => setIsLogoutConfirmOpen(false)}
          okText={t("logoutConfirmOk")}
          cancelText={t("logoutConfirmCancel")}
          okButtonProps={{danger: true}}
        >
          <p className="text-stone-600">{t("logoutConfirmDesc")}</p>
        </Modal>
        </div>
      </AntApp>
    </ConfigProvider>
  );
}

function AdminNavLink({
  href,
  label,
  active,
  icon,
  compact = false,
  collapsed = false,
  onNavigateStart
}: {
  href: string;
  label: string;
  active: boolean;
  icon: ReactNode;
  compact?: boolean;
  collapsed?: boolean;
  onNavigateStart?: (href: string) => void;
}) {
  return (
    <Link
      aria-label={label}
      title={collapsed ? label : undefined}
      href={href}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        onNavigateStart?.(href);
      }}
      className={cn(
        "flex items-center gap-3 rounded-xl transition-colors",
        compact
          ? "h-10 px-3 text-xs font-semibold"
          : collapsed
            ? "h-12 justify-center px-0 text-sm font-medium"
            : "px-4 py-3 text-sm font-medium",
        active
          ? "bg-ember text-white"
          : "text-stone-300 hover:bg-white/10 hover:text-white"
      )}
    >
      {icon}
      <span className={cn(compact ? "hidden sm:inline" : undefined, collapsed && "sr-only")}>{label}</span>
    </Link>
  );
}
