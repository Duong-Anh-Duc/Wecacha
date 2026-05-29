"use server";

import {revalidatePath} from "next/cache";
import {uploadImageToCloudinary} from "@/lib/cloudinary";
import {createClient} from "@/lib/supabase/server";

export async function upsertArticle(data: any) {
  try {
    const supabase = await createClient();
    const payload = {
      slug: data.slug,
      title_vi: data.title_vi,
      title_en: data.title_en,
      intro_vi: data.intro_vi,
      intro_en: data.intro_en,
      content_vi: data.content_vi,
      content_en: data.content_en,
      image_url: data.image_url || null,
      secondary_image_url: data.secondary_image_url || null,
      is_visible: data.is_visible === "on" || data.is_visible === "true",
      placement: data.placement || "news",
      sort_order: Number(data.sort_order || 0),
    };

    if (data.id) {
      const { error } = await supabase.from("news_articles").update(payload).eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("news_articles").insert([payload]);
      if (error) throw error;
    }

    revalidatePath("/admin/articles");
    revalidatePath("/news");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteArticle(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("news_articles").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/articles");
    revalidatePath("/news");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function uploadArticleImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const upload = await uploadImageToCloudinary(file, {
      folder: "wecacha/articles"
    });
    return {url: upload.secureUrl};
  } catch (err: any) {
    return {error: err.message};
  }
}
