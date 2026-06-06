"use client";

import {useState} from "react";
import {Button, Modal} from "antd";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import {useTranslations} from "next-intl";
import {ProductForm, type ProductCategoryOption, type ProductFormData} from "./product-form";

export function ProductFormModalButton({
  categories,
  product,
  mode = "create",
  compact = false
}: {
  categories: ProductCategoryOption[];
  product?: ProductFormData;
  mode?: "create" | "edit";
  compact?: boolean;
}) {
  const t = useTranslations("Admin");
  const [open, setOpen] = useState(false);
  const isEdit = mode === "edit";

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
        footer={null}
        width="min(1180px, calc(100vw - 32px))"
        style={{top: 24}}
        destroyOnHidden
      >
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
          <ProductForm
            initialData={product}
            categories={categories}
            redirectOnSave={false}
            onSaved={() => setOpen(false)}
          />
        </div>
      </Modal>
    </>
  );
}
