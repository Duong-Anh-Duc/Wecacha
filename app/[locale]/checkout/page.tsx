import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {SectionHeading} from "@/components/sections/section-heading";
import {CheckoutForm} from "@/features/checkout/checkout-form";
import type {Locale} from "@/i18n/routing";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Checkout"});

  return {
    title: t("title"),
    robots: {index: false, follow: false},
    alternates: {
      canonical: `/${locale}/checkout`,
      languages: {
        vi: "/vi/checkout",
        en: "/en/checkout",
        "x-default": "/vi/checkout"
      }
    }
  };
}

export default async function CheckoutPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Checkout"});
  const tNav = await getTranslations({locale, namespace: "Nav"});

  return (
    <main className="bg-parchment-50 px-4 pb-20 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading kicker={tNav("checkout")} title={t("title")} />
        </Reveal>
        <div className="mt-10">
          <CheckoutForm />
        </div>
      </div>
    </main>
  );
}
