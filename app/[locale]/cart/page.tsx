import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {Reveal} from "@/components/motion/reveal";
import {SectionHeading} from "@/components/sections/section-heading";
import {CartPageClient} from "@/features/cart/cart-page-client";
import type {Locale} from "@/i18n/routing";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "Cart"});

  return {
    title: t("title"),
    robots: {index: false, follow: false},
    alternates: {
      canonical: `/${locale}/cart`,
      languages: {
        vi: "/vi/cart",
        en: "/en/cart",
        "x-default": "/vi/cart"
      }
    }
  };
}

export default async function CartPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: "Cart"});
  const tNav = await getTranslations({locale, namespace: "Nav"});

  return (
    <main className="bg-parchment-50 px-4 pb-20 pt-36 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading kicker={tNav("cart")} title={t("title")} />
        </Reveal>
        <div className="mt-10">
          <CartPageClient />
        </div>
      </div>
    </main>
  );
}
