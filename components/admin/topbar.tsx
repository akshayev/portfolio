import { LogoutButton } from "./logout-button";

export function Topbar() {
  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center">
        <span className="text-sm font-medium text-slate-500">
          Admin Dashboard
        </span>
      </div>
      <div className="flex items-center gap-4">
        <LogoutButton />
      </div>
    </header>
  );
}
