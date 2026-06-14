"use server";

import {createClient} from "@supabase/supabase-js";

type FlavorEventType = "click" | "submit";

const VALID_FLAVORS = new Set([
  "floral",
  "fruity",
  "sourFermented",
  "green",
  "other",
  "roasted",
  "spicy",
  "nutty",
  "sweet"
]);

/**
 * Records a flavor-wheel event (a flavor selection "click" or a quiz "submit").
 * Uses the public anon key — RLS allows anonymous inserts. Fails silently so the
 * UI is never blocked by analytics.
 */
export async function recordFlavorEvent(
  flavorKey: string,
  type: FlavorEventType,
  locale: string
): Promise<{success: boolean}> {
  if (!VALID_FLAVORS.has(flavorKey) || (type !== "click" && type !== "submit")) {
    return {success: false};
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return {success: false};

  try {
    const supabase = createClient(url, anonKey, {auth: {persistSession: false}});
    const {error} = await supabase.from("flavor_wheel_events").insert([
      {
        flavor_key: flavorKey,
        type,
        locale: locale === "en" ? "en" : "vi"
      }
    ]);
    return {success: !error};
  } catch {
    return {success: false};
  }
}
