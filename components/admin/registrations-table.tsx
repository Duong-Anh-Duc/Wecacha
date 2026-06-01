"use client";

import {useMemo, useState, useTransition} from "react";
import {App, Button, Input, Modal, Radio, Select, Space, Table, Tag, Tooltip, Typography, type TableColumnsType} from "antd";
import {EditOutlined, PhoneOutlined, SearchOutlined} from "@ant-design/icons";
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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editing, setEditing] = useState<RegistrationRow | null>(null);
  const [draftStatus, setDraftStatus] = useState<RegistrationRow["status"]>("new");
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

    return registrations.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const haystack = [item.name, item.phone, item.address, item.note, item.admin_note]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [query, registrations, statusFilter]);

  function startEdit(row: RegistrationRow) {
    setEditing(row);
    setDraftStatus(row.status);
    setDraftNote(row.admin_note ?? "");
  }

  function save() {
    if (!editing) return;

    const formData = new FormData();
    formData.set("id", editing.id);
    formData.set("status", draftStatus);
    formData.set("admin_note", draftNote);

    startTransition(async () => {
      const result = await updateRegistrationWorkflow(formData);
      if (result.success) {
        message.success(t("saveSuccess"));
        setEditing(null);
      } else {
        message.error(`${t("saveError")}${result.error}`);
      }
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
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
              <p className="font-semibold text-forest-950">{editing.name}</p>
              <p>{editing.phone}</p>
              {editing.address ? <p>{editing.address}</p> : null}
              {editing.note ? <p className="mt-2 italic">{editing.note}</p> : null}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-stone-700">{t("status")}</p>
              <Radio.Group
                block
                optionType="button"
                buttonStyle="solid"
                value={draftStatus}
                onChange={(event) => setDraftStatus(event.target.value)}
                options={[
                  {label: t("statusNew"), value: "new"},
                  {label: t("statusContacted"), value: "contacted"},
                  {label: t("statusClosed"), value: "closed"}
                ]}
              />
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
