"use client";

import {useTranslations, useLocale} from "next-intl";
import {motion} from "framer-motion";
import {ShoppingBag, Star, Package} from "lucide-react";

export function RecentPurchasesMarquee() {
  const t = useTranslations("Home");
  const locale = useLocale();
  
  // Replace the simple strings with an array of objects to allow rich formatting
  const purchases = [
    {
      icon: ShoppingBag,
      name: locale === "vi" ? "Đinh Lan Hương" : "Dinh Lan Huong",
      location: locale === "vi" ? "Hà Nội" : "Hanoi",
      action: t("recentPurchases.buyPlum"),
      time: t("recentPurchases.time2m"),
      color: "text-rose-400"
    },
    {
      icon: Package,
      name: locale === "vi" ? "Phạm Quốc Bảo" : "Pham Quoc Bao",
      location: locale === "vi" ? "TP.HCM" : "HCMC",
      action: t("recentPurchases.buyGift"),
      time: t("recentPurchases.time15m"),
      color: "text-amber-400"
    },
    {
      icon: ShoppingBag,
      name: locale === "vi" ? "Vũ Phương Thảo" : "Vu Phuong Thao",
      location: locale === "vi" ? "Đà Nẵng" : "Da Nang",
      action: t("recentPurchases.buyHoney"),
      time: t("recentPurchases.time1h"),
      color: "text-emerald-400"
    },
    {
      icon: ShoppingBag,
      name: locale === "vi" ? "Bùi Quang Huy" : "Bui Quang Huy",
      location: locale === "vi" ? "Sơn La" : "Son La",
      action: t("recentPurchases.buyPhin"),
      time: t("recentPurchases.time2h"),
      color: "text-blue-400"
    },
    {
      icon: Star,
      name: locale === "vi" ? "Trần Minh Nhật" : "Tran Minh Nhat",
      location: locale === "vi" ? "Hải Phòng" : "Hai Phong",
      action: t("recentPurchases.rateArabica"),
      time: t("recentPurchases.time3h"),
      color: "text-yellow-500"
    }
  ];

  // We duplicate the array to create a seamless infinite scrolling effect
  const repeatedPurchases = [...purchases, ...purchases, ...purchases];

  return (
    <div className="w-full bg-[#030604] py-6 overflow-hidden relative border-y border-white/5 z-20">
      {/* Background cinematic glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-[#1a1005] to-forest-950 opacity-50" />
      
      {/* Gradient masks for smooth fade in/out at edges */}
      <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-48 bg-gradient-to-r from-[#030604] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-48 bg-gradient-to-l from-[#030604] to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex whitespace-nowrap items-center w-max relative z-0"
        animate={{ x: ["0%", "-33.333333%"] }}
        transition={{
          duration: 40,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {repeatedPurchases.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="flex items-center mx-3 sm:mx-4 bg-white/[0.03] border border-white/10 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 shadow-xl backdrop-blur-md hover:bg-white/[0.08] transition-colors"
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-black/40 border border-white/5 mr-4 shadow-inner ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#f4f2ea] font-semibold text-[13px] sm:text-[15px] tracking-wide">
                    {item.name}
                  </span>
                  <span className="text-white/30 text-[11px] sm:text-[13px] font-medium hidden sm:inline-block">
                    ({item.location})
                  </span>
                </div>
                <span className="text-white/60 text-[12px] sm:text-[14px] font-light">
                  {item.action}
                </span>
                <span className="text-[#b5703a]/70 text-[10px] sm:text-[12px] ml-1 sm:ml-3 font-medium uppercase tracking-wider">
                  {item.time}
                </span>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  );
}
