-- ============================================================
-- Portfolio Database Schema for Supabase
-- Maps 1:1 with portfolio-timeline-schema.json
-- ============================================================

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  description TEXT,
  date_range TEXT NOT NULL,
  type TEXT DEFAULT 'milestone',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table  
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_link TEXT,
  live_link TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  date_range TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creative table
CREATE TABLE IF NOT EXISTS creative (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  date_range TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline stops (ordering & linking layer)
CREATE TABLE IF NOT EXISTS timeline_stops (
  id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL CHECK (source_type IN ('education', 'project', 'experience', 'creative')),
  source_id TEXT NOT NULL,
  type TEXT DEFAULT 'standard',
  label TEXT NOT NULL,
  z_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security — public read, no public write
-- ============================================================

ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_stops ENABLE ROW LEVEL SECURITY;

-- Public read policies (portfolio is public-facing)
CREATE POLICY "Public read education" ON education FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read creative" ON creative FOR SELECT USING (true);
CREATE POLICY "Public read timeline_stops" ON timeline_stops FOR SELECT USING (true);

-- ============================================================
-- Seed data from portfolio-timeline-schema.json
-- ============================================================

-- Education
INSERT INTO education (id, title, institution, description, date_range, type) VALUES
  ('education-cusat-btech-it', 'B.Tech in Information Technology', 'Cochin University of Science and Technology (CUSAT)', 'Built a strong software engineering foundation while serving as Zone Captain for the Sargam arts festival.', '2023-2027', 'major_milestone')
ON CONFLICT (id) DO NOTHING;

-- Projects
INSERT INTO projects (id, title, description, tech_stack, github_link, category) VALUES
  ('project-citypulse-ai', 'CityPulse AI', 'An AI-powered urban insight platform for extracting and analyzing city-scale signals.', ARRAY['Python', 'Google Gemini', 'PostgreSQL', 'FastAPI', 'React'], 'https://github.com/your-username/citypulse-ai', 'AI Agent'),
  ('project-job-seeker-ai-agent', 'Job Seeker AI Agent', 'An agentic workflow that automates job discovery, ranking, and application support.', ARRAY['Python', 'Google Gemini', 'Selenium', 'Playwright', 'Supabase'], 'https://github.com/your-username/job-seeker-ai-agent', 'AI Agent')
ON CONFLICT (id) DO NOTHING;

-- Experience
INSERT INTO experience (id, role, company, date_range) VALUES
  ('experience-strokx-website-developer-intern', 'Website Developer Intern', 'Strokx Technologies', '2025-01 to 2025-04'),
  ('experience-keltron-intern', 'Software Development Intern', 'Keltron', '2024-06 to 2024-08')
ON CONFLICT (id) DO NOTHING;

-- Creative
INSERT INTO creative (id, role, organization, date_range) VALUES
  ('creative-cucek-photography', 'Creative Member', 'CUCEK Photography Club', '2023-2026'),
  ('creative-tedxcusat', 'Design / Media Team', 'TEDxCUSAT', '2024-2026')
ON CONFLICT (id) DO NOTHING;

-- Timeline Stops
INSERT INTO timeline_stops (id, source_type, source_id, type, label, z_index) VALUES
  ('stop-cusat-btech-it', 'education', 'education-cusat-btech-it', 'major_milestone', 'B.Tech in Information Technology', 0),
  ('stop-citypulse-ai', 'project', 'project-citypulse-ai', 'standard', 'CityPulse AI', 1),
  ('stop-job-seeker-ai-agent', 'project', 'project-job-seeker-ai-agent', 'standard', 'Job Seeker AI Agent', 2),
  ('stop-strokx-technologies', 'experience', 'experience-strokx-website-developer-intern', 'standard', 'Website Developer Intern at Strokx Technologies', 3),
  ('stop-keltron', 'experience', 'experience-keltron-intern', 'standard', 'Keltron', 4),
  ('stop-cucek-photography-club', 'creative', 'creative-cucek-photography', 'standard', 'CUCEK Photography Club', 5),
  ('stop-tedxcusat', 'creative', 'creative-tedxcusat', 'standard', 'TEDxCUSAT', 6)
ON CONFLICT (id) DO NOTHING;
