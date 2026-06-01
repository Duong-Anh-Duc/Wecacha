"use client";

import {useState, useTransition} from "react";
import {App, Button, Form, Input, Modal, Popconfirm, Space, Switch, Table, Tag, Tooltip, type TableColumnsType} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {deleteProductCategory, upsertProductCategory} from "@/actions/product-actions";
import type {ProductCategoryOption} from "./product-form";

export type ProductCategoryRow = ProductCategoryOption & {
  sort_order: number;
  is_visible: boolean;
};

type Draft = {
  slug?: string;
  name_vi: string;
  name_en: string;
  is_visible: boolean;
};

export function ProductCategoriesManager({categories}: {categories: ProductCategoryRow[]}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const {message} = App.useApp();
  const [form] = Form.useForm<Draft>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isPending, startTransition] = useTransition();

  function startCreate() {
    const nextDraft = {name_vi: "", name_en: "", is_visible: true};
    setDraft(nextDraft);
    form.setFieldsValue(nextDraft);
    setIsModalOpen(true);
  }

  function startEdit(row: ProductCategoryRow) {
    const nextDraft = {
      slug: row.slug,
      name_vi: row.name_vi,
      name_en: row.name_en,
      is_visible: row.is_visible
    };
    setDraft(nextDraft);
    form.setFieldsValue(nextDraft);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setDraft(null);
    form.resetFields();
  }

  function save(values: Draft) {
    if (!draft) return;

    const formData = new FormData();
    if (draft.slug) formData.set("slug", draft.slug);
    formData.set("name_vi", values.name_vi);
    formData.set("name_en", values.name_en);
    formData.set("is_visible", values.is_visible ? "true" : "false");

    startTransition(async () => {
      const result = await upsertProductCategory(formData);
      if (result.success) {
        message.success(t("saveSuccess"));
        closeModal();
        router.refresh();
      } else {
        message.error(`${t("saveError")}${result.error}`);
      }
    });
  }

  function remove(slug: string) {
    startTransition(async () => {
      const result = await deleteProductCategory(slug);
      if (result.success) {
        message.success(t("deleteSuccess"));
        router.refresh();
      } else {
        message.error(`${t("saveError")}${result.error}`);
      }
    });
  }

  const columns: TableColumnsType<ProductCategoryRow & {slug: string}> = [
    {
      title: t("colIndex"),
      key: "index",
      width: 72,
      align: "center",
      render: (_value, _row, index) => (
        <span className="font-medium text-stone-500">{index + 1}</span>
      )
    },
    {
      title: t("categoryNameVI"),
      dataIndex: "name_vi",
      render: (value) => <span className="font-semibold text-forest-950">{value}</span>
    },
    {
      title: t("categoryNameEN"),
      dataIndex: "name_en",
      render: (value) => value
    },
    {
      title: t("status"),
      dataIndex: "is_visible",
      width: 150,
      render: (value) => (
        <Tag color={value ? "green" : "default"}>
          {value ? t("visible") : t("hidden")}
        </Tag>
      )
    },
    {
      title: t("colActions"),
      key: "actions",
      align: "right",
      width: 160,
      render: (_, row) => (
        <Space>
          <Tooltip title={t("edit")}>
            <Button type="text" icon={<EditOutlined />} onClick={() => startEdit(row)} />
          </Tooltip>
          <Popconfirm
            title={t("deleteCategoryConfirm")}
            okText={t("delete")}
            cancelText={t("cancel")}
            okButtonProps={{danger: true}}
            onConfirm={() => remove(row.slug)}
          >
            <Tooltip title={t("delete")}>
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4">
      <div className="flex justify-end">
        <Button type="primary" icon={<PlusOutlined />} onClick={startCreate}>
          {t("addCategory")}
        </Button>
      </div>
      <Table
        rowKey="slug"
        columns={columns}
        dataSource={categories}
        pagination={false}
        scroll={{x: 720}}
      />

      <Modal
        title={draft?.slug ? t("editCategoryTitle") : t("newCategoryTitle")}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={t("save")}
        cancelText={t("cancel")}
        confirmLoading={isPending}
      >
        <Form form={form} layout="vertical" onFinish={save} initialValues={{is_visible: true}}>
          <Form.Item
            name="name_vi"
            label={t("categoryNameVI")}
            rules={[{required: true, message: t("categoryNameRequired")}]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="name_en" label={t("categoryNameEN")}>
            <Input />
          </Form.Item>
          <Form.Item name="is_visible" label={t("status")} valuePropName="checked">
            <Switch checkedChildren={t("visible")} unCheckedChildren={t("hidden")} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
