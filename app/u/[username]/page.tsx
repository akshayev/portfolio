import { notFound } from "next/navigation";
import { Metadata } from "next";

import { PortfolioPage } from "@/components/public/PortfolioPage";
import { getPortfolioContent } from "@/lib/content/queries";
import { getUserIdByUsername, getUserProfile } from "@/lib/content/user-profiles";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const userId = await getUserIdByUsername(params.username);
  
  if (!userId) {
    return {
      title: "User Not Found",
    };
  }

  const profile = await getUserProfile(userId);
  const displayName = profile?.display_name || params.username;

  return createPageMetadata({
    title: `${displayName} - Portfolio`,
    description: `Portfolio of ${displayName}`,
    path: `/u/${params.username}`,
  });
}

export default async function UserPortfolioPage(props: Props) {
  const params = await props.params;
  const userId = await getUserIdByUsername(params.username);

  if (!userId) {
    notFound();
  }

  const content = await getPortfolioContent(userId);
  
  return <PortfolioPage content={content} />;
}
