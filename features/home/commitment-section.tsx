import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";
import type { Locale } from "@/i18n/routing";
import { CommitmentCards } from "@/features/home/commitment-cards";

export async function CommitmentSection({
  locale,
  tone = "classic"
}: {
  locale: Locale;
  tone?: "classic" | "green";
}) {
  const t = await getTranslations({ locale, namespace: "Home" });

  return (
    <section className="bg-parchment-50 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            kicker={t("commitmentKicker")}
            title={t("commitmentTitle")}
            align="center"
          />
        </Reveal>
        <div className="mt-12">
          <CommitmentCards tone={tone} />
        </div>
      </div>
    </section>
  );
}
