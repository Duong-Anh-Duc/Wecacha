"use client";

import {useEffect, useState, type ReactNode} from "react";
import {App as AntApp, ConfigProvider, Dropdown, Modal} from "antd";
import {
  ChevronDown,
  Coffee,
  FileText,
  Home,
  LayoutDashboard,
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
        <div className="admin-shell flex min-h-screen bg-[#f7f6f1]">
      <aside
        className={cn(
          "relative hidden shrink-0 border-r border-white/10 bg-forest-950 text-stone-300 transition-[width] duration-300 lg:flex lg:flex-col",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-white/10 py-6 text-parchment-50",
            isSidebarCollapsed ? "justify-center px-3" : "justify-between px-6"
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Coffee className="h-6 w-6 shrink-0 text-ember" />
            <span className={cn("truncate font-serif text-xl font-bold", isSidebarCollapsed && "sr-only")}>
              {t("cms")}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((value) => !value)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-white/10 hover:text-parchment-50",
              isSidebarCollapsed && "absolute left-[4.4rem] top-5 bg-forest-950 shadow-lg"
            )}
            aria-label={isSidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <AdminNavLink
            href="/admin"
            label={t("dashboard")}
            active={isDashboard}
            collapsed={isSidebarCollapsed}
            icon={<LayoutDashboard className="h-5 w-5" />}
          />
          <AdminNavLink
            href="/admin/registrations"
            label={t("registrations")}
            active={isRegistrations}
            collapsed={isSidebarCollapsed}
            icon={<Users className="h-5 w-5" />}
          />
          <AdminNavLink
            href="/admin/articles"
            label={t("articles")}
            active={isArticles}
            collapsed={isSidebarCollapsed}
            icon={<FileText className="h-5 w-5" />}
          />
          <AdminNavLink
            href="/admin/products"
            label={t("products")}
            active={isProducts}
            collapsed={isSidebarCollapsed}
            icon={<Package className="h-5 w-5" />}
          />
          <AdminNavLink
            href="/admin/orders"
            label={t("orders")}
            active={isOrders}
            collapsed={isSidebarCollapsed}
            icon={<ShoppingBag className="h-5 w-5" />}
          />
        </nav>

      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-5 shadow-sm sm:px-8">
          <h1 className="flex items-center gap-2 text-lg font-bold text-forest-950">
            <LayoutDashboard className="h-5 w-5 text-ember" />
            {t("systemTitle")}
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 lg:hidden">
              <AdminNavLink
                href="/admin"
                label={t("dashboard")}
                active={isDashboard}
                compact
                icon={<LayoutDashboard className="h-4 w-4" />}
              />
              <AdminNavLink
                href="/admin/registrations"
                label={t("registrations")}
                active={isRegistrations}
                compact
                icon={<Users className="h-4 w-4" />}
              />
              <AdminNavLink
                href="/admin/articles"
                label={t("articles")}
                active={isArticles}
                compact
                icon={<FileText className="h-4 w-4" />}
              />
              <AdminNavLink
                href="/admin/products"
                label={t("products")}
                active={isProducts}
                compact
                icon={<Package className="h-4 w-4" />}
              />
              <AdminNavLink
                href="/admin/orders"
                label={t("orders")}
                active={isOrders}
                compact
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
                className="inline-flex h-10 items-center gap-2 rounded-full border border-stone-200 bg-[#fafaf8] px-2.5 text-sm font-semibold text-forest-950 transition hover:border-ember/40 hover:text-ember"
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

        <div className="flex-1 overflow-auto bg-[#f7f6f1] p-5 sm:p-8">{children}</div>
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
  collapsed = false
}: {
  href: string;
  label: string;
  active: boolean;
  icon: ReactNode;
  compact?: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link
      aria-label={label}
      title={collapsed ? label : undefined}
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl transition",
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
