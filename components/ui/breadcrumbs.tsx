import Link from "next/link";
import {getLocale} from "next-intl/server";
import {ChevronRight} from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

const localeHref = (locale: string, href: string) => {
  if (href.startsWith("http")) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href;
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
};

export async function Breadcrumbs({
  items, 
  homeLabel = "Trang chủ", 
  theme = "light" 
}: { 
  items: BreadcrumbItem[], 
  homeLabel?: string,
  theme?: "light" | "dark"
}) {
  const isDark = theme === "dark";
  const primaryColor = isDark ? "text-ember" : "text-[#b5703a]";
  const hoverColor = isDark ? "hover:text-amber-400" : "hover:text-[#d38b54]";
  const arrowColor = isDark ? "text-white/40" : "text-[#142918]/30";
  const textColor = isDark ? "text-white/70" : "text-[#142918]/60";
  const locale = await getLocale();

  return (
    <div className={`flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] mb-5 ${primaryColor}`}>
      <Link href={localeHref(locale, "/")} className={`cursor-pointer hover:underline transition-colors ${hoverColor}`}>
        {homeLabel}
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className={arrowColor}>&gt;</span>
          {item.href ? (
            <Link href={localeHref(locale, item.href)} className={`cursor-pointer hover:underline transition-colors ${hoverColor}`}>
              {item.label}
            </Link>
          ) : (
            <span className={textColor}>{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
}
