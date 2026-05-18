import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleForm } from "@/components/admin/article-form";
import { getTranslations } from "next-intl/server";

export default async function NewArticlePage() {
  const t = await getTranslations("Admin");

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
