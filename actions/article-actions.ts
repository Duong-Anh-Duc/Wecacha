"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
    const supabase = await createClient();
    const file = formData.get("file") as File;
    if (!file || !file.size) return { error: "No file provided" };

    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("articles")
      .upload(fileName, file, { contentType: file.type, upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from("articles").getPublicUrl(fileName);
    return { url: data.publicUrl };
  } catch (err: any) {
    return { error: err.message };
  }
}
