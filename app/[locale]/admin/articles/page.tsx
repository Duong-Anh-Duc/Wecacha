import {Plus} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {ArticlesTable, type ArticleRow} from "@/components/admin/articles-table";
import {Link} from "@/i18n/navigation";
import type {Locale} from "@/i18n/routing";
import {requireAdmin} from "@/lib/admin-auth";

export const revalidate = 0;

export default async function ArticlesPage({
  params
}: {
  params: Promise<{locale: Locale}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Admin");
  const {supabase} = await requireAdmin(locale);

  const {data, error} = await supabase
    .from("news_articles")
    .select("id, slug, title_vi, intro_vi, content_vi, image_url, created_at, published_at, is_visible, placement, sort_order")
    .order("sort_order", {ascending: true})
    .order("published_at", {ascending: false});

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
        {t("loadError")} {error.message}
      </div>
    );
  }

  const articles = (data as ArticleRow[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-forest-950">{t("articlesTitle")}</h2>
          <p className="mt-1 text-stone-500">{t("articlesDesc")}</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 rounded-xl bg-ember px-4 py-2.5 font-medium text-white shadow-sm transition hover:bg-ember/90"
        >
          <Plus className="h-5 w-5" />
          {t("addArticle")}
        </Link>
      </div>

      <ArticlesTable articles={articles} locale={locale} />
    </div>
  );
}
