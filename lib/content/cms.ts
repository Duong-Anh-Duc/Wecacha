import {supabase} from "@/lib/supabase";
import type {Locale} from "@/i18n/routing";
import type {Localized, Product, ProductCategory} from "./types";

type ProductRow = {
  slug: string;
  category: ProductCategory;
  name_vi: string;
  name_en: string;
  short_vi: string;
  short_en: string;
  description_vi: string;
  description_en: string;
  farmer_story_vi: string;
  farmer_story_en: string;
  price: number;
  original_price: number | null;
  weight: string;
  altitude: string;
  roast_vi: string;
  roast_en: string;
  origin_vi: string;
  origin_en: string;
  notes_vi: string[];
  notes_en: string[];
  brew_guide_vi: string[];
  brew_guide_en: string[];
  journey_vi: Product["journey"]["vi"];
  journey_en: Product["journey"]["en"];
  images: string[];
  featured: boolean;
};

export type SitePage = {
  key: string;
  path: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  metadata: Record<string, unknown>;
  is_visible: boolean;
  sort_order: number;
};

export type SiteSection = {
  page_key: string;
  section_key: string;
  type: string;
  eyebrow_vi: string;
  eyebrow_en: string;
  title_vi: string;
  title_en: string;
  copy_vi: string;
  copy_en: string;
  quote_vi: string;
  quote_en: string;
  cta_label_vi: string;
  cta_label_en: string;
  cta_href: string | null;
  media: Record<string, any>;
  settings: Record<string, any>;
  is_visible: boolean;
  sort_order: number;
};

export type SiteSectionItem = {
  page_key: string;
  section_key: string;
  item_key: string;
  type: string;
  label_vi: string;
  label_en: string;
  title_vi: string;
  title_en: string;
  subtitle_vi: string;
  subtitle_en: string;
  body_vi: string;
  body_en: string;
  href: string | null;
  media: Record<string, any>;
  data: Record<string, any>;
  is_visible: boolean;
  sort_order: number;
};

export type ProductReview = {
  review_key: string;
  product_slug: string | null;
  name_vi: string;
  name_en: string;
  review_vi: string;
  review_en: string;
  rating: number;
  is_verified: boolean;
  avatar_url: string | null;
  is_visible: boolean;
  sort_order: number;
};

export type PageContent = {
  page: SitePage | null;
  sections: SiteSection[];
  items: SiteSectionItem[];
};

const productColumns = [
  "slug",
  "category",
  "name_vi",
  "name_en",
  "short_vi",
  "short_en",
  "description_vi",
  "description_en",
  "farmer_story_vi",
  "farmer_story_en",
  "price",
  "original_price",
  "weight",
  "altitude",
  "roast_vi",
  "roast_en",
  "origin_vi",
  "origin_en",
  "notes_vi",
  "notes_en",
  "brew_guide_vi",
  "brew_guide_en",
  "journey_vi",
  "journey_en",
  "images",
  "featured"
].join(",");

function pair<T>(vi: T, en: T): Localized<T> {
  return {vi, en};
}

export function productFromRow(row: ProductRow): Product {
  return {
    slug: row.slug,
    category: row.category,
    name: pair(row.name_vi, row.name_en),
    short: pair(row.short_vi, row.short_en),
    description: pair(row.description_vi, row.description_en),
    farmerStory: pair(row.farmer_story_vi, row.farmer_story_en),
    journey: pair(row.journey_vi ?? [], row.journey_en ?? []),
    brewGuide: pair(row.brew_guide_vi ?? [], row.brew_guide_en ?? []),
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    weight: row.weight,
    altitude: row.altitude,
    roast: pair(row.roast_vi, row.roast_en),
    origin: pair(row.origin_vi, row.origin_en),
    notes: pair(row.notes_vi ?? [], row.notes_en ?? []),
    images: row.images ?? [],
    featured: row.featured
  };
}

export function localizedField<T extends Record<string, any>>(
  row: T | null | undefined,
  field: string,
  locale: Locale
) {
  if (!row) return "";
  return String(row[`${field}_${locale}`] ?? row[`${field}_vi`] ?? row[`${field}_en`] ?? "");
}

