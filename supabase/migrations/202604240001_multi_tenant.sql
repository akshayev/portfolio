-- Add user profiles table (for username -> user_id lookup)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text,
  created_at timestamptz DEFAULT now()
);

-- Function to handle applying user_id and RLS to a table
CREATE OR REPLACE FUNCTION public.apply_multi_tenant_policies(target_table text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Add user_id column if it doesn't exist
  EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE', target_table);
  
  -- Create an index on user_id
  EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_user_id ON public.%I(user_id)', target_table, target_table);

  -- Enable RLS
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target_table);

  -- Drop existing policies that might conflict (we'll overwrite the ones created in 0005_app_compat_rls.sql)
  EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', target_table || '_public_select', target_table);
  EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', target_table || '_admin_insert', target_table);
  EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', target_table || '_admin_update', target_table);
  EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', target_table || '_admin_delete', target_table);

  -- Create new policies
  -- Anyone can read active records
  EXECUTE format(
    'CREATE POLICY %I ON public.%I FOR SELECT USING (is_active = true)',
    target_table || '_public_select',
    target_table
  );

  -- Owners can insert their own records
  EXECUTE format(
    'CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)',
    target_table || '_owner_insert',
    target_table
  );

  -- Owners can update their own records
  EXECUTE format(
    'CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)',
    target_table || '_owner_update',
    target_table
  );

  -- Owners can delete their own records
  EXECUTE format(
    'CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (auth.uid() = user_id)',
    target_table || '_owner_delete',
    target_table
  );
END;
$$;

-- Apply to all content tables
SELECT public.apply_multi_tenant_policies('settings');
SELECT public.apply_multi_tenant_policies('hero');
SELECT public.apply_multi_tenant_policies('about');
SELECT public.apply_multi_tenant_policies('experience');
SELECT public.apply_multi_tenant_policies('publications');
SELECT public.apply_multi_tenant_policies('skills');
SELECT public.apply_multi_tenant_policies('education');
SELECT public.apply_multi_tenant_policies('certifications');
SELECT public.apply_multi_tenant_policies('projects');

-- Clean up the helper function
DROP FUNCTION IF EXISTS public.apply_multi_tenant_policies(text);

-- RLS for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_profiles_public_select ON public.user_profiles;
CREATE POLICY user_profiles_public_select
ON public.user_profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS user_profiles_owner_insert ON public.user_profiles;
CREATE POLICY user_profiles_owner_insert
ON public.user_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_profiles_owner_update ON public.user_profiles;
CREATE POLICY user_profiles_owner_update
ON public.user_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_profiles_owner_delete ON public.user_profiles;
CREATE POLICY user_profiles_owner_delete
ON public.user_profiles FOR DELETE TO authenticated
USING (auth.uid() = user_id);
