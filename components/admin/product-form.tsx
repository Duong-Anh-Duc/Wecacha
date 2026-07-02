"use client";

import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {App, Button, Card, Form, Input, InputNumber, Modal, Select, Space, Switch, Tooltip} from "antd";
import {
  DeleteOutlined,
  DragOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  ScissorOutlined,
  UploadOutlined
} from "@ant-design/icons";
import {useLocale, useTranslations} from "next-intl";
import {uploadProductImage, upsertProduct, upsertProductAttribute, upsertProductCategory} from "@/actions/product-actions";
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

type CropDraft = {
  file: File;
  url: string;
  index: number;
  total: number;
  naturalWidth: number;
  naturalHeight: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
};

const defaultAttributeGroups = ["CÂN NẶNG", "MÀU", "DUNG TÍCH", "KHỐI LƯỢNG"];
const defaultAttributeValues = ["1kg", "2kg", "5kg", "10kg", "20kg", "50kg"];
const cropPreviewWidth = 360;
const cropPreviewHeight = 540;
const minCropSize = 72;
const maxCropOutputSide = 1600;
const productImageAspectRatio = 2 / 3;

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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function cropGeometry(draft: CropDraft) {
  if (!draft.naturalWidth || !draft.naturalHeight) return null;

  const scale = Math.min(cropPreviewWidth / draft.naturalWidth, cropPreviewHeight / draft.naturalHeight);
  const width = draft.naturalWidth * scale;
  const height = draft.naturalHeight * scale;

  return {
    scale,
    width,
    height,
    left: (cropPreviewWidth - width) / 2,
    top: (cropPreviewHeight - height) / 2
  };
}

function normalizeCropBox(draft: CropDraft) {
  const geometry = cropGeometry(draft);
  if (!geometry) return null;

  const maxWidth = Math.max(minCropSize, geometry.width);
  const maxHeight = Math.max(minCropSize / productImageAspectRatio, geometry.height);
  const widthFromImageHeight = maxHeight * productImageAspectRatio;
  const maxCropWidth = Math.min(maxWidth, widthFromImageHeight);
  const minCropWidth = Math.min(minCropSize, maxCropWidth);
  const cropWidth = clamp(draft.cropWidth || maxCropWidth, minCropWidth, maxCropWidth);
  const cropHeight = cropWidth / productImageAspectRatio;
  const cropX = clamp(draft.cropX || geometry.left, geometry.left, geometry.left + geometry.width - cropWidth);
  const cropY = clamp(draft.cropY || geometry.top, geometry.top, geometry.top + geometry.height - cropHeight);

  return {cropX, cropY, cropWidth, cropHeight};
}

