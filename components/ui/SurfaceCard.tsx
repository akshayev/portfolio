import type { ReactNode } from "react";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
};

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return (
    <article
      className={`rounded-2xl border border-zinc-700/60 bg-[linear-gradient(160deg,rgba(24,24,27,0.95),rgba(15,15,19,0.82))] p-6 shadow-[0_20px_70px_-35px_rgba(245,158,11,0.55)] backdrop-blur ${className ?? ""}`}
    >
      {children}
    </article>
  );
}
