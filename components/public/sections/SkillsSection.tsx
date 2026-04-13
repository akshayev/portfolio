import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { Tables } from "@/lib/supabase/database.types";

type SkillsSectionProps = {
  skills: Tables<"skills">[];
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="space-y-6">
      <SectionHeading eyebrow="Capabilities" title="Skills" />
      {skills.length ? (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <StaggerItem key={skill.id}>
              <SurfaceCard className="h-full">
                <h3 className="font-serif text-xl text-zinc-50">{skill.name}</h3>
                {skill.description ? <p className="mt-2 text-sm leading-relaxed text-zinc-300">{skill.description}</p> : null}
              </SurfaceCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <SurfaceCard>
          <p className="text-sm text-zinc-300">No skills have been published yet.</p>
        </SurfaceCard>
      )}
    </section>
  );
}
