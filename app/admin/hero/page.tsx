import { HeroSectionForm } from "@/components/admin/forms/section-forms";
import { PageContainer } from "@/components/admin/page-container";
import { ErrorState } from "@/components/admin/state-displays";
import { createClient } from "@/utils/supabase/server";

export default async function HeroPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("hero_sections")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return <PageContainer title="hero">{error ? <ErrorState error={error.message} /> : <HeroSectionForm initial={data} />}</PageContainer>;
}
