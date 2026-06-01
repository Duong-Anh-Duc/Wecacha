"use client";

import {useEffect, useMemo, useState, useTransition} from "react";
import {App, Button, Input, Select, Space, Table, Tag, Tooltip, type TableColumnsType} from "antd";
import {EditOutlined, EyeInvisibleOutlined, EyeOutlined, SearchOutlined} from "@ant-design/icons";
import {GripVertical} from "lucide-react";
import {useTranslations} from "next-intl";
import {updateArticleSortOrder} from "@/actions/article-actions";
import {Link} from "@/i18n/navigation";
import {ArticlePreviewButton} from "./article-preview-button";

export type ArticleRow = {
  id: string;
  slug: string;
  title_vi: string;
  intro_vi?: string | null;
  content_vi?: string | null;
  image_url?: string | null;
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
  const {message} = App.useApp();
  const [query, setQuery] = useState("");
  const [placement, setPlacement] = useState("all");
  const [orderedArticles, setOrderedArticles] = useState(articles);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pagination, setPagination] = useState({current: 1, pageSize: 10});

  useEffect(() => {
    setOrderedArticles(articles);
  }, [articles]);

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

    return orderedArticles.filter((article) => {
      const matchesPlacement = placement === "all" || article.placement === placement;
      const haystack = [article.title_vi, article.slug, article.placement].join(" ").toLowerCase();
      return matchesPlacement && (!normalized || haystack.includes(normalized));
    });
  }, [orderedArticles, placement, query]);

  function placementLabel(value: ArticleRow["placement"]) {
    if (value === "home") return t("placementHome");
    if (value === "both") return t("placementBoth");
    return t("placementNews");
  }

  function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      return;
    }

    const fromIndex = orderedArticles.findIndex((article) => article.id === draggingId);
    const toIndex = orderedArticles.findIndex((article) => article.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
      setDraggingId(null);
      return;
    }

    const nextArticles = [...orderedArticles];
    const [movedArticle] = nextArticles.splice(fromIndex, 1);
    nextArticles.splice(toIndex, 0, movedArticle);
    setOrderedArticles(nextArticles);
    setDraggingId(null);

    startTransition(async () => {
      const result = await updateArticleSortOrder(nextArticles.map((article) => article.id));
      if (result.success) {
        message.success(t("reorderArticlesSuccess"));
      } else {
        setOrderedArticles(articles);
        message.error(`${t("reorderArticlesError")}${result.error}`);
      }
    });
  }

  const columns: TableColumnsType<ArticleRow> = [
    {
      title: "",
      key: "drag",
      width: 46,
      align: "center",
      render: () => (
        <Tooltip title={t("dragToReorder")}>
          <GripVertical className="mx-auto h-4 w-4 cursor-grab text-stone-400" />
        </Tooltip>
      )
    },
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
      render: (_value, _row, index) => (
        <span className="font-medium text-stone-500">{index + 1}</span>
      )
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
        <Space>
          <Tooltip title={t("previewArticle")}>
            <ArticlePreviewButton article={row} compact />
          </Tooltip>
          <Tooltip title={t("edit")}>
            <Link href={`/admin/articles/${row.id}`}>
              <Button
                type="text"
                icon={<EditOutlined />}
                className="text-ember hover:!bg-transparent hover:!text-forest-950"
              />
            </Link>
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
        rowClassName={(row) => (row.id === draggingId ? "opacity-50" : "cursor-grab")}
        onRow={(row) => ({
          draggable: !isPending,
          onDragStart: () => setDraggingId(row.id),
          onDragOver: (event) => event.preventDefault(),
          onDrop: () => handleDrop(row.id),
          onDragEnd: () => setDraggingId(null)
        })}
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
