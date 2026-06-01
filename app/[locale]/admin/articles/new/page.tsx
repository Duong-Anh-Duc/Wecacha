import {ArrowLeft} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {ArticleForm} from "@/components/admin/article-form";
import {Link} from "@/i18n/navigation";
import {requireAdmin} from "@/lib/admin-auth";
import type {Locale} from "@/i18n/routing";

export default async function NewArticlePage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const t = await getTranslations("Admin");

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Link
          href="/admin/articles"
          className="inline-flex h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-stone-600 shadow-sm transition hover:bg-stone-200 hover:text-forest-950"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backArticles")}
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-forest-950 font-serif">{t("newArticleTitle")}</h2>
          <p className="text-stone-500 mt-1">{t("newArticleDesc")}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <ArticleForm />
      </div>
    </div>
  );
}
