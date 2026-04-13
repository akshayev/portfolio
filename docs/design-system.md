# Design System

## Visual direction

- Mood: editorial, cinematic, and premium.
- Palette: deep navy/charcoal surfaces with amber accents and restrained cool highlights.
- Shape language: rounded modular cards, soft borders, depth shadows, and layered glow.

## Typography

- Primary sans: `Sora` for navigation, body text, and controls.
- Display serif: `Cormorant Garamond` for section and hero headlines.
- Tracking strategy:
  - Eyebrow labels use uppercased high tracking (`0.2em+`).
  - Body copy uses relaxed leading for readability.

## Color tokens

Defined in `app/globals.css`:

- `--background`: base canvas.
- `--foreground`: default text.
- `--surface`, `--surface-2`: layered card tones.
- `--muted`: secondary text.
- `--accent`: primary amber action color.

## Layout and spacing

- Max content width: `max-w-6xl` on public page container.
- Rhythm: major section spacing around `space-y-14`.
- Card spacing: `p-6` by default, with larger treatment in hero card.

## Motion primitives

Reusable components in `components/motion/`:

- `FadeInUp`: vertical reveal for text blocks and section intros.
- `StaggerContainer` + `StaggerItem`: sequential card entrance.
- `ScaleIn`: subtle scale entrance for emphasis cards.
- `SlideIn`: lateral reveal for timeline columns.
- `RevealOnScroll`: blur-to-sharp reveal for featured sections.

All primitives use `useReducedMotion()` to respect user accessibility preferences.

## Accessibility notes

- External links are sanitized to `http/https` only.
- Invalid external URLs are rendered as non-clickable text (no `#` fallback).
- Contrast prioritizes readable body text against dark surfaces.
- Motion effects degrade to minimal movement under reduced motion.

## Component conventions

- `SectionHeading`: shared eyebrow/title/description block.
- `SurfaceCard`: shared visual shell for all card blocks.
- Public sections live in `components/public/sections/`.
- Admin tooling lives in `components/admin/`.

## CMS consistency

- Singleton tables are read with deterministic ordering:
  - `created_at ASC`
  - `id ASC`
  - `limit 1`
- Ordered collections use:
  - `position ASC`
  - `created_at ASC`
  - `id ASC`
