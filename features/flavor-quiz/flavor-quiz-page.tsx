"use client";

import {useMemo, useState} from "react";
import Link from "next/link";
import {motion} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Coffee,
  Leaf,
  RotateCcw,
  Sparkles
} from "lucide-react";
import {useTranslations} from "next-intl";
import type {Locale} from "@/i18n/routing";
import type {Product} from "@/lib/content/types";
import {formatCurrency, localized} from "@/lib/content/helpers";
import {cn} from "@/lib/utils";
import {flavors, productKeywords, questions, type FlavorKey, type FlavorScore} from "./data";

type FlavorQuizPageProps = {
  locale: Locale;
  products: Product[];
};

type QuizStage = "intro" | "quiz" | "result";

type WheelChild = {
  id: string;
  labelKey: string;
  color: string;
  leaves: string[];
};

type WheelGroup = {
  key: FlavorKey;
  labelKey: string;
  color: string;
  weight: number;
  children: WheelChild[];
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
    color: "#cf3f94",
    weight: 10,
    children: [
      {id: "flower", labelKey: "wheel.flower", color: "#d75d9d", leaves: ["chamomile", "rose", "jasmine"]}
    ]
  },
  {
    key: "fruity",
    labelKey: "flavors.fruity.label",
    color: "#ce4146",
    weight: 30,
    children: [
      {id: "berryFruit", labelKey: "wheel.berryFruit", color: "#c84c64", leaves: ["blackberry", "raspberry", "blueberry", "strawberry"]},
      {id: "driedFruit", labelKey: "wheel.driedFruit", color: "#b55262", leaves: ["raisin", "prune"]},
      {id: "otherFruit", labelKey: "wheel.otherFruit", color: "#d36f4d", leaves: ["coconut", "cherry", "pineapple", "peach", "pear"]},
      {id: "citrusFruit", labelKey: "wheel.citrusFruit", color: "#ddb935", leaves: ["grapefruit", "orange", "lemon", "lime"]}
    ]
  },
  {
    key: "citrus",
    labelKey: "flavors.citrus.label",
    color: "#c9c63f",
    weight: 24,
    children: [
      {id: "sour", labelKey: "wheel.sour", color: "#c9c83f", leaves: ["sourAroma", "vinegar", "yogurt", "citricAcid"]},
      {id: "fermented", labelKey: "wheel.fermented", color: "#b4ad52", leaves: ["wine", "whisky", "ferment"]}
    ]
  },
  {
    key: "earthy",
    labelKey: "flavors.earthy.label",
    color: "#3f8a56",
    weight: 24,
    children: [
      {id: "green", labelKey: "wheel.green", color: "#3e9954", leaves: ["oliveOil", "raw", "green", "grass"]},
      {id: "earth", labelKey: "wheel.earth", color: "#78936e", leaves: ["hay", "woody", "dampEarth", "mineral"]}
    ]
  },
  {
    key: "berry",
    labelKey: "flavors.berry.label",
    color: "#7fb9c9",
    weight: 18,
    children: [
      {id: "chemical", labelKey: "wheel.chemical", color: "#73b6ca", leaves: ["rubber", "petrol", "medicinal"]},
      {id: "musty", labelKey: "wheel.musty", color: "#93adbb", leaves: ["stale", "mold", "dust"]}
    ]
  },
  {
    key: "roasted",
    labelKey: "flavors.roasted.label",
    color: "#b65745",
    weight: 25,
    children: [
      {id: "roasted", labelKey: "wheel.roasted", color: "#a98155", leaves: ["malt", "toast", "smoke", "ash"]},
      {id: "cereal", labelKey: "wheel.cereal", color: "#d2b24e", leaves: ["grain", "bread", "rice"]}
    ]
  },
  {
    key: "spicy",
    labelKey: "flavors.spicy.label",
    color: "#b34057",
    weight: 22,
    children: [
      {id: "drySpice", labelKey: "wheel.drySpice", color: "#b54d5f", leaves: ["clove", "pepper", "cinnamon", "licorice"]},
      {id: "herbal", labelKey: "wheel.herbal", color: "#68606a", leaves: ["blackTea", "herb"]}
    ]
  },
  {
    key: "nutty",
    labelKey: "flavors.nutty.label",
    color: "#978879",
    weight: 18,
    children: [
      {id: "nut", labelKey: "wheel.nut", color: "#a98b64", leaves: ["peanut", "hazelnut", "almond"]},
      {id: "cocoa", labelKey: "wheel.cocoa", color: "#815f50", leaves: ["cocoa", "darkChocolate"]}
    ]
  },
  {
    key: "chocolate",
    labelKey: "flavors.chocolate.label",
    color: "#8b6253",
    weight: 16,
    children: [
      {id: "cacao", labelKey: "wheel.cacao", color: "#8b6253", leaves: ["cocoa", "darkChocolate", "milkChocolate"]}
    ]
  },
  {
    key: "sweet",
    labelKey: "flavors.sweet.label",
    color: "#c96f3b",
    weight: 20,
    children: [
      {id: "brownSugar", labelKey: "wheel.brownSugar", color: "#c97e45", leaves: ["molasses", "maple", "caramel", "honey"]},
      {id: "sweetAroma", labelKey: "wheel.sweetAroma", color: "#c79262", leaves: ["vanilla", "candy", "sweetAroma"]}
    ]
  }
];

