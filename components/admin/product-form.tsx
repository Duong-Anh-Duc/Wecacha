"use client";

import {useState, useTransition} from "react";
import Image from "next/image";
import {App, Button, Card, Form, Input, InputNumber, Modal, Select, Space, Switch} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined, UploadOutlined} from "@ant-design/icons";
import {useLocale, useTranslations} from "next-intl";
import {uploadProductImage, upsertProduct, upsertProductAttribute} from "@/actions/product-actions";
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
  bulk_price_tiers?: BulkPriceTier[] | null;
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

type BulkPriceTier = {
  minKg?: number;
  maxKg?: number;
  price?: number;
};

const defaultAttributeGroups = ["CÂN NẶNG", "MÀU", "DUNG TÍCH", "KHỐI LƯỢNG"];
const defaultAttributeValues = ["1kg", "2kg", "5kg", "10kg", "20kg", "50kg"];

export type ProductAttributeOption = {
  id?: string;
  name: string;
};

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

function CompactNumberInput({
  suffix,
  className,
  ...props
}: {
  suffix: string;
  className?: string;
  value?: number;
  min?: number;
  formatter?: (value?: string | number) => string;
  parser?: (value?: string) => string | number;
  onChange?: (value: number | null) => void;
}) {
  return (
    <Space.Compact className={className ?? "w-full"}>
      <InputNumber {...props} parser={props.parser as never} className="w-full" />
      <div className="flex min-w-16 items-center justify-center rounded-r-lg border border-l-0 border-stone-200 bg-stone-100 px-3 text-sm text-stone-500">
        {suffix}
      </div>
    </Space.Compact>
  );
}

