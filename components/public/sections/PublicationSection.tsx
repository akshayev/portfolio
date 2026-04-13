import { FadeInUp } from "@/components/motion/FadeInUp";
import { ExternalLink } from "@/components/public/ExternalLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { CertificationContent, PublicationContent } from "@/lib/content/types";

type PublicationSectionProps = {
  publications: PublicationContent[];
  certifications: CertificationContent[];
};

function Item({
  title,
  subtitle,
  summary,
  url,
  section,
}: {
  title: string;
  subtitle: string;
  summary: string | null;
  url: string | null;
  section: string;
}) {
  return (
    <SurfaceCard>
      <h3 className="font-serif text-xl text-zinc-50">{title}</h3>
      <p className="mt-1 text-sm text-zinc-300">{subtitle}</p>
      {summary ? <p className="mt-3 text-sm leading-relaxed text-zinc-300">{summary}</p> : null}
      <div className="mt-4 text-sm text-amber-200">
        <ExternalLink href={url} label={title} section={section} className="hover:text-amber-100">
          View details
        </ExternalLink>
      </div>
    </SurfaceCard>
  );
}

export function PublicationSection({ publications, certifications }: PublicationSectionProps) {
  return (
    <section id="writing" className="grid gap-6 xl:grid-cols-2">
      <FadeInUp>
        <div className="space-y-4">
          <SectionHeading eyebrow="Thought leadership" title="Publications" />
          {publications.length ? (
            publications.map((item) => (
              <Item
                key={item.id}
                title={item.title}
                subtitle={item.publisher}
                summary={item.summary}
                url={item.url}
                section="publications"
              />
            ))
          ) : (
            <SurfaceCard>
              <p className="text-sm text-zinc-300">No publications published yet.</p>
            </SurfaceCard>
          )}
        </div>
      </FadeInUp>
      <FadeInUp delay={0.08}>
        <div className="space-y-4">
          <SectionHeading eyebrow="Credentials" title="Certifications" />
          {certifications.length ? (
            certifications.map((item) => (
              <Item
                key={item.id}
                title={item.title}
                subtitle={item.issuer}
                summary={item.issued_on}
                url={item.credential_url}
                section="certifications"
              />
            ))
          ) : (
            <SurfaceCard>
              <p className="text-sm text-zinc-300">No certifications published yet.</p>
            </SurfaceCard>
          )}
        </div>
      </FadeInUp>
    </section>
  );
}
