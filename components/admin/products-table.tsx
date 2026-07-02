"use client";

import {useCallback, useEffect, useMemo, useRef, useState, useTransition} from "react";
import Image from "next/image";
import {App, Button, Input, Select, Space, Switch, Table, Tooltip, type TableColumnsType} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {GripVertical, Trash2} from "lucide-react";
import {useTranslations} from "next-intl";
import {deleteProduct, updateProductSortOrder, updateProductVisibility} from "@/actions/product-actions";
import {formatCurrency} from "@/lib/content/helpers";
import {createClient} from "@/lib/supabase/client";
import {ProductFormModalButton} from "./product-form-modal-button";
import {ProductPreviewButton} from "./product-preview-button";
import type {ProductAttributeOption, ProductCategoryOption} from "./product-form";

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
  bulk_price_tiers?: {
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

type StatusFilter = "all" | "active" | "stopped";

function summarizePriceTiers(row: ProductRow) {
  const tiers = (row.price_tiers?.length ? row.price_tiers : [{attribute: row.weight, price: row.price}])
    .filter((tier) => Number(tier.price ?? 0) > 0);

  if (tiers.length <= 1) return tiers;

  const sorted = [...tiers].sort((left, right) => {
    const leftPrice = Number(left.price ?? 0);
    const rightPrice = Number(right.price ?? 0);
    if (leftPrice !== rightPrice) return leftPrice - rightPrice;
    return String(left.attribute ?? "").localeCompare(String(right.attribute ?? ""));
  });

  return [sorted[0], sorted[sorted.length - 1]];
}

function formatPriceSummary(row: ProductRow, locale: "vi" | "en") {
  const tiers = summarizePriceTiers(row);
  if (!tiers.length) return "—";

  const prices = tiers.map((tier) => Number(tier.price ?? 0));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  if (minPrice === maxPrice) {
    return formatCurrency(minPrice, locale);
  }

  return `${formatCurrency(minPrice, locale)} - ${formatCurrency(maxPrice, locale)}`;
}

export function ProductsTable({
  products,
  locale,
  categories,
  attributes = []
}: {
  products: ProductRow[];
  locale: string;
  categories: ProductCategoryOption[];
  attributes?: ProductAttributeOption[];
}) {
  const t = useTranslations("Admin");
  const {message, modal} = App.useApp();
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [orderedProducts, setOrderedProducts] = useState(products);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [visibilityPendingId, setVisibilityPendingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10});

  useEffect(() => {
    setOrderedProducts(products);
  }, [products]);

  const refreshProducts = useCallback(async () => {
    setIsSyncing(true);
    const supabase = createClient();
    const {data, error} = await supabase
      .from("products")
      .select("*")
      .gte("sort_order", 0)
      .order("sort_order", {ascending: true})
      .order("created_at", {ascending: false});

    setIsSyncing(false);
    if (error) {
      message.error(`${t("loadError")} ${error.message}`);
      return;
    }

    setOrderedProducts((data as ProductRow[]) ?? []);
  }, [message, t]);

  useEffect(() => {
    const scheduleRefresh = () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        refreshProducts();
      }, 350);
    };

    window.addEventListener("products:changed", scheduleRefresh);

    const supabase = createClient();
    const channel = supabase
      .channel("admin-products-table-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products"
        },
        scheduleRefresh
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          message.warning(t("realtimeUnavailable"));
        }
      });

    return () => {
      window.removeEventListener("products:changed", scheduleRefresh);
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      supabase.removeChannel(channel);
    };
  }, [message, refreshProducts, t]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return orderedProducts.filter((product) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.is_visible) ||
        (statusFilter === "stopped" && !product.is_visible);
      const haystack = [
        product.name_vi,
        product.slug,
        product.description_vi,
        product.weight,
        product.base_unit
      ].join(" ").toLowerCase();
      return matchesStatus && (!normalized || haystack.includes(normalized));
    });
  }, [orderedProducts, query, statusFilter]);

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
          window.dispatchEvent(new Event("products:changed"));
        } else {
          message.error(`${t("saveError")}${result.error}`);
        }
      }
    });
  }

  async function updateVisibility(row: ProductRow, isVisible: boolean) {
    const previousProducts = orderedProducts;
    setVisibilityPendingId(row.id);
    setOrderedProducts((current) =>
      current.map((product) =>
        product.id === row.id ? {...product, is_visible: isVisible} : product
      )
    );

    const result = await updateProductVisibility(row.id, isVisible);
    setVisibilityPendingId(null);

    if (result.success) {
      message.success(isVisible ? t("productBusinessActiveSuccess") : t("productBusinessStoppedSuccess"));
      window.dispatchEvent(new Event("products:changed"));
    } else {
      setOrderedProducts(previousProducts);
      message.error(`${t("saveError")}${result.error}`);
    }
  }

  function handleVisibilityChange(row: ProductRow, isVisible: boolean) {
    modal.confirm({
      title: isVisible ? t("startBusinessConfirmTitle") : t("stopBusinessConfirmTitle"),
      content: isVisible ? t("startBusinessConfirmDesc") : t("stopBusinessConfirmDesc"),
      okText: isVisible ? t("businessActive") : t("businessStopped"),
      okButtonProps: {danger: !isVisible},
      cancelText: t("cancel"),
      onOk: () => updateVisibility(row, isVisible)
    });
  }

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
        message.success(t("reorderProductsSuccess"));
        window.dispatchEvent(new Event("products:changed"));
      } else {
        setOrderedProducts(products);
        message.error(`${t("reorderProductsError")}${result.error}`);
      }
    });
  }

  // Tạm ẩn tính năng kéo-thả đổi vị trí (đặt true để bật lại).
  const SHOW_REORDER = false;
  const columns: TableColumnsType<ProductRow> = ([
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
      width: 76,
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
      title: t("weight"),
      dataIndex: "weight",
      width: 120,
      render: (value) => value || "—"
    },
    {
      title: t("packageSpec"),
      dataIndex: "base_unit",
      width: 140,
      align: "center",
      render: (value) => <span className="block text-center">{value || "—"}</span>
    },
    {
      title: t("price"),
      dataIndex: "price_tiers",
      width: 180,
      align: "center",
      render: (_value, row) => {
        const priceSummary = formatPriceSummary(row, locale as "vi" | "en");
        return (
          <div className="flex justify-center">
            <div className="rounded-lg bg-stone-50 px-3 py-1.5 text-xs">
              <span className="font-bold text-ember">{priceSummary}</span>
            </div>
          </div>
        );
      }
    },
    {
      title: t("businessStatus"),
      dataIndex: "is_visible",
      width: 180,
      align: "center",
      render: (_value, row) => (
        <div className="flex flex-col items-center gap-1.5">
          <Tooltip title={row.is_visible ? t("businessActive") : t("businessStopped")}>
            <Switch
              checked={row.is_visible}
              loading={visibilityPendingId === row.id}
              checkedChildren={t("businessActiveShort")}
              unCheckedChildren={t("businessStoppedShort")}
              onChange={(checked) => handleVisibilityChange(row, checked)}
            />
          </Tooltip>
          <span className={row.is_visible ? "text-xs font-semibold text-emerald-700" : "text-xs font-semibold text-stone-500"}>
            {row.is_visible ? t("businessActive") : t("businessStopped")}
          </span>
        </div>
      )
    },
    {
      title: t("colActions"),
      key: "actions",
      align: "center",
      render: (_, row) => (
        <Space className="justify-center">
          <Tooltip title={t("previewProduct")}>
            <span className="inline-flex">
              <ProductPreviewButton product={row} categories={categories} locale={locale} compact />
            </span>
          </Tooltip>
          <Tooltip title={t("edit")}>
            <span className="inline-flex">
              <ProductFormModalButton mode="edit" product={row} categories={categories} attributes={attributes} compact />
            </span>
          </Tooltip>
          <Tooltip title={t("delete")}>
            <span className="inline-flex">
              <Button
                danger
                type="text"
                icon={<Trash2 className="h-4 w-4" />}
                loading={deletingId === row.id}
                onClick={() => handleDelete(row)}
                className="text-red-600 hover:!bg-red-50 hover:!text-red-700"
              />
            </span>
          </Tooltip>
        </Space>
      )
    }
  ] as TableColumnsType<ProductRow>).filter((col) => SHOW_REORDER || (col as {key?: string}).key !== "drag");

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
          id="products-status-filter"
          value={statusFilter === "all" ? undefined : statusFilter}
          onChange={(value) => setStatusFilter(value ?? "all")}
          allowClear
          placeholder={t("businessStatusAll")}
          className="w-full sm:w-64"
          size="large"
          options={[
            {value: "all", label: t("businessStatusAll")},
            {value: "active", label: t("businessActive")},
            {value: "stopped", label: t("businessStopped")}
          ]}
        />
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        loading={isSyncing ? {tip: t("productTableSyncing")} : false}
        scroll={{x: 1090}}
        rowClassName={(row) => (row.id === draggingId ? "opacity-50" : SHOW_REORDER ? "cursor-grab" : "")}
        onRow={(row) => ({
          draggable: SHOW_REORDER && !isPending && !isSyncing,
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
          showSizeChanger: {id: "products-page-size"},
          showTotal: (total) => t("tableTotal", {total})
        }}
      />
    </div>
  );
}
