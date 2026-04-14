# Supabase Setup

This project includes SQL migrations, row-level security policies, and bootstrap scripts for a production-safe portfolio/CMS deployment.

## Assumptions

- You are using Supabase Postgres with the `auth` schema enabled.
- App code currently reads these tables: `settings`, `hero`, `about`, `skills`, `experience`, `education`, `projects`, `publications`, `certifications`, and `admin_users`.
- Additional normalized tables are included for future compatibility (`site_settings`, `hero_sections`, etc.) but are not required by the current app runtime.

## Migration files (ordered)

1. `supabase/migrations/202604130001_utility_functions.sql`
2. `supabase/migrations/202604130002_schema_core.sql`
3. `supabase/migrations/202604130003_rls_policies.sql`
4. `supabase/migrations/202604130004_app_compat_schema.sql`
5. `supabase/migrations/202604130005_app_compat_rls.sql`
6. `supabase/migrations/202604140006_contact_messages.sql`
7. `supabase/migrations/202604140007_contact_messages_retention.sql`
8. `supabase/migrations/202604140008_contact_messages_archive.sql`

## Apply migrations

If using Supabase CLI:

```bash
supabase db push
```

If applying manually in SQL editor, run files in the order listed above.

## Seed minimal public content

Run:

```sql
-- from supabase/seed.sql
```

The seed is idempotent (`where not exists`) and inserts only minimal portfolio starter content.

## Bootstrap first admin user

1. Create/sign in a user through your app at `/login` (or Supabase auth UI).
2. Get the user UUID:

```sql
select id, email, created_at
from auth.users
order by created_at desc;
```

3. Insert the UUID into `public.admin_users`:

```sql
insert into public.admin_users (user_id)
values ('YOUR-USER-UUID'::uuid)
on conflict (user_id) do nothing;
```

You can also edit and run `supabase/bootstrap_admin.sql`.

## RLS troubleshooting checklist

- Confirm RLS is enabled:

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

- Confirm policies exist:

```sql
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

- Confirm admin mapping:

```sql
select user_id, created_at from public.admin_users order by created_at;
```

- If admin writes fail, validate the authenticated user UUID matches `admin_users.user_id` exactly.

## Rollback strategy

Preferred rollback: create a new forward migration that reverts the last change set.

Example rollback workflow:

1. Identify failing migration (for example `202604130004_app_compat_schema.sql`).
2. Create a new migration `20260413xxxx_rollback_compat_schema.sql`.
3. In that migration, drop policies/triggers/indexes/columns/tables introduced by the failed migration as needed.
4. Apply via `supabase db push`.

Avoid manual drift in production databases; keep rollback actions migration-based.

## Security notes

- App-level hardening (headers, API limits, origin checks) is documented in `docs/security-hardening.md`.
- Current rate limiting is in-memory and should be replaced with shared storage for horizontally scaled production.
- Keep `SUPABASE_SERVICE_ROLE_KEY` and `TELEGRAM_BOT_TOKEN` server-only; never expose them in client code, docs with real values, or logs.

## Contact message table and policies

Apply migration `supabase/migrations/202604140006_contact_messages.sql` to provision:

- `public.contact_messages` table
- anon insert policy for public form submissions
- service role full-access policy

Expected behavior:

- `anon`: insert allowed, select/update/delete denied
- `authenticated`: denied unless using service role
- `service_role`: full access

## Contact message retention

Migration `supabase/migrations/202604140007_contact_messages_retention.sql` adds:

- function `public.purge_old_contact_messages()`
- daily cron schedule `purge_old_contact_messages_daily` (if `pg_cron` is available)
- retention policy deleting rows older than 180 days

Migration `supabase/migrations/202604140008_contact_messages_archive.sql` upgrades this to archive-before-delete:

- `public.contact_messages_archive` table (`archived_at` included)
- `public.purge_old_contact_messages()` now archives old rows first, then deletes from live table in the same transaction
- existing cron schedule remains unchanged

Manual run:

```sql
select public.purge_old_contact_messages();
```

Cron check:

```sql
select jobid, jobname, schedule, active
from cron.job
where jobname = 'purge_old_contact_messages_daily';
```