const WHEEL_CENTER = 380;

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

function labelPosition(startAngle: number, endAngle: number, radius: number, center = WHEEL_CENTER) {
  return polarToCartesian(center, center, radius, (startAngle + endAngle) / 2);
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

export function FlavorQuizPage({locale, products}: FlavorQuizPageProps) {
  const t = useTranslations("FlavorQuiz");
  const [stage, setStage] = useState<QuizStage>("intro");
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const topKeys = useMemo(() => topFlavorKeys(answers), [answers]);
  const profileId = profileIdFor(topKeys);
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorKey>("fruity");
  const suggestions = useMemo(
    () => recommendedProducts(products, topKeys, locale),
    [locale, products, topKeys]
  );
  const currentQuestion = questions[activeStep];
  const selectedAnswer = answers[currentQuestion.id];
  const progress = ((activeStep + 1) / questions.length) * 100;
  const activeKeys = stage === "result" ? topKeys : [selectedFlavor];

  const chooseAnswer = (answerId: string) => {
    setAnswers((current) => ({...current, [currentQuestion.id]: answerId}));
  };

  const nextStep = () => {
    if (activeStep === questions.length - 1) {
      setStage("result");
      setSelectedFlavor(topKeys[0] ?? "fruity");
      return;
    }
    setActiveStep((current) => current + 1);
  };

  const restart = () => {
    setAnswers({});
    setActiveStep(0);
    setSelectedFlavor("fruity");
    setStage("intro");
  };

  return (
    <main className="overflow-hidden bg-parchment-50 text-forest-950">
      <FlavorWheelPoster
        t={t}
        activeKeys={activeKeys}
        selectedFlavor={selectedFlavor}
        onSelect={setSelectedFlavor}
        onStart={() => setStage("quiz")}
        stage={stage}
      />

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {stage === "intro" ? (
            <IntroPanel t={t} />
          ) : stage === "quiz" ? (
            <section className="grid gap-8 lg:grid-cols-[0.72fr_0.28fr]">
              <div className="rounded-[2rem] border border-forest-950/10 bg-white p-5 shadow-[0_24px_80px_rgba(20,41,24,0.08)] sm:p-8">
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.16em] text-earth-700">
                      {t("step", {current: activeStep + 1, total: questions.length})}
                    </p>
                    <h2 className="mt-3 font-serif text-3xl leading-tight text-forest-950 sm:text-4xl">
                      {t(currentQuestion.titleKey)}
                    </h2>
                  </div>
                  <div className="rounded-full bg-parchment-100 px-4 py-2 text-sm font-black text-forest-950/70">
                    {Math.round(progress)}%
                  </div>
                </div>
                <div className="mb-8 h-2 overflow-hidden rounded-full bg-parchment-100">
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
                        onClick={() => chooseAnswer(answer.id)}
                        className={cn(
                          "group min-h-[96px] rounded-3xl border p-5 text-left transition",
                          isSelected
                            ? "border-earth-600 bg-earth-600 text-white shadow-[0_18px_44px_rgba(181,112,58,0.24)]"
                            : "border-forest-950/10 bg-parchment-50 text-forest-950 hover:-translate-y-0.5 hover:border-earth-600/50 hover:bg-white"
                        )}
                      >
                        <span className="flex items-start gap-3">
                          <span
                            className={cn(
                              "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-black",
                              isSelected
                                ? "border-white bg-white text-earth-700"
                                : "border-forest-950/15 bg-white text-earth-700"
                            )}
                          >
                            {isSelected ? <Check className="h-4 w-4" aria-hidden="true" /> : answer.id.slice(-1).toUpperCase()}
                          </span>
                          <span className="text-base font-bold leading-7">{t(answer.labelKey)}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
                    disabled={activeStep === 0}
                    className="inline-flex items-center gap-2 rounded-full border border-forest-950/10 bg-white px-5 py-3 text-sm font-black text-forest-950 transition hover:border-earth-600/50 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {t("back")}
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!selectedAnswer}
                    className="inline-flex items-center gap-2 rounded-full bg-forest-950 px-6 py-3 text-sm font-black text-parchment-50 transition hover:bg-forest-900 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {activeStep === questions.length - 1 ? t("seeResult") : t("next")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <FlavorPanel t={t} selectedFlavor={selectedFlavor} />
            </section>
          ) : (
            <ResultPanel
              t={t}
              locale={locale}
              profileId={profileId}
              topKeys={topKeys}
              selectedFlavor={selectedFlavor}
              setSelectedFlavor={setSelectedFlavor}
              suggestions={suggestions}
              restart={restart}
            />
          )}
        </div>
      </section>
    </main>
  );
}

