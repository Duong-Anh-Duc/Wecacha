"use client";

import {useMemo, useState, useTransition} from "react";
import {App, Button, Drawer, Input, Select, Space, Table, Tag, Tooltip, Typography, type TableColumnsType} from "antd";
import {EditOutlined, PhoneOutlined, SearchOutlined, SaveOutlined} from "@ant-design/icons";
import {useTranslations} from "next-intl";
import {updateOrderWorkflow} from "@/actions/order-actions";
import {formatCurrency} from "@/lib/content";

export type OrderRow = {
  id: string;
  created_at: string;
  status: "new" | "confirmed" | "shipping" | "completed" | "cancelled";
  customer_name: string;
  phone: string;
  city: string;
  ward: string;
  address: string;
  note: string | null;
  admin_note: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  order_items?: {
    id: string;
    product_slug: string;
    product_name: string;
    quantity: number;
    price: number;
    line_total: number;
  }[];
};

const statusColors = {
  new: "blue",
  confirmed: "gold",
  shipping: "purple",
  completed: "green",
  cancelled: "red"
};

export function OrdersTable({orders, locale}: {orders: OrderRow[]; locale: string}) {
  const t = useTranslations("Admin");
  const {message} = App.useApp();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<OrderRow | null>(null);
  const [draftStatus, setDraftStatus] = useState<OrderRow["status"]>("new");
  const [draftNote, setDraftNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pagination, setPagination] = useState({current: 1, pageSize: 10});

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
    [locale]
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const haystack = [order.customer_name, order.phone, order.city, order.address, order.admin_note]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [orders, query, statusFilter]);

  function statusLabel(status: OrderRow["status"]) {
    if (status === "confirmed") return t("orderConfirmed");
    if (status === "shipping") return t("orderShipping");
    if (status === "completed") return t("orderCompleted");
    if (status === "cancelled") return t("orderCancelled");
    return t("orderNew");
  }

  function openEdit(order: OrderRow) {
    setEditing(order);
    setDraftStatus(order.status);
    setDraftNote(order.admin_note ?? "");
  }

  function save() {
    if (!editing) return;

    const formData = new FormData();
    formData.set("id", editing.id);
    formData.set("status", draftStatus);
    formData.set("admin_note", draftNote);

    startTransition(async () => {
      const result = await updateOrderWorkflow(formData);
      if (result.success) {
        message.success(t("saveSuccess"));
        setEditing(null);
      } else {
        message.error(`${t("saveError")}${result.error}`);
      }
    });
  }

  const columns: TableColumnsType<OrderRow> = [
    {
      title: t("colIndex"),
      key: "index",
      width: 72,
      align: "center",
      render: (_value, _row, index) => (
        <span className="font-medium text-stone-500">
          {(pagination.current - 1) * pagination.pageSize + index + 1}
        </span>
      )
    },
    {
      title: t("customer"),
      dataIndex: "customer_name",
      sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
      render: (_, row) => (
        <div className="min-w-48">
          <p className="font-semibold text-forest-950">{row.customer_name}</p>
          <Typography.Text copyable className="text-xs text-stone-500">
            {row.phone}
          </Typography.Text>
        </div>
      )
    },
    {
      title: t("status"),
      dataIndex: "status",
      filters: [
        {text: t("orderNew"), value: "new"},
        {text: t("orderConfirmed"), value: "confirmed"},
        {text: t("orderShipping"), value: "shipping"},
        {text: t("orderCompleted"), value: "completed"},
        {text: t("orderCancelled"), value: "cancelled"}
      ],
      onFilter: (value, row) => row.status === value,
      render: (value) => <Tag color={statusColors[value as OrderRow["status"]]}>{statusLabel(value)}</Tag>
    },
    {
      title: t("orderItems"),
      dataIndex: "order_items",
      render: (items: OrderRow["order_items"]) => `${items?.length ?? 0} ${t("items")}`
    },
    {
      title: t("total"),
      dataIndex: "total",
      sorter: (a, b) => a.total - b.total,
      render: (value) => formatCurrency(value, locale as "vi" | "en")
    },
    {
      title: t("address"),
      dataIndex: "address",
      ellipsis: true,
      render: (_, row) => `${row.address}, ${row.ward}, ${row.city}`
    },
    {
      title: t("colRegisteredAt"),
      dataIndex: "created_at",
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      defaultSortOrder: "descend",
      render: (value) => dateFormatter.format(new Date(value))
    },
    {
      title: t("colActions"),
      key: "actions",
      align: "right",
      render: (_, row) => (
        <Space>
          <Tooltip title={t("callCustomer")}>
            <Button
              type="text"
              href={`tel:${row.phone}`}
              icon={<PhoneOutlined />}
              className="text-[#4A751D] hover:!bg-transparent hover:!text-forest-950"
            />
          </Tooltip>
          <Tooltip title={t("edit")}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEdit(row)}
              className="text-ember hover:!bg-transparent hover:!text-forest-950"
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          allowClear
          size="large"
          prefix={<SearchOutlined />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchOrders")}
          className="max-w-xl"
        />
        <Select
          size="large"
          value={statusFilter}
          onChange={setStatusFilter}
          className="min-w-52"
          options={[
            {label: t("allStatuses"), value: "all"},
            {label: t("orderNew"), value: "new"},
            {label: t("orderConfirmed"), value: "confirmed"},
            {label: t("orderShipping"), value: "shipping"},
            {label: t("orderCompleted"), value: "completed"},
            {label: t("orderCancelled"), value: "cancelled"}
          ]}
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        scroll={{x: 1200}}
        onChange={(nextPagination) => {
          setPagination({
            current: nextPagination.current ?? 1,
            pageSize: nextPagination.pageSize ?? 10
          });
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          showTotal: (total) => t("tableTotal", {total})
        }}
      />

      <Drawer
        title={editing ? editing.customer_name : t("orders")}
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        width={520}
        extra={
          <Button type="primary" icon={<SaveOutlined />} loading={isPending} onClick={save}>
            {t("save")}
          </Button>
        }
      >
        {editing ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">{t("status")}</p>
              <Select
                className="mt-2 w-full"
                value={draftStatus}
                onChange={setDraftStatus}
                options={[
                  {label: t("orderNew"), value: "new"},
                  {label: t("orderConfirmed"), value: "confirmed"},
                  {label: t("orderShipping"), value: "shipping"},
                  {label: t("orderCompleted"), value: "completed"},
                  {label: t("orderCancelled"), value: "cancelled"}
                ]}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">{t("adminNote")}</p>
              <Input.TextArea
                className="mt-2"
                rows={4}
                value={draftNote}
                onChange={(event) => setDraftNote(event.target.value)}
                placeholder={t("adminNotePlaceholder")}
              />
            </div>
            <div className="rounded-2xl border border-stone-200 p-4">
              <p className="font-semibold text-forest-950">{t("orderItems")}</p>
              <div className="mt-3 space-y-3">
                {editing.order_items?.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium text-forest-950">{item.product_name}</p>
                      <p className="text-stone-500">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-forest-950">{formatCurrency(item.line_total, locale as "vi" | "en")}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-stone-200 p-4 text-sm text-stone-600">
              <p className="font-semibold text-forest-950">{editing.customer_name}</p>
              <p>{editing.phone}</p>
              <p>{`${editing.address}, ${editing.ward}, ${editing.city}`}</p>
              {editing.note ? <p className="mt-2 italic">{editing.note}</p> : null}
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
