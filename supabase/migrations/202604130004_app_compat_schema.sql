create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  site_title text not null,
  site_tagline text,
  location text,
  contact_email text,
  contact_phone text,
  social_github text,
  social_linkedin text,
  social_x text,
  visual_glow_strength numeric(5,2) not null default 0.75,
  visual_grain_opacity numeric(5,2) not null default 0.14,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hero (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  subheadline text not null,
  cta_label text not null,
  cta_url text not null,
  portrait_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about (
  id uuid primary key default gen_random_uuid(),
  bio text not null,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  link_url text,
  start_date date,
  end_date date,
  summary text,
  position integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  publisher text not null,
  summary text,
  published_on date,
  url text,
  position integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.settings
  add column if not exists is_active boolean not null default true;

alter table public.hero
  add column if not exists is_active boolean not null default true;

alter table public.about
  add column if not exists is_active boolean not null default true;

alter table public.experience
  add column if not exists is_active boolean not null default true;

alter table public.publications
  add column if not exists is_active boolean not null default true;

alter table public.skills
  add column if not exists position integer not null default 100;

alter table public.education
  add column if not exists position integer not null default 100;

alter table public.certifications
  add column if not exists position integer not null default 100;

alter table public.projects
  add column if not exists position integer not null default 100;

create index if not exists idx_settings_created_at on public.settings(created_at);
create index if not exists idx_settings_is_active on public.settings(is_active);

create index if not exists idx_hero_created_at on public.hero(created_at);
create index if not exists idx_hero_is_active on public.hero(is_active);

create index if not exists idx_about_created_at on public.about(created_at);
create index if not exists idx_about_is_active on public.about(is_active);

create index if not exists idx_experience_position on public.experience(position);
create index if not exists idx_experience_created_at on public.experience(created_at);
create index if not exists idx_experience_is_active on public.experience(is_active);

create index if not exists idx_publications_position on public.publications(position);
create index if not exists idx_publications_created_at on public.publications(created_at);
create index if not exists idx_publications_is_active on public.publications(is_active);

create index if not exists idx_skills_position on public.skills(position);
create index if not exists idx_education_position on public.education(position);
create index if not exists idx_certifications_position on public.certifications(position);
create index if not exists idx_projects_position on public.projects(position);

drop trigger if exists trg_settings_updated_at on public.settings;
create trigger trg_settings_updated_at
before update on public.settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_hero_updated_at on public.hero;
create trigger trg_hero_updated_at
before update on public.hero
for each row execute function public.set_updated_at();

drop trigger if exists trg_about_updated_at on public.about;
create trigger trg_about_updated_at
before update on public.about
for each row execute function public.set_updated_at();

drop trigger if exists trg_experience_updated_at on public.experience;
create trigger trg_experience_updated_at
before update on public.experience
for each row execute function public.set_updated_at();

drop trigger if exists trg_publications_updated_at on public.publications;
create trigger trg_publications_updated_at
before update on public.publications
for each row execute function public.set_updated_at();
