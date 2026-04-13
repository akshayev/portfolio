import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import { ExternalLink } from "@/components/public/ExternalLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { ProjectContent } from "@/lib/content/types";

type ProjectsSectionProps = {
  projects: ProjectContent[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="space-y-6">
      <RevealOnScroll>
        <SectionHeading
          eyebrow="Selected work"
          title="Projects"
          description="A curated selection of systems and products I designed and delivered."
        />
      </RevealOnScroll>

      {projects.length ? (
        <StaggerContainer className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <SurfaceCard className="h-full">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80">
                  {project.featured ? "Featured" : "Project"}
                </p>
                <h3 className="mt-2 font-serif text-2xl text-zinc-50">{project.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{project.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <li
                      key={`${project.id}-${tech}`}
                      className="rounded-full border border-zinc-600/80 px-3 py-1 text-xs text-zinc-300"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-4 text-sm">
                  <ExternalLink
                    href={project.project_url}
                    label={`${project.title} live`}
                    section="projects"
                    className="text-amber-200 hover:text-amber-100"
                  >
                    Live
                  </ExternalLink>
                  <ExternalLink
                    href={project.repo_url}
                    label={`${project.title} repo`}
                    section="projects"
                    className="text-zinc-300 hover:text-zinc-100"
                  >
                    Source
                  </ExternalLink>
                </div>
              </SurfaceCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <SurfaceCard>
          <p className="text-sm text-zinc-300">No projects published yet.</p>
        </SurfaceCard>
      )}
    </section>
  );
}
