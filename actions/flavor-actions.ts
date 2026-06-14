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

export type FlavorCounts = Record<string, {clicks: number; submits: number}>;

/**
 * Returns aggregated click/submit counts per flavor from the public
 * `flavor_wheel_counts` view. Returns an empty object if the table/view
 * does not exist yet (migration not run).
 */
export async function getFlavorCounts(): Promise<FlavorCounts> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return {};

  try {
    const supabase = createClient(url, anonKey, {auth: {persistSession: false}});
    const {data, error} = await supabase
      .from("flavor_wheel_counts")
      .select("flavor_key, clicks, submits");
    if (error || !data) return {};

    const counts: FlavorCounts = {};
    for (const row of data as {flavor_key: string; clicks: number; submits: number}[]) {
      counts[row.flavor_key] = {
        clicks: Number(row.clicks) || 0,
        submits: Number(row.submits) || 0
      };
    }
    return counts;
  } catch {
    return {};
  }
}
