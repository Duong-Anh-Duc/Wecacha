"use server";

import {revalidatePath} from "next/cache";
import {uploadImageToCloudinary} from "@/lib/cloudinary";
import {createClient} from "@/lib/supabase/server";
import {createSlug} from "@/lib/slug";

async function createUniqueArticleSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  source: string,
  id?: string
) {
  const baseSlug = createSlug(source);
  let candidate = baseSlug;
  let index = 2;

  while (true) {
    let query = supabase.from("news_articles").select("id").eq("slug", candidate).limit(1);
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

export async function upsertArticle(data: any) {
  try {
    const supabase = await createClient();
    const titleVi = String(data.title_vi ?? "");
    const titleEn = String(data.title_en ?? "");
    const slug = data.id
      ? String(data.slug ?? "")
      : await createUniqueArticleSlug(supabase, titleVi || titleEn);

    const payload = {
      slug: slug || await createUniqueArticleSlug(supabase, titleVi || titleEn, data.id),
      title_vi: titleVi,
      title_en: titleEn,
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

export async function updateArticleSortOrder(ids: string[]) {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();
    const updates = ids.map((id, index) =>
      supabase
        .from("news_articles")
        .update({sort_order: (index + 1) * 10, updated_at: now})
        .eq("id", id)
    );
    const results = await Promise.all(updates);
    const error = results.find((result) => result.error)?.error;

    if (error) throw error;

    revalidatePath("/admin/articles");
    revalidatePath("/news");
    return {success: true};
  } catch (err: any) {
    return {success: false, error: err.message};
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
