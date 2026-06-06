"use client";

import {useState, useTransition} from "react";
import Image from "next/image";
import {App, Button, Card, Form, Input, InputNumber, Modal, Select, Switch} from "antd";
import {DeleteOutlined, PlusOutlined, SaveOutlined, UploadOutlined} from "@ant-design/icons";
import {useLocale, useTranslations} from "next-intl";
import {uploadProductImage, upsertProduct} from "@/actions/product-actions";
import {useRouter} from "@/i18n/navigation";

export type ProductFormData = {
  id?: string;
  slug?: string | null;
  category?: string | null;
  category_slugs?: string[] | null;
  name_vi?: string | null;
  name_en?: string | null;
  short_vi?: string | null;
  short_en?: string | null;
  description_vi?: string | null;
  description_en?: string | null;
  farmer_story_vi?: string | null;
  farmer_story_en?: string | null;
  price?: number;
  price_tiers?: PriceTier[] | null;
  original_price?: number | null;
  weight?: string | null;
  base_unit?: string | null;
  altitude?: string | null;
  roast_vi?: string | null;
  roast_en?: string | null;
  origin_vi?: string | null;
  origin_en?: string | null;
  notes_vi?: string[] | null;
  notes_en?: string[] | null;
  brew_guide_vi?: string[] | null;
  brew_guide_en?: string[] | null;
  images?: string[] | null;
  featured?: boolean;
  is_visible?: boolean;
};

type PriceTier = {
  attribute?: string;
  minKg?: number;
  maxKg?: number;
  price?: number;
};

const defaultPriceAttributes = ["5kg đến 20kg", "21kg đến 50kg"];

export type ProductCategoryOption = {
  slug: string;
  name_vi: string;
  name_en: string;
};

function textFromList(value?: string[] | string | null) {
  if (Array.isArray(value)) return value.join("\n");
  return value ?? "";
}

