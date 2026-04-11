export function PageContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 flex flex-col gap-6">
      <header className="flex flex-col gap-1 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </header>
      <main className="w-full">{children}</main>
    </div>
  );
}
