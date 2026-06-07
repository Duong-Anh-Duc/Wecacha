"use client";

import {useState, useTransition} from "react";
import {App, Button, Form, Input, Modal, Popconfirm, Space, Switch, Table, Tag, Tooltip, type TableColumnsType} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {deleteProductAttribute, upsertProductAttribute} from "@/actions/product-actions";

export type ProductAttributeRow = {
  id: string;
  name: string;
  sort_order: number;
  is_visible: boolean;
};

type Draft = {
  id?: string;
  name: string;
  is_visible: boolean;
};

export function ProductAttributesManager({attributes}: {attributes: ProductAttributeRow[]}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const {message} = App.useApp();
  const [form] = Form.useForm<Draft>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isPending, startTransition] = useTransition();

  function startCreate() {
    const nextDraft = {name: "", is_visible: true};
    setDraft(nextDraft);
    form.setFieldsValue(nextDraft);
    setIsModalOpen(true);
  }

  function startEdit(row: ProductAttributeRow) {
    const nextDraft = {
      id: row.id,
      name: row.name,
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
    if (draft.id) formData.set("id", draft.id);
    formData.set("name", values.name);
    formData.set("is_visible", values.is_visible ? "true" : "false");

    startTransition(async () => {
      const result = await upsertProductAttribute(formData);
      if (result.success) {
        message.success(t("saveSuccess"));
        closeModal();
        router.refresh();
      } else {
        message.error(`${t("saveError")}${result.error}`);
      }
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteProductAttribute(id);
      if (result.success) {
        message.success(t("deleteSuccess"));
        router.refresh();
      } else {
        message.error(`${t("saveError")}${result.error}`);
      }
    });
  }

  const columns: TableColumnsType<ProductAttributeRow> = [
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
      title: t("attributeName"),
      dataIndex: "name",
      render: (value) => <span className="font-semibold text-forest-950">{value}</span>
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
            title={t("deleteAttributeConfirm")}
            okText={t("delete")}
            cancelText={t("cancel")}
            okButtonProps={{danger: true}}
            onConfirm={() => remove(row.id)}
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
          {t("addAttribute")}
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={attributes}
        pagination={false}
        scroll={{x: 640}}
      />

      <Modal
        title={draft?.id ? t("editAttribute") : t("newAttributeTitle")}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={t("save")}
        cancelText={t("cancel")}
        confirmLoading={isPending}
      >
        <Form form={form} layout="vertical" onFinish={save} initialValues={{is_visible: true}}>
          <Form.Item
            name="name"
            label={t("attributeName")}
            rules={[{required: true, message: t("attributeNameRequired")}]}
          >
            <Input placeholder={t("attributeNamePlaceholder")} />
          </Form.Item>
          <Form.Item name="is_visible" label={t("status")} valuePropName="checked">
            <Switch checkedChildren={t("visible")} unCheckedChildren={t("hidden")} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
