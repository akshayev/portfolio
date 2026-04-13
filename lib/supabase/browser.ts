"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseEnv } from "@/lib/supabase/env";

let browserClient: SupabaseClient<Database> | null = null;

export function getBrowserSupabaseClient() {
  if (browserClient) {
    return browserClient;
  }

  const env = getSupabaseEnv();

  if (!env) {
    throw new Error("Missing Supabase environment variables.");
  }

  browserClient = createBrowserClient<Database>(env.url, env.anonKey);
  return browserClient;
}
