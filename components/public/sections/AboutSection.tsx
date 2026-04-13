import { FadeInUp } from "@/components/motion/FadeInUp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { Tables } from "@/lib/supabase/database.types";

type AboutSectionProps = {
  about: Tables<"about"> | null;
};

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="space-y-6">
      <FadeInUp>
        <SectionHeading eyebrow="Profile" title="About" />
      </FadeInUp>
      <FadeInUp delay={0.05}>
        <SurfaceCard>
          <p className="leading-relaxed text-zinc-200">
            {about?.bio ??
              "I am a product-focused engineer who works across backend architecture and premium frontend experiences, with a strong emphasis on maintainability and operational confidence."}
          </p>
          {about?.location ? (
            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-zinc-400">{about.location}</p>
          ) : null}
        </SurfaceCard>
      </FadeInUp>
    </section>
  );
}
