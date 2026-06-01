import Image from "next/image";
import Link from "next/link";
import {getTranslations} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import type {Locale} from "@/i18n/routing";
import {imageLibrary} from "@/lib/content";
import {localizedField, type SiteSection} from "@/lib/content/cms";

const localeHref = (locale: Locale, href: string) => {
  if (href.startsWith("http")) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) return href;
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
};

export async function AboutCtaSection({
  locale,
  section
}: {
  locale: Locale;
  section?: SiteSection | null;
}) {
  const t = await getTranslations({locale, namespace: "About"});

  return (
    <section className="relative flex min-h-[50vh] items-center justify-center py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={section?.media?.background ?? imageLibrary.brocade}
          alt="Brocade pattern"
          fill
          className="object-cover opacity-30 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-forest-950/90" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <Reveal>
          <h2 className="font-serif text-4xl text-parchment-50 sm:text-5xl">
            {localizedField(section, "title", locale) || t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            {localizedField(section, "copy", locale) || t("ctaCopy")}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            {/* <Link
              href="/shop"
              className="inline-flex h-14 items-center justify-center rounded-full bg-earth-600 px-8 text-base font-bold text-white transition hover:bg-earth-700"
            >
              {t("ctaShop")}
            </Link> */}
            <Link
              href={localeHref(locale, section?.cta_href ?? "/explore")}
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-base font-bold text-white backdrop-blur transition hover:bg-white/10"
            >
              {localizedField(section, "cta_label", locale) || t("ctaJourney")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
