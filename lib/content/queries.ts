import type { SupabaseClient } from "@supabase/supabase-js";

import { fallbackPortfolioContent } from "@/lib/content/fallback";
import type {
  CertificationContent,
  ExperienceContent,
  HeroContent,
  PortfolioContent,
  ProjectContent,
  PublicationContent,
  SettingsContent,
} from "@/lib/content/types";
import type { Database, Tables } from "@/lib/supabase/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { reportPublicDataError } from "@/utils/monitoring";
import { normalizeExternalUrl } from "@/utils/url";

type ContentClient = SupabaseClient<Database>;

async function fetchHero(client: ContentClient): Promise<Tables<"hero"> | null> {
  const { data, error } = await client
    .from("hero")
    .select("*")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(1);

  if (error) {
    throw error;
  }

  return (data?.[0] ?? null) as Tables<"hero"> | null;
}

async function fetchAbout(client: ContentClient): Promise<Tables<"about"> | null> {
  const { data, error } = await client
    .from("about")
    .select("*")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(1);

  if (error) {
    throw error;
  }

  return (data?.[0] ?? null) as Tables<"about"> | null;
}

async function fetchSettings(client: ContentClient): Promise<Tables<"settings"> | null> {
  const { data, error } = await client
    .from("settings")
    .select("*")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(1);

  if (error) {
    throw error;
  }

  return (data?.[0] ?? null) as Tables<"settings"> | null;
}

async function fetchSkills(client: ContentClient): Promise<Tables<"skills">[]> {
  const { data, error } = await client
    .from("skills")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Tables<"skills">[];
}

async function fetchExperience(client: ContentClient): Promise<Tables<"experience">[]> {
  const { data, error } = await client
    .from("experience")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Tables<"experience">[];
}

async function fetchEducation(client: ContentClient): Promise<Tables<"education">[]> {
  const { data, error } = await client
    .from("education")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Tables<"education">[];
}

async function fetchProjects(client: ContentClient): Promise<Tables<"projects">[]> {
  const { data, error } = await client
    .from("projects")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Tables<"projects">[];
}

async function fetchPublications(client: ContentClient): Promise<Tables<"publications">[]> {
  const { data, error } = await client
    .from("publications")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Tables<"publications">[];
}

async function fetchCertifications(client: ContentClient): Promise<Tables<"certifications">[]> {
  const { data, error } = await client
    .from("certifications")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Tables<"certifications">[];
}

function normalizeHero(hero: Tables<"hero"> | null): HeroContent | null {
  if (!hero) {
    return null;
  }

  const safeCtaUrl = normalizeExternalUrl(hero.cta_url);

  return {
    ...hero,
    cta_url: safeCtaUrl,
  };
}

function normalizeExperience(items: Tables<"experience">[]): ExperienceContent[] {
  return items.map((item) => ({
    ...item,
    link_url: normalizeExternalUrl(item.link_url),
  }));
}

function normalizeProjects(items: Tables<"projects">[]): ProjectContent[] {
  return items.map((item) => ({
    ...item,
    project_url: normalizeExternalUrl(item.project_url),
    repo_url: normalizeExternalUrl(item.repo_url),
  }));
}

function normalizePublications(items: Tables<"publications">[]): PublicationContent[] {
  return items.map((item) => ({
    ...item,
    url: normalizeExternalUrl(item.url),
  }));
}

function normalizeCertifications(items: Tables<"certifications">[]): CertificationContent[] {
  return items.map((item) => ({
    ...item,
    credential_url: normalizeExternalUrl(item.credential_url),
  }));
}

function normalizeSettings(settings: Tables<"settings"> | null): SettingsContent | null {
  if (!settings) {
    return null;
  }

  return {
    ...settings,
    social_github: normalizeExternalUrl(settings.social_github),
    social_linkedin: normalizeExternalUrl(settings.social_linkedin),
    social_x: normalizeExternalUrl(settings.social_x),
  };
}

export async function getPortfolioContent(): Promise<PortfolioContent> {
  const client = await createServerSupabaseClient();

  if (!client) {
    return fallbackPortfolioContent;
  }

  try {
    const [hero, about, settings, skills, experience, education, projects, publications, certifications] =
      await Promise.all([
        fetchHero(client),
        fetchAbout(client),
        fetchSettings(client),
        fetchSkills(client),
        fetchExperience(client),
        fetchEducation(client),
        fetchProjects(client),
        fetchPublications(client),
        fetchCertifications(client),
      ]);

    return {
      hero: normalizeHero(hero),
      about,
      settings: normalizeSettings(settings),
      skills,
      experience: normalizeExperience(experience),
      education,
      projects: normalizeProjects(projects),
      publications: normalizePublications(publications),
      certifications: normalizeCertifications(certifications),
    };
  } catch (error) {
    reportPublicDataError("portfolio", error);
    return fallbackPortfolioContent;
  }
}
