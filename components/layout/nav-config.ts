import {
  Coffee,
  Globe2,
  HelpCircle,
  Store
} from "lucide-react";
import type {Locale} from "@/i18n/routing";

export type DropdownItem = {
  href: string;
  label: Record<"vi" | "en", string>;
};

export type NavItem = {
  href: string;
  key: string;
  icon: any;
  children?: DropdownItem[];
};

export const navItems: NavItem[] = [
  { href: "/", key: "home", icon: Coffee },
  {
    href: "/shop",
    key: "shop",
    icon: Store,
    children: [
      { href: "/shop", label: { vi: "Tất cả sản phẩm", en: "All Products" } },
      { href: "/shop/category/beans", label: { vi: "Cà phê hạt", en: "Whole Beans" } },
      { href: "/shop/category/phin", label: { vi: "Cà phê pha phin", en: "Phin Coffee" } },
      { href: "/shop/category/gifts", label: { vi: "Bộ quà tặng", en: "Gift Sets" } }
    ]
  },
  {
    href: "/explore",
    key: "explore",
    icon: Globe2
  },
  {
    href: "/faq",
    key: "support",
    icon: HelpCircle,
    children: [
      { href: "/faq", label: { vi: "FAQ - Hỏi đáp", en: "FAQ" } },
      { href: "/return-policy", label: { vi: "Chính sách đổi trả", en: "Return Policy" } },
      { href: "/contact", label: { vi: "Liên hệ", en: "Contact" } }
    ]
  }
];

export const drawerEase = [0.16, 1, 0.3, 1] as const;

export const localeFlag: Record<Locale, string> = {vi: "🇻🇳", en: "🇬🇧"};