function formatNumber(value: string | number | undefined) {
  if (value === undefined || value === "") return "";
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function parseNumber(value: string | undefined) {
  return value?.replace(/,/g, "") ?? "";
}

export function ProductForm({
  initialData = {},
  categories,
  onSaved,
  redirectOnSave = true
}: {
  initialData?: ProductFormData;
  categories: ProductCategoryOption[];
  onSaved?: () => void;
  redirectOnSave?: boolean;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();
  const {message} = App.useApp();
  const [form] = Form.useForm();
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>(initialData.images ?? []);
  const [isUploading, setIsUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(initialData.is_visible ?? true);
  const [featured, setFeatured] = useState(Boolean(initialData.featured));
  const [attributeModalOpen, setAttributeModalOpen] = useState(false);
  const [pendingAttributeIndex, setPendingAttributeIndex] = useState<number | null>(null);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [attributeOptions, setAttributeOptions] = useState<string[]>(() => {
    const existingAttributes = (initialData.price_tiers ?? [])
      .map((tier) => tier.attribute?.trim())
      .filter((attribute): attribute is string => Boolean(attribute));
    return Array.from(new Set([...defaultPriceAttributes, ...existingAttributes]));
  });
  const isEditing = Boolean(initialData.id);
  const categoryOptions = categories.length > 0
    ? categories
    : [
        {slug: "beans", name_vi: "beans", name_en: "beans"},
        {slug: "ground", name_vi: "ground", name_en: "ground"},
        {slug: "phin", name_vi: "phin", name_en: "phin"},
        {slug: "gifts", name_vi: "gifts", name_en: "gifts"}
      ];

  function openAttributeModal(fieldIndex: number | null = null) {
    setPendingAttributeIndex(fieldIndex);
    setNewAttributeName("");
    setAttributeModalOpen(true);
  }

  function handleCreateAttribute() {
    const attribute = newAttributeName.trim();
    if (!attribute) {
      message.error(t("attributeNameRequired"));
      return;
    }

    setAttributeOptions((current) => current.includes(attribute) ? current : [...current, attribute]);
    if (pendingAttributeIndex !== null) {
      form.setFieldValue(["price_tiers", pendingAttributeIndex, "attribute"], attribute);
    }
    setAttributeModalOpen(false);
    setPendingAttributeIndex(null);
    setNewAttributeName("");
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadProductImage(formData);

        if (result.url) {
          setImages((current) => [...current, result.url!]);
        } else {
          message.error(`${t("uploadError")}${result.error ?? ""}`);
        }
      }
      message.success(t("uploadSuccess"));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  function handleSubmit(values: Record<string, unknown>) {
    const formData = new FormData();
    if (initialData.id) formData.set("id", initialData.id);
    if (initialData.slug) formData.set("slug", initialData.slug);
    formData.set("category_slugs", JSON.stringify(initialData.category_slugs ?? (initialData.category ? [initialData.category] : [])));
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "category_slugs" || key === "price_tiers") {
          formData.set(key, JSON.stringify(value));
        } else {
          formData.set(key, String(value));
        }
      }
    });
    const firstTierPrice = Array.isArray(values.price_tiers)
      ? values.price_tiers.find((tier) => Number((tier as PriceTier | undefined)?.price ?? 0) > 0) as PriceTier | undefined
      : undefined;
    if (firstTierPrice?.price !== undefined) {
      formData.set("price", String(firstTierPrice.price));
    }
    formData.set("images", images.join("\n"));
    formData.set("is_visible", isVisible ? "true" : "false");
    formData.set("featured", featured ? "true" : "false");

    startTransition(async () => {
      const result = await upsertProduct(formData);
      if (result.success) {
        message.success(t("saveSuccess"));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("products:changed"));
        }
        if (onSaved) onSaved();
        if (redirectOnSave) router.push("/admin/products");
        if (redirectOnSave) router.refresh();
      } else {
        message.error(`${t("saveError")}${result.error}`);
      }
    });
  }

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialData,
          notes_vi: textFromList(initialData.notes_vi),
          notes_en: textFromList(initialData.notes_en),
          brew_guide_vi: textFromList(initialData.brew_guide_vi),
          brew_guide_en: textFromList(initialData.brew_guide_en),
          category_slugs: initialData.category_slugs ?? (initialData.category ? [initialData.category] : []),
          base_unit: initialData.base_unit ?? "",
          price_tiers: initialData.price_tiers?.length ? initialData.price_tiers : [
            {
              attribute: defaultPriceAttributes[0],
              price: initialData.price
            },
            {
              attribute: defaultPriceAttributes[1],
              price: initialData.price
            }
          ]
        }}
        onFinish={handleSubmit}
        className="w-full [&_.ant-card-body]:p-4 [&_.ant-card-head]:min-h-12 [&_.ant-card-head]:px-4 [&_.ant-card-head-title]:py-3 [&_.ant-form-item]:mb-3"
      >
      {isEditing ? (
        <div className="mb-4 flex items-center justify-end">
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isPending} size="large">
            {t("saveProduct")}
          </Button>
        </div>
      ) : null}

      <Card className="mb-4" title={t("productBasics")}>
        <Form.Item name="short_vi" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="short_en" hidden>
          <Input />
        </Form.Item>
        <div className="grid gap-3 md:grid-cols-2">
          <Form.Item name="name_vi" label={t("fieldNameVI")} rules={[{required: true, message: t("productNameRequired")}]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_en" label={t("fieldNameEN")} rules={[{required: true, message: t("productNameRequired")}]}>
            <Input />
          </Form.Item>
        </div>
        <Form.Item name="category_slugs" label={t("categoriesOptional")}>
          <Select
            mode="multiple"
            allowClear
            options={categoryOptions.map((category) => ({
              value: category.slug,
              label: locale === "en" ? category.name_en : category.name_vi
            }))}
          />
        </Form.Item>
        <div className="flex flex-wrap gap-5 pt-1">
          <label className="inline-flex items-center gap-3 text-sm font-medium text-stone-700">
            <Switch checked={isVisible} onChange={setIsVisible} />
            {isVisible ? t("businessActive") : t("businessStopped")}
          </label>
          <label className="inline-flex items-center gap-3 text-sm font-medium text-stone-700">
            <Switch checked={featured} onChange={setFeatured} />
            {t("featured")}
          </label>
        </div>
      </Card>

      <Card className="mb-4" title={t("productCommerce")}>
        <Form.Item name="original_price" hidden>
          <InputNumber />
        </Form.Item>
        <div className="grid gap-3 md:grid-cols-2">
          <Form.Item name="weight" label={t("weight")}>
            <Input />
          </Form.Item>
          <Form.Item name="base_unit" label={t("packageSpec")}>
            <Input placeholder={t("baseUnitPlaceholder")} />
          </Form.Item>
        </div>

        <Form.List name="price_tiers">
          {(fields, {add, remove}) => (
            <div className="space-y-2.5">
              {fields.map((field) => (
                <div key={field.key} className="grid gap-2.5 rounded-xl border border-stone-200 bg-stone-50 p-2.5 md:grid-cols-[minmax(0,1fr)_150px_180px_auto] md:items-end">
                  <Form.Item name={[field.name, "attribute"]} label={t("priceAttribute")} className="mb-0">
                    <Select
                      allowClear
                      showSearch
                      placeholder={t("selectAttribute")}
                      optionFilterProp="label"
                      options={attributeOptions.map((attribute) => ({value: attribute, label: attribute}))}
                    />
                  </Form.Item>
                  <Button icon={<PlusOutlined />} onClick={() => openAttributeModal(field.name)}>
                    {t("quickAddAttribute")}
                  </Button>
                  <Form.Item name={[field.name, "price"]} label={t("price")} className="mb-0" rules={[{required: true}]}>
                    <InputNumber
                      className="w-full"
                      min={0}
                      addonAfter="VNĐ"
                      formatter={formatNumber}
                      parser={parseNumber}
                    />
                  </Form.Item>
                  <Button danger type="text" icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                </div>
              ))}
              <Button icon={<PlusOutlined />} onClick={() => add({attribute: "", price: undefined})}>
                {t("addPriceTier")}
              </Button>
            </div>
          )}
        </Form.List>

        <Form.Item name="price" hidden>
          <InputNumber />
        </Form.Item>

        {["altitude", "roast_vi", "roast_en", "origin_vi", "origin_en"].map((name) => (
          <Form.Item key={name} name={name} hidden>
            <Input />
          </Form.Item>
        ))}
      </Card>

      <Card className="mb-4" title={t("productContent")}>
        <div className="grid gap-3 md:grid-cols-2">
          <Form.Item name="description_vi" label={t("productInfoVI")}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="description_en" label={t("productInfoEN")}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </div>
        {["farmer_story_vi", "farmer_story_en", "notes_vi", "notes_en", "brew_guide_vi", "brew_guide_en"].map((name) => (
          <Form.Item key={name} name={name} hidden>
            <Input />
          </Form.Item>
        ))}
      </Card>

      <Card className="mb-4" title={t("productImages")}>
        <div className="space-y-3">
          <Button
            icon={<UploadOutlined />}
            loading={isUploading}
            disabled={isUploading}
            onClick={() => document.getElementById("product-image-upload")?.click()}
          >
            {t("uploadTab")}
          </Button>
          <input id="product-image-upload" type="file" accept="image/*" multiple hidden onChange={handleFileChange} />
          {images.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                  <Image src={image} alt="" fill sizes="160px" className="object-cover" />
                  <Button
                    danger
                    size="small"
                    type="primary"
                    icon={<DeleteOutlined />}
                    className="absolute right-2 top-2"
                    onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Card>

      {!isEditing ? (
        <div className="sticky bottom-0 z-20 -mx-1 flex items-center justify-end border-t border-stone-200 bg-white/95 px-1 py-3 backdrop-blur">
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isPending} size="large">
            {t("saveProduct")}
          </Button>
        </div>
      ) : null}
      </Form>

      <Modal
        title={t("createAttribute")}
        open={attributeModalOpen}
        okText={t("addAttribute")}
        cancelText={t("cancel")}
        onCancel={() => {
          setAttributeModalOpen(false);
          setPendingAttributeIndex(null);
          setNewAttributeName("");
        }}
        onOk={handleCreateAttribute}
        destroyOnHidden
      >
        <div className="pt-2">
          <label className="mb-2 block text-sm font-medium text-stone-700">{t("attributeName")}</label>
          <Input
            value={newAttributeName}
            placeholder={t("attributeNamePlaceholder")}
            onChange={(event) => setNewAttributeName(event.target.value)}
            onPressEnter={handleCreateAttribute}
            autoFocus
          />
        </div>
      </Modal>
    </>
  );
}
