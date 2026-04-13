import { AboutSection } from "@/components/public/sections/AboutSection";
import { ContactSection } from "@/components/public/sections/ContactSection";
import { HeroSection } from "@/components/public/sections/HeroSection";
import { ProjectsSection } from "@/components/public/sections/ProjectsSection";
import { PublicationSection } from "@/components/public/sections/PublicationSection";
import { SkillsSection } from "@/components/public/sections/SkillsSection";
import { TimelineSection } from "@/components/public/sections/TimelineSection";
import type { PortfolioContent } from "@/lib/content/types";

import { AmbientBackdrop } from "./AmbientBackdrop";

type PortfolioPageProps = {
  content: PortfolioContent;
};

export function PortfolioPage({ content }: PortfolioPageProps) {
  return (
    <>
      <AmbientBackdrop />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-7 sm:py-12 lg:px-10">
        <div className="space-y-14">
          <HeroSection hero={content.hero} settings={content.settings} />
          <AboutSection about={content.about} />
          <SkillsSection skills={content.skills} />
          <TimelineSection experience={content.experience} education={content.education} />
          <ProjectsSection projects={content.projects} />
          <PublicationSection publications={content.publications} certifications={content.certifications} />
          <ContactSection settings={content.settings} />
        </div>
      </main>
    </>
  );
}
