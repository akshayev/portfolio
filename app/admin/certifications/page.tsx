import { CertificationForm } from "@/components/admin/forms/section-forms";
import { PageContainer } from "@/components/admin/page-container";
import { EmptyState, ErrorState } from "@/components/admin/state-displays";
import { createClient } from "@/utils/supabase/server";

export default async function CertificationsPage() {
  const supabase = await createClient();
  const [{ data, error }, { data: canDeleteData, error: canDeleteError }] = await Promise.all([
    supabase
      .from("certifications")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.rpc("is_admin"),
  ]);

  if (error) {
    return (
      <PageContainer title="certifications">
        <ErrorState error={error.message} />
      </PageContainer>
    );
  }

  const canDelete = !canDeleteError && Boolean(canDeleteData);

  return (
    <PageContainer title="certifications">
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Create New</h2>
        <CertificationForm initial={null} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Existing Records</h2>
        {data.length === 0 ? (
          <EmptyState message="No certification records found yet. Create one to get started." />
        ) : (
          <div className="space-y-5">
            {data.map((record) => (
              <CertificationForm key={record.id} initial={record} canDelete={canDelete} />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  );
}
