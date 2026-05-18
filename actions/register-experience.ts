"use server";

import { supabase } from "@/lib/supabase";

export async function submitExperienceForm(data: {
  name: string;
  phone: string;
  address: string;
  note: string;
}) {
  try {
    const { error } = await supabase
      .from("experience_registrations")
      .insert([
        {
          name: data.name,
          phone: data.phone,
          address: data.address,
          note: data.note,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Server Action error:", err);
    return { success: false, error: err.message };
  }
}
