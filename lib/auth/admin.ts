import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminContext = {
  client: SupabaseClient<Database> | null;
  user: User | null;
  isAdmin: boolean;
  reason: "missing-env" | "unauthenticated" | "not-admin" | null;
};

export async function getAdminContext(): Promise<AdminContext> {
  const client = await createServerSupabaseClient();

  if (!client) {
    return {
      client: null,
      user: null,
      isAdmin: false,
      reason: "missing-env",
    };
  }

  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError || !user) {
    return {
      client,
      user: null,
      isAdmin: false,
      reason: "unauthenticated",
    };
  }

  const { data, error } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .order("user_id", { ascending: true })
    .limit(1);

  if (error || !data.length) {
    return {
      client,
      user,
      isAdmin: false,
      reason: "not-admin",
    };
  }

  return {
    client,
    user,
    isAdmin: true,
    reason: null,
  };
}
