"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type SignupFormProps = {
  nextPath: string;
};

const SIGNUP_ERROR_MESSAGE = "Failed to sign up. Please try again.";

function toUiError(error: unknown): string {
  if (error === "rate_limited") {
    return "Too many attempts. Please try again in a moment.";
  }
  if (error === "username_taken") {
    return "Username is already taken. Please choose another one.";
  }
  if (typeof error === "string" && error !== "signup_failed") {
    // Basic formatting of the string if it's from supabase
    return error.charAt(0).toUpperCase() + error.slice(1);
  }

  return SIGNUP_ERROR_MESSAGE;
}

export function SignupForm({ nextPath }: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      const payload = (await response.json()) as { error?: unknown };

      if (!response.ok) {
        setError(toUiError(payload.error));
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch (unknownError) {
      void unknownError;
      setError(SIGNUP_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm text-zinc-300">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
          required
          autoComplete="username"
          className="w-full rounded-xl border border-zinc-600 bg-zinc-900/80 px-3 py-2 text-zinc-100 outline-none transition focus:border-amber-300/75"
          placeholder="your_username"
        />
      </div>

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
          autoComplete="new-password"
          minLength={6}
          className="w-full rounded-xl border border-zinc-600 bg-zinc-900/80 px-3 py-2 text-zinc-100 outline-none transition focus:border-amber-300/75"
        />
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl border border-amber-300/70 bg-amber-200/95 px-4 py-2 font-semibold text-zinc-900 transition hover:scale-[1.01] disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
