# Post Launch Ops

## Environment checklist

Set these variables before running in production:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Server-only secrets:

- `SUPABASE_SERVICE_ROLE_KEY` and `TELEGRAM_BOT_TOKEN` must never be exposed in client code or `NEXT_PUBLIC_*` variables.
- Do not paste real secret values in docs, chat logs, screenshots, or commit history.

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
- Contact form submissions are sent to `POST /api/contact` and forwarded to Telegram.
- Public content fetch failures are logged with `reportPublicDataError`.
- In development, analytics payloads print to server console.
- Contact message retention cleanup runs daily (180-day window) via `public.purge_old_contact_messages()`, archiving into `public.contact_messages_archive` before delete.

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
6. Contact form submission stores row in `public.contact_messages` and triggers Telegram notification.
