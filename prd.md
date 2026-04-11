Product Requirements Document (PRD)
Project: akshayev/portfolio
Date: 2026-04-11
Owner: akshayev
Prepared by: PM + Prompt Engineering Assistant
1) Objective
Build a cinematic, modern, professional portfolio platform with:

Public portfolio website (mobile + laptop responsive)
Admin CMS to manage all content
GitHub project import (selected repos only)
Zero-cost friendly architecture (free tiers)
Strong anti-hallucination execution via phased prompts
2) Confirmed Decisions (Locked)
Repo: akshayev/portfolio
Rebuild strategy: from scratch in same repo
Stack: Next.js + TypeScript + Tailwind + Supabase
Auth: Email/Password + Google OAuth
Admin model: Multi-admin (role-ready)
Content CMS: All sections editable
Theme: Light/Dark toggle
Visual style: Cinematic / Experimental
3D usage: Hero + section-wise storytelling
Sound: Subtle interaction SFX only
Preloader: Yes (cinematic)
Device support: Mobile + laptop (adaptive behavior)
3D strategy: Balanced quality/performance
Mobile fallback: Adaptive effects auto-reduction
Media handling: Cloudinary
Data/Auth: Supabase
Deployment: Vercel now, custom domain later
Budget: Zero cost
Global admin kill switch: Yes (sounds / heavy 3D / preloader / animation intensity)
GitHub sync: Selected repos only
Repo selection method: Dashboard import + manual URL
Project statuses: completed, in_progress, planned
3) Product Scope
3.1 Public Website
Home/Hero (cinematic intro + CTA)
About
Skills
Projects
Experience
Education
Certifications
Contact
Resume download/view
Theme toggle
Optional subtle UI sound interactions
SEO essentials + social preview metadata
3.2 Admin CMS
Secure login (email/password + Google)
Multi-admin access with roles
CRUD for all content sections
Site settings management
GitHub repo import and mapping
Global performance controls
Publish/unpublish controls where relevant
3.3 Integrations
Supabase (DB + Auth)
Cloudinary (media)
GitHub API (selected repo ingestion)
Vercel deployment pipeline
4) Non-Goals (for v1)
Payments/e-commerce
Blog engine with comments
Multi-language i18n
Complex analytics suite (basic privacy-friendly analytics optional later)
Native mobile app
5) User Roles
5.1 Public Visitor
View portfolio sections
Open project links
Contact via provided channels
Toggle theme
5.2 Admin
Manage content
Import/select GitHub projects
Control global performance switches
Manage project visibility/order/featured state
5.3 Super Admin / Owner
All admin capabilities
Manage other admin users/roles (role-ready foundation)
6) Functional Requirements
FR-1: Authentication & Authorization
Support:
Email/password auth
Google OAuth
Role-based access control scaffold:
owner, admin, editor (even if editor features limited in v1)
Protected admin routes
Session persistence and secure logout
FR-2: CMS Content Management
Admin can create/update/delete/reorder:

Site settings:
name, title, tagline, SEO defaults, social links, contact details, resume URL
Hero
About
Skills
Projects
Experience
Education
Certifications
Contact block content
Visual/performance configuration
FR-3: Projects Module
Each project supports:

Mandatory:
title
short_description
tech_stack
thumbnail
project_type
status (completed, in_progress, planned)
featured (boolean)
at least one: github_url OR live_url
Optional:
start_date, end_date
long_description/case study
gallery
sort order
visibility/publish flag
FR-4: GitHub Sync
Import source: only selected repos
Selection methods:
dashboard search/import
manual repo URL input
Admin can map imported data to project schema
Admin can override synced fields manually
No auto-publish without review (recommended safety)
FR-5: Media Management
Upload and store images/assets in Cloudinary
Store Cloudinary URLs + metadata in Supabase
Validate file type/size
Optimize delivery format where possible
FR-6: Performance Control (Global Kill Switch)
Admin toggles:

sounds_enabled
heavy_3d_enabled
preloader_enabled
animation_intensity (low|medium|high)
mobile_effects_mode (adaptive|reduced|off optional extension)
These settings affect rendering without redeploy.

FR-7: UI/UX & Motion
Cinematic preloader
Smooth transitions
Subtle interaction SFX (license-free assets)
3D hero + section storytelling
Adaptive degradation on constrained devices
Accessibility-aware defaults (reduced motion fallback)
FR-8: Responsiveness
Mobile-first support
Laptop optimized layouts
Tablet-friendly behavior (implied)
Avoid interaction blocking on low-power devices
FR-9: Contact & CTA
Primary CTA: “Contact Me”
Show:
email
phone/WhatsApp
LinkedIn
GitHub
Anti-spam strategy for visible contacts (basic obfuscation/rate-limited form optional)
FR-10: Deployment
Vercel deployment
Environment variable management
Production and preview compatibility
7) Non-Functional Requirements
NFR-1: Zero-Cost Compliance
Use only free-tier-friendly services/configs:

Vercel (Hobby)
Supabase (Free)
Cloudinary (Free)
Design constraints:

compressed media
lazy loading
route/code splitting
controlled 3D assets
optional effect disable
NFR-2: Performance
Targets (v1):

