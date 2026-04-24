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
  const ownerId = process.env.PORTFOLIO_OWNER_USER_ID;
  
  if (!ownerId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">PORTFOLIO_OWNER_USER_ID is not configured.</p>
      </div>
    );
  }

  const content = await getPortfolioContent(ownerId);
  return <PortfolioPage content={content} />;
}
