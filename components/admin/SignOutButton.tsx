"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSignOut = async () => {
    setLoading(true);

    try {
      const client = getBrowserSupabaseClient();
      await client.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={loading}
      className="rounded-full border border-zinc-600/80 px-4 py-2 text-sm text-zinc-100 transition hover:border-amber-300/70 hover:text-amber-100 disabled:opacity-60"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
