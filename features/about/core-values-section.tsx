import {CheckCircle2, HeartHandshake, Leaf, ShieldCheck} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {SectionHeading} from "@/components/sections/section-heading";
import type {Locale} from "@/i18n/routing";

export async function CoreValuesSection({locale}: {locale: Locale}) {
  const t = await getTranslations({locale, namespace: "About"});

  const values = [
    {icon: HeartHandshake, label: t("value1Label"), copy: t("value1Copy")},
    {icon: ShieldCheck, label: t("value2Label"), copy: t("value2Copy")},
    {icon: CheckCircle2, label: t("value3Label"), copy: t("value3Copy")},
    {icon: Leaf, label: t("value4Label"), copy: t("value4Copy")}
  ];

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker={t("coreValuesKicker")}
          title={t("coreValuesTitle")}
          align="center"
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({icon: Icon, label, copy}, idx) => (
            <Reveal key={label} delay={0.1 + idx * 0.1}>
              <div className="group h-full rounded-2xl border border-forest-950/10 bg-white p-8 text-center shadow-warm transition duration-500 hover:-translate-y-2 hover:shadow-cinematic">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-parchment-100 text-earth-700 transition group-hover:bg-earth-600 group-hover:text-white">
                  <Icon className="h-8 w-8" />
                </div>
                <h4 className="mt-6 font-serif text-2xl text-forest-950">
                  {label}
                </h4>
                <p className="mt-4 text-sm leading-6 text-forest-950/60">
                  {copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
