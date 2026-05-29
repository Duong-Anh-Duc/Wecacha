import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";

export async function getAdminSession() {
  const supabase = await createClient();
  const {
    data: {user},
    error
  } = await supabase.auth.getUser();

  return {supabase, user, error};
}

export async function requireAdmin(locale: string) {
  const session = await getAdminSession();

  if (session.error || !session.user) {
    redirect(`/${locale}/admin/login`);
  }

  return session;
}
