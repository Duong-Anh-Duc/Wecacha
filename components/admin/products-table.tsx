"use client";

import {useMemo, useState} from "react";
import Image from "next/image";
import {Button, Input, Select, Space, Table, Tag, Tooltip, type TableColumnsType} from "antd";
import {EditOutlined, EyeInvisibleOutlined, EyeOutlined, SearchOutlined} from "@ant-design/icons";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/navigation";
import {formatCurrency} from "@/lib/content";

export type ProductRow = {
  id: string;
  slug: string;
  category: string;
  name_vi: string;
  price: number;
  original_price: number | null;
  weight: string;
  images: string[] | null;
  featured: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
};

export function ProductsTable({products, locale}: {products: ProductRow[]; locale: string}) {
  const t = useTranslations("Admin");
  const tShop = useTranslations("Shop");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [pagination, setPagination] = useState({current: 1, pageSize: 10});

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const haystack = [product.name_vi, product.slug, product.category].join(" ").toLowerCase();
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [category, products, query]);

  function categoryLabel(value: string) {
    if (value === "ground") return tShop("ground");
    if (value === "phin") return tShop("phin");
    if (value === "gifts") return tShop("gifts");
    return tShop("beans");
  }

  const columns: TableColumnsType<ProductRow> = [
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
      title: t("product"),
      dataIndex: "name_vi",
      sorter: (a, b) => a.name_vi.localeCompare(b.name_vi),
      render: (_, row) => (
        <div className="flex min-w-64 items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-stone-100">
            {row.images?.[0] ? (
              <Image src={row.images[0]} alt="" fill sizes="48px" className="object-cover" />
            ) : null}
          </div>
          <div>
            <p className="font-semibold text-forest-950">{row.name_vi}</p>
            <p className="font-mono text-xs text-stone-400">{row.slug}</p>
          </div>
        </div>
      )
    },
    {
      title: t("category"),
      dataIndex: "category",
      filters: [
        {text: tShop("beans"), value: "beans"},
        {text: tShop("ground"), value: "ground"},
        {text: tShop("phin"), value: "phin"},
        {text: tShop("gifts"), value: "gifts"}
      ],
      onFilter: (value, row) => row.category === value,
      render: (value) => <Tag>{categoryLabel(value)}</Tag>
    },
    {
      title: t("price"),
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      render: (value) => formatCurrency(value, locale as "vi" | "en")
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
      title: t("featured"),
      dataIndex: "featured",
      filters: [
        {text: t("featured"), value: true},
        {text: t("normal"), value: false}
      ],
      onFilter: (value, row) => row.featured === value,
      render: (value) => <Tag color={value ? "gold" : "default"}>{value ? t("featured") : t("normal")}</Tag>
    },
    {
      title: t("sortOrder"),
      dataIndex: "sort_order",
      sorter: (a, b) => a.sort_order - b.sort_order,
      defaultSortOrder: "ascend"
    },
    {
      title: t("colActions"),
      key: "actions",
      align: "right",
      render: (_, row) => (
        <Space>
          <Tooltip title={t("edit")}>
            <Link href={`/admin/products/${row.id}`}>
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
          placeholder={t("searchProducts")}
          className="max-w-xl"
        />
        <Select
          size="large"
          value={category}
          onChange={setCategory}
          className="min-w-52"
          options={[
            {label: t("allCategories"), value: "all"},
            {label: tShop("beans"), value: "beans"},
            {label: tShop("ground"), value: "ground"},
            {label: tShop("phin"), value: "phin"},
            {label: tShop("gifts"), value: "gifts"}
          ]}
        />
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        scroll={{x: 1160}}
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
