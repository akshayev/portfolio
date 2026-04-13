import { SlideIn } from "@/components/motion/SlideIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { ExperienceContent } from "@/lib/content/types";
import type { Tables } from "@/lib/supabase/database.types";
import { formatDateRange } from "@/utils/date";

type TimelineSectionProps = {
  experience: ExperienceContent[];
  education: Tables<"education">[];
};

function Entry({
  title,
  subtitle,
  dateLabel,
  summary,
  location,
}: {
  title: string;
  subtitle: string;
  dateLabel: string;
  summary: string | null;
  location: string | null;
}) {
  return (
    <SurfaceCard>
      <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80">{dateLabel}</p>
      <h3 className="mt-2 font-serif text-xl text-zinc-50">{title}</h3>
      <p className="text-sm text-zinc-300">{subtitle}</p>
      {summary ? <p className="mt-3 text-sm leading-relaxed text-zinc-300">{summary}</p> : null}
      {location ? <p className="mt-4 text-xs uppercase tracking-[0.18em] text-zinc-400">{location}</p> : null}
    </SurfaceCard>
  );
}

export function TimelineSection({ experience, education }: TimelineSectionProps) {
  return (
    <section id="timeline" className="space-y-6">
      <SectionHeading eyebrow="Journey" title="Experience & Education" />
      <div className="grid gap-6 xl:grid-cols-2">
        <SlideIn from="left">
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.25em] text-zinc-400">Experience</h3>
            {experience.length ? (
              experience.map((item) => (
                <Entry
                  key={item.id}
                  title={item.role}
                  subtitle={item.company}
                  dateLabel={formatDateRange(item.start_date, item.end_date)}
                  summary={item.summary}
                  location={item.location}
                />
              ))
            ) : (
              <SurfaceCard>
                <p className="text-sm text-zinc-300">No experience entries yet.</p>
              </SurfaceCard>
            )}
          </div>
        </SlideIn>
        <SlideIn from="right">
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.25em] text-zinc-400">Education</h3>
            {education.length ? (
              education.map((item) => (
                <Entry
                  key={item.id}
                  title={item.degree}
                  subtitle={item.field_of_study ? `${item.institution} - ${item.field_of_study}` : item.institution}
                  dateLabel={formatDateRange(item.start_date, item.end_date)}
                  summary={item.summary}
                  location={item.location}
                />
              ))
            ) : (
              <SurfaceCard>
                <p className="text-sm text-zinc-300">No education entries yet.</p>
              </SurfaceCard>
            )}
          </div>
        </SlideIn>
      </div>
    </section>
  );
}
