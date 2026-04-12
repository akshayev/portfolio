import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { createClient } from "@/utils/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultTitle = "Portfolio";
const defaultDescription = "Personal portfolio website.";

function readSeoValue(value: unknown, key: string): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const candidate = record[key];
  return typeof candidate === "string" && candidate.trim().length > 0 ? candidate.trim() : null;
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("title, tagline, seo_defaults")
    .order("created_at", { ascending: true })
    .limit(1);

  const site = data?.[0] ?? null;
  const title = site?.title?.trim() || defaultTitle;
  const description = site?.tagline?.trim() || defaultDescription;
  const seoDefaults = site?.seo_defaults;

  const ogTitle = readSeoValue(seoDefaults, "ogTitle") ?? readSeoValue(seoDefaults, "openGraphTitle") ?? title;
  const ogDescription =
    readSeoValue(seoDefaults, "ogDescription") ?? readSeoValue(seoDefaults, "openGraphDescription") ?? description;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
