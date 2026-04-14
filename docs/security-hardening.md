# Security Hardening Notes

## Implemented protections

- Global HTTP security headers configured in `next.config.ts`:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`
  - `Strict-Transport-Security` (production only)

- Admin API hardening in `app/api/admin/[table]/route.ts`:
  - consistent generic internal error response (`internal_error`)
  - structured security audit logs for denied and failed actions
  - request body size limits (`24KB`)
  - same-origin enforcement for write methods (`POST`, `PATCH`, `DELETE`)
  - strict ID validation for write/delete paths

- Rate limiting added with in-memory limiter (`lib/security/rate-limit.ts`):
  - admin API auth + write operations
  - login endpoint (`/api/auth/login`) by IP and identity
  - analytics ingestion endpoint

- Login UX hardened against account enumeration:
  - login now goes through server endpoint `app/api/auth/login/route.ts`
  - unified failure message in `components/admin/LoginForm.tsx`

- Analytics endpoint hardening in `app/api/analytics/route.ts`:
  - payload size cap
  - schema validation
  - rate limit response with `retry-after`

## Operational caveat

The current rate limiter is in-memory and process-local. For multi-instance production deployments, replace with shared storage (for example Redis/Upstash) for consistent global enforcement.

## Validation checklist

1. Unauthenticated calls to `/api/admin/*` return `403`.
2. Cross-origin write requests to `/api/admin/*` return `403`.
3. Repeated requests trigger `429` with `retry-after`.
4. Internal DB errors are not exposed to clients.
5. Security headers are present on page and API responses.
