import type {Metadata} from "next";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {FlavorQuizPage} from "@/features/flavor-quiz/flavor-quiz-page";
import type {Locale} from "@/i18n/routing";
import {getVisibleProducts} from "@/lib/content/cms";

type Props = {
  params: Promise<{locale: Locale}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "FlavorQuiz"});

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/flavor-quiz`,
      languages: {
        vi: "/vi/flavor-quiz",
        en: "/en/flavor-quiz",
        "x-default": "/vi/flavor-quiz"
      }
    }
  };
}

export default async function FlavorQuizRoute({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const products = await getVisibleProducts();

  return <FlavorQuizPage locale={locale} products={products} />;
}
