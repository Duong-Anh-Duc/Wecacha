"use server";

import {revalidatePath} from "next/cache";
import {getAdminSession} from "@/lib/admin-auth";

type RegistrationStatus = "new" | "contacted" | "closed";

export async function updateRegistrationWorkflow(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new") as RegistrationStatus;
  const adminNote = String(formData.get("admin_note") ?? "");

  if (!id) {
    return {success: false, error: "Missing registration id"};
  }

  if (!["new", "contacted", "closed"].includes(status)) {
    return {success: false, error: "Invalid registration status"};
  }

  const {supabase, user, error: authError} = await getAdminSession();

  if (authError || !user) {
    return {success: false, error: "Unauthorized"};
  }

  const payload = {
    status,
    admin_note: adminNote || null,
    contacted_at: status === "contacted" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  };

  const {error} = await supabase
    .from("experience_registrations")
    .update(payload)
    .eq("id", id);

  if (error) {
    return {success: false, error: error.message};
  }

  revalidatePath("/admin");
  revalidatePath("/admin/registrations");
  return {success: true};
}
