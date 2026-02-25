import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Server-side Supabase client (anon key, respects RLS). Use for reads. */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

/** Server-side admin client (service role, bypasses RLS). Use only for admin writes (create/update article). */
export const supabaseAdmin: SupabaseClient | null =
  url && serviceRoleKey ? createClient(url, serviceRoleKey) : null;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(url && serviceRoleKey);
}
