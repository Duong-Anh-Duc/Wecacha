"use client";

import {useMemo, useRef, useState, type CSSProperties} from "react";
import Link from "next/link";
import {AnimatePresence, motion} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bean,
  Candy,
  Check,
  Cherry,
  ChevronRight,
  Coffee,
  Flame,
  Flower2,
  Leaf,
  RotateCcw,
  Soup,
  Sparkles,
  Sprout,
  Wine,
  X,
  type LucideIcon
} from "lucide-react";
import {useTranslations} from "next-intl";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content/types";
import {formatCurrency, localized} from "@/lib/content/helpers";
import {cn} from "@/lib/utils";
import {flavors, productKeywords, questions, type FlavorKey, type FlavorScore} from "./data";
import {flavorQuizzes, tx} from "./flavor-quizzes";
import {recordFlavorEvent} from "@/actions/flavor-actions";


type FlavorQuizPageProps = {
  locale: Locale;
  products: Product[];
  flavorCounts?: Record<string, {clicks: number; submits: number}>;
};

type QuizStage = "intro" | "quiz" | "result";

type WheelChild = {
  id: string;
  labelKey: string;
  color: string;
  leaves: string[];
};

type WheelGroup = {
  key: FlavorKey | string;
  labelKey: string;
  color: string;
  weight: number;
  children: WheelChild[];
};

export type WheelSelection = {
  groupKey: string;
  groupLabelKey: string;
  itemLabelKey: string;
  level: "group" | "family" | "note";
  color: string;
};

const profileMatchers: {
  id: "bright" | "balanced" | "bold";
  keys: FlavorKey[];
}[] = [
  {id: "bright", keys: ["fruity", "citrus", "floral"]},
  {id: "balanced", keys: ["chocolate", "sweet", "nutty"]},
  {id: "bold", keys: ["roasted", "earthy", "chocolate"]}
];

const wheelGroups: WheelGroup[] = [
  {
    key: "floral",
    labelKey: "flavors.floral.label",
    color: "#ec008c",
    weight: 4,
    children: [
      { id: "blackTea", labelKey: "wheel.blackTea", color: "#ae667d", leaves: [] },
      { id: "flower", labelKey: "wheel.flower", color: "#f05794", leaves: ["chamomile", "rose", "jasmine"] }
    ]
  },
  {
    key: "fruity",
    labelKey: "flavors.fruity.label",
    color: "#ee1d23",
    weight: 18,
    children: [
      { id: "berryFruit", labelKey: "wheel.berryFruit", color: "#ed2c4b", leaves: ["blackberry", "raspberry", "blueberry", "strawberry"] },
      { id: "driedFruit", labelKey: "wheel.driedFruit", color: "#d7444f", leaves: ["raisin", "prune"] },
      { id: "otherFruit", labelKey: "wheel.otherFruit", color: "#f26648", leaves: ["coconut", "cherry", "pomegranate", "pineapple", "grape", "apple", "peach", "pear"] },
      { id: "citrusFruit", labelKey: "wheel.citrusFruit", color: "#fcb914", leaves: ["grapefruit", "orange", "lemon", "lime"] }
    ]
  },
  {
    key: "sourFermented",
    labelKey: "wheel.sourFermented",
    color: "#c2b21a",
    weight: 9,
    children: [
      { id: "sour", labelKey: "wheel.sour", color: "#e2d925", leaves: ["sourAroma", "vinegar", "yogurt", "isovalericAcid", "citricAcid", "malicAcid"] },
      { id: "fermented", labelKey: "wheel.fermented", color: "#b2a113", leaves: ["wine", "whisky", "ferment", "overripe"] }
    ]
  },
  {
    key: "green",
    labelKey: "wheel.green",
    color: "#17803b",
    weight: 10,
    children: [
      { id: "oliveOil", labelKey: "wheel.oliveOil", color: "#a0b127", leaves: [] },
      { id: "raw", labelKey: "wheel.raw", color: "#6c8c39", leaves: [] },
      { id: "green", labelKey: "wheel.green", color: "#21b252", leaves: ["underRipe", "peapod", "fresh", "darkGreen", "vegetative", "hay", "herb"] },
      { id: "beany", labelKey: "wheel.beany", color: "#6f9f95", leaves: [] }
    ]
  },
  {
    key: "other",
    labelKey: "wheel.other",
    color: "#7ba6bc",
    weight: 9,
    children: [
      { id: "earth", labelKey: "wheel.earth", color: "#9bbccc", leaves: ["stale", "cardboard", "papery", "woody", "moldy", "dust", "dampEarth", "animal", "meatyBrothy", "phenolic"] },
      { id: "chemical", labelKey: "wheel.chemical", color: "#61c6dd", leaves: ["bitter", "salty", "rubber", "wintergreen", "petrol", "medicinal"] }
    ]
  },
  {
    key: "roasted",
    labelKey: "flavors.roasted.label",
    color: "#d33727",
    weight: 8,
    children: [
      { id: "tobacco", labelKey: "wheel.tobacco", color: "#cfb480", leaves: [] },
      { id: "pipeTobacco", labelKey: "wheel.pipeTobacco", color: "#bda06a", leaves: [] },
      { id: "roasted", labelKey: "wheel.roasted", color: "#b6804d", leaves: ["acrid", "ashy", "smoke", "toast"] },
      { id: "cereal", labelKey: "wheel.cereal", color: "#e4bd2d", leaves: ["grain", "malt"] }
    ]
  },
  {
    key: "spicy",
    labelKey: "flavors.spicy.label",
    color: "#b90d41",
    weight: 6,
    children: [
      { id: "drySpice", labelKey: "wheel.drySpice", color: "#be404c", leaves: ["licorice", "nutmeg", "cinnamon", "clove"] },
      { id: "pepper", labelKey: "wheel.pepper", color: "#bc4747", leaves: [] },
      { id: "pungent", labelKey: "wheel.pungent", color: "#734864", leaves: [] }
    ]
  },
  {
    key: "nutty",
    labelKey: "flavors.nutty.label",
    color: "#9a7b79",
    weight: 5,
    children: [
      { id: "nut", labelKey: "wheel.nut", color: "#b59287", leaves: ["peanut", "hazelnut", "almond"] },
      { id: "cacao", labelKey: "wheel.cacao", color: "#b37122", leaves: ["cocoa", "darkChocolate"] }
    ]
  },
  {
    key: "sweet",
    labelKey: "flavors.sweet.label",
    color: "#f36421",
    weight: 8,
    children: [
      { id: "brownSugar", labelKey: "wheel.brownSugar", color: "#ce7c92", leaves: ["molasses", "maple", "caramel", "honey"] },
      { id: "vanilla", labelKey: "wheel.vanilla", color: "#f6997d", leaves: [] },
      { id: "vanillin", labelKey: "wheel.vanillin", color: "#f38088", leaves: [] },
      { id: "overallSweet", labelKey: "wheel.overallSweet", color: "#de707a", leaves: [] },
      { id: "sweetAroma", labelKey: "wheel.sweetAroma", color: "#ce3e6c", leaves: [] }
    ]
  }
];

const WHEEL_CENTER = 700;

function svgNumber(value: number) {
  return Number(value.toFixed(3));
}

