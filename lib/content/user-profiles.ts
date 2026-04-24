import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getUserIdByUsername(username: string): Promise<string | null> {
  const client = await createServerSupabaseClient();
  if (!client) return null;

  const { data, error } = await client
    .from("user_profiles")
    .select("user_id")
    .eq("username", username)
    .single();

  if (error || !data) {
    return null;
  }

  return data.user_id;
}

export async function getUserProfile(userId: string) {
  const client = await createServerSupabaseClient();
  if (!client) return null;

  const { data, error } = await client
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
