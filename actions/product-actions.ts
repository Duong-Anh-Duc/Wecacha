"use server";

import {revalidatePath} from "next/cache";
import {uploadImageToCloudinary} from "@/lib/cloudinary";
import {getAdminSession} from "@/lib/admin-auth";
import {createSlug} from "@/lib/slug";

function listFromText(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function imageListFromText(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function jsonFromText<T>(value: FormDataEntryValue | null, fallback: T): T {
  try {
    const parsed = JSON.parse(String(value ?? ""));
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function revalidateShopPaths(productSlug?: string, categorySlugs: string[] = []) {
  for (const locale of ["vi", "en"]) {
    revalidatePath(`/${locale}/admin/products`);
    revalidatePath(`/${locale}/shop`);
    if (productSlug) {
      revalidatePath(`/${locale}/shop/${productSlug}`);
    }
    for (const categorySlug of categorySlugs) {
      revalidatePath(`/${locale}/shop/category/${categorySlug}`);
    }
  }
}

async function productExtensionColumns(
  supabase: Awaited<ReturnType<typeof getAdminSession>>["supabase"]
) {
  const {error} = await supabase
    .from("products")
    .select("category_slugs,price_tiers,base_unit")
    .limit(1);

  const hasExtensions = !error;

  return {
    categorySlugs: hasExtensions,
    priceTiers: hasExtensions,
    baseUnit: hasExtensions
  };
}

async function createUniqueProductSlug(
  supabase: Awaited<ReturnType<typeof getAdminSession>>["supabase"],
  source: string,
  id?: string
) {
  const baseSlug = createSlug(source);
  let candidate = baseSlug;
  let index = 2;

  while (true) {
    let query = supabase.from("products").select("id").eq("slug", candidate).limit(1);
    if (id) {
      query = query.neq("id", id);
    }

    const {data, error} = await query.maybeSingle();
    if (error) {
      throw error;
    }

    if (!data) {
      return candidate;
    }

    candidate = `${baseSlug}-${index}`;
    index += 1;
  }
}

async function createUniqueCategorySlug(
  supabase: Awaited<ReturnType<typeof getAdminSession>>["supabase"],
  source: string
) {
  const baseSlug = createSlug(source);
  let candidate = baseSlug;
  let index = 2;

  while (true) {
    const {data, error} = await supabase
      .from("product_categories")
      .select("slug")
      .eq("slug", candidate)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return candidate;
    }

    candidate = `${baseSlug}-${index}`;
    index += 1;
  }
}

export async function upsertProduct(formData: FormData) {
  const {supabase, user, error: authError} = await getAdminSession();

  if (authError || !user) {
    return {success: false, error: "Unauthorized"};
  }

  const id = String(formData.get("id") ?? "");
  const nameVi = String(formData.get("name_vi") ?? "");
  const nameEn = String(formData.get("name_en") ?? "") || nameVi;
  const categorySlugs = jsonFromText<string[]>(formData.get("category_slugs"), [])
    .map((item) => String(item).trim())
    .filter(Boolean);
  const priceTiers = jsonFromText<
    {attribute?: string; minKg?: number | null; maxKg?: number | null; price?: number | null}[]
  >(formData.get("price_tiers"), [])
    .map((tier) => ({
      attribute: String(tier.attribute ?? "").trim(),
      minKg: tier.minKg === null || tier.minKg === undefined ? undefined : Number(tier.minKg),
      maxKg: tier.maxKg === null || tier.maxKg === undefined ? undefined : Number(tier.maxKg),
      price: Number(tier.price ?? 0)
    }))
    .filter((tier) => tier.attribute || tier.minKg || tier.maxKg || tier.price);
  const firstTierPrice = priceTiers.find((tier) => tier.price > 0)?.price;
  const extensionColumns = await productExtensionColumns(supabase);
  const slug = id
    ? String(formData.get("slug") ?? "")
    : await createUniqueProductSlug(supabase, nameVi || nameEn);

  const rawPrice = String(formData.get("price") ?? "").trim();
  const payload: Record<string, unknown> = {
    slug: slug || await createUniqueProductSlug(supabase, nameVi || nameEn, id),
    category: categorySlugs[0] ?? String(formData.get("category") ?? "beans") ?? "beans",
    name_vi: nameVi,
    name_en: nameEn,
    short_vi: String(formData.get("short_vi") ?? ""),
    short_en: String(formData.get("short_en") ?? "") || String(formData.get("short_vi") ?? ""),
    description_vi: String(formData.get("description_vi") ?? ""),
    description_en: String(formData.get("description_en") ?? ""),
    farmer_story_vi: String(formData.get("farmer_story_vi") ?? ""),
    farmer_story_en: String(formData.get("farmer_story_en") ?? ""),
    price: rawPrice ? Number(rawPrice) : Number(firstTierPrice ?? 0),
    original_price: formData.get("original_price") ? Number(formData.get("original_price")) : null,
    weight: String(formData.get("weight") ?? ""),
    altitude: String(formData.get("altitude") ?? ""),
    roast_vi: String(formData.get("roast_vi") ?? ""),
    roast_en: String(formData.get("roast_en") ?? ""),
    origin_vi: String(formData.get("origin_vi") ?? ""),
    origin_en: String(formData.get("origin_en") ?? ""),
    notes_vi: listFromText(formData.get("notes_vi")),
    notes_en: listFromText(formData.get("notes_en")),
    brew_guide_vi: listFromText(formData.get("brew_guide_vi")),
    brew_guide_en: listFromText(formData.get("brew_guide_en")),
    images: imageListFromText(formData.get("images")),
    featured: formData.get("featured") === "true",
    is_visible: formData.get("is_visible") === "true",
    updated_at: new Date().toISOString()
  };

  if (extensionColumns.categorySlugs) {
    payload.category_slugs = categorySlugs;
  }
  if (extensionColumns.priceTiers) {
    payload.price_tiers = priceTiers;
  }
  if (extensionColumns.baseUnit) {
    payload.base_unit = String(formData.get("base_unit") ?? "");
  }

  if (id) {
    const result = await supabase.from("products").update(payload).eq("id", id);

    if (result.error) {
      return {success: false, error: result.error.message};
    }
  } else {
    const {data: lastProduct, error: orderError} = await supabase
      .from("products")
      .select("sort_order")
      .order("sort_order", {ascending: false})
      .limit(1)
      .maybeSingle();

    if (orderError) {
      return {success: false, error: orderError.message};
    }

    const result = await supabase.from("products").insert([{
      ...payload,
      sort_order: Number(lastProduct?.sort_order ?? 0) + 10
    }]);

    if (result.error) {
      return {success: false, error: result.error.message};
    }
  }

  revalidateShopPaths(String(payload.slug ?? ""), [String(payload.category ?? ""), ...categorySlugs].filter(Boolean));
  return {success: true};
}

export async function updateProductSortOrder(ids: string[]) {
  const {supabase, user, error: authError} = await getAdminSession();

  if (authError || !user) {
    return {success: false, error: "Unauthorized"};
  }

  const updates = ids.map((id, index) =>
    supabase
      .from("products")
      .update({sort_order: (index + 1) * 10, updated_at: new Date().toISOString()})
      .eq("id", id)
  );
  const results = await Promise.all(updates);
  const error = results.find((result) => result.error)?.error;

  if (error) {
    return {success: false, error: error.message};
  }

  revalidateShopPaths();
  return {success: true};
}

export async function upsertProductCategory(formData: FormData) {
  const {supabase, user, error: authError} = await getAdminSession();

  if (authError || !user) {
    return {success: false, error: "Unauthorized"};
  }

  const slug = String(formData.get("slug") ?? "");
  const nameVi = String(formData.get("name_vi") ?? "").trim();
  const nameEn = String(formData.get("name_en") ?? "").trim();

  if (!nameVi) {
    return {success: false, error: "Tên danh mục là bắt buộc"};
  }

  if (slug) {
    const {error} = await supabase
      .from("product_categories")
      .update({
        name_vi: nameVi,
        name_en: nameEn || nameVi,
        is_visible: formData.get("is_visible") === "true",
        updated_at: new Date().toISOString()
      })
      .eq("slug", slug);

    if (error) {
      return {success: false, error: error.message};
    }
  } else {
    const {data: lastCategory, error: orderError} = await supabase
      .from("product_categories")
      .select("sort_order")
      .order("sort_order", {ascending: false})
      .limit(1)
      .maybeSingle();

    if (orderError) {
      return {success: false, error: orderError.message};
    }

    const categorySlug = await createUniqueCategorySlug(supabase, nameVi || nameEn);
    const {error} = await supabase.from("product_categories").insert([{
      slug: categorySlug,
      name_vi: nameVi,
      name_en: nameEn || nameVi,
      sort_order: Number(lastCategory?.sort_order ?? 0) + 10,
      is_visible: true
    }]);

    if (error) {
      return {success: false, error: error.message};
    }
  }

  revalidateShopPaths();
  return {success: true};
}

export async function deleteProductCategory(slug: string) {
  const {supabase, user, error: authError} = await getAdminSession();

  if (authError || !user) {
    return {success: false, error: "Unauthorized"};
  }

  const {count, error: countError} = await supabase
    .from("products")
    .select("id", {count: "exact", head: true})
    .eq("category", slug);

  if (countError) {
    return {success: false, error: countError.message};
  }

  if ((count ?? 0) > 0) {
    return {success: false, error: "Danh mục này đang có sản phẩm, vui lòng chuyển sản phẩm sang danh mục khác trước"};
  }

  const {error} = await supabase.from("product_categories").delete().eq("slug", slug);

  if (error) {
    return {success: false, error: error.message};
  }

  revalidateShopPaths();
  return {success: true};
}

export async function deleteProduct(id: string) {
  const {supabase, user, error: authError} = await getAdminSession();

  if (authError || !user) {
    return {success: false, error: "Unauthorized"};
  }

  const {data: product} = await supabase
    .from("products")
    .select("slug, category, category_slugs")
    .eq("id", id)
    .maybeSingle();

  const {error} = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return {success: false, error: error.message};
  }

  revalidateShopPaths(
    String(product?.slug ?? ""),
    [String(product?.category ?? ""), ...((product?.category_slugs as string[] | null) ?? [])].filter(Boolean)
  );
  return {success: true};
}

export async function uploadProductImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const upload = await uploadImageToCloudinary(file, {
      folder: "wecacha/products"
    });
    return {url: upload.secureUrl};
  } catch (err: any) {
    return {error: err.message};
  }
}
