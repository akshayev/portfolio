-- =============================================================================
-- v3: SECURITY DEFINER hardening patch
-- Hardens the 3 helper functions from v2:
--   1. Pins search_path to prevent schema-injection attacks
--   2. Revokes default PUBLIC EXECUTE grant
--   3. Grants EXECUTE only to `authenticated` (anon never needs these;
--      all anon-accessible policies use literal `true` or `auth.uid()`)
--
-- WHY THIS IS NEEDED:
--   By default PostgreSQL grants EXECUTE ON FUNCTION to PUBLIC (all roles).
--   Without `SET search_path`, a SECURITY DEFINER function inherits the
--   caller's search_path, allowing a malicious schema earlier in the path
--   to shadow `public.admin_roles` with a crafted table, bypassing auth.
--   Both issues are classified under CWE-273 / PostgreSQL CVE class.
--
-- RECURSION TRAP ANALYSIS:
--   is_admin() queries public.admin_roles, which has a SELECT policy that
--   calls is_admin(). This would normally be infinite recursion, but
--   SECURITY DEFINER functions run as the definer (postgres superuser in
--   Supabase), which has BYPASSRLS. RLS is not evaluated inside the
--   function body. No recursion trap exists. Confirmed safe.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Replace functions with search_path pinned
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid()
        AND role = 'owner'
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.has_access_role()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM public.admin_roles
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'editor')
    )
  );
END;
$$;

-- -----------------------------------------------------------------------------
-- 2. Revoke default PUBLIC execute grant, then re-grant only to `authenticated`
--    `anon` role does NOT need these functions:
--      - public SELECT policies use literal `true` (no function call)
--      - auth.uid() policies are inline expressions (no function call)
--    Only INSERT/UPDATE/DELETE policies call these helpers, which only
--    authenticated (logged-in) users can reach.
-- -----------------------------------------------------------------------------

REVOKE ALL ON FUNCTION public.is_owner() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_access_role() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.is_owner() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_access_role() TO authenticated;

-- NOTE: In Supabase-hosted environments the platform's `roles.sql` bootstrap
-- re-grants EXECUTE to `anon` and `service_role` at startup. This is expected
-- and safe: all three functions call `auth.uid()` internally. When called by
-- the `anon` role (no JWT), `auth.uid()` returns NULL → EXISTS returns false →
-- all permission checks return false. No privilege escalation is possible.
