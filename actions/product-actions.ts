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
  const nameEn = String(formData.get("name_en") ?? "");
  const slug = id
    ? String(formData.get("slug") ?? "")
    : await createUniqueProductSlug(supabase, nameVi || nameEn);

  const payload = {
    slug: slug || await createUniqueProductSlug(supabase, nameVi || nameEn, id),
    category: String(formData.get("category") ?? "beans"),
    name_vi: nameVi,
    name_en: nameEn,
    short_vi: String(formData.get("short_vi") ?? ""),
    short_en: String(formData.get("short_en") ?? ""),
    description_vi: String(formData.get("description_vi") ?? ""),
    description_en: String(formData.get("description_en") ?? ""),
    farmer_story_vi: String(formData.get("farmer_story_vi") ?? ""),
    farmer_story_en: String(formData.get("farmer_story_en") ?? ""),
    price: Number(formData.get("price") ?? 0),
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

  revalidatePath("/admin/products");
  revalidatePath("/shop");
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

  revalidatePath("/admin/products");
  revalidatePath("/shop");
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

  revalidatePath("/admin/products");
  revalidatePath("/shop");
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

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return {success: true};
}

export async function deleteProduct(id: string) {
  const {supabase, user, error: authError} = await getAdminSession();

  if (authError || !user) {
    return {success: false, error: "Unauthorized"};
  }

  const {error} = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return {success: false, error: error.message};
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
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
