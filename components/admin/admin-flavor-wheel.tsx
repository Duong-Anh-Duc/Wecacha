"use client";

import {useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {X} from "lucide-react";
import {useTranslations} from "next-intl";
import {FlavorWheel, type WheelSelection} from "@/features/flavor-quiz/flavor-quiz-page";
import {flavorQuizzes, tx} from "@/features/flavor-quiz/flavor-quizzes";
import type {FlavorKey} from "@/features/flavor-quiz/data";
import type {Locale} from "@/i18n/routing";

type Counts = Record<string, {clicks: number; submits: number}>;

export function AdminFlavorWheel({
  locale,
  counts
}: {
  locale: Locale;
  counts: Counts;
}) {
  const t = useTranslations("FlavorQuiz");
  const isVi = locale === "vi";
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorKey>("fruity");
  const [selectedItem, setSelectedItem] = useState<WheelSelection>({
    groupKey: "fruity",
    groupLabelKey: "flavors.fruity.label",
    itemLabelKey: "flavors.fruity.label",
    level: "group",
    color: "#ee1d23"
  });

  const active = activeGroupKey ? flavorQuizzes[activeGroupKey] : null;
  const activeCount = activeGroupKey ? counts[activeGroupKey] : undefined;

  return (
    <div className="overflow-hidden rounded-2xl border border-forest-950/10 bg-white p-3 shadow-sm sm:p-5">
      <p className="mb-2 px-2 text-sm font-semibold text-stone-500">
        {isVi
          ? "Nhấn vào một múi để xem số người đã chọn vị đó."
          : "Click a slice to see how many people picked that flavor."}
      </p>
      <FlavorWheel
        idPrefix="admin"
        t={t}
        activeKeys={[selectedFlavor]}
        selectedFlavor={selectedFlavor}
        onSelect={setSelectedFlavor}
        onItemSelect={setSelectedItem}
        selectedItem={selectedItem}
        onPickFlavor={setActiveGroupKey}
        variant="poster"
        locale={locale}
      />

      <AnimatePresence>
        {active && (
          <motion.div
            key="admin-flavor-modal"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.2}}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-forest-950/40 p-4 backdrop-blur-[2px]"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveGroupKey(null);
            }}
          >
            <motion.div
              initial={{opacity: 0, scale: 0.95, y: 20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.95, y: 20}}
              transition={{duration: 0.25, ease: [0.16, 1, 0.3, 1]}}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-[0_40px_120px_rgba(10,24,10,0.3)]"
            >
              <button
                type="button"
                onClick={() => setActiveGroupKey(null)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-forest-950/10 text-forest-950/50 transition hover:bg-forest-950 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="text-xs font-black uppercase tracking-[0.16em] text-earth-700">
                {isVi ? "Hương vị" : "Flavor"}
              </p>
              <h3 className="mt-1 font-serif text-2xl text-forest-950">{tx(active.name, locale)}</h3>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-forest-950/10 bg-[#fff8ed] p-4">
                  <p className="text-3xl font-black text-[#a46131]">
                    {(activeCount?.clicks ?? 0).toLocaleString(isVi ? "vi-VN" : "en-US")}
                  </p>
                  <p className="mt-1 text-xs font-bold text-forest-950/60">
                    {isVi ? "lượt chọn (click)" : "selections (click)"}
                  </p>
                </div>
                <div className="rounded-2xl border border-forest-950/10 bg-[#eef4ee] p-4">
                  <p className="text-3xl font-black text-[#17351f]">
                    {(activeCount?.submits ?? 0).toLocaleString(isVi ? "vi-VN" : "en-US")}
                  </p>
                  <p className="mt-1 text-xs font-bold text-forest-950/60">
                    {isVi ? "hoàn thành quiz" : "quiz completions"}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
