import { supabase } from "@/lib/supabase";
import { Link } from "@/i18n/navigation";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleForm } from "@/components/admin/article-form";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const resolvedParams = await params;
  const t = await getTranslations("Admin");

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
          className="p-2 bg-white rounded-full text-stone-500 hover:text-forest-950 hover:bg-stone-200 transition"
        >
          <ArrowLeft className="h-5 w-5" />
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