Good Lighthouse scores on modern mobile/laptop baseline
Fast first meaningful paint with preloader masking heavy assets
Avoid long main-thread blocking
NFR-3: Reliability
Graceful fallback if:
GitHub API fails
Cloudinary upload fails
3D context unsupported
NFR-4: Security
RLS enabled in Supabase for protected data writes
Admin-only mutations
Secrets only in env vars
Basic server-side validation for admin mutations
NFR-5: Maintainability
Typed schemas
Modular components
CMS-driven content where possible
Clear README + runbooks
8) Proposed Data Model (High-level)
Core tables (Supabase/Postgres):

users (profile extension)
admin_roles
site_settings
hero_sections
about_sections
skills
projects
project_links
project_media
experiences
education
certifications
contact_settings
social_links
global_visual_settings
github_import_sources
github_import_logs
Key project fields:

id (uuid)
title
slug
short_description
long_description
tech_stack (json/text[])
thumbnail_url
project_type
status enum
featured boolean
github_url nullable
live_url nullable
start_date nullable
end_date nullable
visibility/published boolean
source_type (manual|github)
source_repo_full_name nullable
display_order
timestamps
Validation rule:

CHECK at least one of github_url/live_url is non-null
9) API / Backend Behavior (App Router + Server Actions or Route Handlers)
Auth endpoints via Supabase Auth
Admin CRUD endpoints protected by role checks
GitHub import endpoint with:
repo validation
rate-limit handling
selective field mapping
Cloudinary signed upload flow (if needed)
Settings endpoint consumed by public app for runtime feature toggles
10) UX Rules to Reduce Hallucination in Generated UI
Every editable section must correspond to explicit DB-backed fields
No hardcoded placeholder content in production mode
If content missing:
show deterministic fallback state
never fabricate data
Project cards must render only stored fields
GitHub imported data must be tagged with source metadata
11) Observability & Debugging Requirements
Basic error boundary pages
Console-safe structured logs in development
Admin-facing toast/error messaging with actionable text
Import logs for GitHub sync attempts (status + reason)
12) Risks & Mitigations
Free-tier overages (media/bandwidth)

Mitigation: aggressive optimization, adaptive effects, kill switch
Node 22 package incompatibility

Mitigation: keep fallback plan for Node 20 LTS
Low free RAM local machine

Mitigation: reduce concurrent apps, lighter dev mode, staged builds
3D performance on mobile

Mitigation: adaptive quality + motion fallback
GitHub API limits

Mitigation: selected import only + caching/import logs
13) Acceptance Criteria (v1 Release)
A release is accepted only if:

Admin can log in (email/password + Google)
Admin can manage all confirmed sections
Admin can import selected GitHub repos (dashboard/manual URL)
Project validation enforces required fields
Global kill switch works without redeploy
Public site is responsive on mobile + laptop
Theme toggle works
Resume link works
Contact methods visible and correct
Deployment successful on Vercel
No fabricated content appears when DB is empty
14) Execution Plan (Phases)
Phase 0: Foundation
repo cleanup
Next.js TS setup
Tailwind setup
lint/format/typecheck
env strategy
Phase 1: Data/Auth Core
Supabase project + schema + RLS
auth flows
admin route protection
role model
Phase 2: CMS Core
admin layout
CRUD screens for all sections
settings + global controls
Phase 3: Public Portfolio Core
section rendering from DB
responsive layout
theme system
Phase 4: Projects + GitHub Import
manual project management
GitHub selected import
mapping/override logic
Phase 5: Media + Visual System
Cloudinary integration
preloader
cinematic motion
subtle SFX
Phase 6: 3D + Adaptive Performance
hero 3D
section-wise 3D accents
mobile adaptive downgrade
kill switch integration
Phase 7: QA + Deploy
validation pass
performance tuning
Vercel deployment
documentation/runbook
15) Prompting Protocol for Antigravity (Anti-Hallucination)
For every task prompt:

Include:
exact phase/sub-phase
exact files allowed to change
explicit constraints
definition of done
Ask for:
plan first
then patch
then self-check
Require:
“If unknown, do not assume. Ask for clarification.”
Force output sections:
Changes made
Why
Risks
Test steps
Rollback steps

## Definition of Done (DoD) Template per sub-phase
Before a sub-phase is considered complete, ensure:
- **Code Quality:** Zero TS warnings/errors, zero ESLint warnings/errors.
- **Verification:** Feature is manually tested and verified against PRD requirements.
- **Proof:** Walkthrough artifact is updated with visual proof or specific test steps taken.
- **Check-in:** Code is committed to the current active feature branch.

16) Master Guardrails (paste in every Antigravity prompt)
Do not invent requirements beyond PRD.
Do not create fields/tables/endpoints not listed unless explicitly approved.
Do not use paid services/features.
Do not hardcode mock portfolio content in production paths.
If a requirement is ambiguous, stop and ask.
Keep commits small and phase-scoped.
Preserve TypeScript strictness.

17) Development Workflow
- **Package Manager:** Standardize on **pnpm** exclusively.
- **Framework Version:** Use Next.js stable (latest compatible) at initialization to avoid version lock conflicts.
- **Branch Policy:** `main` branch is protected. All feature implementations must occur in isolated feature branches (e.g., `feature/phase-0-foundation`) before merging.
- **Data Model:** The defined schema is a "target initial schema set"; logical merges or splits are permitted if they optimize implementation without losing required functionality.
