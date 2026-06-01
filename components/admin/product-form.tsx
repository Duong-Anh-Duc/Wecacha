"use client";

import {useState, useTransition} from "react";
import {App, Button, Card, Form, Input, InputNumber, Select, Space, Switch} from "antd";
import {DeleteOutlined, SaveOutlined, UploadOutlined} from "@ant-design/icons";
import {useTranslations} from "next-intl";
import {deleteProduct, uploadProductImage, upsertProduct} from "@/actions/product-actions";
import {useRouter} from "@/i18n/navigation";

type ProductFormData = {
  id?: string;
  slug?: string;
  category?: string;
  name_vi?: string;
  name_en?: string;
  short_vi?: string;
  short_en?: string;
  description_vi?: string;
  description_en?: string;
  farmer_story_vi?: string;
  farmer_story_en?: string;
  price?: number;
  original_price?: number | null;
  weight?: string;
  altitude?: string;
  roast_vi?: string;
  roast_en?: string;
  origin_vi?: string;
  origin_en?: string;
  notes_vi?: string[];
  notes_en?: string[];
  brew_guide_vi?: string[];
  brew_guide_en?: string[];
  images?: string[];
  featured?: boolean;
  is_visible?: boolean;
};

export type ProductCategoryOption = {
  slug: string;
  name_vi: string;
  name_en: string;
};

function textFromList(value?: string[] | null) {
  return (value ?? []).join("\n");
}