async function compressImageFile(file: File) {
  if (!file.type.startsWith("image/")) return file;
  if (file.size <= 1_500_000) return file;

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Không đọc được ảnh."));
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Không nén được ảnh."));
      img.src = String(reader.result ?? "");
    };
    reader.readAsDataURL(file);
  });

  const maxSide = 1800;
  const sourceWidth = image.naturalWidth || 1;
  const sourceHeight = image.naturalHeight || 1;
  const scale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return file;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), "image/jpeg", 0.82);
  });

  if (!blob) return file;

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now()
  });
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
  onSavingChange,
  formId,
  showActions = true,
  redirectOnSave = true
}: {
  initialData?: ProductFormData;
  categories: ProductCategoryOption[];
  attributes?: ProductAttributeOption[];
  onSaved?: () => void;
  onCancel?: () => void;
  onSavingChange?: (isSaving: boolean) => void;
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
    : [];
  const [images, setImages] = useState<string[]>(initialData.images ?? []);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draggingImageIndex, setDraggingImageIndex] = useState<number | null>(null);
  const [cropDraft, setCropDraft] = useState<CropDraft | null>(null);
  const [isVisible, setIsVisible] = useState(initialData.is_visible ?? true);
  const [attributeModalOpen, setAttributeModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [newCategoryNameVi, setNewCategoryNameVi] = useState("");
  const [newCategoryNameEn, setNewCategoryNameEn] = useState("");
  const [bulkPriceDraft, setBulkPriceDraft] = useState<BulkPriceTier[]>(initialBulkPriceTiers);
  const [showAttributeEditor, setShowAttributeEditor] = useState(true);
  const [newAttributeName, setNewAttributeName] = useState("");
  const [editingAttribute, setEditingAttribute] = useState<ProductAttributeOption | null>(null);
  const [attributeOptions, setAttributeOptions] = useState<ProductAttributeOption[]>(() => {
    const keyed = new Map<string, ProductAttributeOption>();
    [...defaultAttributeGroups.map((name) => ({name})), ...attributes].forEach((attribute) => {
      keyed.set(attribute.name, attribute);
    });
    return Array.from(keyed.values());
  });
  const [selectedAttributeGroup, setSelectedAttributeGroup] = useState<string | undefined>(
    attributes[0]?.name ?? defaultAttributeGroups[0]
  );
  const [attributeValues, setAttributeValues] = useState<string[]>(initialAttributeValues);
  const [categoryOptions, setCategoryOptions] = useState<ProductCategoryOption[]>(() => (
    categories.length > 0
      ? categories
      : [
          {slug: "beans", name_vi: "beans", name_en: "beans"},
          {slug: "ground", name_vi: "ground", name_en: "ground"},
          {slug: "phin", name_vi: "phin", name_en: "phin"},
          {slug: "gifts", name_vi: "gifts", name_en: "gifts"}
        ]
  ));
  const cropResolverRef = useRef<((file: File | null) => void) | null>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const cropDragRef = useRef<{
    x: number;
    y: number;
    cropX: number;
    cropY: number;
    cropWidth: number;
    cropHeight: number;
    action: "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
  } | null>(null);
  const cropPreviewGeometry = cropDraft ? cropGeometry(cropDraft) : null;
  const cropBox = cropDraft ? normalizeCropBox(cropDraft) : null;
  useEffect(() => {
    return () => {
      if (cropDraft?.url) {
        URL.revokeObjectURL(cropDraft.url);
      }
    };
  }, [cropDraft?.url]);

  useEffect(() => {
    if (categories.length > 0) {
      setCategoryOptions(categories);
    }
  }, [categories]);

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
    setShowAttributeEditor(true);
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

  function requestCloseAttributeModal() {
    Modal.confirm({
      title: t("closeModalConfirmTitle"),
      content: t("closeModalConfirmDesc"),
      okText: t("closeModalConfirmOk"),
      cancelText: t("closeModalConfirmCancel"),
      okButtonProps: {danger: true},
      onOk: closeAttributeModal
    });
  }

  function openCreateCategoryModal() {
    setNewCategoryNameVi("");
    setNewCategoryNameEn("");
    setCategoryModalOpen(true);
  }

  function closeCategoryModal() {
    setCategoryModalOpen(false);
    setNewCategoryNameVi("");
    setNewCategoryNameEn("");
  }

  function requestCloseCategoryModal() {
    if (isSavingCategory) return;

    Modal.confirm({
      title: t("closeModalConfirmTitle"),
      content: t("closeModalConfirmDesc"),
      okText: t("closeModalConfirmOk"),
      cancelText: t("closeModalConfirmCancel"),
      okButtonProps: {danger: true},
      onOk: closeCategoryModal
    });
  }

  async function handleSaveCategory() {
    const nameVi = newCategoryNameVi.trim();
    const nameEn = newCategoryNameEn.trim();

    if (!nameVi) {
      message.error(t("categoryNameRequired"));
      return;
    }

    setIsSavingCategory(true);
    const formData = new FormData();
    formData.set("name_vi", nameVi);
    formData.set("name_en", nameEn);
    formData.set("is_visible", "true");

    try {
      const result = await upsertProductCategory(formData);
      if (!result.success) {
        message.error(`${t("saveError")}${result.error}`);
        return;
      }

      if (result.category) {
        const nextCategory = result.category;
        setCategoryOptions((current) =>
          current.some((category) => category.slug === nextCategory.slug)
            ? current
            : [...current, nextCategory]
        );
        const currentValues = (form.getFieldValue("category_slugs") as string[] | undefined) ?? [];
        form.setFieldValue("category_slugs", Array.from(new Set([...currentValues, nextCategory.slug])));
      }
      message.success(t("saveSuccess"));
      closeCategoryModal();
      router.refresh();
    } finally {
      setIsSavingCategory(false);
    }
  }

  function startAttributeEditor() {
    setShowAttributeEditor(true);
    if (!selectedAttributeGroup && attributeOptions.length) {
      setSelectedAttributeGroup(attributeOptions[0]?.name);
    }
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

  function moveImage(fromIndex: number, toIndex: number) {
    setImages((current) => {
      if (toIndex < 0 || toIndex >= current.length || fromIndex === toIndex) return current;

      const nextImages = [...current];
      const [movedImage] = nextImages.splice(fromIndex, 1);
      nextImages.splice(toIndex, 0, movedImage);
      return nextImages;
    });
  }

  function handleImageDrop(targetIndex: number) {
    if (draggingImageIndex === null || draggingImageIndex === targetIndex) {
      setDraggingImageIndex(null);
      return;
    }

    moveImage(draggingImageIndex, targetIndex);
    setDraggingImageIndex(null);
  }

  function requestImageCrop(file: File, index: number, total: number) {
    return new Promise<File | null>((resolve) => {
      cropResolverRef.current = resolve;
      cropImageRef.current = null;
      setCropDraft({
        file,
        url: URL.createObjectURL(file),
        index,
        total,
        naturalWidth: 0,
        naturalHeight: 0,
        cropX: 0,
        cropY: 0,
        cropWidth: 0,
        cropHeight: 0
      });
    });
  }

  function resolveImageCrop(file: File | null) {
    cropResolverRef.current?.(file);
    cropResolverRef.current = null;
    cropImageRef.current = null;
    cropDragRef.current = null;
    setCropDraft(null);
  }

  function updateCropDraft(nextDraft: CropDraft) {
    const box = normalizeCropBox(nextDraft);
    if (!box) {
      setCropDraft(nextDraft);
      return;
    }

    setCropDraft({
      ...nextDraft,
      ...box
    });
  }

  function handleCropImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const image = event.currentTarget;
    cropImageRef.current = image;
    if (!cropDraft) return;

    const nextDraft = {
      ...cropDraft,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight
    };
    const geometry = cropGeometry(nextDraft);
    if (!geometry) {
      setCropDraft(nextDraft);
      return;
    }

    const cropWidth = Math.min(geometry.width, geometry.height * productImageAspectRatio) * 0.9;
    const cropHeight = cropWidth / productImageAspectRatio;
    setCropDraft({
      ...nextDraft,
      cropX: geometry.left + (geometry.width - cropWidth) / 2,
      cropY: geometry.top + (geometry.height - cropHeight) / 2,
      cropWidth,
      cropHeight
    });
  }

  function handleCropPointerDown(
    event: React.PointerEvent<HTMLElement>,
    action: "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"
  ) {
    if (!cropDraft || !cropBox) return;
    event.preventDefault();
    event.stopPropagation();
    const cropStage = event.currentTarget.closest("[data-crop-stage]") as HTMLDivElement | null;
    cropStage?.setPointerCapture(event.pointerId);
    cropDragRef.current = {
      x: event.clientX,
      y: event.clientY,
      ...cropBox,
      action
    };
  }

  function handleCropPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!cropDraft || !cropDragRef.current || !cropPreviewGeometry) return;

    const drag = cropDragRef.current;
    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;
    const imageLeft = cropPreviewGeometry.left;
    const imageTop = cropPreviewGeometry.top;
    const imageRight = cropPreviewGeometry.left + cropPreviewGeometry.width;
    const imageBottom = cropPreviewGeometry.top + cropPreviewGeometry.height;
    let cropX = drag.cropX;
    let cropY = drag.cropY;
    let cropWidth = drag.cropWidth;
    let cropHeight = drag.cropHeight;

    if (drag.action === "move") {
      cropX = clamp(drag.cropX + deltaX, imageLeft, imageRight - cropWidth);
      cropY = clamp(drag.cropY + deltaY, imageTop, imageBottom - cropHeight);
      setCropDraft({...cropDraft, cropX, cropY, cropWidth, cropHeight});
      return;
    }

    const anchorRight = drag.cropX + drag.cropWidth;
    const anchorBottom = drag.cropY + drag.cropHeight;
    const maxWidthFromLeft = imageRight - drag.cropX;
    const maxWidthFromRight = anchorRight - imageLeft;
    const maxWidthFromTop = (imageBottom - drag.cropY) * productImageAspectRatio;
    const maxWidthFromBottom = (anchorBottom - imageTop) * productImageAspectRatio;
    const minWidth = Math.min(minCropSize, drag.cropWidth);
    let nextWidth = drag.cropWidth;

    if (drag.action.includes("e")) nextWidth = drag.cropWidth + deltaX;
    if (drag.action.includes("w")) nextWidth = drag.cropWidth - deltaX;
    if (drag.action.includes("s")) nextWidth = (drag.cropHeight + deltaY) * productImageAspectRatio;
    if (drag.action.includes("n")) nextWidth = (drag.cropHeight - deltaY) * productImageAspectRatio;
    if ((drag.action === "se" || drag.action === "nw") && Math.abs(deltaX) > Math.abs(deltaY)) {
      nextWidth = drag.cropWidth + (drag.action === "se" ? deltaX : -deltaX);
    }
    if ((drag.action === "ne" || drag.action === "sw") && Math.abs(deltaX) > Math.abs(deltaY)) {
      nextWidth = drag.cropWidth + (drag.action === "ne" ? deltaX : -deltaX);
    }

    const maxWidth = Math.min(
      drag.action.includes("w") ? maxWidthFromRight : maxWidthFromLeft,
      drag.action.includes("n") ? maxWidthFromBottom : maxWidthFromTop
    );
    cropWidth = clamp(nextWidth, minWidth, maxWidth);
    cropHeight = cropWidth / productImageAspectRatio;
    cropX = drag.action.includes("w") ? anchorRight - cropWidth : drag.cropX;
    cropY = drag.action.includes("n") ? anchorBottom - cropHeight : drag.cropY;

    updateCropDraft({
      ...cropDraft,
      cropX,
      cropY,
      cropWidth,
      cropHeight
    });
  }

  function handleCropPointerEnd(event: React.PointerEvent<HTMLDivElement>) {
    cropDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  async function createCroppedImageFile() {
    if (!cropDraft || !cropPreviewGeometry || !cropBox || !cropImageRef.current) return cropDraft?.file ?? null;

    const sourceX = Math.max(0, (cropBox.cropX - cropPreviewGeometry.left) / cropPreviewGeometry.scale);
    const sourceY = Math.max(0, (cropBox.cropY - cropPreviewGeometry.top) / cropPreviewGeometry.scale);
    const sourceWidth = Math.min(cropDraft.naturalWidth - sourceX, cropBox.cropWidth / cropPreviewGeometry.scale);
    const sourceHeight = Math.min(cropDraft.naturalHeight - sourceY, cropBox.cropHeight / cropPreviewGeometry.scale);
    const outputScale = Math.min(1, maxCropOutputSide / Math.max(sourceWidth, sourceHeight));
    const outputWidth = Math.max(1, Math.round(sourceWidth * outputScale));
    const outputHeight = Math.max(1, Math.round(sourceHeight * outputScale));

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const context = canvas.getContext("2d");
    if (!context) return cropDraft.file;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, outputWidth, outputHeight);
    context.drawImage(
      cropImageRef.current,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      outputWidth,
      outputHeight
    );

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), "image/jpeg", 0.9);
    });
    if (!blob) return cropDraft.file;

    const baseName = cropDraft.file.name.replace(/\.[^.]+$/, "") || "product-image";
    return new File([blob], `${baseName}-crop.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now()
    });
  }

  async function handleCropConfirm() {
    resolveImageCrop(await createCroppedImageFile());
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setIsUploading(true);
    try {
      let uploadedCount = 0;
      for (const [index, file] of files.entries()) {
        const preparedFile = await requestImageCrop(file, index, files.length);
        if (!preparedFile) continue;

        const formData = new FormData();
        formData.append("file", await compressImageFile(preparedFile));
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

  async function handleCropExistingImage(image: string, index: number) {
    setIsUploading(true);
    try {
      const response = await fetch(image);
      if (!response.ok) {
        message.error(t("cropExistingImageError"));
        return;
      }

      const blob = await response.blob();
      const type = blob.type || "image/jpeg";
      const extension = type.split("/")[1] || "jpg";
      const file = new File([blob], `product-image-${index + 1}.${extension}`, {type});
      const croppedFile = await requestImageCrop(file, 0, 1);
      if (!croppedFile) return;

      const formData = new FormData();
      formData.append("file", await compressImageFile(croppedFile));
      const result = await uploadProductImage(formData);

      if (result.url) {
        setImages((current) => current.map((currentImage, imageIndex) => imageIndex === index ? result.url! : currentImage));
        message.success(t("uploadSuccess"));
      } else {
        message.error(`${t("uploadError")}${result.error ?? ""}`);
      }
    } catch {
      message.error(t("cropExistingImageError"));
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(values: Record<string, unknown>) {
    if (isSaving) return;
    setIsSaving(true);
    onSavingChange?.(true);

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

    try {
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
    } finally {
      setIsSaving(false);
      onSavingChange?.(false);
    }
  }

  function handleCancel() {
    if (onCancel) {
      onCancel();
      return;
    }

    router.push("/admin/products");
  }

  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter" || event.nativeEvent.isComposing || isSaving) return;

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
        onFinishFailed={({errorFields}) => {
          const firstError = errorFields[0]?.name;
          if (firstError) {
            form.scrollToField(firstError, {behavior: "smooth", block: "center"});
          }
        }}
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
              showSearch
              popupRender={(menu) => (
                <div>
                  {menu}
                  <div className="border-t border-stone-100 p-2">
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      className="flex w-full items-center justify-start text-forest-800"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={openCreateCategoryModal}
                    >
                      {t("addCategory")}
                    </Button>
                  </div>
                </div>
              )}
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
          {showAttributeEditor ? (
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
                open={false}
                suffixIcon={null}
                options={[]}
                onChange={syncAttributeValues}
              />
            </div>
          ) : (
            <Button icon={<PlusOutlined />} onClick={startAttributeEditor}>
              {t("addAttribute")}
            </Button>
          )}
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
                <div
                  key={`${image}-${index}`}
                  draggable={!isSaving}
                  className={`group relative aspect-square overflow-hidden rounded-2xl border bg-stone-100 transition ${
                    draggingImageIndex === index
                      ? "border-amber-400 opacity-60"
                      : "border-stone-200 hover:border-amber-300"
                  }`}
                  onDragStart={() => setDraggingImageIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleImageDrop(index)}
                  onDragEnd={() => setDraggingImageIndex(null)}
                >
                  <Image src={image} alt="" fill sizes="160px" className="object-cover" />
                  <div className="absolute left-2 top-2 rounded-lg bg-black/45 px-2 py-1 text-xs font-medium text-white shadow-sm backdrop-blur">
                    {index + 1}
                  </div>
                  <Tooltip title={t("dragImageToReorder")}>
                    <Button
                      size="small"
                      icon={<DragOutlined />}
                      className="absolute left-2 bottom-2 cursor-grab border-white/70 bg-white/90"
                    />
                  </Tooltip>
                  <Button
                    danger
                    size="small"
                    type="primary"
                    icon={<DeleteOutlined />}
                    className="absolute right-2 top-2"
                    onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))}
                  />
                  <Tooltip title={t("cropExistingImage")}>
                    <Button
                      size="small"
                      icon={<ScissorOutlined />}
                      loading={isUploading}
                      disabled={isUploading}
                      className="absolute right-2 bottom-2 border-white/70 bg-white/90"
                      onClick={() => handleCropExistingImage(image, index)}
                    />
                  </Tooltip>
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
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isSaving} disabled={isSaving} size="large">
            {t("saveProduct")}
          </Button>
        </div>
      ) : null}
      </Form>

      <Modal
        title={cropDraft ? `${t("cropImageTitle")} (${cropDraft.index + 1}/${cropDraft.total})` : t("cropImageTitle")}
        open={Boolean(cropDraft)}
        width={620}
        onCancel={() => resolveImageCrop(null)}
        destroyOnHidden
        footer={[
          <Button key="skip" onClick={() => resolveImageCrop(null)}>
            {t("skipImage")}
          </Button>,
          <Button key="crop" type="primary" icon={<ScissorOutlined />} disabled={!cropPreviewGeometry} onClick={handleCropConfirm}>
            {t("cropAndUpload")}
          </Button>
        ]}
      >
        {cropDraft ? (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-stone-500">{t("cropImageInstruction")}</p>
            <div className="flex justify-center">
              <div
                data-crop-stage
                className="relative touch-none select-none overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-inner"
                style={{width: cropPreviewWidth, height: cropPreviewHeight}}
                onPointerMove={handleCropPointerMove}
                onPointerUp={handleCropPointerEnd}
                onPointerCancel={handleCropPointerEnd}
              >
                {/* Local blob URL for canvas cropping; next/image optimization is not useful here. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={cropImageRef}
                  src={cropDraft.url}
                  alt=""
                  draggable={false}
                  className="absolute max-w-none"
                  style={
                    cropPreviewGeometry
                      ? {
                          width: cropPreviewGeometry.width,
                          height: cropPreviewGeometry.height,
                          left: cropPreviewGeometry.left,
                          top: cropPreviewGeometry.top
                        }
                      : {inset: 0, width: "100%", height: "100%", objectFit: "cover"}
                  }
                  onLoad={handleCropImageLoad}
                />
                {cropPreviewGeometry && cropBox ? (
                  <>
                    <div
                      className="pointer-events-none absolute bg-black/50"
                      style={{left: 0, top: 0, width: cropPreviewWidth, height: cropBox.cropY}}
                    />
                    <div
                      className="pointer-events-none absolute bg-black/50"
                      style={{
                        left: 0,
                        top: cropBox.cropY + cropBox.cropHeight,
                        width: cropPreviewWidth,
                        height: cropPreviewHeight - cropBox.cropY - cropBox.cropHeight
                      }}
                    />
                    <div
                      className="pointer-events-none absolute bg-black/50"
                      style={{left: 0, top: cropBox.cropY, width: cropBox.cropX, height: cropBox.cropHeight}}
                    />
                    <div
                      className="pointer-events-none absolute bg-black/50"
                      style={{
                        left: cropBox.cropX + cropBox.cropWidth,
                        top: cropBox.cropY,
                        width: cropPreviewWidth - cropBox.cropX - cropBox.cropWidth,
                        height: cropBox.cropHeight
                      }}
                    />
                    <div
                      className="absolute cursor-move border border-dashed border-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
                      style={{
                        left: cropBox.cropX,
                        top: cropBox.cropY,
                        width: cropBox.cropWidth,
                        height: cropBox.cropHeight,
                        backgroundImage:
                          "linear-gradient(to right, rgba(255,255,255,.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.55) 1px, transparent 1px)",
                        backgroundSize: `${cropBox.cropWidth / 3}px ${cropBox.cropHeight / 3}px`
                      }}
                      onPointerDown={(event) => handleCropPointerDown(event, "move")}
                    >
                      {[
                        ["nw", "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize"],
                        ["n", "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize"],
                        ["ne", "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-nesw-resize"],
                        ["e", "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize"],
                        ["se", "right-0 bottom-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize"],
                        ["s", "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-ns-resize"],
                        ["sw", "left-0 bottom-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize"],
                        ["w", "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize"]
                      ].map(([action, className]) => (
                        <button
                          key={action}
                          type="button"
                          aria-label={t("resizeCropArea")}
                          className={`absolute h-5 w-5 rounded-full border-2 border-stone-300 bg-white shadow-sm ${className}`}
                          onPointerDown={(event) =>
                            handleCropPointerDown(
                              event,
                              action as "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"
                            )
                          }
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        title={editingAttribute ? t("editAttribute") : t("createAttribute")}
        open={attributeModalOpen}
        okText={t("saveAttribute")}
        cancelText={t("cancel")}
        onCancel={requestCloseAttributeModal}
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

      <Modal
        title={t("newCategoryTitle")}
        open={categoryModalOpen}
        okText={t("save")}
        cancelText={t("cancel")}
        confirmLoading={isSavingCategory}
        onCancel={requestCloseCategoryModal}
        onOk={handleSaveCategory}
        destroyOnHidden
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">{t("categoryNameVI")}</label>
            <Input
              value={newCategoryNameVi}
              onChange={(event) => setNewCategoryNameVi(event.target.value)}
              onPressEnter={handleSaveCategory}
              autoFocus
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">{t("categoryNameEN")}</label>
            <Input
              value={newCategoryNameEn}
              onChange={(event) => setNewCategoryNameEn(event.target.value)}
              onPressEnter={handleSaveCategory}
            />
          </div>
        </div>
      </Modal>

    </>
  );
}
