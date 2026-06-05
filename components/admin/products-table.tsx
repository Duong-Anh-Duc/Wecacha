"use client";

import {useEffect, useMemo, useState, useTransition} from "react";
import Image from "next/image";
import {App, Button, Input, Space, Table, Tooltip, type TableColumnsType} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {GripVertical, Trash2} from "lucide-react";
import {useTranslations} from "next-intl";
import {deleteProduct, updateProductSortOrder} from "@/actions/product-actions";
import {useRouter} from "@/i18n/navigation";
import {formatCurrency} from "@/lib/content/helpers";
import {ProductFormModalButton} from "./product-form-modal-button";
import {ProductPreviewButton} from "./product-preview-button";
import type {ProductCategoryOption} from "./product-form";

export type ProductRow = {
  id: string;
  slug: string;
  category: string;
  category_slugs?: string[] | null;
  name_vi: string;
  name_en?: string | null;
  short_vi?: string | null;
  short_en?: string | null;
  description_vi?: string | null;
  description_en?: string | null;
  farmer_story_vi?: string | null;
  farmer_story_en?: string | null;
  price: number;
  price_tiers?: {
    attribute?: string;
    minKg?: number;
    maxKg?: number;
    price?: number;
  }[] | null;
  original_price: number | null;
  weight: string;
  base_unit?: string | null;
  altitude?: string | null;
  roast_vi?: string | null;
  roast_en?: string | null;
  origin_vi?: string | null;
  origin_en?: string | null;
  notes_vi?: string[] | null;
  notes_en?: string[] | null;
  brew_guide_vi?: string[] | null;
  brew_guide_en?: string[] | null;
  images: string[] | null;
  featured: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
};

export function ProductsTable({
  products,
  locale,
  categories
}: {
  products: ProductRow[];
  locale: string;
  categories: ProductCategoryOption[];
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const {message, modal} = App.useApp();
  const [query, setQuery] = useState("");
  const [orderedProducts, setOrderedProducts] = useState(products);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pagination, setPagination] = useState({current: 1, pageSize: 10});

  useEffect(() => {
    setOrderedProducts(products);
  }, [products]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return orderedProducts.filter((product) => {
      const haystack = [
        product.name_vi,
        product.slug,
        product.description_vi,
        product.weight,
        product.base_unit
      ].join(" ").toLowerCase();
      return !normalized || haystack.includes(normalized);
    });
  }, [orderedProducts, query]);

  function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      return;
    }

    const fromIndex = orderedProducts.findIndex((product) => product.id === draggingId);
    const toIndex = orderedProducts.findIndex((product) => product.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
      setDraggingId(null);
      return;
    }

    const nextProducts = [...orderedProducts];
    const [movedProduct] = nextProducts.splice(fromIndex, 1);
    nextProducts.splice(toIndex, 0, movedProduct);
    setOrderedProducts(nextProducts);
    setDraggingId(null);

    startTransition(async () => {
      const result = await updateProductSortOrder(nextProducts.map((product) => product.id));
      if (result.success) {
        message.success(t("reorderSuccess"));
      } else {
        setOrderedProducts(products);
        message.error(`${t("reorderError")}${result.error}`);
      }
    });
  }

  function handleDelete(row: ProductRow) {
    modal.confirm({
      title: t("deleteProductConfirm"),
      okText: t("delete"),
      okButtonProps: {danger: true},
      cancelText: t("cancel"),
      onOk: async () => {
        setDeletingId(row.id);
        const result = await deleteProduct(row.id);
        setDeletingId(null);

        if (result.success) {
          setOrderedProducts((current) => current.filter((product) => product.id !== row.id));
          message.success(t("deleteSuccess"));
          router.refresh();
        } else {
          message.error(`${t("saveError")}${result.error}`);
        }
      }
    });
  }

  const columns: TableColumnsType<ProductRow> = [
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
      title: t("productInfo"),
      dataIndex: "description_vi",
      render: (value) => (
        <p className="max-w-80 whitespace-pre-line text-sm leading-6 text-stone-600 line-clamp-3">
          {value || "—"}
        </p>
      )
    },
    {
      title: t("weight"),
      dataIndex: "weight",
      width: 120,
      render: (value) => value || "—"
    },
    {
      title: t("packageSpec"),
      dataIndex: "base_unit",
      width: 140,
      render: (value) => value || "—"
    },
    {
      title: t("priceTiers"),
      dataIndex: "price_tiers",
      width: 260,
      render: (_value, row) => {
        const tiers = row.price_tiers?.length ? row.price_tiers : [{attribute: row.weight, price: row.price}];
        return (
          <div className="space-y-1.5">
            {tiers.map((tier, index) => {
              const range = [tier.minKg ? `${tier.minKg}kg` : "", tier.maxKg ? `${tier.maxKg}kg` : ""]
                .filter(Boolean)
                .join(" - ");
              return (
                <div key={`${tier.attribute}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-stone-50 px-2.5 py-1.5 text-xs">
                  <span className="font-medium text-stone-600">{tier.attribute || range || "—"}</span>
                  <span className="font-bold text-ember">{formatCurrency(Number(tier.price ?? 0), locale as "vi" | "en")}</span>
                </div>
              );
            })}
          </div>
        );
      }
    },
    {
      title: t("colActions"),
      key: "actions",
      align: "right",
      render: (_, row) => (
        <Space>
          <Tooltip title={t("previewProduct")}>
            <ProductPreviewButton product={row} categories={categories} locale={locale} compact />
          </Tooltip>
          <Tooltip title={t("edit")}>
            <ProductFormModalButton mode="edit" product={row} categories={categories} compact />
          </Tooltip>
          <Tooltip title={t("delete")}>
            <Button
              danger
              type="text"
              icon={<Trash2 className="h-4 w-4" />}
              loading={deletingId === row.id}
              onClick={() => handleDelete(row)}
              className="text-red-600 hover:!bg-red-50 hover:!text-red-700"
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
          placeholder={t("searchProducts")}
          className="max-w-xl"
        />
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        scroll={{x: 1100}}
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
