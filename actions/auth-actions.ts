"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAdmin(locale: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const login = String(formData.get("email") ?? "").trim();
  const email = login.includes("@") ? login : `${login}@gmail.com`;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(`/${locale}/admin`);
}

export async function logoutAdmin(locale: string) {
  const supabase = await createClient();
  await supabase.auth.signOut({scope: "local"});
  redirect(`/${locale}/admin/login?loggedOut=1`);
}
