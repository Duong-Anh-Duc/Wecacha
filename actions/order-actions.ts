"use server";

import {revalidatePath} from "next/cache";
import {getAdminSession} from "@/lib/admin-auth";
import {createAdminClient} from "@/lib/supabase/admin";

type OrderItemInput = {
  slug: string;
  name: string;
  image?: string;
  weight?: string;
  quantity: number;
  price: number;
};

export async function createOrder(data: {
  customer_name: string;
  phone: string;
  city: string;
  ward: string;
  address: string;
  note?: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: OrderItemInput[];
}) {
  if (!data.items.length) {
    return {success: false, error: "Cart is empty"};
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return {success: false, error: "Order service is not configured"};
  }

  const {data: order, error} = await supabase
    .from("orders")
    .insert([
      {
        status: "new",
        customer_name: data.customer_name,
        phone: data.phone,
        city: data.city,
        ward: data.ward,
        address: data.address,
        note: data.note || null,
        subtotal: data.subtotal,
        shipping: data.shipping,
        total: data.total,
        payment_method: "cod"
      }
    ])
    .select("id")
    .single();

  if (error || !order) {
    return {success: false, error: error?.message ?? "Could not create order"};
  }

  const itemsPayload = data.items.map((item) => ({
    order_id: order.id,
    product_slug: item.slug,
    product_name: item.name,
    image: item.image || null,
    weight: item.weight || null,
    quantity: item.quantity,
    price: item.price,
    line_total: item.price * item.quantity
  }));

  const {error: itemError} = await supabase.from("order_items").insert(itemsPayload);

  if (itemError) {
    return {success: false, error: itemError.message};
  }

  revalidatePath("/admin/orders");
  return {success: true, orderId: order.id as string};
}

export async function updateOrderWorkflow(formData: FormData) {
  const {supabase, user, error: authError} = await getAdminSession();

  if (authError || !user) {
    return {success: false, error: "Unauthorized"};
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new");
  const adminNote = String(formData.get("admin_note") ?? "");

  if (!id) {
    return {success: false, error: "Missing order id"};
  }

  if (!["new", "confirmed", "shipping", "completed", "cancelled"].includes(status)) {
    return {success: false, error: "Invalid order status"};
  }

  const {error} = await supabase
    .from("orders")
    .update({
      status,
      admin_note: adminNote || null,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) {
    return {success: false, error: error.message};
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return {success: true};
}
