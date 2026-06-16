"use client";

import {useMemo, useState} from "react";
import {App, Button, DatePicker, Drawer, Dropdown, Input, Select, Space, Table, Tag, Tooltip, Typography, type TableColumnsType} from "antd";
import {DownOutlined, EditOutlined, EyeOutlined, SearchOutlined, SaveOutlined} from "@ant-design/icons";
import dayjs, {type Dayjs} from "dayjs";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {updateOrderWorkflow} from "@/actions/order-actions";
import {formatCurrency} from "@/lib/content/helpers";

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
    image: string | null;
    weight: string | null;
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
  const {message, modal} = App.useApp();
  const isVi = locale === "vi";
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [viewing, setViewing] = useState<OrderRow | null>(null);
  const [editing, setEditing] = useState<OrderRow | null>(null);
  const [draftStatus, setDraftStatus] = useState<OrderRow["status"]>("new");
  const [draftNote, setDraftNote] = useState("");
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
    const fromTs = dateRange?.[0] ? dateRange[0].startOf("day").valueOf() : null;
    const toTs = dateRange?.[1] ? dateRange[1].endOf("day").valueOf() : null;

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const haystack = [order.customer_name, order.phone, order.city, order.address, order.admin_note]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const createdTs = new Date(order.created_at).getTime();
      const matchesDate =
        (fromTs === null || createdTs >= fromTs) && (toTs === null || createdTs <= toTs);

      return matchesStatus && matchesDate && (!normalized || haystack.includes(normalized));
    });
  }, [orders, query, statusFilter, dateRange]);

  function statusLabel(status: OrderRow["status"]) {
    if (status === "confirmed") return t("orderConfirmed");
    if (status === "shipping") return t("orderShipping");
    if (status === "completed") return t("orderCompleted");
    if (status === "cancelled") return t("orderCancelled");
    return t("orderNew");
  }

  const statusOptions: {value: OrderRow["status"]; label: string}[] = [
    {value: "new", label: t("orderNew")},
    {value: "confirmed", label: t("orderConfirmed")},
    {value: "shipping", label: t("orderShipping")},
    {value: "completed", label: t("orderCompleted")},
    {value: "cancelled", label: t("orderCancelled")}
  ];

  function changeStatus(order: OrderRow, next: OrderRow["status"]) {
    if (next === order.status) return;
    modal.confirm({
      title: isVi ? "Đổi trạng thái đơn hàng" : "Change order status",
      content: isVi
        ? `Chuyển trạng thái từ "${statusLabel(order.status)}" sang "${statusLabel(next)}"?`
        : `Change status from "${statusLabel(order.status)}" to "${statusLabel(next)}"?`,
      okText: isVi ? "Xác nhận" : "Confirm",
      cancelText: isVi ? "Huỷ" : "Cancel",
      onOk: async () => {
        const formData = new FormData();
        formData.set("id", order.id);
        formData.set("status", next);
        formData.set("admin_note", order.admin_note ?? "");
        const result = await updateOrderWorkflow(formData);
        if (result.success) {
          message.success(t("saveSuccess"));
        } else {
          message.error(`${t("saveError")}${result.error}`);
          throw new Error(result.error);
        }
      }
    });
  }

  function openEdit(order: OrderRow) {
    setEditing(order);
    setDraftStatus(order.status);
    setDraftNote(order.admin_note ?? "");
  }

  async function persistOrder(order: OrderRow, status: OrderRow["status"], note: string) {
    const formData = new FormData();
    formData.set("id", order.id);
    formData.set("status", status);
    formData.set("admin_note", note);
    const result = await updateOrderWorkflow(formData);
    if (result.success) {
      message.success(t("saveSuccess"));
      return true;
    }
    message.error(`${t("saveError")}${result.error}`);
    return false;
  }

  // Status dropdown inside the drawer → confirm → save status to DB immediately.
  function handleDrawerStatusChange(next: OrderRow["status"]) {
    if (!editing || next === draftStatus) return;
    const order = editing;
    modal.confirm({
      title: isVi ? "Đổi trạng thái đơn hàng" : "Change order status",
      content: isVi
        ? `Chuyển trạng thái từ "${statusLabel(draftStatus)}" sang "${statusLabel(next)}"?`
        : `Change status from "${statusLabel(draftStatus)}" to "${statusLabel(next)}"?`,
      okText: isVi ? "Xác nhận" : "Confirm",
      cancelText: isVi ? "Huỷ" : "Cancel",
      onOk: async () => {
        const ok = await persistOrder(order, next, order.admin_note ?? "");
        if (!ok) throw new Error("update failed");
        setDraftStatus(next);
        setEditing({...order, status: next});
      }
    });
  }

  // Save button → saves the internal note only (status is handled by the dropdown).
  function saveNote() {
    if (!editing) return;
    void persistOrder(editing, editing.status, draftNote);
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
      render: (value, row) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            selectable: true,
            selectedKeys: [row.status],
            items: statusOptions.map((opt) => ({key: opt.value, label: opt.label})),
            onClick: ({key}) => changeStatus(row, key as OrderRow["status"])
          }}
        >
          <Tag
            color={statusColors[value as OrderRow["status"]]}
            className="cursor-pointer select-none"
            style={{marginInlineEnd: 0}}
          >
            {statusLabel(value)} <DownOutlined style={{fontSize: 9}} />
          </Tag>
        </Dropdown>
      )
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
          <Tooltip title={t("viewDetails")}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => setViewing(row)}
              className="text-blue-500 hover:!bg-transparent hover:!text-blue-700"
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
          id="orders-status-filter"
          size="large"
          allowClear
          value={statusFilter === "all" ? undefined : statusFilter}
          placeholder={t("allStatuses")}
          onChange={(value) => setStatusFilter(value ?? "all")}
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
        <DatePicker.RangePicker
          size="large"
          value={dateRange}
          onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null] | null)}
          format="DD/MM/YYYY"
          maxDate={dayjs()}
          allowEmpty={[true, true]}
          placeholder={[locale === "vi" ? "Từ ngày" : "From", locale === "vi" ? "Đến ngày" : "To"]}
          className="min-w-64"
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
          showSizeChanger: {id: "orders-page-size"},
          showTotal: (total) => t("tableTotal", {total})
        }}
      />

      <Drawer
        title={viewing ? `${t("viewDetails")} - ${viewing.customer_name}` : t("viewDetails")}
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        size="large"
      >
        {viewing ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm">
              <p className="font-semibold text-forest-950">{viewing.customer_name}</p>
              <Typography.Text copyable className="mt-1 text-stone-600">
                {viewing.phone}
              </Typography.Text>
              <p className="mt-2 text-stone-600">{`${viewing.address}, ${viewing.ward}, ${viewing.city}`}</p>
              <div className="mt-3">
                <Tag color={statusColors[viewing.status]}>{statusLabel(viewing.status)}</Tag>
              </div>
              {viewing.note ? <p className="mt-3 italic text-stone-600">{viewing.note}</p> : null}
              {viewing.admin_note ? (
                <div className="mt-3 rounded-xl bg-white p-3 text-stone-600">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">{t("adminNote")}</p>
                  <p className="mt-1">{viewing.admin_note}</p>
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-stone-200 p-4">
              <p className="font-semibold text-forest-950">{t("orderItems")}</p>
              <div className="mt-3 space-y-3">
                {viewing.order_items?.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                        {item.image ? (
                          <Image src={item.image} alt={item.product_name} fill sizes="56px" className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-stone-400">
                            {t("noProductImage")}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-forest-950">{item.product_name}</p>
                        <p className="text-stone-500">
                          x{item.quantity}
                          {item.weight ? ` · ${item.weight}` : ""}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-forest-950">
                      {formatCurrency(item.line_total, locale as "vi" | "en")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 p-4 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>{t("shippingFee")}</span>
                <span>{formatCurrency(viewing.shipping, locale as "vi" | "en")}</span>
              </div>
              <div className="mt-3 flex justify-between text-base font-semibold text-forest-950">
                <span>{t("total")}</span>
                <span>{formatCurrency(viewing.total, locale as "vi" | "en")}</span>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>

      <Drawer
        title={editing ? editing.customer_name : t("orders")}
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        size="large"
      >
        {editing ? (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">{t("status")}</p>
              <Select
                className="mt-2 w-full"
                value={draftStatus}
                onChange={handleDrawerStatusChange}
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
              <Button
                type="primary"
                size="large"
                block
                icon={<SaveOutlined />}
                onClick={saveNote}
                className="mt-3 !h-12 !font-bold"
              >
                {isVi ? "Lưu ghi chú" : "Save note"}
              </Button>
            </div>
            <div className="rounded-2xl border border-stone-200 p-4">
              <p className="font-semibold text-forest-950">{t("orderItems")}</p>
              <div className="mt-3 space-y-3">
                {editing.order_items?.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
                        {item.image ? (
                          <Image src={item.image} alt={item.product_name} fill sizes="56px" className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-stone-400">
                            {t("noProductImage")}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-forest-950">{item.product_name}</p>
                        <p className="text-stone-500">
                          x{item.quantity}
                          {item.weight ? ` · ${item.weight}` : ""}
                        </p>
                      </div>
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
