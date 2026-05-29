import {ArrowLeft} from "lucide-react";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {redirect} from "next/navigation";
import {ArticleForm} from "@/components/admin/article-form";
import {Link} from "@/i18n/navigation";
import {requireAdmin} from "@/lib/admin-auth";
import type {Locale} from "@/i18n/routing";

export const revalidate = 0;

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{id: string; locale: Locale}>;
}) {
  const resolvedParams = await params;
  setRequestLocale(resolvedParams.locale);
  const t = await getTranslations("Admin");
  const {supabase} = await requireAdmin(resolvedParams.locale);

  const { data, error } = await supabase
    .from("news_articles")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !data) {
    redirect(`/${resolvedParams.locale}/admin/articles`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/articles"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-stone-600 shadow-sm transition hover:bg-stone-200 hover:text-forest-950"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backArticles")}
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-forest-950 font-serif">{t("editArticleTitle")}</h2>
          <p className="text-stone-500 mt-1">{t("editArticleDesc")}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <ArticleForm initialData={data} />
      </div>
    </div>
  );
}
