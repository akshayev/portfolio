import type { Tables } from "@/lib/supabase/database.types";

export type HeroContent = Omit<Tables<"hero">, "cta_url"> & {
  cta_url: string | null;
};

export type ExperienceContent = Omit<Tables<"experience">, "link_url"> & {
  link_url: string | null;
};

export type ProjectContent = Omit<Tables<"projects">, "project_url" | "repo_url"> & {
  project_url: string | null;
  repo_url: string | null;
};

export type PublicationContent = Omit<Tables<"publications">, "url"> & {
  url: string | null;
};

export type CertificationContent = Omit<Tables<"certifications">, "credential_url"> & {
  credential_url: string | null;
};

export type SettingsContent = Omit<
  Tables<"settings">,
  "social_github" | "social_linkedin" | "social_x"
> & {
  social_github: string | null;
  social_linkedin: string | null;
  social_x: string | null;
};

export type PortfolioContent = {
  hero: HeroContent | null;
  about: Tables<"about"> | null;
  settings: SettingsContent | null;
  skills: Tables<"skills">[];
  experience: ExperienceContent[];
  education: Tables<"education">[];
  projects: ProjectContent[];
  publications: PublicationContent[];
  certifications: CertificationContent[];
};
