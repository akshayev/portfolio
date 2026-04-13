insert into public.settings (
  site_title,
  site_tagline,
  location,
  contact_email,
  contact_phone,
  social_github,
  social_linkedin,
  social_x,
  visual_glow_strength,
  visual_grain_opacity
)
select
  'Aksha Portfolio',
  'Engineering with narrative and precision',
  'Remote',
  'hello@example.com',
  null,
  'https://github.com',
  'https://linkedin.com',
  null,
  0.75,
  0.14
where not exists (select 1 from public.settings);

insert into public.hero (headline, subheadline, cta_label, cta_url, portrait_url)
select
  'Designing resilient systems with cinematic interfaces',
  'I build product-grade platforms that combine robust engineering with premium frontend craft.',
  'View projects',
  'https://example.com/work',
  null
where not exists (select 1 from public.hero);

insert into public.about (bio, location)
select
  'Senior full-stack engineer focused on platform architecture, data-heavy systems, and high-fidelity user experience.',
  'Remote'
where not exists (select 1 from public.about);

insert into public.skills (name, description, position, display_order, is_active)
select * from (
  values
    ('TypeScript Architecture', 'Strictly typed domain modeling across app and data layers.', 1, 1, true),
    ('UI Motion Systems', 'Framer Motion choreography tuned for performance and accessibility.', 2, 2, true),
    ('Supabase + Postgres', 'Typed queries, auth controls, and observability practices.', 3, 3, true)
) as v(name, description, position, display_order, is_active)
where not exists (select 1 from public.skills);

insert into public.experience (company, role, location, link_url, start_date, end_date, summary, position)
select
  'Northline Systems',
  'Staff Software Engineer',
  'New York, NY',
  'https://example.com',
  date '2022-04-01',
  null,
  'Leading platform modernization and frontend performance initiatives across customer-critical workflows.',
  1
where not exists (select 1 from public.experience);

insert into public.education (
  institution,
  degree,
  field_of_study,
  location,
  start_date,
  end_date,
  summary,
  position,
  display_order
)
select
  'State University',
  'B.S.',
  'Computer Science',
  'Boston, MA',
  date '2016-09-01',
  date '2020-05-15',
  'Focused on distributed systems and human-computer interaction.',
  1,
  1
where not exists (select 1 from public.education);

insert into public.projects (
  title,
  summary,
  tech_stack,
  media_type,
  thumbnail_url,
  project_url,
  repo_url,
  featured,
  position,
  display_order
)
select
  'Atlas Control Plane',
  'Enterprise operations dashboard with role-aware workflows and event-driven insights.',
  array['Next.js', 'TypeScript', 'Supabase', 'Framer Motion'],
  'image',
  null,
  'https://example.com/product',
  'https://github.com',
  true,
  1,
  1
where not exists (select 1 from public.projects);

insert into public.publications (title, publisher, summary, published_on, url, position)
select
  'Designing Motion-First Interfaces',
  'Frontend Journal',
  'A practical framework for expressive motion systems without sacrificing usability.',
  date '2025-08-01',
  'https://example.com/article',
  1
where not exists (select 1 from public.publications);

insert into public.certifications (title, issuer, issued_on, credential_url, position, display_order)
select
  'Professional Cloud Architect',
  'Google Cloud',
  date '2024-11-15',
  'https://example.com/cert',
  1,
  1
where not exists (select 1 from public.certifications);
