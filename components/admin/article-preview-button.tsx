"use client";

import {useState} from "react";
import Image from "next/image";
import {Button, Drawer, Tag} from "antd";
import {Eye} from "lucide-react";
import {useTranslations} from "next-intl";

export type ArticlePreviewData = {
  slug: string;
  title_vi: string;
  intro_vi?: string | null;
  content_vi?: string | null;
  image_url?: string | null;
  placement: "home" | "news" | "both";
  is_visible: boolean;
};

export function ArticlePreviewButton({
  article,
  compact = false
}: {
  article: ArticlePreviewData;
  compact?: boolean;
}) {
  const t = useTranslations("Admin");
  const [open, setOpen] = useState(false);
  const paragraphs = String(article.content_vi ?? "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);

  function placementLabel(value: ArticlePreviewData["placement"]) {
    if (value === "home") return t("placementHome");
    if (value === "both") return t("placementBoth");
    return t("placementNews");
  }

  return (
    <>
      <Button
        type={compact ? "text" : "default"}
        icon={<Eye className="h-4 w-4" />}
        onClick={() => setOpen(true)}
        className={compact ? "text-[#4A751D] hover:!bg-transparent hover:!text-forest-950" : undefined}
      >
        {compact ? null : t("previewArticle")}
      </Button>

      <Drawer title={t("previewArticle")} open={open} onClose={() => setOpen(false)} size="large">
        <article className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Tag color={article.is_visible ? "green" : "default"}>
              {article.is_visible ? t("visible") : t("hidden")}
            </Tag>
            <Tag color="blue">{placementLabel(article.placement)}</Tag>
          </div>

          {article.image_url ? (
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
              <div className="relative aspect-[16/10]">
                <Image src={article.image_url} alt={article.title_vi} fill sizes="520px" className="object-cover" />
              </div>
            </div>
          ) : null}

          <div>
            <h3 className=" text-3xl leading-tight text-forest-950">{article.title_vi}</h3>
            {article.intro_vi ? <p className="mt-3 text-sm leading-6 text-stone-600">{article.intro_vi}</p> : null}
          </div>

          <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <p key={index} className="text-sm leading-6 text-stone-600">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-sm text-stone-400">{t("noArticleContent")}</p>
            )}
          </div>
        </article>
      </Drawer>
    </>
  );
}
