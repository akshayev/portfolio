import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://example.com";
const DEFAULT_OG_IMAGE = "/next.svg";

export function getSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL;

  if (!value) {
    return FALLBACK_SITE_URL;
  }

  try {
    const parsed = new URL(value);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return FALLBACK_SITE_URL;
    }

    return parsed.toString().replace(/\/$/, "");
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function createPageMetadata(input: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalPath = input.path ?? "/";
  const imagePath = input.image ?? DEFAULT_OG_IMAGE;
  const canonical = `${siteUrl}${canonicalPath}`;
  const image = imagePath.startsWith("http") ? imagePath : `${siteUrl}${imagePath}`;

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      type: "website",
      url: canonical,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}
