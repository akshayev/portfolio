import { PageContainer } from '@/components/admin/page-container';

export default function LoginPage() {
  return (
    <PageContainer title="Login">
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-slate-50 border border-slate-200 border-dashed rounded-xl p-12">
        <h2 className="text-xl font-semibold text-slate-700 mb-4 font-sans">Portfolio Access Control</h2>
        <p className="text-slate-500 mb-8 text-center max-w-xs">
          This page will handle authentication in Phase 2.2. Currently, all /admin routes are guarded.
        </p>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
          Sign in with Provider
        </button>
      </div>
    </PageContainer>
  );
}
