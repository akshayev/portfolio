export function LoadingState() {
  return (
    <div className="w-full h-48 flex items-center justify-center bg-slate-50 rounded-lg p-6 border border-slate-200 border-dashed">
      <p className="text-slate-500 font-medium">[Loading...]</p>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="w-full h-48 flex flex-col items-center justify-center bg-slate-50 rounded-lg p-6 border border-slate-200 border-dashed">
      <p className="text-slate-500 font-medium mb-2">[Empty]</p>
      <span className="text-slate-400 text-sm text-center">{message}</span>
    </div>
  );
}

export function ErrorState({ error }: { error: string }) {
  return (
    <div className="w-full flex-col flex items-center justify-center bg-red-50 rounded-lg p-6 border border-red-200 border-dashed">
      <p className="text-red-600 font-bold mb-2">[Error]</p>
      <span className="text-red-500 text-sm text-center">{error}</span>
    </div>
  );
}