export function localizedValue<T>(value: Record<string, T> | null | undefined, locale: Locale, fallback: T): T {
  if (!value) return fallback;
  return value[locale] ?? value.vi ?? value.en ?? fallback;
}

export function sectionByKey(content: PageContent, sectionKey: string) {
  return content.sections.find((section) => section.section_key === sectionKey) ?? null;
}

export function itemsForSection(content: PageContent, sectionKey: string) {
  return content.items.filter((item) => item.section_key === sectionKey);
}

export async function getPageContent(pageKey: string): Promise<PageContent> {
  const [pageResult, sectionsResult, itemsResult] = await Promise.all([
    supabase
      .from("site_pages")
      .select("*")
      .eq("key", pageKey)
      .eq("is_visible", true)
      .maybeSingle(),
    supabase
      .from("site_sections")
      .select("*")
      .eq("page_key", pageKey)
      .eq("is_visible", true)
      .order("sort_order", {ascending: true}),
    supabase
      .from("site_section_items")
      .select("*")
      .eq("page_key", pageKey)
      .eq("is_visible", true)
      .order("section_key", {ascending: true})
      .order("sort_order", {ascending: true})
  ]);

  if (pageResult.error) throw pageResult.error;
  if (sectionsResult.error) throw sectionsResult.error;
  if (itemsResult.error) throw itemsResult.error;

  return {
    page: (pageResult.data as SitePage | null) ?? null,
    sections: (sectionsResult.data as SiteSection[]) ?? [],
    items: (itemsResult.data as SiteSectionItem[]) ?? []
  };
}

export async function getVisibleProducts() {
  const {data, error} = await supabase
    .from("products")
    .select(productColumns)
    .eq("is_visible", true)
    .order("sort_order", {ascending: true})
    .order("created_at", {ascending: false});

  if (error) throw error;
  return ((data as unknown as ProductRow[]) ?? []).map(productFromRow);
}

export async function getVisibleProductsByCategory(category: ProductCategory) {
  const {data, error} = await supabase
    .from("products")
    .select(productColumns)
    .eq("is_visible", true)
    .eq("category", category)
    .order("sort_order", {ascending: true})
    .order("created_at", {ascending: false});

  if (error) throw error;
  return ((data as unknown as ProductRow[]) ?? []).map(productFromRow);
}

export async function getVisibleProductBySlug(slug: string) {
  const {data, error} = await supabase
    .from("products")
    .select(productColumns)
    .eq("is_visible", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? productFromRow(data as unknown as ProductRow) : null;
}

export async function getRelatedVisibleProducts(slug: string) {
  const products = await getVisibleProducts();
  return products.filter((product) => product.slug !== slug).slice(0, 3);
}

export async function getVisibleProductSlugs() {
  const {data, error} = await supabase
    .from("products")
    .select("slug")
    .eq("is_visible", true)
    .order("sort_order", {ascending: true});

  if (error) throw error;
  return ((data as {slug: string}[]) ?? []).map((product) => product.slug);
}

export async function getVisibleProductReviews(productSlug?: string) {
  let query = supabase
    .from("product_reviews")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", {ascending: true});

  if (productSlug) {
    query = query.or(`product_slug.eq.${productSlug},product_slug.is.null`);
  }

  const {data, error} = await query;
  if (error) throw error;
  return (data as ProductReview[]) ?? [];
}

export async function getExplorePageKeys() {
  const {data, error} = await supabase
    .from("site_pages")
    .select("key,path,metadata")
    .eq("is_visible", true)
    .like("key", "explore-%")
    .order("sort_order", {ascending: true});

  if (error) throw error;
  return ((data as Pick<SitePage, "key" | "path" | "metadata">[]) ?? []).map((page) => ({
    key: page.key,
    path: page.path,
    slug: typeof page.metadata?.slug === "string" ? page.metadata.slug : page.path.split("/").pop() ?? page.key
  }));
}
