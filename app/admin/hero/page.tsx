import { HeroSectionForm } from "@/components/admin/forms/section-forms";
import { PageContainer } from "@/components/admin/page-container";
import { EmptyState, ErrorState } from "@/components/admin/state-displays";
import { createClient } from "@/utils/supabase/server";

export default async function HeroPage() {
  const supabase = await createClient();
  const [{ data, error }, { data: canDeleteData, error: canDeleteError }] = await Promise.all([
    supabase
      .from("hero_sections")
      .select("*")
      .order("created_at", { ascending: true }),
    supabase.rpc("is_admin"),
  ]);

  if (error) {
    return (
      <PageContainer title="hero">
        <ErrorState error={error.message} />
      </PageContainer>
    );
  }

  const canDelete = !canDeleteError && Boolean(canDeleteData);

  return (
    <PageContainer title="hero">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Create New</h2>
        <HeroSectionForm initial={null} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Existing Records</h2>
        {data.length === 0 ? (
          <EmptyState message="No hero records found yet. Create one to get started." />
        ) : (
          <div className="space-y-5">
            {data.map((record) => (
              <HeroSectionForm key={record.id} initial={record} canDelete={canDelete} />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
