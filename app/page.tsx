import type { Metadata } from "next";

import { PortfolioPage } from "@/components/public/PortfolioPage";
import { getPortfolioContent } from "@/lib/content/queries";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Product Engineer",
  description:
    "Portfolio featuring product engineering work, timeline, publications, and contact details.",
  path: "/",
});

export default async function Home() {
  const content = await getPortfolioContent();
  return <PortfolioPage content={content} />;
}
