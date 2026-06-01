"use client";

import {useEffect, useState, type ReactNode} from "react";
import {App as AntApp, ConfigProvider, Dropdown, Modal} from "antd";
import viVN from "antd/locale/vi_VN";
import {
  ChevronDown,
  Coffee,
  FileText,
  Home,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingBag,
  Tags,
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
  const isProductCategories = pathname.includes("/admin/product-categories");
  const isProducts = pathname.includes("/admin/products");
  const isOrders = pathname.includes("/admin/orders");
  const navItems = [
    {
      key: "dashboard",
      href: "/admin",
      label: t("dashboard"),
      active: isDashboard,
      icon: <LayoutDashboard className="h-5 w-5" />,
      mobileIcon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      key: "registrations",
      href: "/admin/registrations",
      label: t("registrations"),
      active: isRegistrations,
      icon: <Users className="h-5 w-5" />,
      mobileIcon: <Users className="h-4 w-4" />
    },
    {
      key: "articles",
      href: "/admin/articles",
      label: t("articles"),
      active: isArticles,
      icon: <FileText className="h-5 w-5" />,
      mobileIcon: <FileText className="h-4 w-4" />
    },
    {
      key: "products",
      href: "/admin/products",
      label: t("products"),
      active: isProducts,
      icon: <Package className="h-5 w-5" />,
      mobileIcon: <Package className="h-4 w-4" />
    },
    {
      key: "productCategories",
      href: "/admin/product-categories",
      label: t("productCategories"),
      active: isProductCategories,
      icon: <Tags className="h-5 w-5" />,
      mobileIcon: <Tags className="h-4 w-4" />
    },
    {
      key: "orders",
      href: "/admin/orders",
      label: t("orders"),
      active: isOrders,
      icon: <ShoppingBag className="h-5 w-5" />,
      mobileIcon: <ShoppingBag className="h-4 w-4" />
    }
  ];
  const currentNav = navItems.find((item) => item.active) ?? navItems[0];

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
      locale={viVN}
      theme={{
        cssVar: {key: "wecacha-admin"},
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
        <div className="admin-shell flex h-dvh overflow-hidden bg-[#fafafa]">
      <aside
        className={cn(
          "relative hidden h-full shrink-0 border-r border-[#ffffff]/5 bg-gradient-to-b from-[#081a07] via-[#051404] to-[#020901] text-stone-300 transition-[width] duration-300 ease-in-out lg:flex lg:flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-20",
          isSidebarCollapsed ? "w-20" : "w-72"
        )}
      >
        <div
          className={cn(
            "flex items-center border-b border-stone-800/40 py-6 px-6 bg-[#041203]/40 backdrop-blur-sm",
            isSidebarCollapsed && "justify-center px-3"
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-ember to-amber-700 shadow-md">
              <Coffee className="h-5 w-5 text-white" />
            </div>
            <span className={cn("truncate font-serif text-xl font-bold text-parchment-50 tracking-wider", isSidebarCollapsed && "sr-only")}>
              {t("cms")}
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4 pt-6">
          {navItems.map((item) => (
            <AdminNavLink
              key={item.key}
              href={item.href}
              label={item.label}
              active={item.active}
              collapsed={isSidebarCollapsed}
              onNavigateStart={handleNavigateStart}
              icon={item.icon}
            />
          ))}
        </nav>

      </aside>

      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-stone-200/60 bg-white/95 backdrop-blur-md px-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] sm:px-8 z-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((value) => !value)}
              className="hidden lg:inline-flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 transition hover:bg-stone-50 hover:text-forest-950 shadow-sm"
              aria-label={isSidebarCollapsed ? t("expandSidebar") : t("collapseSidebar")}
            >
              {isSidebarCollapsed ? <PanelLeftOpen className="h-4.5 w-4.5" /> : <PanelLeftClose className="h-4.5 w-4.5" />}
            </button>

            <h1 className="flex min-w-0 items-center gap-2 text-[14px] font-black tracking-wider text-forest-950 uppercase">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-ember/10 text-ember">
                <LayoutDashboard className="h-4 w-4" />
              </span>
              <span className="truncate">{t("systemTitle")}</span>
            </h1>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              menu={{
                items: navItems.map((item) => ({
                  key: item.key,
                  icon: item.mobileIcon,
                  label: (
                    <Link href={item.href} onClick={() => handleNavigateStart(item.href)}>
                      {item.label}
                    </Link>
                  )
                }))
              }}
            >
              <button
                type="button"
                className="inline-flex h-10 min-w-0 items-center gap-2 rounded-full border border-stone-200 bg-[#fafaf8] px-3 text-sm font-semibold text-forest-950 transition-colors hover:border-ember/40 hover:text-ember lg:hidden"
                aria-label={t("adminMenu")}
              >
                <Menu className="h-4 w-4 shrink-0" />
                <span className="max-w-[32vw] truncate sm:max-w-[220px]">{currentNav.label}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-stone-400" />
              </button>
            </Dropdown>

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

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#fafafa] p-5 sm:p-8">
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
        "flex items-center gap-3 rounded-xl transition-all duration-300",
        compact
          ? "h-10 px-3 text-[11px] font-extrabold uppercase tracking-wider"
          : collapsed
            ? "h-12 justify-center px-0 text-sm font-semibold"
            : "px-4 py-3 text-sm font-bold",
        active
          ? "bg-gradient-to-r from-[#b56500] to-[#d68524] text-white shadow-[0_4px_16px_rgba(181,101,0,0.25)] scale-[1.02]"
          : "text-stone-400 hover:bg-white/5 hover:text-white pl-4.5 hover:pl-5"
      )}
    >
      {icon}
      <span className={cn(compact ? "hidden sm:inline" : undefined, collapsed && "sr-only")}>{label}</span>
    </Link>
  );
}
