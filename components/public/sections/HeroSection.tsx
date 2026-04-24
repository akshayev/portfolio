import { FadeInUp } from "@/components/motion/FadeInUp";
import { ScaleIn } from "@/components/motion/ScaleIn";
import { ExternalLink } from "@/components/public/ExternalLink";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { HeroContent, SettingsContent } from "@/lib/content/types";

type HeroSectionProps = {
  hero: HeroContent | null;
  settings: SettingsContent | null;
};

export function HeroSection({ hero, settings }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-zinc-700/60 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.22),transparent_42%),linear-gradient(140deg,rgba(24,24,27,0.98),rgba(10,10,13,0.96))] p-7 shadow-[0_26px_90px_-45px_rgba(245,158,11,0.55)] sm:p-10">
      <div className="pointer-events-none absolute -left-10 top-20 h-36 w-36 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-2 top-1 h-44 w-44 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <FadeInUp className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300/85">
            {settings?.site_tagline ?? "Engineering portfolio"}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            {hero?.headline ?? "Building product systems with craft and precision"}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {hero?.subheadline ??
              "I ship resilient web products with a strong narrative, robust architecture, and intentional motion."}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <ExternalLink
              href={hero?.cta_url ?? null}
              label={hero?.cta_label ?? "Primary CTA"}
              section="hero"
              className="inline-flex rounded-full border border-amber-300/70 bg-amber-200/95 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:scale-[1.02]"
            >
              {hero?.cta_label ?? "Explore projects"}
            </ExternalLink>
            {settings?.contact_email ? (
              <a
                href={`mailto:${settings.contact_email}`}
                className="inline-flex rounded-full border border-zinc-500/80 px-5 py-2 text-sm text-zinc-200 transition hover:border-amber-300/60 hover:text-zinc-50"
              >
                Contact me
              </a>
            ) : null}
          </div>
        </FadeInUp>

        <ScaleIn>
          <SurfaceCard className="h-full p-0">
            {hero?.portrait_url ? (
              <div className="relative h-full min-h-56 w-full overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={hero.portrait_url} 
                  alt="Portrait" 
                  className="absolute inset-0 h-full w-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
                <p className="absolute bottom-6 left-6 right-6 text-xs text-zinc-300">
                  {settings?.location ?? "Open to remote and hybrid roles"}
                </p>
              </div>
            ) : (
              <div className="relative flex h-full min-h-56 flex-col justify-between gap-5 overflow-hidden rounded-2xl p-6">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(245,158,11,0.2),transparent_50%,rgba(56,189,248,0.12))]" />
                <p className="relative text-xs uppercase tracking-[0.26em] text-amber-300/85">Currently focused</p>
                <ul className="relative space-y-3 text-sm text-zinc-200">
                  <li>Design systems with motion primitives</li>
                  <li>Typed data access and domain-safe APIs</li>
                  <li>Production observability and resilience</li>
                </ul>
                <p className="relative text-xs text-zinc-400">{settings?.location ?? "Open to remote and hybrid roles"}</p>
              </div>
            )}
          </SurfaceCard>
        </ScaleIn>
      </div>
    </section>
  );
}