function polarToCartesian(cx: number, cy: number, radius: number, angle: number) {
  const angleInRadians = ((angle - 90) * Math.PI) / 180;
  return {
    x: svgNumber(cx + radius * Math.cos(angleInRadians)),
    y: svgNumber(cy + radius * Math.sin(angleInRadians))
  };
}

function describeSegment(startAngle: number, endAngle: number, inner: number, outer: number, center = WHEEL_CENTER) {
  const outerStart = polarToCartesian(center, center, outer, startAngle);
  const outerEnd = polarToCartesian(center, center, outer, endAngle);
  const innerStart = polarToCartesian(center, center, inner, startAngle);
  const innerEnd = polarToCartesian(center, center, inner, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outer} ${outer} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${inner} ${inner} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z"
  ].join(" ");
}

function describeSpoke(angle: number, inner: number, outer: number, center = WHEEL_CENTER) {
  const start = polarToCartesian(center, center, inner, angle);
  const end = polarToCartesian(center, center, outer, angle);
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
}

function getTextPath(startAngle: number, endAngle: number, radius: number, center = WHEEL_CENTER) {
  const midAngle = (startAngle + endAngle) / 2;
  const normMid = ((midAngle % 360) + 360) % 360;
  const isBottom = normMid > 90 && normMid < 270;

  if (isBottom) {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 0 ${end.x} ${end.y}`;
  } else {
    const start = polarToCartesian(center, center, radius, startAngle);
    const end = polarToCartesian(center, center, radius, endAngle);
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
  }
}

function labelPosition(startAngle: number, endAngle: number, radius: number, center = WHEEL_CENTER) {
  return polarToCartesian(center, center, radius, (startAngle + endAngle) / 2);
}

function splitWheelLabel(label: string) {
  const normalized = label.replace(/\s+/g, " ").trim();
  if (!normalized) return [] as string[];

  if (normalized.includes(" / ")) {
    return normalized.split(" / ").flatMap((part, index, array) => {
      if (index === 0) return [part];
      return index === array.length - 1 ? [part] : [`/ ${part}`];
    });
  }

  const words = normalized.split(" ");
  if (words.length <= 2) return [normalized];

  let splitIndex = Math.ceil(words.length / 2);
  if (words.length >= 4) {
    const left = words.slice(0, splitIndex).join(" ").length;
    const right = words.slice(splitIndex).join(" ").length;
    if (Math.abs(left - right) > 4 && splitIndex > 1) {
      splitIndex -= 1;
    }
  }

  return [words.slice(0, splitIndex).join(" "), words.slice(splitIndex).join(" ")];
}

function topFlavorKeys(answers: Record<string, string>) {
  const score: Record<FlavorKey, number> = flavors.reduce(
    (acc, flavor) => ({...acc, [flavor.key]: 0}),
    {} as Record<FlavorKey, number>
  );

  questions.forEach((question) => {
    const answerId = answers[question.id];
    const answer = question.answers.find((item) => item.id === answerId);
    if (!answer) return;

    Object.entries(answer.scores as FlavorScore).forEach(([key, value]) => {
      score[key as FlavorKey] += value ?? 0;
    });
  });

  const ranked = Object.entries(score)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key as FlavorKey);

  return ranked.slice(0, 3);
}

function profileIdFor(topKeys: FlavorKey[]) {
  const match = profileMatchers
    .map((profile) => ({
      id: profile.id,
      count: profile.keys.filter((key) => topKeys.includes(key)).length
    }))
    .sort((a, b) => b.count - a.count)[0];

  return match?.count ? match.id : "balanced";
}

function recommendedProducts(products: Product[], topKeys: FlavorKey[], locale: Locale) {
  const scored = products.map((product) => {
    const haystack = [
      localized(product.name, locale),
      localized(product.short, locale),
      localized(product.description, locale),
      localized(product.roast, locale),
      localized(product.origin, locale),
      ...localized(product.notes, locale),
      product.category
    ]
      .join(" ")
      .toLowerCase();

    const score = topKeys.reduce((total, key) => {
      return total + productKeywords[key].filter((keyword) => haystack.includes(keyword)).length;
    }, product.featured ? 0.5 : 0);

    return {product, score};
  });

  const matched = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);

  if (matched.length >= 3) return matched.slice(0, 3);

  const fallback = products
    .filter((product) => !matched.some((item) => item.slug === product.slug))
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  return [...matched, ...fallback].slice(0, 3);
}

const FLAVOR_ICONS: Record<string, LucideIcon> = {
  floral: Flower2,
  fruity: Cherry,
  sourFermented: Wine,
  green: Sprout,
  other: Sparkles,
  roasted: Flame,
  spicy: Soup,
  nutty: Bean,
  sweet: Candy
};

function LaurelBranch({color, className}: {color: string; className?: string}) {
  return (
    <svg viewBox="0 0 44 80" width="38" height="70" fill="none" style={{color}} className={className} aria-hidden="true">
      <path d="M33 78 C 12 60 8 30 25 4" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.55" strokeLinecap="round" />
      <g fill="currentColor" opacity="0.42">
        <ellipse cx="29" cy="66" rx="7" ry="2.9" transform="rotate(-36 29 66)" />
        <ellipse cx="21" cy="54" rx="7.5" ry="3" transform="rotate(-27 21 54)" />
        <ellipse cx="15" cy="42" rx="7.5" ry="3" transform="rotate(-16 15 42)" />
        <ellipse cx="14" cy="29" rx="7" ry="2.8" transform="rotate(-4 14 29)" />
        <ellipse cx="18" cy="16" rx="6" ry="2.6" transform="rotate(10 18 16)" />
      </g>
    </svg>
  );
}

function DecoLeaf({className, style}: {className?: string; style?: CSSProperties}) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} fill="none" aria-hidden="true">
      <path d="M20 100 C 50 80 80 50 100 20" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <path d="M40 92 C 52 80 58 66 58 52 C 46 58 38 72 40 92 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M62 74 C 74 62 80 48 80 34 C 68 40 60 54 62 74 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
    </svg>
  );
}

export function FlavorQuizPage({locale, flavorCounts}: FlavorQuizPageProps) {
  const t = useTranslations("FlavorQuiz");
  const isVi = locale === "vi";
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorKey>("fruity");
  const [hoverFlavor, setHoverFlavor] = useState<string | null>(null);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{x: number; y: number} | null>(null);
  const hoverHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizStage, setQuizStage] = useState<"pick" | "questions" | "result">("pick");
  const [pickedFlavor, setPickedFlavor] = useState<string | null>(null);
  const [pickedItemLabel, setPickedItemLabel] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const flavorName = (key: string) => {
    const q = flavorQuizzes[key];
    return q ? tx(q.name, locale) : key;
  };
  const flavorColor = (key: string) => wheelGroups.find((g) => g.key === key)?.color ?? "#a46131";

  // All specific flavors on the wheel (outer-ring notes), grouped by their main flavor group.
  const quizGroups = wheelGroups.map((group) => ({
    groupKey: group.key,
    groupName: flavorName(group.key),
    color: group.color,
    items: group.children.flatMap((child) =>
      child.leaves.length > 0
        ? child.leaves.map((leaf) => ({key: leaf, label: t(`wheel.${leaf}`), color: child.color}))
        : [{key: child.id, label: t(child.labelKey), color: child.color}]
    )
  }));

  // Clicking a flavor on the wheel shows the hovered flavor in the preview and records a click.
  const handlePickFlavor = (groupKey: string, label?: string) => {
    setSelectedFlavor(mapGroupKeyToFlavorKey(groupKey));
    if (hoverHideTimer.current) {
      clearTimeout(hoverHideTimer.current);
      hoverHideTimer.current = null;
    }
    setHoverFlavor(groupKey);
    setHoverLabel(label ?? null);
    void recordFlavorEvent(groupKey, "click", locale);
  };

  // Hover → small preview that follows the cursor.
  const handleHoverFlavor = (groupKey: string | null, label?: string) => {
    if (quizOpen) return;
    if (hoverHideTimer.current) {
      clearTimeout(hoverHideTimer.current);
      hoverHideTimer.current = null;
    }
    if (groupKey) {
      setHoverFlavor(groupKey);
      setHoverLabel(label ?? null);
    } else {
      hoverHideTimer.current = setTimeout(() => setHoverFlavor(null), 60);
    }
  };

  const handleHoverMove = (x: number, y: number) => setHoverPos({x, y});

  const quiz = pickedFlavor ? flavorQuizzes[pickedFlavor] : null;
  const currentQuestion = quiz?.questions[step];
  const isLastQuestion = quiz ? step === quiz.questions.length - 1 : false;
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const progress = quiz ? ((step + 1) / quiz.questions.length) * 100 : 0;

  const openQuiz = () => {
    setHoverFlavor(null);
    setQuizStage("pick");
    setPickedFlavor(null);
    setStep(0);
    setAnswers({});
    setQuizOpen(true);
  };

  const closeQuiz = () => setQuizOpen(false);

  const pickQuizFlavor = (groupKey: string, itemLabel: string) => {
    setPickedFlavor(groupKey);
    setPickedItemLabel(itemLabel);
    setStep(0);
    setAnswers({});
    setQuizStage("questions");
  };

  const chooseAnswer = (questionId: string, answerId: string) =>
    setAnswers((cur) => ({...cur, [questionId]: answerId}));

  const nextQuestion = () => {
    if (!quiz) return;
    if (isLastQuestion) {
      void recordFlavorEvent(quiz.groupKey, "submit", locale);
      setQuizStage("result");
      return;
    }
    setStep((s) => s + 1);
  };

  const backQuestion = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    } else {
      setQuizStage("pick");
      setPickedFlavor(null);
    }
  };

  const restartQuiz = () => {
    setQuizStage("pick");
    setPickedFlavor(null);
    setStep(0);
    setAnswers({});
  };

  return (
    <main className="overflow-hidden bg-parchment-50 text-forest-950">
      <FlavorWheelPoster
        t={t}
        activeKeys={[selectedFlavor]}
        selectedFlavor={selectedFlavor}
        onSelect={setSelectedFlavor}
        onPickFlavor={handlePickFlavor}
        onHoverFlavor={handleHoverFlavor}
        onHoverMove={handleHoverMove}
        onStart={openQuiz}
        locale={locale}
      />

      {/* Hover preview — small card that follows the cursor */}
      <AnimatePresence>
        {hoverFlavor && hoverPos && !quizOpen && (() => {
          const color = flavorColor(hoverFlavor);
          const Icon = FLAVOR_ICONS[hoverFlavor] || Sparkles;
          const panelW = 256;
          const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
          const vh = typeof window !== "undefined" ? window.innerHeight : 800;
          // Prefer to the right of the cursor; flip to the left if it would overflow.
          const left = hoverPos.x + 20 + panelW > vw ? Math.max(12, hoverPos.x - panelW - 20) : hoverPos.x + 20;
          const top = Math.min(Math.max(hoverPos.y - 24, 12), vh - 140);
          return (
            <motion.div
              key="hover-cursor"
              initial={{opacity: 0, scale: 0.96}}
              animate={{opacity: 1, scale: 1}}
              exit={{opacity: 0, scale: 0.96}}
              transition={{duration: 0.14}}
              className="pointer-events-none fixed z-[140] w-64 overflow-hidden rounded-2xl border border-forest-950/10 shadow-[0_20px_60px_rgba(10,24,10,0.18)]"
              style={{backgroundColor: "#faf6ed", left, top}}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-16"
                style={{background: `linear-gradient(180deg, ${color}33, transparent)`}}
              />
              <div className="relative flex items-center gap-3 px-4 pt-4">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  style={{backgroundColor: `${color}26`}}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.7} style={{color}} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{color}}>
                    {hoverLabel && hoverLabel !== flavorName(hoverFlavor)
                      ? (isVi ? `Nhóm ${flavorName(hoverFlavor)}` : `${flavorName(hoverFlavor)} group`)
                      : (isVi ? "Hương vị" : "Flavor")}
                  </p>
                  <p className="truncate font-serif text-lg leading-tight text-forest-950">
                    {hoverLabel ?? flavorName(hoverFlavor)}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2 px-4 pb-4">
                <span className="font-serif text-3xl font-black leading-none" style={{color}}>
                  {(flavorCounts?.[hoverFlavor]?.submits ?? 0).toLocaleString(isVi ? "vi-VN" : "en-US")}
                </span>
                <span className="text-xs font-bold text-forest-950/55">
                  {isVi ? "người đã chọn vị này" : "people picked this flavor"}
                </span>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Quiz modal — centered, fixed size: pick a flavor → its questions → thank-you */}
      <AnimatePresence>
        {quizOpen && (
          <motion.div
            key="quiz-modal"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.25}}
            className="fixed inset-0 z-[160] flex items-center justify-center bg-forest-950/40 p-4 backdrop-blur-[2px]"
            onClick={(e) => { if (e.target === e.currentTarget) closeQuiz(); }}
          >
            <motion.div
              initial={{opacity: 0, scale: 0.96, y: 20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.96, y: 20}}
              transition={{duration: 0.3, ease: [0.16, 1, 0.3, 1]}}
              className="relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] bg-parchment-50 shadow-[0_40px_120px_rgba(10,24,10,0.3)]"
            >
              <button
                type="button"
                onClick={closeQuiz}
                className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-forest-950/10 bg-white text-forest-950/60 transition hover:bg-forest-950 hover:text-white"
                aria-label={t("closeWheel")}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>

              {quizStage === "pick" ? (
                <div className="overflow-y-auto p-6 sm:p-8">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-earth-700">
                    {isVi ? "Khám phá gu cà phê" : "Explore your taste"}
                  </p>
                  <h2 className="mt-2 pr-10 font-serif text-2xl leading-tight text-forest-950 sm:text-3xl">
                    {isVi ? "Chọn hương vị bạn yêu thích nhất" : "Pick the flavor you love most"}
                  </h2>
                  <div className="mt-6 space-y-5">
                    {quizGroups.map((group) => {
                      const GroupIcon = FLAVOR_ICONS[group.groupKey] || Sparkles;
                      return (
                        <div key={group.groupKey}>
                          <div className="mb-2 flex items-center gap-2">
                            <GroupIcon className="h-4 w-4" strokeWidth={1.9} style={{color: group.color}} aria-hidden="true" />
                            <p className="text-xs font-black uppercase tracking-[0.12em] text-forest-950/55">
                              {group.groupName}
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-5">
                            {group.items.map((item) => (
                              <button
                                key={`${group.groupKey}-${item.key}`}
                                type="button"
                                onClick={() => pickQuizFlavor(group.groupKey, item.label)}
                                className="rounded-lg border px-2.5 py-1.5 text-center text-xs font-bold leading-tight text-forest-950 transition hover:-translate-y-0.5"
                                style={{borderColor: `${item.color}40`, backgroundColor: `${item.color}14`}}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : quizStage === "questions" && quiz && currentQuestion ? (
                <div className="overflow-y-auto p-6 sm:p-8">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-earth-700">
                    {pickedItemLabel ?? tx(quiz.name, locale)} · {step + 1}/{quiz.questions.length}
                  </p>
                  <h2 className="mt-2 pr-10 font-serif text-xl leading-tight text-forest-950 sm:text-2xl">
                    {tx(currentQuestion.title, locale)}
                  </h2>
                  <div className="my-5 h-2 overflow-hidden rounded-full bg-parchment-100">
                    <motion.div
                      className="h-full rounded-full bg-earth-600"
                      animate={{width: `${progress}%`}}
                      transition={{duration: 0.35}}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {currentQuestion.answers.map((answer) => {
                      const isSelected = selectedAnswer === answer.id;
                      return (
                        <button
                          key={answer.id}
                          type="button"
                          onClick={() => chooseAnswer(currentQuestion.id, answer.id)}
                          className={cn(
                            "group min-h-[72px] rounded-2xl border p-4 text-left transition",
                            isSelected
                              ? "border-earth-600 bg-earth-600 text-white shadow-[0_18px_44px_rgba(181,112,58,0.24)]"
                              : "border-forest-950/10 bg-white text-forest-950 hover:-translate-y-0.5 hover:border-earth-600/50"
                          )}
                        >
                          <span className="flex items-start gap-3">
                            <span
                              className={cn(
                                "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-black",
                                isSelected ? "border-white bg-white text-earth-700" : "border-forest-950/15 bg-white text-earth-700"
                              )}
                            >
                              {isSelected ? <Check className="h-4 w-4" aria-hidden="true" /> : answer.id.slice(-1).toUpperCase()}
                            </span>
                            <span className="text-sm font-bold leading-6">{tx(answer.label, locale)}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={backQuestion}
                      className="inline-flex items-center gap-2 rounded-full border border-forest-950/10 bg-white px-5 py-3 text-sm font-black text-forest-950 transition hover:border-earth-600/50"
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      {t("back")}
                    </button>
                    <button
                      type="button"
                      onClick={nextQuestion}
                      disabled={!selectedAnswer}
                      className="inline-flex items-center gap-2 rounded-full bg-forest-950 px-6 py-3 text-sm font-black text-parchment-50 transition hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {isLastQuestion ? t("seeResult") : t("next")}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center sm:p-10">
                  <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-earth-600 text-white">
                    <Check className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <h2 className="mt-6 font-serif text-3xl leading-tight text-forest-950 sm:text-4xl">
                    {isVi ? "Cảm ơn bạn!" : "Thank you!"}
                  </h2>
                  <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-7 text-forest-950/72">
                    {isVi
                      ? "Cảm ơn vì đã cho chúng tôi biết cảm nhận của bạn về cà phê. Phản hồi của bạn giúp Wecacha phục vụ bạn tốt hơn."
                      : "Thanks for sharing your coffee taste with us. Your feedback helps Wecacha serve you better."}
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={restartQuiz}
                      className="inline-flex items-center gap-2 rounded-full border border-forest-950/10 bg-white px-5 py-2.5 text-sm font-black text-forest-950 transition hover:border-earth-600/50"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      {t("restart")}
                    </button>
                    <button
                      type="button"
                      onClick={closeQuiz}
                      className="inline-flex items-center gap-2 rounded-full bg-forest-950 px-6 py-2.5 text-sm font-black text-parchment-50 transition hover:bg-forest-900"
                    >
                      {t("closeWheel")}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function FlavorWheelPoster({
  t,
  activeKeys,
  selectedFlavor,
  onSelect,
  onStart,
  onPickFlavor,
  onHoverFlavor,
  onHoverMove,
  highlightGroups = [],
  quizActive = false,
  locale
}: {
  t: ReturnType<typeof useTranslations<"FlavorQuiz">>;
  activeKeys: FlavorKey[];
  selectedFlavor: FlavorKey;
  onSelect: (key: FlavorKey) => void;
  onStart: () => void;
  onPickFlavor: (groupKey: string, label?: string) => void;
  onHoverFlavor?: (groupKey: string | null, label?: string) => void;
  onHoverMove?: (x: number, y: number) => void;
  highlightGroups?: string[];
  quizActive?: boolean;
  locale: Locale;
}) {
  const [selectedItem, setSelectedItem] = useState<WheelSelection>({
    groupKey: "fruity",
    groupLabelKey: "flavors.fruity.label",
    itemLabelKey: "flavors.fruity.label",
    level: "group",
    color: "#ee1d23"
  });

  return (
    <section className="relative isolate overflow-hidden bg-[#fbfaf7] pb-12 pt-24 lg:pt-28">
      <div className="absolute inset-x-[-12vw] top-[5.8rem] h-px rotate-[-4deg] bg-[repeating-linear-gradient(90deg,rgba(20,41,24,0.46)_0_4px,rgba(20,41,24,0.18)_4px_7px)] opacity-70" />
      <div className="absolute inset-x-[-12vw] top-[5.8rem] h-px rotate-[4deg] bg-[repeating-linear-gradient(90deg,rgba(20,41,24,0.42)_0_4px,rgba(20,41,24,0.16)_4px_7px)] opacity-70" />

      <div className="relative w-full">
        <div
          id="flavor-wheel"
          className="relative bg-[#f4f4f1] shadow-[0_34px_90px_rgba(20,41,24,0.18)] ring-1 ring-forest-950/5"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_32%_18%,rgba(255,255,255,0.82),transparent_28%),linear-gradient(90deg,rgba(20,41,24,0.035),transparent_48%,rgba(20,41,24,0.03)),linear-gradient(180deg,transparent_49.7%,rgba(20,41,24,0.055)_50%,transparent_50.3%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-forest-950/5" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-5 border-b border-[#40556b]/45 px-4 pb-5 sm:px-6 lg:px-8">
              <div>
                <h1 className="font-sans text-2xl font-bold text-[#40556b] sm:text-3xl">
                  {t("posterTitle")}
                </h1>
                <p className="mt-2 text-sm font-medium text-[#40556b]/86 sm:text-base">
                  {t("posterSubtitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={onStart}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-forest-950 px-6 text-sm font-black text-parchment-50 shadow-warm transition hover:-translate-y-0.5 hover:bg-forest-900"
              >
                {t("start")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex gap-0">
              <div className="min-w-0 flex-1">
                <FlavorWheel
                  idPrefix="poster"
                  t={t}
                  activeKeys={activeKeys}
                  selectedFlavor={selectedFlavor}
                  onSelect={onSelect}
                  onItemSelect={setSelectedItem}
                  selectedItem={selectedItem}
                  onStart={onStart}
                  onPickFlavor={onPickFlavor}
                  onHoverFlavor={onHoverFlavor}
                  onHoverMove={onHoverMove}
                  highlightGroups={highlightGroups}
                  variant="poster"
                  locale={locale}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WheelSelectionPanel({
  t,
  locale,
  selection
}: {
  t: ReturnType<typeof useTranslations<"FlavorQuiz">>;
  locale: Locale;
  selection: WheelSelection;
}) {
  const groupLabel = t(selection.groupLabelKey);
  const itemLabel = t(selection.itemLabelKey);
  const group = wheelGroups.find((item) => item.key === selection.groupKey);
  const relatedNotes = group?.children.flatMap((child) => child.leaves).slice(0, 8) ?? [];

  return (
    <aside className="sticky top-6 border border-[#40556b]/20 bg-[#fbfaf7] p-5 text-[#40556b] shadow-[0_18px_50px_rgba(20,41,24,0.08)]">
      <div className="h-2 w-16" style={{backgroundColor: selection.color}} />
      <p className="mt-5 text-xs font-black uppercase text-[#40556b]/60">
        {t(`wheelLevel.${selection.level}`)}
      </p>
      <h2 className="mt-2 text-3xl font-black leading-tight">{itemLabel}</h2>
      {itemLabel !== groupLabel && (
        <p className="mt-2 text-sm font-bold text-[#40556b]/65">
          {t("belongsTo", {group: groupLabel})}
        </p>
      )}
      <p className="mt-5 text-sm font-semibold leading-6 text-[#40556b]/78">
        {t("selectionHelp")}
      </p>
      {relatedNotes.length > 0 && (
        <div className="mt-6 border-t border-[#40556b]/20 pt-5">
          <p className="text-xs font-black uppercase text-[#40556b]/60">{t("relatedNotes")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedNotes.map((note) => (
              <span key={note} className="border border-[#40556b]/20 bg-white px-2.5 py-1.5 text-xs font-bold">
                {t(`wheel.${note}`)}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6 border-t border-[#40556b]/20 pt-4 text-xs font-semibold text-[#40556b]/55">
        {t("selectAnother")}
      </div>
    </aside>
  );
}

function IntroPanel({t}: {t: ReturnType<typeof useTranslations<"FlavorQuiz">>}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {["introCard1", "introCard2", "introCard3"].map((key, index) => {
        const icons = [Coffee, Leaf, Sparkles];
        const Icon = icons[index];
        return (
          <div key={key} className="rounded-[1.75rem] border border-forest-950/10 bg-white p-6 shadow-[0_18px_60px_rgba(20,41,24,0.06)]">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-950 text-parchment-50">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-black text-forest-950">{t(`${key}.title`)}</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-forest-950/66">{t(`${key}.copy`)}</p>
          </div>
        );
      })}
    </div>
  );
}

const wheelShortLabelsVi: Record<string, string> = {
  floral: "HOA",
  fruity: "TRÁI CÂY",
  sourFermented: "LÊN MEN CHUA",
  green: "TƯƠI XANH / THỰC VẬT",
  other: "MÙI VỊ KHÁC",
  roasted: "RANG",
  spicy: "GIA VỊ",
  nutty: "CA CAO & HẠT",
  sweet: "NGỌT"
};

const wheelShortLabelsEn: Record<string, string> = {
  floral: "FLORAL",
  fruity: "FRUITY",
  sourFermented: "SOUR / FERMENTED",
  green: "GREEN / VEG",
  other: "OTHER",
  roasted: "ROASTED",
  spicy: "SPICES",
  nutty: "NUTTY / COCOA",
  sweet: "SWEET"
};

const childShortLabelsVi: Record<string, string> = {
  flower: "HOA",
  berryFruit: "QUẢ MỌNG",
  driedFruit: "QUẢ KHÔ",
  otherFruit: "CÁC LOẠI QUẢ KHÁC",
  citrusFruit: "QUẢ CÓ MÚI",
  sour: "CHUA",
  fermented: "LÊN MEN RƯỢU",
  green: "TƯƠI XANH / THỰC VẬT",
  oliveOil: "DẦU Ô LIU",
  raw: "TƯƠI SỐNG",
  beany: "ĐẬU (HẠT)",
  earth: "GIẤY / MỘC",
  animal: "ĐỘNG VẬT",
  bitter: "VỊ ĐẮNG",
  salty: "VỊ MẶN",
  chemical: "HÓA CHẤT",
  tobacco: "THUỐC LÁ",
  pipeTobacco: "THUỐC LÀO",
  roasted: "RANG / NƯỚNG",
  cereal: "NGŨ CỐC",
  drySpice: "GIA VỊ KHÔ",
  pepper: "TIÊU ĐEN",
  pungent: "HĂNG CAY",
  nut: "HẠT",
  cacao: "CA CAO",
  brownSugar: "ĐƯỜNG NÂU",
  vanilla: "QUẢ VA-NI KHÔ",
  vanillin: "KẸO VA-NI",
  overallSweet: "NGỌT",
  sweetAroma: "NGỌT NGÀO",
  blackTea: "TRÀ ĐEN"
};

const childShortLabelsEn: Record<string, string> = {
  flower: "FLOWER",
  berryFruit: "BERRY",
  driedFruit: "DRIED FRUIT",
  otherFruit: "OTHER FRUIT",
  citrusFruit: "CITRUS FRUIT",
  sour: "SOUR",
  fermented: "ALCOHOL / FERMENTED",
  green: "GREEN / VEG",
  oliveOil: "OLIVE OIL",
  raw: "RAW",
  beany: "BEANY",
  earth: "PAPERY/MUSTY",
  animal: "ANIMALIC",
  bitter: "BITTER",
  salty: "SALTY",
  chemical: "CHEMICAL",
  tobacco: "TOBACCO",
  pipeTobacco: "PIPE TOBACCO",
  roasted: "ROASTED",
  cereal: "CEREAL",
  drySpice: "BROWN SPICE",
  pepper: "PEPPER",
  pungent: "PUNGENT",
  nut: "NUTTY",
  cacao: "COCOA",
  brownSugar: "BROWN SUGAR",
  vanilla: "VANILLA",
  vanillin: "VANILLIN",
  overallSweet: "OVERALL SWEET",
  sweetAroma: "SWEET AROMATICS",
  blackTea: "BLACK TEA"
};

function getTextColorForGroup(groupKey: string, childId: string, defaultColor: string) {
  const darkColors: Record<string, string> = {
    floral: "#b53d71",
    flower: "#b53d71",
    blackTea: "#6b3043",
    berryFruit: "#a61229",
    driedFruit: "#861d25",
    otherFruit: "#a3361e",
    citrusFruit: "#8c6200",
    sourFermented: "#6f6608",
    sour: "#7a7200",
    fermented: "#6b6000",
    green: "#105929",
    oliveOil: "#5c6613",
    raw: "#415422",
    beany: "#395c55",
    paperyMusty: "#4c6470",
    earth: "#4c6470",
    animal: "#5c5e3d",
    bitter: "#356962",
    salty: "#5a5e57",
    chemical: "#256675",
    roasted: "#731910",
    tobacco: "#75603d",
    pipeTobacco: "#6b5733",
    cereal: "#876d0d",
    spicy: "#730022",
    drySpice: "#730022",
    pepper: "#732626",
    pungent: "#4a2c40",
    nutty: "#5e4544",
    nut: "#5e4544",
    cacao: "#6b400d",
    sweet: "#993708",
    brownSugar: "#993708",
    vanilla: "#a34f35",
    vanillin: "#a13c44",
    overallSweet: "#8f353d",
    sweetAroma: "#82193b"
  };

  return darkColors[childId] || darkColors[groupKey] || defaultColor;
}

function isGroupActive(groupKey: string, activeKeys: FlavorKey[]) {
  const mapped = mapGroupKeyToFlavorKey(groupKey);
  return activeKeys.includes(mapped);
}

function isGroupSelected(groupKey: string, selectedFlavor: FlavorKey) {
  const mapped = mapGroupKeyToFlavorKey(groupKey);
  return selectedFlavor === mapped;
}

function mapGroupKeyToFlavorKey(groupKey: string): FlavorKey {
  if (groupKey === "sourFermented") return "citrus";
  if (groupKey === "green" || groupKey === "other") return "earthy";
  return groupKey as FlavorKey;
}

export function FlavorWheel({
  id,
  idPrefix = "wheel",
  t,
  activeKeys,
  selectedFlavor,
  onSelect,
  onItemSelect,
  selectedItem,
  onStart,
  onPickFlavor,
  onHoverFlavor,
  onHoverMove,
  highlightGroups = [],
  variant = "app",
  locale
}: {
  id?: string;
  idPrefix?: string;
  t: ReturnType<typeof useTranslations<"FlavorQuiz">>;
  activeKeys: FlavorKey[];
  selectedFlavor: FlavorKey;
  onSelect: (key: FlavorKey) => void;
  onItemSelect?: (selection: WheelSelection) => void;
  selectedItem?: WheelSelection;
  onStart?: () => void;
  onPickFlavor?: (groupKey: string, label?: string) => void;
  onHoverFlavor?: (groupKey: string | null, label?: string) => void;
  onHoverMove?: (x: number, y: number) => void;
  highlightGroups?: string[];
  variant?: "app" | "poster";
  locale: Locale;
}) {
  const totalWeight = wheelGroups.reduce((sum, group) => sum + group.weight, 0);
  let cursor = -7;

  return (
    <div
      id={id}
      className={cn(
        variant === "poster"
          ? "bg-transparent p-0 shadow-none overflow-visible w-full"
          : "overflow-x-auto rounded-[2rem] border border-forest-950/10 bg-[#f7f3ec] p-3 shadow-[0_24px_90px_rgba(20,41,24,0.14)] sm:p-5"
      )}
    >
      <svg
        viewBox="-300 -300 2000 2000"
        role="img"
        aria-label={t("wheelLabel")}
        onMouseLeave={() => onHoverFlavor?.(null)}
        onMouseMove={(event) => onHoverMove?.(event.clientX, event.clientY)}
        className={cn(
          "mx-auto aspect-square w-full",
          variant === "poster" ? "max-w-[1120px] min-w-0" : "max-w-[650px] lg:max-w-none"
        )}
      >
        <defs>
          <filter id={`${idPrefix}-soft-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#142918" floodOpacity="0.08" />
          </filter>
          <pattern id={`${idPrefix}-stripes`} patternUnits="userSpaceOnUse" width="4" height="4">
            <line x1="2" y1="0" x2="2" y2="4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" />
          </pattern>
        </defs>
        <circle
          cx={WHEEL_CENTER}
          cy={WHEEL_CENTER}
          r="674"
          fill={variant === "poster" ? "transparent" : "#f5efe5"}
          filter={variant === "poster" ? undefined : `url(#${idPrefix}-soft-shadow)`}
        />
        <circle
          cx={WHEEL_CENTER}
          cy={WHEEL_CENTER}
          r="241"
          fill={variant === "poster" ? "#f4f4f1" : "#f9f6ef"}
          stroke="#d9d8d3"
          strokeWidth="1.2"
        />
        {wheelGroups.flatMap((group) => {
          const groupStart = cursor;
          const groupEnd = cursor + (group.weight / totalWeight) * 360;
          cursor = groupEnd;
          const groupActive = isGroupActive(group.key, activeKeys);
          const groupSelected = isGroupSelected(group.key, selectedFlavor);

          const groupMidAngle = (groupStart + groupEnd) / 2;
          const groupNormMid = ((groupMidAngle % 360) + 360) % 360;
          const groupIsBottom = groupNormMid > 90 && groupNormMid < 270;
          const groupTextRadius = groupIsBottom ? 361 : 344; // Midway is ~352 (scaled)
          const groupTextPathD = getTextPath(groupStart - 25, groupEnd + 25, groupTextRadius);
          const groupLabelText = (locale === "vi" ? wheelShortLabelsVi[group.key] : wheelShortLabelsEn[group.key]) ?? group.key.toUpperCase();
          const groupSelection: WheelSelection = {
            groupKey: group.key,
            groupLabelKey: group.labelKey,
            itemLabelKey: group.labelKey,
            level: "group",
            color: group.color
          };
          const groupItemSelected = (selectedItem?.level === "group" && selectedItem.groupKey === group.key)
            || highlightGroups.includes(group.key);

          // Dynamic font size for group
          const groupAngle = groupEnd - groupStart;
          const groupArcLength = 352 * (groupAngle * Math.PI / 180); // arc at midpoint radius 352
          const groupCharCount = groupLabelText.length;
          const baseGroupFontSize = variant === "poster" ? 15 : 12.5;
          const charWidthRatio = 0.62; // em width per char at given font size
          let groupFontSize = baseGroupFontSize;
          // Fit text to arc: fontSize = arcLength / (charCount * charWidthRatio)
          const maxGroupFontSize = groupArcLength / (groupCharCount * charWidthRatio);
          if (maxGroupFontSize < groupFontSize) {
            groupFontSize = Math.max(8.5, maxGroupFontSize);
          }
          const showGroupLabel = groupArcLength >= groupCharCount * 5.5;

          const childWeight = group.children.reduce((sum, child) => sum + Math.max(child.leaves.length, 1), 0);
          let childCursor = groupStart;
          const pieces = [
            <path
              key={`${group.key}-inner`}
              d={describeSegment(groupStart + 0.3, groupEnd - 0.3, 245, 403)}
              fill={group.color}
              opacity={variant === "poster" ? 1 : groupActive ? 1 : 0.42}
              stroke={groupItemSelected ? "#142918" : "#ffffff"}
              strokeWidth={groupItemSelected ? 3 : 1.0}
              onMouseEnter={() => onHoverFlavor?.(group.key)}
              onMouseLeave={() => onHoverFlavor?.(null)}
              className="cursor-pointer outline-none [outline:none] focus:outline-none focus-visible:outline-none transition duration-300 hover:opacity-100"
              role="button"
              tabIndex={0}
              aria-label={t(group.labelKey)}
              onClick={() => {
                onSelect(mapGroupKeyToFlavorKey(group.key));
                onItemSelect?.(groupSelection); onPickFlavor?.(group.key);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  onSelect(mapGroupKeyToFlavorKey(group.key));
                  onItemSelect?.(groupSelection); onPickFlavor?.(group.key);
                }
              }}
            />,
            <path
              key={`${group.key}-textpath-def`}
              id={`${idPrefix}-textpath-group-${group.key}`}
              d={groupTextPathD}
              fill="none"
              stroke="none"
            />,
            showGroupLabel ? (
            <text
              key={`${group.key}-label`}
              textAnchor="middle"
              dominantBaseline="central"
              letterSpacing="0.06em"
              className="pointer-events-none fill-[#fbf7ef] font-bold uppercase"
              style={{ fontSize: `${groupFontSize}px` }}
            >
              <textPath
                href={`#${idPrefix}-textpath-group-${group.key}`}
                startOffset="50%"
              >
                {groupLabelText}
              </textPath>
            </text>
            ) : null
          ];

          group.children.forEach((child, childIndex) => {
            const childStart = childCursor;
            const childEnd = childCursor + (Math.max(child.leaves.length, 1) / childWeight) * (groupEnd - groupStart);
            childCursor = childEnd;

            const childMidAngle = (childStart + childEnd) / 2;
            const childRotation = svgNumber(childMidAngle);
            const childLabelText = locale === "vi"
              ? childShortLabelsVi[child.id] || t(child.labelKey)
              : childShortLabelsEn[child.id] || t(child.labelKey);
            const childSelection: WheelSelection = {
              groupKey: group.key,
              groupLabelKey: group.labelKey,
              itemLabelKey: child.labelKey,
              level: "family",
              color: child.color
            };
            const childItemSelected = selectedItem?.level === "family"
              && selectedItem.groupKey === group.key
              && selectedItem.itemLabelKey === child.labelKey;

            const hasLeaves = child.leaves.length > 0;

            // Multi-line label + dynamic font size for child
            const baseChildFont = variant === "poster" ? 12 : 9.5;
            // Only wrap when the single line is too long to fit across the ring thickness
            const childFitsOneLine = childLabelText.length * 0.62 * baseChildFont <= 86;
            const childLines = childFitsOneLine ? [childLabelText] : splitWheelLabel(childLabelText);
            const childMaxLineChars = Math.max(...childLines.map((line) => line.length));
            const childAngle = childEnd - childStart;
            const childArcLength = 458 * (childAngle * Math.PI / 180); // tangential room at radius 458
            // radial room: ring is 100px thick (408->508), leave padding for the longest line
            const childRadialMaxFont = 86 / (childMaxLineChars * 0.62);
            // tangential room: wrapped lines stack across the arc
            const childTangentialMaxFont = childArcLength / (childLines.length * 1.2);
            let childFontSize = Math.min(baseChildFont, childRadialMaxFont, childTangentialMaxFont);
            childFontSize = Math.max(6.5, childFontSize);
            // Childless items always show their single label inside the merged block (no level-3 duplicate).
            const showChildLabelInside = !hasLeaves || (childAngle >= 3 && childRadialMaxFont >= 6.5 && childTangentialMaxFont >= 6.5);
            // Flip labels on the left (West) half so they stay upright instead of upside-down
            const childNorm = ((childRotation % 360) + 360) % 360;
            const childFlip = childNorm > 180;
            const childRot = childFlip ? childRotation + 90 : childRotation - 90;

            pieces.push(
              <path
                key={`${group.key}-${child.id}`}
                d={describeSegment(childStart + 0.3, childEnd - 0.3, 408, 508)}
                fill={child.color}
                opacity={variant === "poster" ? 0.96 : groupActive ? 0.96 : 0.38}
                stroke={childItemSelected ? "#142918" : "#ffffff"}
                strokeWidth={childItemSelected ? 2.5 : 0.8}
                onMouseEnter={() => onHoverFlavor?.(group.key, t(child.labelKey))}
              onMouseLeave={() => onHoverFlavor?.(null)}
              className="cursor-pointer outline-none [outline:none] focus:outline-none focus-visible:outline-none transition duration-300 hover:opacity-100"
                role="button"
                tabIndex={0}
                aria-label={t(child.labelKey)}
                onClick={() => {
                  onSelect(mapGroupKeyToFlavorKey(group.key));
                  onItemSelect?.(childSelection); onPickFlavor?.(group.key, t(child.labelKey));
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    onSelect(mapGroupKeyToFlavorKey(group.key));
                    onItemSelect?.(childSelection); onPickFlavor?.(group.key, t(child.labelKey));
                  }
                }}
              />
            );

            if (showChildLabelInside) {
              const childLabelPos = labelPosition(childStart, childEnd, (408 + 508) / 2);
              pieces.push(
                <text
                  key={`${group.key}-${child.id}-label`}
                  x={childLabelPos.x}
                  y={childLabelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  letterSpacing="0.04em"
                  className="pointer-events-none fill-white font-bold uppercase"
                  style={{ fontSize: `${childFontSize}px` }}
                  transform={`rotate(${svgNumber(childRot)}, ${childLabelPos.x}, ${childLabelPos.y})`}
                >
                  {childLines.map((line, lineIndex) => (
                    <tspan
                      key={lineIndex}
                      x={childLabelPos.x}
                      dy={lineIndex === 0 ? `${-((childLines.length - 1) * 0.5 * 1.05).toFixed(3)}em` : "1.05em"}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            } else if (hasLeaves) {
              const familyLabelRadius = variant === "poster" ? 648 + (childIndex % 2) * 22 : 623;
              const familyLabel = polarToCartesian(WHEEL_CENTER, WHEEL_CENTER, familyLabelRadius, childMidAngle);

              pieces.push(
                <path
                  key={`${group.key}-${child.id}-family-spoke`}
                  d={describeSpoke(childMidAngle, 591, familyLabelRadius - 10)}
                  stroke={child.color}
                  strokeWidth="1"
                  opacity={variant === "poster" ? 0.9 : groupActive ? 0.9 : 0.28}
                  fill="none"
                  className="pointer-events-none"
                />,
                <text
                  key={`${group.key}-${child.id}-family-outer-label`}
                  x={familyLabel.x}
                  y={familyLabel.y}
                  textAnchor={childFlip ? "end" : "start"}
                  dominantBaseline="middle"
                  className={cn(
                    "pointer-events-none font-black uppercase",
                    variant === "poster" ? "text-[9.5px]" : "text-[8px]"
                  )}
                  style={{fill: getTextColorForGroup(group.key, child.id, child.color)}}
                  transform={`rotate(${svgNumber(childRot)}, ${familyLabel.x}, ${familyLabel.y})`}
                >
                  {childLabelText}
                </text>
              );
            }

            if (hasLeaves) {
              const leafAngle = (childEnd - childStart) / child.leaves.length;
              child.leaves.forEach((leaf, leafIndex) => {
                const leafStart = childStart + leafIndex * leafAngle + 0.28;
                const leafEnd = childStart + (leafIndex + 1) * leafAngle - 0.28;
                const leafMid = (leafStart + leafEnd) / 2;
                const label = polarToCartesian(WHEEL_CENTER, WHEEL_CENTER, variant === "poster" ? 750 : 674, leafMid);
                const rotation = svgNumber(leafMid);
                const leafNorm = ((rotation % 360) + 360) % 360;
                const leafFlip = leafNorm > 180;
                const leafRot = leafFlip ? rotation + 90 : rotation - 90;
                const leafSelection: WheelSelection = {
                  groupKey: group.key,
                  groupLabelKey: group.labelKey,
                  itemLabelKey: `wheel.${leaf}`,
                  level: "note",
                  color: child.color
                };
                const leafItemSelected = selectedItem?.level === "note"
                  && selectedItem.groupKey === group.key
                  && selectedItem.itemLabelKey === `wheel.${leaf}`;

                pieces.push(
                  <path
                    key={`${group.key}-${child.id}-${leaf}`}
                    d={describeSegment(leafStart, leafEnd, 513, 591)}
                    fill={child.color}
                    opacity={variant === "poster" ? 0.9 : groupActive ? 0.9 : 0.28}
                    stroke={leafItemSelected ? "#142918" : "#ffffff"}
                    strokeWidth={leafItemSelected ? 2.5 : 0.6}
                    onMouseEnter={() => onHoverFlavor?.(group.key, t(`wheel.${leaf}`))}
              onMouseLeave={() => onHoverFlavor?.(null)}
              className="cursor-pointer outline-none [outline:none] focus:outline-none focus-visible:outline-none transition duration-300 hover:opacity-100"
                    role="button"
                    tabIndex={0}
                    aria-label={t(`wheel.${leaf}`)}
                    onClick={() => {
                      onSelect(mapGroupKeyToFlavorKey(group.key));
                      onItemSelect?.(leafSelection); onPickFlavor?.(group.key, t(`wheel.${leaf}`));
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        onSelect(mapGroupKeyToFlavorKey(group.key));
                        onItemSelect?.(leafSelection); onPickFlavor?.(group.key, t(`wheel.${leaf}`));
                      }
                    }}
                  />,
                  <path
                    key={`${group.key}-${child.id}-${leaf}-stripe`}
                    d={describeSegment(leafStart, leafEnd, 513, 591)}
                    fill={`url(#${idPrefix}-stripes)`}
                    opacity={variant === "poster" ? 0.5 : groupActive ? 0.5 : 0.15}
                    className="pointer-events-none"
                  />,
                  <path
                    key={`${group.key}-${child.id}-${leaf}-spoke`}
                    d={describeSpoke(rotation, 591, variant === "poster" ? 735 : 660)}
                    stroke={child.color}
                    strokeWidth="0.7"
                    opacity={variant === "poster" ? 0.8 : groupActive ? 0.8 : 0.24}
                    fill="none"
                    className="pointer-events-none"
                  />,
                  <text
                    key={`${group.key}-${child.id}-${leaf}-label`}
                    x={label.x}
                    y={label.y}
                    textAnchor={leafFlip ? "end" : "start"}
                    dominantBaseline="middle"
                    className={cn(
                      "pointer-events-none font-semibold uppercase",
                      variant === "poster" ? "text-[11px]" : "text-[9px]"
                    )}
                    style={{fill: getTextColorForGroup(group.key, child.id, child.color)}}
                    transform={`rotate(${svgNumber(leafRot)}, ${label.x}, ${label.y})`}
                  >
                    {t(`wheel.${leaf}`)}
                  </text>
                );
              });
            }
          });

          return pieces;
        })}
        <circle
          cx={WHEEL_CENTER}
          cy={WHEEL_CENTER}
          r="245"
          fill={variant === "poster" ? "#f4f4f1" : "#f9f6ef"}
          stroke="#d9d8d3"
          strokeWidth="1.2"
        />
        <g className="pointer-events-none">
          <circle cx={WHEEL_CENTER} cy={WHEEL_CENTER} r="172" fill="#f9f6ef" stroke="#a46131" strokeWidth="2.5" />
          <text x={WHEEL_CENTER} y={WHEEL_CENTER - 12} textAnchor="middle" dominantBaseline="middle" className="fill-forest-950 font-serif" style={{fontSize: "32px"}}>
            Wecacha
          </text>
          <text x={WHEEL_CENTER} y={WHEEL_CENTER + 20} textAnchor="middle" dominantBaseline="middle" className="fill-forest-950/55 font-bold uppercase" style={{fontSize: "10px", letterSpacing: "0.16em"}}>
            {locale === "vi" ? "KHÁM PHÁ GU CÀ PHÊ" : "EXPLORE YOUR TASTE"}
          </text>
        </g>
      </svg>
    </div>
  );
}

function FlavorPanel({
  t,
  selectedFlavor
}: {
  t: ReturnType<typeof useTranslations<"FlavorQuiz">>;
  selectedFlavor: FlavorKey;
}) {
  const flavor = flavors.find((item) => item.key === selectedFlavor) ?? flavors[0];
  return (
    <aside className="rounded-[2rem] border border-forest-950/10 bg-forest-950 p-6 text-parchment-50 shadow-[0_24px_80px_rgba(20,41,24,0.18)]">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-parchment-50 text-forest-950">
        <Leaf className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="text-sm font-black uppercase tracking-[0.16em] text-ember">{t("selectedFlavor")}</p>
      <h3 className="mt-3 font-serif text-3xl">{t(`flavors.${selectedFlavor}.label`)}</h3>
      <p className="mt-4 text-sm font-medium leading-7 text-parchment-50/75">
        {t(`flavors.${selectedFlavor}.desc`)}
      </p>
      <div className="mt-5 rounded-3xl border border-white/10 bg-white/8 p-4 text-sm font-bold leading-7 text-parchment-50/85">
        {t(flavor.childKey)}
      </div>
    </aside>
  );
}

function ResultPanel({
  t,
  locale,
  profileId,
  topKeys,
  selectedFlavor,
  setSelectedFlavor,
  suggestions,
  restart
}: {
  t: ReturnType<typeof useTranslations<"FlavorQuiz">>;
  locale: Locale;
  profileId: "bright" | "balanced" | "bold";
  topKeys: FlavorKey[];
  selectedFlavor: FlavorKey;
  setSelectedFlavor: (key: FlavorKey) => void;
  suggestions: Product[];
  restart: () => void;
}) {
  return (
    <section className="grid gap-6 sm:grid-cols-2">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-earth-700">{t("resultKicker")}</p>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-forest-950 sm:text-4xl">
          {t(`profiles.${profileId}.title`)}
        </h2>
        <p className="mt-4 text-sm font-medium leading-7 text-forest-950/72">
          {t(`profiles.${profileId}.desc`)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {topKeys.map((key) => {
            const flavor = flavors.find((item) => item.key === key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedFlavor(key)}
                className="inline-flex items-center gap-2 rounded-full border border-forest-950/10 bg-parchment-50 px-3 py-1.5 text-sm font-black text-forest-950 transition hover:border-earth-600/50"
              >
                <span className="h-2 w-2 rounded-full" style={{backgroundColor: flavor?.color}} />
                {t(`flavors.${key}.label`)}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={restart}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest-950 px-5 py-2.5 text-sm font-black text-parchment-50 transition hover:bg-forest-900"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t("restart")}
        </button>
      </div>

      <div>
        <h3 className="text-base font-black text-forest-950">{t("recommendedTitle")}</h3>
        <div className="mt-3 grid gap-2">
          {suggestions.map((product) => (
            <Link
              key={product.slug}
              href={`/${locale}/shop/${product.slug}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-forest-950/10 bg-white p-3 transition hover:border-earth-600/50"
            >
              <div className="min-w-0">
                <p className="truncate font-black text-forest-950 text-sm">{localized(product.name, locale)}</p>
                <p className="mt-0.5 line-clamp-1 text-xs font-medium text-forest-950/62">
                  {localized(product.notes, locale).join(", ")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-sm font-black text-earth-700">
                {formatCurrency(product.price, locale)}
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
