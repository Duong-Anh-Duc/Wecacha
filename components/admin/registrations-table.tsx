"use client";

import {useEffect, useMemo, useState, useTransition} from "react";
import {App, Button, Input, Modal, Select, Space, Table, Tag, Tooltip, Typography, type TableColumnsType} from "antd";
import {EyeOutlined, SearchOutlined} from "@ant-design/icons";
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
  const {message, modal} = App.useApp();
  const [rows, setRows] = useState(registrations);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewing, setViewing] = useState<RegistrationRow | null>(null);
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
        setViewing((current) =>
          current?.id === row.id ? {...current, status: nextStatus, admin_note: nextAdminNote || null} : current
        );
        message.success(successMessage);
        if (closeModal) setViewing(null);
      } else {
        message.error(`${t("saveError")}${result.error}`);
      }
    });
  }

  function saveViewingNote() {
    if (!viewing) return;
    persistWorkflow({
      row: viewing,
      nextStatus: viewing.status,
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

  function confirmStatusChange(row: RegistrationRow, nextStatus: RegistrationRow["status"]) {
    if (row.status === nextStatus) return;

    modal.confirm({
      title: t("changeStatusConfirmTitle"),
      content: t("changeStatusConfirmDesc"),
      okText: t("save"),
      cancelText: t("cancel"),
      onOk: () => saveStatus(row, nextStatus)
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
      title: t("colRegisteredAt"),
      dataIndex: "created_at",
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      defaultSortOrder: "descend",
      render: (value) => dateFormatter.format(new Date(value))
    },
    {
      title: t("status"),
      dataIndex: "status",
      width: 160,
      filters: [
        {text: t("statusNew"), value: "new"},
        {text: t("statusContacted"), value: "contacted"},
        {text: t("statusClosed"), value: "closed"}
      ],
      onFilter: (value, row) => row.status === value,
      render: (_, row) => (
        <Select
          size="small"
          value={row.status}
          disabled={isPending}
          onChange={(value: RegistrationRow["status"]) => confirmStatusChange(row, value)}
          className="min-w-36"
          labelRender={({value}) => (
            <Tag color={statusColors[value as RegistrationRow["status"]]} className="m-0">
              {statusLabel(value as RegistrationRow["status"])}
            </Tag>
          )}
          options={[
            {
              label: <Tag color={statusColors.new}>{statusLabel("new")}</Tag>,
              value: "new"
            },
            {
              label: <Tag color={statusColors.contacted}>{statusLabel("contacted")}</Tag>,
              value: "contacted"
            },
            {
              label: <Tag color={statusColors.closed}>{statusLabel("closed")}</Tag>,
              value: "closed"
            }
          ]}
        />
      )
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
              onClick={() => {
                setViewing(row);
                setDraftNote(row.admin_note ?? "");
              }}
              className="text-blue-500 hover:!bg-transparent hover:!text-blue-700"
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
        scroll={{x: 1040}}
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
        title={t("viewDetails")}
        open={Boolean(viewing)}
        onCancel={() => setViewing(null)}
        onOk={saveViewingNote}
        okText={t("save")}
        cancelText={t("cancel")}
        confirmLoading={isPending}
      >
        {viewing ? (
          <div className="space-y-4">
            <div className="grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{t("colName")}</p>
                <p className="mt-1 font-semibold text-forest-950">{viewing.name}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{t("colPhone")}</p>
                  <Typography.Text copyable className="mt-1 text-stone-700">
                    {viewing.phone}
                  </Typography.Text>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{t("status")}</p>
                  <Tag className="mt-1" color={statusColors[viewing.status]}>
                    {statusLabel(viewing.status)}
                  </Tag>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{t("colAddress")}</p>
                <p className="mt-1 text-stone-700">{viewing.address || t("noValue")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{t("colNote")}</p>
                <p className="mt-1 italic text-stone-700">{viewing.note || t("noValue")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{t("adminNote")}</p>
                <Input.TextArea
                  className="mt-2"
                  rows={4}
                  value={draftNote}
                  onChange={(event) => setDraftNote(event.target.value)}
                  placeholder={t("adminNotePlaceholder")}
                />
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