export function ProductForm({
  initialData = {},
  categories
}: {
  initialData?: ProductFormData;
  categories: ProductCategoryOption[];
}) {
  const t = useTranslations("Admin");
  const tShop = useTranslations("Shop");
  const router = useRouter();
  const {message, modal} = App.useApp();
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState(textFromList(initialData.images));
  const [isVisible, setIsVisible] = useState(initialData.is_visible ?? true);
  const [featured, setFeatured] = useState(Boolean(initialData.featured));
  const isEditing = Boolean(initialData.id);
  const categoryOptions = categories.length > 0
    ? categories
    : [
        {slug: "beans", name_vi: tShop("beans"), name_en: tShop("beans")},
        {slug: "ground", name_vi: tShop("ground"), name_en: tShop("ground")},
        {slug: "phin", name_vi: tShop("phin"), name_en: tShop("phin")},
        {slug: "gifts", name_vi: tShop("gifts"), name_en: tShop("gifts")}
      ];

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadProductImage(formData);

    if (result.url) {
      setImages((current) => [current, result.url].filter(Boolean).join("\n"));
      message.success(t("uploadSuccess"));
    } else {
      message.error(`${t("uploadError")}${result.error ?? ""}`);
    }
  }

  function handleSubmit(values: Record<string, unknown>) {
    const formData = new FormData();
    if (initialData.id) formData.set("id", initialData.id);
    if (initialData.slug) formData.set("slug", initialData.slug);
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.set(key, String(value));
      }
    });
    formData.set("images", images);
    formData.set("is_visible", isVisible ? "true" : "false");
    formData.set("featured", featured ? "true" : "false");

    startTransition(async () => {
      const result = await upsertProduct(formData);
      if (result.success) {
        message.success(t("saveSuccess"));
        router.push("/admin/products");
      } else {
        message.error(`${t("saveError")}${result.error}`);
      }
    });
  }

  function handleDelete() {
    if (!initialData.id) return;

    modal.confirm({
      title: t("deleteProductConfirm"),
      okText: t("delete"),
      okButtonProps: {danger: true},
      cancelText: t("cancel"),
      onOk: async () => {
        const result = await deleteProduct(initialData.id!);
        if (result.success) {
          message.success(t("deleteSuccess"));
          router.push("/admin/products");
        } else {
          message.error(`${t("saveError")}${result.error}`);
        }
      }
    });
  }

  return (
    <Form
      layout="vertical"
      initialValues={{
        ...initialData,
        notes_vi: textFromList(initialData.notes_vi),
        notes_en: textFromList(initialData.notes_en),
        brew_guide_vi: textFromList(initialData.brew_guide_vi),
        brew_guide_en: textFromList(initialData.brew_guide_en),
        category: initialData.category ?? "beans"
      }}
      onFinish={handleSubmit}
      className="max-w-5xl"
    >
      <Card className="mb-6" title={t("productBasics")}>
        <div className="grid gap-4 md:grid-cols-1">
          <Form.Item name="category" label={t("category")} rules={[{required: true}]}>
            <Select
              options={categoryOptions.map((category) => ({
                label: category.name_vi,
                value: category.slug
              }))}
            />
          </Form.Item>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item name="name_vi" label={t("fieldNameVI")} rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_en" label={t("fieldNameEN")} rules={[{required: true}]}>
            <Input />
          </Form.Item>
          <Form.Item name="short_vi" label={t("fieldShortVI")}>
            <Input.TextArea autoSize={{minRows: 2, maxRows: 4}} />
          </Form.Item>
          <Form.Item name="short_en" label={t("fieldShortEN")}>
            <Input.TextArea autoSize={{minRows: 2, maxRows: 4}} />
          </Form.Item>
        </div>
        <div className="flex flex-wrap gap-6">
          <Space>
            <Switch checked={isVisible} onChange={setIsVisible} />
            <span className="text-sm font-medium text-stone-700">{t("visible")}</span>
          </Space>
          <Space>
            <Switch checked={featured} onChange={setFeatured} />
            <span className="text-sm font-medium text-stone-700">{t("featured")}</span>
          </Space>
        </div>
      </Card>

      <Card className="mb-6" title={t("productCommerce")}>
        <div className="grid gap-4 md:grid-cols-3">
          <Form.Item name="price" label={t("price")} rules={[{required: true}]}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item name="original_price" label={t("originalPrice")}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item name="weight" label={t("weight")}>
            <Input />
          </Form.Item>
          <Form.Item name="altitude" label={t("altitude")}>
            <Input />
          </Form.Item>
          <Form.Item name="roast_vi" label={t("roastVI")}>
            <Input />
          </Form.Item>
          <Form.Item name="roast_en" label={t("roastEN")}>
            <Input />
          </Form.Item>
          <Form.Item name="origin_vi" label={t("originVI")}>
            <Input />
          </Form.Item>
          <Form.Item name="origin_en" label={t("originEN")}>
            <Input />
          </Form.Item>
        </div>
      </Card>

      <Card className="mb-6" title={t("productContent")}>
        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item name="description_vi" label={t("descriptionVI")}>
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item name="description_en" label={t("descriptionEN")}>
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item name="farmer_story_vi" label={t("farmerStoryVI")}>
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item name="farmer_story_en" label={t("farmerStoryEN")}>
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item name="notes_vi" label={t("notesVI")}>
            <Input.TextArea rows={4} placeholder={t("oneItemPerLine")} />
          </Form.Item>
          <Form.Item name="notes_en" label={t("notesEN")}>
            <Input.TextArea rows={4} placeholder={t("oneItemPerLine")} />
          </Form.Item>
          <Form.Item name="brew_guide_vi" label={t("brewGuideVI")}>
            <Input.TextArea rows={4} placeholder={t("oneItemPerLine")} />
          </Form.Item>
          <Form.Item name="brew_guide_en" label={t("brewGuideEN")}>
            <Input.TextArea rows={4} placeholder={t("oneItemPerLine")} />
          </Form.Item>
        </div>
      </Card>

      <Card className="mb-6" title={t("productImages")}>
        <div className="space-y-4">
          <Button icon={<UploadOutlined />} onClick={() => document.getElementById("product-image-upload")?.click()}>
            {t("uploadTab")}
          </Button>
          <input id="product-image-upload" type="file" accept="image/*" hidden onChange={handleFileChange} />
          <Input.TextArea
            rows={5}
            value={images}
            onChange={(event) => setImages(event.target.value)}
            placeholder={t("imageUrlsPlaceholder")}
          />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isPending} size="large">
          {t("saveProduct")}
        </Button>
        {isEditing ? (
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete} size="large">
            {t("delete")}
          </Button>
        ) : null}
      </div>
    </Form>
  );
}
