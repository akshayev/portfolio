import type { Metadata } from "next";
import Link from "next/link";

import { SignupForm } from "@/components/public/SignupForm";
import { createPageMetadata } from "@/lib/seo";
import { toSafeInternalPath } from "@/utils/url";

type SignupPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Create Account",
  description: "Sign up to create your own portfolio.",
  path: "/signup",
});

export default async function SignupPage(props: SignupPageProps) {
  const searchParams = await props.searchParams;
  const nextPath = toSafeInternalPath(searchParams.next, "/admin");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-12 sm:px-0">
      <section className="w-full rounded-3xl border border-zinc-700/70 bg-zinc-900/80 p-6 shadow-[0_35px_100px_-50px_rgba(245,158,11,0.52)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300/85">Join Portfolio Platform</p>
        <h1 className="mt-2 font-serif text-3xl text-zinc-50">Create account</h1>
        <p className="mt-2 text-sm text-zinc-300">Sign up to start building your own portfolio.</p>

        <div className="mt-6">
          <SignupForm nextPath={nextPath} />
        </div>

        <p className="mt-5 text-sm text-zinc-300">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-300 hover:text-amber-100 transition">
            Sign in
          </Link>
        </p>
        <Link href="/" className="mt-2 inline-block text-sm text-zinc-500 hover:text-zinc-300 transition">
          Back to home
        </Link>
      </section>
    </main>
  );
}
