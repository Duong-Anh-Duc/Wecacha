"use client";

import {useId, useState} from "react";
import {Button, Modal} from "antd";
import {EditOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {useTranslations} from "next-intl";
import {ProductForm, type ProductAttributeOption, type ProductCategoryOption, type ProductFormData} from "./product-form";

export function ProductFormModalButton({
  categories,
  attributes = [],
  product,
  mode = "create",
  compact = false
}: {
  categories: ProductCategoryOption[];
  attributes?: ProductAttributeOption[];
  product?: ProductFormData;
  mode?: "create" | "edit";
  compact?: boolean;
}) {
  const t = useTranslations("Admin");
  const [open, setOpen] = useState(false);
  const isEdit = mode === "edit";
  const generatedFormId = useId();
  const formId = `product-form-${generatedFormId.replace(/:/g, "")}`;

  return (
    <>
      {compact ? (
        <Button
          type="text"
          icon={<EditOutlined />}
          className="text-ember hover:!bg-transparent hover:!text-forest-950"
          onClick={() => setOpen(true)}
        />
      ) : (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="bg-ember hover:!bg-ember/90"
          onClick={() => setOpen(true)}
        >
          {t("addProduct")}
        </Button>
      )}

      <Modal
        title={isEdit ? t("editProductTitle") : t("newProductTitle")}
        open={open}
        onCancel={() => setOpen(false)}
        footer={(
          <div className="flex items-center justify-end gap-2">
            <Button size="large" onClick={() => setOpen(false)}>
              {t("skip")}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              form={formId}
              icon={<SaveOutlined />}
              size="large"
              className="bg-ember hover:!bg-ember/90"
            >
              {t("saveProduct")}
            </Button>
          </div>
        )}
        width="min(1180px, calc(100vw - 32px))"
        style={{top: 24}}
        destroyOnHidden
      >
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto pb-24 pr-1">
          <ProductForm
            initialData={product}
            categories={categories}
            attributes={attributes}
            formId={formId}
            showActions={false}
            redirectOnSave={false}
            onCancel={() => setOpen(false)}
            onSaved={() => setOpen(false)}
          />
        </div>
      </Modal>
    </>
  );
}
