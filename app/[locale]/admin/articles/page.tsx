import { supabase } from "@/lib/supabase";
import { Link } from "@/i18n/navigation";
import { Plus, Edit } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

type Article = {
  id: string;
  slug: string;
  title_vi: string;
  created_at: string;
};

export default async function ArticlesPage() {
  const t = await getTranslations("Admin");

  const { data, error } = await supabase
    .from("news_articles")
    .select("id, slug, title_vi, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
        {t("loadError")} {error.message}
      </div>
    );
  }

  const articles = (data as Article[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-forest-950 font-serif">{t("articlesTitle")}</h2>
          <p className="text-stone-500 mt-1">{t("articlesDesc")}</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-ember hover:bg-ember/90 text-white px-4 py-2.5 rounded-xl font-medium transition shadow-sm"
        >
          <Plus className="h-5 w-5" />
          {t("addArticle")}
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-stone-500 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">{t("colTitleVI")}</th>
                <th className="px-6 py-4">{t("colSlug")}</th>
                <th className="px-6 py-4">{t("colCreatedAt")}</th>
                <th className="px-6 py-4 text-right">{t("colActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-stone-400">
                    {t("noArticles")}
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-stone-50/50 transition">
                    <td className="px-6 py-4 font-medium text-forest-950">{article.title_vi}</td>
                    <td className="px-6 py-4 font-mono text-xs">{article.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(article.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="inline-flex items-center gap-1.5 text-ember hover:text-ember/80 font-medium transition"
                      >
                        <Edit className="h-4 w-4" />
                        {t("edit")}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