export function ProductForm({
  initialData = {},
  categories,
  attributes = [],
  onSaved,
  onCancel,
  formId,
  showActions = true,
  redirectOnSave = true
}: {
  initialData?: ProductFormData;
  categories: ProductCategoryOption[];
  attributes?: ProductAttributeOption[];
  onSaved?: () => void;
  onCancel?: () => void;
  formId?: string;
  showActions?: boolean;
  redirectOnSave?: boolean;
}) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const router = useRouter();
  const {message} = App.useApp();
  const [form] = Form.useForm();
  const initialPriceTiers = initialData.price_tiers?.length
    ? initialData.price_tiers
    : [];
  const initialAttributeValues = initialPriceTiers
    .map((tier) => tier.attribute?.trim())
    .filter((attribute): attribute is string => Boolean(attribute));
  const initialBulkPriceTiers = initialData.bulk_price_tiers?.length
    ? initialData.bulk_price_tiers
    : [{minKg: undefined, maxKg: undefined, price: undefined}];
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState<string[]>(initialData.images ?? []);
  const [isUploading, setIsUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(initialData.is_visible ?? true);
  const [attributeModalOpen, setAttributeModalOpen] = useState(false);
  const [bulkPriceDraft, setBulkPriceDraft] = useState<BulkPriceTier[]>(initialBulkPriceTiers);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [editingAttribute, setEditingAttribute] = useState<ProductAttributeOption | null>(null);
  const [attributeOptions, setAttributeOptions] = useState<ProductAttributeOption[]>(() => {
    const keyed = new Map<string, ProductAttributeOption>();
    [...defaultAttributeGroups.map((name) => ({name})), ...attributes].forEach((attribute) => {
      keyed.set(attribute.name, attribute);
    });
    return Array.from(keyed.values());
  });
  const [selectedAttributeGroup, setSelectedAttributeGroup] = useState<string | undefined>(undefined);
  const [attributeValues, setAttributeValues] = useState<string[]>(initialAttributeValues);
  const categoryOptions = categories.length > 0
    ? categories
    : [
        {slug: "beans", name_vi: "beans", name_en: "beans"},
        {slug: "ground", name_vi: "ground", name_en: "ground"},
        {slug: "phin", name_vi: "phin", name_en: "phin"},
        {slug: "gifts", name_vi: "gifts", name_en: "gifts"}
      ];

  function openCreateAttributeModal() {
    setEditingAttribute(null);
    setNewAttributeName("");
    setAttributeModalOpen(true);
  }

  function openEditAttributeModal(attribute: ProductAttributeOption, event?: React.MouseEvent<HTMLElement>) {
    event?.preventDefault();
    event?.stopPropagation();
    setEditingAttribute(attribute);
    setNewAttributeName(attribute.name);
    setAttributeModalOpen(true);
  }

  async function handleSaveAttribute() {
    const attributeGroup = newAttributeName.trim();
    if (!attributeGroup) {
      message.error(t("attributeNameRequired"));
      return;
    }

    const formData = new FormData();
    if (editingAttribute?.id) formData.set("id", editingAttribute.id);
    formData.set("name", attributeGroup);
    formData.set("is_visible", "true");
    const result = await upsertProductAttribute(formData);
    if (!result.success) {
      message.error(`${t("saveError")}${result.error}`);
      return;
    }

    if (editingAttribute) {
      setAttributeOptions((current) =>
        current.map((item) => item.name === editingAttribute.name ? {...item, name: attributeGroup} : item)
      );
      if (selectedAttributeGroup === editingAttribute.name) {
        setSelectedAttributeGroup(attributeGroup);
      }
    } else {
      setAttributeOptions((current) => current.some((item) => item.name === attributeGroup) ? current : [...current, {name: attributeGroup}]);
      setSelectedAttributeGroup(attributeGroup);
    }
    message.success(t("saveSuccess"));
    setAttributeModalOpen(false);
    setEditingAttribute(null);
    setNewAttributeName("");
  }

  function closeAttributeModal() {
    setAttributeModalOpen(false);
    setEditingAttribute(null);
    setNewAttributeName("");
  }

  function syncAttributeValues(nextValues: string[]) {
    const normalizedValues = Array.from(new Set(nextValues.map((value) => value.trim()).filter(Boolean)));
    const currentTiers = (form.getFieldValue("price_tiers") as PriceTier[] | undefined) ?? initialPriceTiers;
    setAttributeValues(normalizedValues);
    form.setFieldValue(
      "price_tiers",
      normalizedValues.map((attribute) => {
        const existingTier = currentTiers.find((tier) => tier.attribute === attribute);
        return existingTier ?? {attribute, price: undefined};
      })
    );
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setIsUploading(true);
    try {
      let uploadedCount = 0;
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadProductImage(formData);

        if (result.url) {
          uploadedCount += 1;
          setImages((current) => [...current, result.url!]);
        } else {
          message.error(`${t("uploadError")}${result.error ?? ""}`);
        }
      }
      if (uploadedCount > 0) {
        message.success(t("uploadSuccess"));
      }
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
    formData.set("bulk_price_tiers", JSON.stringify(bulkPriceDraft));
    formData.set("images", images.join("\n"));
    formData.set("is_visible", isVisible ? "true" : "false");
    formData.set("featured", initialData.featured ? "true" : "false");

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

  function handleCancel() {
    if (onCancel) {
      onCancel();
      return;
    }

    router.push("/admin/products");
  }

  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter" || event.nativeEvent.isComposing || isPending) return;

    const target = event.target as HTMLElement;
    if (
      target.tagName === "TEXTAREA" ||
      target.closest(".ant-select") ||
      target.closest("[role='combobox']")
    ) {
      return;
    }

    event.preventDefault();
    form.submit();
  }

  return (
    <>
      <Form
        id={formId}
        form={form}
        layout="vertical"
        onKeyDown={handleFormKeyDown}
        initialValues={{
          ...initialData,
          notes_vi: textFromList(initialData.notes_vi),
          notes_en: textFromList(initialData.notes_en),
          brew_guide_vi: textFromList(initialData.brew_guide_vi),
          brew_guide_en: textFromList(initialData.brew_guide_en),
          category_slugs: initialData.category_slugs ?? (initialData.category ? [initialData.category] : []),
          base_unit: initialData.base_unit ?? "",
          price_tiers: initialPriceTiers
        }}
        onFinish={handleSubmit}
        className="w-full [&_.ant-card-body]:p-4 [&_.ant-card-head]:min-h-12 [&_.ant-card-head]:px-4 [&_.ant-card-head-title]:py-3 [&_.ant-form-item]:mb-3"
      >
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
        <Form.Item name="weight" hidden>
          <Input />
        </Form.Item>
        <div className="grid gap-3 md:grid-cols-2">
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
          <Form.Item name="base_unit" label={t("packageSpec")}>
            <Input placeholder={t("baseUnitPlaceholder")} />
          </Form.Item>
        </div>
        <div className="flex flex-wrap gap-5 pt-1">
          <label className="inline-flex items-center gap-3 text-sm font-medium text-stone-700">
            <Switch checked={isVisible} onChange={setIsVisible} />
            {isVisible ? t("businessActive") : t("businessStopped")}
          </label>
        </div>
      </Card>

      <Card className="mb-4" title={t("productCommerce")}>
        <Form.Item name="original_price" hidden>
          <InputNumber />
        </Form.Item>

        <div className="mb-4 space-y-3 rounded-2xl border border-stone-200 bg-white p-4">
          <div>
            <p className="text-sm font-bold text-forest-950">{t("priceAttribute")}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-[240px_minmax(0,1fr)_140px_auto] md:items-start">
            <Select
              value={selectedAttributeGroup}
              showSearch
              filterOption={(input, option) =>
                String(option?.value ?? "").toLowerCase().includes(input.toLowerCase())
              }
              popupRender={(menu) => (
                <>
                  {menu}
                  <div className="border-t border-stone-100 p-2">
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      className="px-1 font-semibold"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={openCreateAttributeModal}
                    >
                      {t("createAttribute")}
                    </Button>
                  </div>
                </>
              )}
              optionRender={(option) => {
                const attribute = attributeOptions.find((item) => item.name === option.value);
                return (
                  <div className="flex items-center justify-between gap-3">
                    <span>{String(option.label)}</span>
                    {attribute ? (
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        aria-label={t("editAttribute")}
                        onClick={(event) => openEditAttributeModal(attribute, event)}
                      />
                    ) : null}
                  </div>
                );
              }}
              options={attributeOptions.map((attribute) => ({
                value: attribute.name,
                label: attribute.name
              }))}
              onChange={(value) => setSelectedAttributeGroup(value)}
            />
            <Select
              mode="tags"
              value={attributeValues}
              placeholder={t("attributeValuePlaceholder")}
              tokenSeparators={[","]}
              options={defaultAttributeValues.map((value) => ({value, label: value}))}
              onChange={syncAttributeValues}
            />
            <Button onClick={() => syncAttributeValues(defaultAttributeValues)}>
              {t("quickSelect")}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => syncAttributeValues([])}
            />
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-4 border-b border-stone-100 pb-3">
            <p className="text-sm font-bold text-forest-950">{t("priceGuideTitle")}</p>
          </div>
          <div className="space-y-3">
            {bulkPriceDraft.map((tier, index) => (
              <div key={index} className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3 md:grid-cols-[1fr_1fr_1.4fr_auto] md:items-end">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-stone-700">{t("minKg")}</span>
                  <CompactNumberInput
                    suffix="kg"
                    min={0}
                    value={tier.minKg}
                    onChange={(value) => {
                      setBulkPriceDraft((current) =>
                        current.map((item, itemIndex) => itemIndex === index ? {...item, minKg: Number(value ?? 0)} : item)
                      );
                    }}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-stone-700">{t("maxKg")}</span>
                  <CompactNumberInput
                    suffix="kg"
                    min={0}
                    value={tier.maxKg}
                    onChange={(value) => {
                      setBulkPriceDraft((current) =>
                        current.map((item, itemIndex) => itemIndex === index ? {...item, maxKg: Number(value ?? 0)} : item)
                      );
                    }}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-stone-700">{t("pricePerKg")}</span>
                  <CompactNumberInput
                    suffix="VNĐ/kg"
                    min={0}
                    value={tier.price}
                    formatter={formatNumber}
                    parser={parseNumber}
                    onChange={(value) => {
                      setBulkPriceDraft((current) =>
                        current.map((item, itemIndex) => itemIndex === index ? {...item, price: Number(value ?? 0)} : item)
                      );
                    }}
                  />
                </label>
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => setBulkPriceDraft((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                />
              </div>
            ))}
            <Button
              icon={<PlusOutlined />}
              onClick={() => setBulkPriceDraft((current) => [...current, {minKg: undefined, maxKg: undefined, price: undefined}])}
            >
              {t("addBulkPriceTier")}
            </Button>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-bold text-forest-950">{t("sameTypeProducts")}</p>
        </div>

        <Form.List name="price_tiers">
          {(fields, {remove}) => (
            <div className="space-y-2.5">
              {fields.map((field) => (
                <div key={field.key} className="grid gap-2.5 rounded-xl border border-stone-200 bg-stone-50 p-2.5 md:grid-cols-[minmax(150px,1fr)_minmax(180px,1fr)_auto] md:items-start">
                  <Form.Item name={[field.name, "attribute"]} label={t("priceAttribute")} className="mb-0">
                    <Input readOnly className="bg-stone-100 font-semibold" />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "price"]}
                    label={t("price")}
                    className="mb-0 [&_.ant-form-item-explain-error]:max-w-[220px] [&_.ant-form-item-explain-error]:text-sm [&_.ant-form-item-explain-error]:leading-snug"
                    rules={[{required: true}]}
                  >
                    <CompactNumberInput suffix="VNĐ" min={0} formatter={formatNumber} parser={parseNumber} />
                  </Form.Item>
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                    className="mt-8"
                    onClick={() => {
                      const currentTiers = form.getFieldValue("price_tiers") as PriceTier[] | undefined;
                      const attribute = currentTiers?.[field.name]?.attribute;
                      remove(field.name);
                      if (attribute) {
                        setAttributeValues((current) => current.filter((value) => value !== attribute));
                      }
                    }}
                  />
                </div>
              ))}
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

      {showActions ? (
        <div className="fixed bottom-10 right-6 z-[1200] flex items-center justify-end gap-2 rounded-2xl border border-stone-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur">
          <Button size="large" onClick={handleCancel}>
            {t("skip")}
          </Button>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isPending} size="large">
            {t("saveProduct")}
          </Button>
        </div>
      ) : null}
      </Form>

      <Modal
        title={editingAttribute ? t("editAttribute") : t("createAttribute")}
        open={attributeModalOpen}
        okText={t("saveAttribute")}
        cancelText={t("cancel")}
        onCancel={closeAttributeModal}
        onOk={handleSaveAttribute}
        destroyOnHidden
      >
        <div className="pt-2">
          <label className="mb-2 block text-sm font-medium text-stone-700">{t("attributeName")}</label>
          <Input
            value={newAttributeName}
            placeholder={t("attributeNamePlaceholder")}
            onChange={(event) => setNewAttributeName(event.target.value)}
            onPressEnter={handleSaveAttribute}
            autoFocus
          />
        </div>
      </Modal>

    </>
  );
}
