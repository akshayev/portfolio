import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/admin/LoginForm";
import { createPageMetadata } from "@/lib/seo";
import { toSafeInternalPath } from "@/utils/url";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Admin Login",
  description: "Sign in to manage portfolio content.",
  path: "/login",
});

export default async function LoginPage(props: LoginPageProps) {
  const searchParams = await props.searchParams;
  const nextPath = toSafeInternalPath(searchParams.next, "/admin");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-12 sm:px-0">
      <section className="w-full rounded-3xl border border-zinc-700/70 bg-zinc-900/80 p-6 shadow-[0_35px_100px_-50px_rgba(245,158,11,0.52)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300/85">Admin portal</p>
        <h1 className="mt-2 font-serif text-3xl text-zinc-50">Sign in</h1>
        <p className="mt-2 text-sm text-zinc-300">Use an authorized account to access the CMS.</p>

        <div className="mt-6">
          <LoginForm nextPath={nextPath} />
        </div>

        <Link href="/" className="mt-5 inline-block text-sm text-zinc-300 hover:text-amber-100">
          Back to portfolio
        </Link>
      </section>
    </main>
  );
}
