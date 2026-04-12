import { GlobalVisualSettingsForm } from "@/components/admin/forms/section-forms";
import { PageContainer } from "@/components/admin/page-container";
import { ErrorState } from "@/components/admin/state-displays";
import { createClient } from "@/utils/supabase/server";

export default async function SettingsVisualPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("global_visual_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <PageContainer title="settings/visual">
      {error ? <ErrorState error={error.message} /> : <GlobalVisualSettingsForm initial={data} />}
    </PageContainer>
  );
}
