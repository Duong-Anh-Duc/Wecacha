import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/motion/reveal";
import type { Locale } from "@/i18n/routing";
import { CommitmentCards } from "@/features/home/commitment-cards";
import {localizedField, type SiteSection, type SiteSectionItem} from "@/lib/content/cms";

export async function CommitmentSection({
  locale,
  tone = "classic",
  section,
  items = []
}: {
  locale: Locale;
  tone?: "classic" | "green";
  section?: SiteSection | null;
  items?: SiteSectionItem[];
}) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const cards = items.map((item) => ({
    key: item.item_key,
    title: localizedField(item, "title", locale),
    copy: localizedField(item, "body", locale),
    image: item.media?.image
  }));

  return (
    <section className="bg-parchment-50 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            kicker={localizedField(section, "eyebrow", locale) || t("commitmentKicker")}
            title={localizedField(section, "title", locale) || t("commitmentTitle")}
            align="center"
          />
        </Reveal>
        <div className="mt-12">
          <CommitmentCards cards={cards} tone={tone} />
        </div>
      </div>
    </section>
  );
}