function FlavorWheelPoster({
  t,
  activeKeys,
  selectedFlavor,
  onSelect,
  onStart,
  stage
}: {
  t: ReturnType<typeof useTranslations<"FlavorQuiz">>;
  activeKeys: FlavorKey[];
  selectedFlavor: FlavorKey;
  onSelect: (key: FlavorKey) => void;
  onStart: () => void;
  stage: QuizStage;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbfaf7] px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <div className="absolute inset-x-[-12vw] top-[5.8rem] h-px rotate-[-4deg] bg-[repeating-linear-gradient(90deg,rgba(20,41,24,0.46)_0_4px,rgba(20,41,24,0.18)_4px_7px)] opacity-70" />
      <div className="absolute inset-x-[-12vw] top-[5.8rem] h-px rotate-[4deg] bg-[repeating-linear-gradient(90deg,rgba(20,41,24,0.42)_0_4px,rgba(20,41,24,0.16)_4px_7px)] opacity-70" />

      <div className="relative mx-auto max-w-[1180px]">
        <div className="absolute left-[18%] top-[-1.75rem] z-20 h-12 w-12 sm:left-[20%]">
          <PosterClip />
        </div>
        <div className="absolute right-[18%] top-[-1.75rem] z-20 h-12 w-12 sm:right-[20%]">
          <PosterClip />
        </div>

        <div
          id="flavor-wheel"
          className="relative mx-auto min-h-[900px] overflow-hidden bg-[#f4f4f1] px-6 pb-11 pt-20 shadow-[0_34px_90px_rgba(20,41,24,0.18)] ring-1 ring-forest-950/5 sm:px-14 lg:min-h-[1120px] lg:px-24"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_32%_18%,rgba(255,255,255,0.82),transparent_28%),linear-gradient(90deg,rgba(20,41,24,0.035),transparent_48%,rgba(20,41,24,0.03)),linear-gradient(180deg,transparent_49.7%,rgba(20,41,24,0.055)_50%,transparent_50.3%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-forest-950/5" />
          <div className="relative">
            <h1 className="font-sans text-2xl font-black tracking-wide text-[#40556b] sm:text-3xl">
              {t("posterTitle")}
            </h1>
            <div className="mt-2 h-px w-full bg-[#40556b]/55" />
            <p className="mt-3 text-sm font-medium tracking-wide text-[#40556b]/86 sm:text-base">
              {t("posterSubtitle")}
            </p>

            <div className="mx-auto mt-16 max-w-[720px] lg:mt-24">
              <FlavorWheel
                t={t}
                activeKeys={activeKeys}
                selectedFlavor={selectedFlavor}
                onSelect={onSelect}
                variant="poster"
              />
            </div>

            <div className="mt-20 border-t border-[#40556b]/45 pt-5 lg:mt-28">
              <div className="grid gap-5 text-[#40556b] sm:grid-cols-[260px_1fr] sm:items-end">
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#40556b]/70 text-lg font-black">
                    WC
                  </div>
                  <div className="h-12 w-px bg-[#40556b]/40" />
                  <div className="text-sm font-black uppercase leading-tight">
                    Wecacha<br />Coffee Research
                  </div>
                </div>
                <p className="text-left text-[10px] font-semibold leading-4 text-[#40556b]/76 sm:text-right">
                  {t("posterFooter")}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={onStart}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-forest-950 px-6 text-sm font-black text-parchment-50 shadow-[0_16px_36px_rgba(10,24,10,0.18)] transition hover:-translate-y-0.5 hover:bg-forest-900"
              >
                {stage === "intro" ? t("start") : t("continueQuiz")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PosterClip() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1/2 top-0 h-8 w-5 -translate-x-1/2 rounded-t-full border-2 border-black/80 bg-transparent" />
      <div className="absolute bottom-0 left-1/2 h-7 w-11 -translate-x-1/2 rounded-[2px] bg-black shadow-[0_4px_12px_rgba(0,0,0,0.28)]">
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/22" />
      </div>
    </div>
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

function FlavorWheel({
  id,
  t,
  activeKeys,
  selectedFlavor,
  onSelect,
  variant = "app"
}: {
  id?: string;
  t: ReturnType<typeof useTranslations<"FlavorQuiz">>;
  activeKeys: FlavorKey[];
  selectedFlavor: FlavorKey;
  onSelect: (key: FlavorKey) => void;
  variant?: "app" | "poster";
}) {
  const totalWeight = wheelGroups.reduce((sum, group) => sum + group.weight, 0);
  let cursor = -7;

  return (
    <div
      id={id}
      className={cn(
        "overflow-x-auto",
        variant === "poster"
          ? "bg-transparent p-0 shadow-none"
          : "rounded-[2rem] border border-forest-950/10 bg-[#f7f3ec] p-3 shadow-[0_24px_90px_rgba(20,41,24,0.14)] sm:p-5"
      )}
    >
      <svg
        viewBox="0 0 760 760"
        role="img"
        aria-label={t("wheelLabel")}
        className={cn("mx-auto aspect-square w-full", variant === "poster" ? "min-w-[620px] max-w-[720px]" : "min-w-[760px] lg:min-w-0")}
      >
        <defs>
          <filter id="wheel-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#142918" floodOpacity="0.08" />
          </filter>
        </defs>
        <circle cx={WHEEL_CENTER} cy={WHEEL_CENTER} r="334" fill={variant === "poster" ? "transparent" : "#f5efe5"} filter={variant === "poster" ? undefined : "url(#wheel-soft-shadow)"} />
        <circle cx={WHEEL_CENTER} cy={WHEEL_CENTER} r="100" fill={variant === "poster" ? "#f4f4f1" : "#f9f6ef"} stroke="rgba(20,41,24,0.12)" strokeWidth="2" />
        {wheelGroups.flatMap((group) => {
          const groupStart = cursor;
          const groupEnd = cursor + (group.weight / totalWeight) * 360;
          cursor = groupEnd;
          const groupActive = activeKeys.includes(group.key);
          const groupSelected = selectedFlavor === group.key;
          const groupRotation = svgNumber((groupStart + groupEnd) / 2);
          const groupMid = labelPosition(groupStart, groupEnd, 142);
          const childWeight = group.children.reduce((sum, child) => sum + Math.max(child.leaves.length, 1), 0);
          let childCursor = groupStart;
          const pieces = [
            <path
              key={`${group.key}-inner`}
              d={describeSegment(groupStart + 0.35, groupEnd - 0.35, 102, 178)}
              fill={group.color}
              opacity={variant === "poster" ? 1 : groupActive ? 1 : 0.42}
              stroke={groupSelected ? "#142918" : "#f9f6ef"}
              strokeWidth={groupSelected ? 4 : 1.5}
              className="cursor-pointer transition duration-300 hover:opacity-100"
              role="button"
              tabIndex={0}
              aria-label={t(group.labelKey)}
              onClick={() => onSelect(group.key)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(group.key);
              }}
            />,
            <text
              key={`${group.key}-label`}
              x={groupMid.x}
              y={groupMid.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none fill-[#fbf7ef] text-[13px] font-black uppercase"
              transform={`rotate(${groupRotation}, ${groupMid.x}, ${groupMid.y})`}
            >
              {t(group.labelKey)}
            </text>
          ];

          group.children.forEach((child) => {
            const childStart = childCursor;
            const childEnd = childCursor + (Math.max(child.leaves.length, 1) / childWeight) * (groupEnd - groupStart);
            childCursor = childEnd;
            const childRotation = svgNumber((childStart + childEnd) / 2);
            const childMid = labelPosition(childStart, childEnd, 218);
            pieces.push(
              <path
                key={`${group.key}-${child.id}`}
                d={describeSegment(childStart + 0.35, childEnd - 0.35, 182, 252)}
                fill={child.color}
                opacity={variant === "poster" ? 0.96 : groupActive ? 0.96 : 0.38}
                stroke="#f9f6ef"
                strokeWidth="1.4"
                className="cursor-pointer transition duration-300 hover:opacity-100"
                role="button"
                tabIndex={0}
                aria-label={t(child.labelKey)}
                onClick={() => onSelect(group.key)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onSelect(group.key);
                }}
              />,
              <text
                key={`${group.key}-${child.id}-label`}
                x={childMid.x}
                y={childMid.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none fill-[#fbf7ef] text-[11px] font-bold uppercase"
                transform={`rotate(${childRotation}, ${childMid.x}, ${childMid.y})`}
              >
                {t(child.labelKey)}
              </text>
            );

            const leafAngle = (childEnd - childStart) / Math.max(child.leaves.length, 1);
            child.leaves.forEach((leaf, leafIndex) => {
              const leafStart = childStart + leafIndex * leafAngle + 0.28;
              const leafEnd = childStart + (leafIndex + 1) * leafAngle - 0.28;
              const stripeCount = Math.max(2, Math.min(5, Math.round(leafAngle / 2.8)));
              const stripeAngle = (leafEnd - leafStart) / stripeCount;
              const label = labelPosition(leafStart, leafEnd, 345);
              const rotation = svgNumber((leafStart + leafEnd) / 2);

              pieces.push(
                <path
                  key={`${group.key}-${child.id}-${leaf}`}
                  d={describeSegment(leafStart, leafEnd, 258, 298)}
                  fill={child.color}
                  opacity={variant === "poster" ? 0.9 : groupActive ? 0.9 : 0.28}
                  stroke="#f9f6ef"
                  strokeWidth="1"
                  className="cursor-pointer transition duration-300 hover:opacity-100"
                  role="button"
                  tabIndex={0}
                  aria-label={t(`wheel.${leaf}`)}
                  onClick={() => onSelect(group.key)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") onSelect(group.key);
                  }}
                />,
                ...Array.from({length: stripeCount}).map((_, stripeIndex) => (
                  <path
                    key={`${group.key}-${child.id}-${leaf}-stripe-${stripeIndex}`}
                    d={describeSegment(
                      leafStart + stripeIndex * stripeAngle + 0.12,
                      leafStart + (stripeIndex + 1) * stripeAngle - 0.12,
                      302,
                      334
                    )}
                    fill={child.color}
                    opacity={variant === "poster" ? 0.78 : groupActive ? 0.78 : 0.22}
                    stroke="#f9f6ef"
                    strokeWidth="0.8"
                    className="pointer-events-none"
                  />
                )),
                <text
                  key={`${group.key}-${child.id}-${leaf}-label`}
                  x={label.x}
                  y={label.y}
                  textAnchor={rotation > 180 ? "end" : "start"}
                  dominantBaseline="middle"
                  className="pointer-events-none fill-forest-950/80 text-[8.5px] font-black uppercase"
                  transform={`rotate(${svgNumber(rotation > 180 ? rotation + 90 : rotation - 90)}, ${label.x}, ${label.y})`}
                >
                  {t(`wheel.${leaf}`)}
                </text>
              );
            });
          });

          return pieces;
        })}
        <circle cx={WHEEL_CENTER} cy={WHEEL_CENTER} r="102" fill={variant === "poster" ? "#f4f4f1" : "#f9f6ef"} stroke="rgba(20,41,24,0.12)" strokeWidth="2" />
        <text x={WHEEL_CENTER} y="370" textAnchor="middle" className="fill-forest-950 text-[40px] font-black">
          Wecacha
        </text>
        <text x={WHEEL_CENTER} y="406" textAnchor="middle" className="fill-forest-950/70 text-[14px] font-bold uppercase tracking-[0.18em]">
          Flavor Wheel
        </text>
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
    <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-[2rem] border border-forest-950/10 bg-white p-6 shadow-[0_24px_80px_rgba(20,41,24,0.08)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-earth-700">{t("resultKicker")}</p>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-forest-950 sm:text-5xl">
          {t(`profiles.${profileId}.title`)}
        </h2>
        <p className="mt-5 text-base font-medium leading-8 text-forest-950/72">
          {t(`profiles.${profileId}.desc`)}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {topKeys.map((key) => {
            const flavor = flavors.find((item) => item.key === key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedFlavor(key)}
                className="inline-flex items-center gap-2 rounded-full border border-forest-950/10 bg-parchment-50 px-4 py-2 text-sm font-black text-forest-950 transition hover:border-earth-600/50"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: flavor?.color}} />
                {t(`flavors.${key}.label`)}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={restart}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest-950 px-5 py-3 text-sm font-black text-parchment-50 transition hover:bg-forest-900"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {t("restart")}
        </button>

        <div className="mt-10">
          <h3 className="text-xl font-black text-forest-950">{t("recommendedTitle")}</h3>
          <div className="mt-4 grid gap-3">
            {suggestions.map((product) => (
              <Link
                key={product.slug}
                href={`/${locale}/shop/${product.slug}`}
                className="group flex items-center justify-between gap-4 rounded-3xl border border-forest-950/10 bg-parchment-50 p-4 transition hover:-translate-y-0.5 hover:border-earth-600/50 hover:bg-white"
              >
                <div>
                  <p className="font-black text-forest-950">{localized(product.name, locale)}</p>
                  <p className="mt-1 line-clamp-1 text-sm font-medium text-forest-950/62">
                    {localized(product.notes, locale).join(", ")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm font-black text-earth-700">
                  {formatCurrency(product.price, locale)}
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <FlavorWheel
          t={t}
          activeKeys={topKeys}
          selectedFlavor={selectedFlavor}
          onSelect={setSelectedFlavor}
        />
        <FlavorPanel t={t} selectedFlavor={selectedFlavor} />
      </div>
    </section>
  );
}
