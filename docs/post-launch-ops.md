# Post Launch Ops

## Environment checklist

Set these variables before running in production:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase setup checklist

1. Create all portfolio tables used by `lib/supabase/database.types.ts`.
2. Enable email/password auth in Supabase.
3. Insert at least one admin record in `admin_users` with the authenticated `user_id`.
4. Apply RLS policies so only admin users can modify CMS content tables.

## Verification commands

Run before each deploy:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Analytics and monitoring

- Client events are sent to `POST /api/analytics`.
- Public content fetch failures are logged with `reportPublicDataError`.
- In development, analytics payloads print to server console.

## Content operations

- Manage data in `/admin` after signing in through `/login`.
- Singleton content (`hero`, `about`, `settings`) is updated in place.
- Repeatable content (`skills`, `experience`, `education`, `projects`, `publications`, `certifications`) supports create, update, and delete.
- For array fields like project `tech_stack`, provide comma-separated values in the admin form.

## Rollback strategy

1. Revert app deployment to previous release.
2. Restore data from Supabase backup/snapshot if needed.
3. Re-run verification commands locally before redeploying.

## Smoke test checklist

After deploy, verify:

1. `/` renders all public sections with content.
2. Invalid external URLs are non-clickable.
3. `/login` authenticates successfully.
4. `/admin` allows authorized CRUD and blocks unauthorized users.
5. Contact and external link clicks hit `POST /api/analytics`.
