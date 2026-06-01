"use client";

import {useEffect, useMemo, useState, useTransition} from "react";
import {App, Button, Dropdown, Input, Modal, Select, Space, Table, Tag, Tooltip, Typography, type TableColumnsType} from "antd";
import {EditOutlined, PhoneOutlined, SearchOutlined, SyncOutlined} from "@ant-design/icons";
import {useTranslations} from "next-intl";
import {updateRegistrationWorkflow} from "@/actions/registration-actions";

export type RegistrationRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  address: string | null;
  note: string | null;
  status: "new" | "contacted" | "closed";
  admin_note: string | null;
};

const statusColors = {
  new: "blue",
  contacted: "green",
  closed: "default"
};

export function RegistrationsTable({
  registrations,
  locale
}: {
  registrations: RegistrationRow[];
  locale: string;
}) {
  const t = useTranslations("Admin");
  const {message} = App.useApp();
  const [rows, setRows] = useState(registrations);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<RegistrationRow | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pagination, setPagination] = useState({current: 1, pageSize: 10});

  useEffect(() => {
    setRows(registrations);
  }, [registrations]);

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

    return rows.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const haystack = [item.name, item.phone, item.address, item.note, item.admin_note]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [query, rows, statusFilter]);

  function startEdit(row: RegistrationRow) {
    setEditing(row);
    setDraftNote(row.admin_note ?? "");
  }

  function persistWorkflow({
    row,
    nextStatus,
    nextAdminNote,
    closeModal = false,
    successMessage = t("saveSuccess")
  }: {
    row: RegistrationRow;
    nextStatus: RegistrationRow["status"];
    nextAdminNote: string;
    closeModal?: boolean;
    successMessage?: string;
  }) {
    const formData = new FormData();
    formData.set("id", row.id);
    formData.set("status", nextStatus);
    formData.set("admin_note", nextAdminNote);

    startTransition(async () => {
      const result = await updateRegistrationWorkflow(formData);
      if (result.success) {
        setRows((currentRows) =>
          currentRows.map((item) =>
            item.id === row.id ? {...item, status: nextStatus, admin_note: nextAdminNote || null} : item
          )
        );
        message.success(successMessage);
        if (closeModal) setEditing(null);
      } else {
        message.error(`${t("saveError")}${result.error}`);
      }
    });
  }

  function save() {
    if (!editing) return;
    persistWorkflow({
      row: editing,
      nextStatus: editing.status,
      nextAdminNote: draftNote,
      closeModal: true
    });
  }

  function saveStatus(row: RegistrationRow, nextStatus: RegistrationRow["status"]) {
    persistWorkflow({
      row,
      nextStatus,
      nextAdminNote: row.admin_note ?? "",
      successMessage: t("statusUpdateSuccess")
    });
  }

  function statusLabel(status: RegistrationRow["status"]) {
    if (status === "contacted") return t("statusContacted");
    if (status === "closed") return t("statusClosed");
    return t("statusNew");
  }

  const columns: TableColumnsType<RegistrationRow> = [
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
      title: t("colName"),
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, row) => (
        <div className="min-w-40">
          <p className="font-semibold text-forest-950">{row.name}</p>
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
        {text: t("statusNew"), value: "new"},
        {text: t("statusContacted"), value: "contacted"},
        {text: t("statusClosed"), value: "closed"}
      ],
      onFilter: (value, row) => row.status === value,
      render: (_, row) => <Tag color={statusColors[row.status]}>{statusLabel(row.status)}</Tag>
    },
    {
      title: t("colAddress"),
      dataIndex: "address",
      ellipsis: true,
      render: (value) => value || <span className="italic text-stone-400">{t("noValue")}</span>
    },
    {
      title: t("colNote"),
      dataIndex: "note",
      ellipsis: true,
      render: (value) => value || <span className="italic text-stone-400">{t("noValue")}</span>
    },
    {
      title: t("adminNote"),
      dataIndex: "admin_note",
      width: 280,
      render: (value) => value || <span className="italic text-stone-400">{t("noValue")}</span>
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
          <Tooltip title={t("changeStatus")}>
            <Dropdown
              trigger={["click"]}
              disabled={isPending}
              menu={{
                selectedKeys: [row.status],
                onClick: ({key}) => saveStatus(row, key as RegistrationRow["status"]),
                items: [
                  {key: "new", label: statusLabel("new")},
                  {key: "contacted", label: statusLabel("contacted")},
                  {key: "closed", label: statusLabel("closed")}
                ]
              }}
            >
              <Button
                type="text"
                icon={<SyncOutlined />}
                className="text-[#4A751D] hover:!bg-transparent hover:!text-forest-950"
              />
            </Dropdown>
          </Tooltip>
          <Tooltip title={t("edit")}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => startEdit(row)}
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
          placeholder={t("searchRegistrations")}
          className="max-w-xl"
        />
        <Select
          size="large"
          value={statusFilter}
          onChange={setStatusFilter}
          className="min-w-52"
          options={[
            {label: t("allStatuses"), value: "all"},
            {label: t("statusNew"), value: "new"},
            {label: t("statusContacted"), value: "contacted"},
            {label: t("statusClosed"), value: "closed"}
          ]}
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        scroll={{x: 1260}}
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

      <Modal
        title={t("editRegistrationTitle")}
        open={Boolean(editing)}
        onOk={save}
        onCancel={() => setEditing(null)}
        okText={t("save")}
        cancelText={t("cancel")}
        confirmLoading={isPending}
      >
        {editing ? (
          <div className="space-y-5">
            <div className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{t("colName")}</p>
                <p className="mt-1 font-semibold text-forest-950">{editing.name}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{t("colPhone")}</p>
                  <p className="mt-1 text-stone-700">{editing.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{t("status")}</p>
                  <Tag className="mt-1" color={statusColors[editing.status]}>
                    {statusLabel(editing.status)}
                  </Tag>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{t("colAddress")}</p>
                <p className="mt-1 text-stone-700">{editing.address || t("noValue")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{t("colNote")}</p>
                <p className="mt-1 italic text-stone-700">{editing.note || t("noValue")}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-stone-700">{t("adminNote")}</p>
              <Input.TextArea
                rows={4}
                value={draftNote}
                onChange={(event) => setDraftNote(event.target.value)}
                placeholder={t("adminNotePlaceholder")}
              />
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
