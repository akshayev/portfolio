import { PageContainer } from "@/components/admin/page-container";
import { ErrorState } from "@/components/admin/state-displays";
import { SiteSettingsForm } from "@/components/admin/forms/section-forms";
import { createClient } from "@/utils/supabase/server";

export default async function SettingsSitePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return (
    <PageContainer title="settings/site">
      {error ? <ErrorState error={error.message} /> : <SiteSettingsForm initial={data} />}
    </PageContainer>
  );
}
