-- Helper functions for role-based checks
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_access_role()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'editor')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all 17 tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_visual_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_import_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_import_logs ENABLE ROW LEVEL SECURITY;

-- 1) public.users policies
CREATE POLICY "Users can view their own record" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Only owners can delete user records" ON public.users FOR DELETE USING (public.is_owner());

-- 2) public.admin_roles policies
CREATE POLICY "Admins and owners can view roles" ON public.admin_roles FOR SELECT USING (public.is_admin());
CREATE POLICY "Only owners can manage roles" ON public.admin_roles FOR ALL USING (public.is_owner());

-- 3) Portfolio Content (Public Read, Admin/Editor Write, Admin/Owner Delete)
-- Tables: site_settings, global_visual_settings, hero_sections, about_sections, skills, projects, project_links, project_media, experiences, education, certifications, contact_settings, social_links

-- site_settings
CREATE POLICY "Public SELECT site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT site_settings" ON public.site_settings FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE site_settings" ON public.site_settings FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE site_settings" ON public.site_settings FOR DELETE USING (public.is_admin());

-- global_visual_settings
CREATE POLICY "Public SELECT global_visual_settings" ON public.global_visual_settings FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT global_visual_settings" ON public.global_visual_settings FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE global_visual_settings" ON public.global_visual_settings FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE global_visual_settings" ON public.global_visual_settings FOR DELETE USING (public.is_admin());

-- hero_sections
CREATE POLICY "Public SELECT hero_sections" ON public.hero_sections FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT hero_sections" ON public.hero_sections FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE hero_sections" ON public.hero_sections FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE hero_sections" ON public.hero_sections FOR DELETE USING (public.is_admin());

-- about_sections
CREATE POLICY "Public SELECT about_sections" ON public.about_sections FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT about_sections" ON public.about_sections FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE about_sections" ON public.about_sections FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE about_sections" ON public.about_sections FOR DELETE USING (public.is_admin());

-- skills
CREATE POLICY "Public SELECT skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT skills" ON public.skills FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE skills" ON public.skills FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE skills" ON public.skills FOR DELETE USING (public.is_admin());

-- projects
CREATE POLICY "Public SELECT projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT projects" ON public.projects FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE projects" ON public.projects FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE projects" ON public.projects FOR DELETE USING (public.is_admin());

-- project_links
CREATE POLICY "Public SELECT project_links" ON public.project_links FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT project_links" ON public.project_links FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE project_links" ON public.project_links FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE project_links" ON public.project_links FOR DELETE USING (public.is_admin());

-- project_media
CREATE POLICY "Public SELECT project_media" ON public.project_media FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT project_media" ON public.project_media FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE project_media" ON public.project_media FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE project_media" ON public.project_media FOR DELETE USING (public.is_admin());

-- experiences
CREATE POLICY "Public SELECT experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT experiences" ON public.experiences FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE experiences" ON public.experiences FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE experiences" ON public.experiences FOR DELETE USING (public.is_admin());

-- education
CREATE POLICY "Public SELECT education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT education" ON public.education FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE education" ON public.education FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE education" ON public.education FOR DELETE USING (public.is_admin());

-- certifications
CREATE POLICY "Public SELECT certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT certifications" ON public.certifications FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE certifications" ON public.certifications FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE certifications" ON public.certifications FOR DELETE USING (public.is_admin());

-- contact_settings
CREATE POLICY "Public SELECT contact_settings" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT contact_settings" ON public.contact_settings FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE contact_settings" ON public.contact_settings FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE contact_settings" ON public.contact_settings FOR DELETE USING (public.is_admin());

-- social_links
CREATE POLICY "Public SELECT social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admin/Editor INSERT social_links" ON public.social_links FOR INSERT WITH CHECK (public.has_access_role());
CREATE POLICY "Admin/Editor UPDATE social_links" ON public.social_links FOR UPDATE USING (public.has_access_role());
CREATE POLICY "Admin/Owner DELETE social_links" ON public.social_links FOR DELETE USING (public.is_admin());

-- 4) GitHub Import Tables (Editor/Admin/Owner Read, Admin/Owner Write/Delete)

-- github_import_sources
CREATE POLICY "Admin/Editor SELECT github_import_sources" ON public.github_import_sources FOR SELECT USING (public.has_access_role());
CREATE POLICY "Admin/Owner INSERT github_import_sources" ON public.github_import_sources FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin/Owner UPDATE github_import_sources" ON public.github_import_sources FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin/Owner DELETE github_import_sources" ON public.github_import_sources FOR DELETE USING (public.is_admin());

-- github_import_logs
CREATE POLICY "Admin/Editor SELECT github_import_logs" ON public.github_import_logs FOR SELECT USING (public.has_access_role());
CREATE POLICY "Admin/Owner INSERT github_import_logs" ON public.github_import_logs FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin/Owner UPDATE github_import_logs" ON public.github_import_logs FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin/Owner DELETE github_import_logs" ON public.github_import_logs FOR DELETE USING (public.is_admin());
