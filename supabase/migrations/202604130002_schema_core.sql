create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text not null,
  site_tagline text,
  contact_email text,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_sections (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  subheadline text not null,
  cta_label text not null,
  cta_url text,
  portrait_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_sections (
  id uuid primary key default gen_random_uuid(),
  bio text not null,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_settings (
  id uuid primary key default gen_random_uuid(),
  contact_email text,
  contact_phone text,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.global_visual_settings (
  id uuid primary key default gen_random_uuid(),
  glow_strength numeric(5,2) not null default 0.75,
  grain_opacity numeric(5,2) not null default 0.14,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text,
  display_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  display_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  link_url text,
  start_date date,
  end_date date,
  summary text,
  display_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  field_of_study text,
  location text,
  start_date date,
  end_date date,
  summary text,
  display_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_on date,
  credential_url text,
  display_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  tech_stack text[] not null default '{}',
  media_type text not null default 'image',
  thumbnail_url text,
  project_url text,
  repo_url text,
  featured boolean not null default false,
  display_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.import_sources (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_type text not null,
  source_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.import_logs (
  id uuid primary key default gen_random_uuid(),
  import_source_id uuid references public.import_sources(id) on delete set null,
  status text not null,
  details text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_site_settings_created_at on public.site_settings(created_at);
create index if not exists idx_site_settings_is_active on public.site_settings(is_active);

create index if not exists idx_hero_sections_created_at on public.hero_sections(created_at);
create index if not exists idx_hero_sections_is_active on public.hero_sections(is_active);

create index if not exists idx_about_sections_created_at on public.about_sections(created_at);
create index if not exists idx_about_sections_is_active on public.about_sections(is_active);

create index if not exists idx_contact_settings_created_at on public.contact_settings(created_at);
create index if not exists idx_contact_settings_is_active on public.contact_settings(is_active);

create index if not exists idx_global_visual_settings_created_at on public.global_visual_settings(created_at);
create index if not exists idx_global_visual_settings_is_active on public.global_visual_settings(is_active);

create index if not exists idx_social_links_display_order on public.social_links(display_order);
create index if not exists idx_social_links_created_at on public.social_links(created_at);
create index if not exists idx_social_links_is_active on public.social_links(is_active);

create index if not exists idx_skills_display_order on public.skills(display_order);
create index if not exists idx_skills_created_at on public.skills(created_at);
create index if not exists idx_skills_is_active on public.skills(is_active);

create index if not exists idx_experiences_display_order on public.experiences(display_order);
create index if not exists idx_experiences_created_at on public.experiences(created_at);
create index if not exists idx_experiences_is_active on public.experiences(is_active);

create index if not exists idx_education_display_order on public.education(display_order);
create index if not exists idx_education_created_at on public.education(created_at);
create index if not exists idx_education_is_active on public.education(is_active);

create index if not exists idx_certifications_display_order on public.certifications(display_order);
create index if not exists idx_certifications_created_at on public.certifications(created_at);
create index if not exists idx_certifications_is_active on public.certifications(is_active);

create index if not exists idx_projects_display_order on public.projects(display_order);
create index if not exists idx_projects_created_at on public.projects(created_at);
create index if not exists idx_projects_is_active on public.projects(is_active);
create index if not exists idx_projects_featured on public.projects(featured);

create index if not exists idx_import_sources_created_at on public.import_sources(created_at);
create index if not exists idx_import_sources_is_active on public.import_sources(is_active);

create index if not exists idx_import_logs_created_at on public.import_logs(created_at);

create index if not exists idx_admin_users_created_at on public.admin_users(created_at);

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_hero_sections_updated_at on public.hero_sections;
create trigger trg_hero_sections_updated_at
before update on public.hero_sections
for each row execute function public.set_updated_at();

drop trigger if exists trg_about_sections_updated_at on public.about_sections;
create trigger trg_about_sections_updated_at
before update on public.about_sections
for each row execute function public.set_updated_at();

drop trigger if exists trg_contact_settings_updated_at on public.contact_settings;
create trigger trg_contact_settings_updated_at
before update on public.contact_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_global_visual_settings_updated_at on public.global_visual_settings;
create trigger trg_global_visual_settings_updated_at
before update on public.global_visual_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_social_links_updated_at on public.social_links;
create trigger trg_social_links_updated_at
before update on public.social_links
for each row execute function public.set_updated_at();

drop trigger if exists trg_skills_updated_at on public.skills;
create trigger trg_skills_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

drop trigger if exists trg_experiences_updated_at on public.experiences;
create trigger trg_experiences_updated_at
before update on public.experiences
for each row execute function public.set_updated_at();

drop trigger if exists trg_education_updated_at on public.education;
create trigger trg_education_updated_at
before update on public.education
for each row execute function public.set_updated_at();

drop trigger if exists trg_certifications_updated_at on public.certifications;
create trigger trg_certifications_updated_at
before update on public.certifications
for each row execute function public.set_updated_at();

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists trg_import_sources_updated_at on public.import_sources;
create trigger trg_import_sources_updated_at
before update on public.import_sources
for each row execute function public.set_updated_at();
