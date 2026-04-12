import { AboutSectionForm } from "@/components/admin/forms/section-forms";
import { PageContainer } from "@/components/admin/page-container";
import { ErrorState } from "@/components/admin/state-displays";
import { createClient } from "@/utils/supabase/server";

export default async function AboutPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_sections")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return <PageContainer title="about">{error ? <ErrorState error={error.message} /> : <AboutSectionForm initial={data} />}</PageContainer>;
}
