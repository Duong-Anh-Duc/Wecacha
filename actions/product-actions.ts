"use server";

import {revalidatePath} from "next/cache";
import {uploadImageToCloudinary} from "@/lib/cloudinary";
import {getAdminSession} from "@/lib/admin-auth";

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

export async function upsertProduct(formData: FormData) {
  const {supabase, user, error: authError} = await getAdminSession();

  if (authError || !user) {
    return {success: false, error: "Unauthorized"};
  }

  const id = String(formData.get("id") ?? "");
  const payload = {
    slug: String(formData.get("slug") ?? ""),
    category: String(formData.get("category") ?? "beans"),
    name_vi: String(formData.get("name_vi") ?? ""),
    name_en: String(formData.get("name_en") ?? ""),
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
    sort_order: Number(formData.get("sort_order") ?? 0),
    updated_at: new Date().toISOString()
  };

  const result = id
    ? await supabase.from("products").update(payload).eq("id", id)
    : await supabase.from("products").insert([payload]);

  if (result.error) {
    return {success: false, error: result.error.message};
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
