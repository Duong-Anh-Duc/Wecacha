"use client";

import {useMemo, useState} from "react";
import {Button, Input, Select, Space, Table, Tag, Tooltip, type TableColumnsType} from "antd";
import {EditOutlined, EyeInvisibleOutlined, EyeOutlined, SearchOutlined} from "@ant-design/icons";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";

export type ArticleRow = {
  id: string;
  slug: string;
  title_vi: string;
  created_at: string;
  published_at: string | null;
  is_visible: boolean;
  placement: "home" | "news" | "both";
  sort_order: number;
};

export function ArticlesTable({
  articles,
  locale
}: {
  articles: ArticleRow[];
  locale: string;
}) {
  const t = useTranslations("Admin");
  const [query, setQuery] = useState("");
  const [placement, setPlacement] = useState("all");
  const [pagination, setPagination] = useState({current: 1, pageSize: 10});

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
    [locale]
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesPlacement = placement === "all" || article.placement === placement;
      const haystack = [article.title_vi, article.slug, article.placement].join(" ").toLowerCase();
      return matchesPlacement && (!normalized || haystack.includes(normalized));
    });
  }, [articles, placement, query]);

  function placementLabel(value: ArticleRow["placement"]) {
    if (value === "home") return t("placementHome");
    if (value === "both") return t("placementBoth");
    return t("placementNews");
  }

  const columns: TableColumnsType<ArticleRow> = [
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
      title: t("colTitleVI"),
      dataIndex: "title_vi",
      sorter: (a, b) => a.title_vi.localeCompare(b.title_vi),
      render: (_, row) => (
        <div className="min-w-56">
          <p className="font-semibold text-forest-950">{row.title_vi}</p>
          <p className="font-mono text-xs text-stone-400">{row.slug}</p>
        </div>
      )
    },
    {
      title: t("visibility"),
      dataIndex: "is_visible",
      filters: [
        {text: t("visible"), value: true},
        {text: t("hidden"), value: false}
      ],
      onFilter: (value, row) => row.is_visible === value,
      render: (value) => (
        <Tag icon={value ? <EyeOutlined /> : <EyeInvisibleOutlined />} color={value ? "green" : "default"}>
          {value ? t("visible") : t("hidden")}
        </Tag>
      )
    },
    {
      title: t("placement"),
      dataIndex: "placement",
      filters: [
        {text: t("placementHome"), value: "home"},
        {text: t("placementNews"), value: "news"},
        {text: t("placementBoth"), value: "both"}
      ],
      onFilter: (value, row) => row.placement === value,
      render: (value) => <Tag color="blue">{placementLabel(value)}</Tag>
    },
    {
      title: t("sortOrder"),
      dataIndex: "sort_order",
      sorter: (a, b) => a.sort_order - b.sort_order,
      defaultSortOrder: "ascend"
    },
    {
      title: t("colCreatedAt"),
      dataIndex: "created_at",
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (value) => dateFormatter.format(new Date(value))
    },
    {
      title: t("colActions"),
      key: "actions",
      align: "right",
      render: (_, row) => (
        <Tooltip title={t("edit")}>
          <Link href={`/admin/articles/${row.id}`}>
            <Button
              type="text"
              icon={<EditOutlined />}
              className="text-ember hover:!bg-transparent hover:!text-forest-950"
            />
          </Link>
        </Tooltip>
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
          placeholder={t("searchArticles")}
          className="max-w-xl"
        />
        <Select
          size="large"
          value={placement}
          onChange={setPlacement}
          className="min-w-52"
          options={[
            {label: t("allPlacements"), value: "all"},
            {label: t("placementHome"), value: "home"},
            {label: t("placementNews"), value: "news"},
            {label: t("placementBoth"), value: "both"}
          ]}
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        scroll={{x: 1060}}
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
    </div>
  );
}
