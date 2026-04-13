"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const client = getBrowserSupabaseClient();
      const { error: signInError } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch (unknownError) {
      const message = unknownError instanceof Error ? unknownError.message : "Unable to sign in.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm text-zinc-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          className="w-full rounded-xl border border-zinc-600 bg-zinc-900/80 px-3 py-2 text-zinc-100 outline-none transition focus:border-amber-300/75"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm text-zinc-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-zinc-600 bg-zinc-900/80 px-3 py-2 text-zinc-100 outline-none transition focus:border-amber-300/75"
        />
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl border border-amber-300/70 bg-amber-200/95 px-4 py-2 font-semibold text-zinc-900 transition hover:scale-[1.01] disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
