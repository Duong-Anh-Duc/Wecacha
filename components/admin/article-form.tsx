"use client";

import { useState, useTransition } from "react";
import {InputNumber, Select, Switch} from "antd";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { upsertArticle, deleteArticle, uploadArticleImage } from "@/actions/article-actions";
import { Button } from "@/components/ui/button";

function ImageField({
  name,
  label,
  defaultValue,
  t,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  t: ReturnType<typeof useTranslations<"Admin">>;
}) {
  const [tab, setTab] = useState<"upload" | "url">(defaultValue ? "url" : "upload");
  const [url, setUrl] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadArticleImage(fd);
    setIsUploading(false);
    if (result.url) {
      setUrl(result.url);
    } else {
      alert(t("uploadError") + (result.error ?? ""));
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-700">{label}</label>

      <div className="flex rounded-xl overflow-hidden border border-stone-200 text-sm">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex-1 py-2 font-medium transition ${
            tab === "upload" ? "bg-ember text-white" : "bg-stone-50 text-stone-600 hover:bg-stone-100"
          }`}
        >
          {t("uploadTab")}
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex-1 py-2 font-medium transition ${
            tab === "url" ? "bg-ember text-white" : "bg-stone-50 text-stone-600 hover:bg-stone-100"
          }`}
        >
          {t("urlTab")}
        </button>
      </div>

      {/* Hidden input carries the resolved URL into the form */}
      <input type="hidden" name={name} value={url} />

      {tab === "upload" ? (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-ember/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-ember hover:file:bg-ember/20 disabled:opacity-50"
          />
          {isUploading && <p className="text-xs text-stone-500">{t("uploading")}</p>}
        </div>
      ) : (
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-xl border border-stone-200 px-4 py-2.5 focus:border-ember focus:ring-1 focus:ring-ember outline-none text-sm"
          placeholder="https://..."
        />
      )}

      {url && (
        <img
          src={url}
          alt=""
          className="w-full h-36 object-cover rounded-xl border border-stone-200"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      )}
    </div>
  );
}

export function ArticleForm({ initialData = {} }: { initialData?: any }) {
  const router = useRouter();
  const t = useTranslations("Admin");
  const [isPending, startTransition] = useTransition();
  const isEditing = !!initialData.id;
  const [isVisible, setIsVisible] = useState(initialData.is_visible ?? true);
  const [placement, setPlacement] = useState(initialData.placement ?? "news");
  const [sortOrder, setSortOrder] = useState(Number(initialData.sort_order ?? 0));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    if (isEditing) data.id = initialData.id;
    if (initialData.slug) data.slug = initialData.slug;

    startTransition(async () => {
      const result = await upsertArticle(data);
      if (result.success) {
        alert(t("saveSuccess"));
        router.push("/admin/articles");
      } else {
        alert(t("saveError") + result.error);
      }
    });
  };

  const handleDelete = () => {
    if (!confirm(t("deleteConfirm"))) return;

    startTransition(async () => {
      const result = await deleteArticle(initialData.id);
      if (result.success) {
        alert(t("deleteSuccess"));
        router.push("/admin/articles");
      } else {
        alert(t("saveError") + result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <input type="hidden" name="is_visible" value={isVisible ? "true" : "false"} />
      <input type="hidden" name="placement" value={placement} />
      <input type="hidden" name="sort_order" value={sortOrder} />
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">{t("visibility")}</label>
            <div className="flex h-10 items-center">
              <Switch
                checked={isVisible}
                onChange={setIsVisible}
                checkedChildren={t("visible")}
                unCheckedChildren={t("hidden")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">{t("placement")}</label>
            <Select
              className="w-full"
              value={placement}
              onChange={setPlacement}
              options={[
                {label: t("placementHome"), value: "home"},
                {label: t("placementNews"), value: "news"},
                {label: t("placementBoth"), value: "both"}
              ]}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">{t("sortOrder")}</label>
            <InputNumber className="w-full" value={sortOrder} onChange={(value) => setSortOrder(Number(value ?? 0))} />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">{t("fieldTitleVI")}</label>
          <input
            name="title_vi"
            defaultValue={initialData.title_vi}
            required
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 focus:border-ember focus:ring-1 focus:ring-ember outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">{t("fieldTitleEN")}</label>
          <input
            name="title_en"
            defaultValue={initialData.title_en}
            required
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 focus:border-ember focus:ring-1 focus:ring-ember outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">{t("fieldIntroVI")}</label>
          <textarea
            name="intro_vi"
            defaultValue={initialData.intro_vi}
            rows={3}
            required
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 focus:border-ember focus:ring-1 focus:ring-ember outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">{t("fieldIntroEN")}</label>
          <textarea
            name="intro_en"
            defaultValue={initialData.intro_en}
            rows={3}
            required
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 focus:border-ember focus:ring-1 focus:ring-ember outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">{t("fieldContentVI")}</label>
          <textarea
            name="content_vi"
            defaultValue={initialData.content_vi}
            rows={10}
            required
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 focus:border-ember focus:ring-1 focus:ring-ember outline-none whitespace-pre-wrap"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">{t("fieldContentEN")}</label>
          <textarea
            name="content_en"
            defaultValue={initialData.content_en}
            rows={10}
            required
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 focus:border-ember focus:ring-1 focus:ring-ember outline-none whitespace-pre-wrap"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageField
          name="image_url"
          label={t("fieldImageUrl")}
          defaultValue={initialData.image_url}
          t={t}
        />
        <ImageField
          name="secondary_image_url"
          label={t("fieldSecondaryImageUrl")}
          defaultValue={initialData.secondary_image_url}
          t={t}
        />
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-stone-200">
        <Button
          type="submit"
          variant="forest"
          disabled={isPending}
          className="rounded-xl font-medium px-8 h-12"
        >
          {isPending ? t("loading") : t("save")}
        </Button>

        {isEditing && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-xl font-medium text-red-600 hover:text-red-700 hover:bg-red-50 h-12"
          >
            {t("delete")}
          </Button>
        )}
      </div>
    </form>
  );
}
