import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminPanel } from "@/components/admin/AdminPanel";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { getAdminContext } from "@/lib/auth/admin";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Admin CMS",
  description: "Manage portfolio and profile content.",
  path: "/admin",
});

export default async function AdminPage() {
  const context = await getAdminContext();

  if (context.reason === "unauthenticated") {
    redirect("/login?next=/admin");
  }

  if (context.reason === "missing-env") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-5 py-12">
        <section className="w-full rounded-3xl border border-zinc-700/70 bg-zinc-900/80 p-6 text-zinc-200">
          <h1 className="font-serif text-3xl text-zinc-50">Admin unavailable</h1>
          <p className="mt-3 text-sm text-zinc-300">
            Supabase environment variables are missing. Set `NEXT_PUBLIC_SUPABASE_URL` and
            `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
          </p>
          <Link href="/" className="mt-5 inline-block text-sm text-amber-100 hover:text-amber-50">
            Back to portfolio
          </Link>
        </section>
      </main>
    );
  }

  if (!context.isAdmin) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-5 py-12">
        <section className="w-full rounded-3xl border border-zinc-700/70 bg-zinc-900/80 p-6 text-zinc-200">
          <h1 className="font-serif text-3xl text-zinc-50">Access denied</h1>
          <p className="mt-3 text-sm text-zinc-300">
            Your account is authenticated but not listed in `admin_users`.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <SignOutButton />
            <Link
              href="/"
              className="rounded-full border border-zinc-600/80 px-4 py-2 text-sm text-zinc-100 transition hover:border-amber-300/60 hover:text-amber-100"
            >
              Back to portfolio
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-7 sm:py-10">
      <section className="space-y-6 rounded-3xl border border-zinc-700/70 bg-zinc-900/80 p-5 shadow-[0_28px_100px_-55px_rgba(245,158,11,0.52)] backdrop-blur sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300/85">CMS</p>
            <h1 className="font-serif text-3xl text-zinc-50">Portfolio Admin</h1>
          </div>
          <SignOutButton />
        </div>
        <AdminPanel />
      </section>
    </main>
  );
}
