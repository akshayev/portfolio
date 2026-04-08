# 3D Portfolio Architecture

This project is a high-performance React portfolio built with Vite, React Three Fiber (R3F), and Tailwind CSS. It is designed to present an **Innovative Software Developer specializing in Agentic AI Systems** through a cinematic, procedural 3D experience backed by lightweight UI overlays and dynamic project data.

## Architecture Goals

- Keep the 3D scene procedural so the portfolio stays fast and mobile-friendly.
- Separate immersive canvas logic from UI overlays and application state.
- Make the project timeline and case studies data-driven so new work can be added without redesigning the app.
- Preserve ATS-friendly access with clear navigation and a prominent CV download action.

## `/src` Folder Structure

```text
src/
  canvas/
    Procedural R3F scene components, animated geometry, timeline stops, and camera-driven experience layers.
  components/
    Reusable UI overlays such as the contact form, floating CV button, loader, cards, and navigation controls.
  hooks/
    Shared React hooks for scroll tracking, scene events, SFX triggers, responsive behavior, and data syncing.
  store/
    Zustand state for global portfolio state, active timeline step, UI visibility, and scene interaction state.
  pages/
    Route-level screens for the main timeline, project case studies, and any future content pages.
```

## Responsibilities By Layer

### `canvas/`
Use this folder for procedural 3D implementation only. Components here should focus on geometry, shaders, camera movement, text in 3D space, and scroll-linked scene composition. Keep data lookup and presentation logic outside the canvas where possible.

### `components/`
Use this folder for non-3D interface elements that sit above the canvas. Typical examples include the contact form, floating CV button, modal cards, hero copy, and other overlays that must stay readable and accessible.

### `hooks/`
Use this folder for shared behavior that bridges the experience layers. Scroll tracking, sound effects, viewport checks, scene loading state, and event subscriptions belong here so the rest of the app stays clean.

### `store/`
Use Zustand here for global state that multiple layers need to read or update. Good candidates include the active timeline stop, selected project, loading state, UI panel visibility, and interaction state for the 3D scene.

### `pages/`
Use route-level pages here. The main timeline page should host the cinematic scroll experience, while project case study pages should present focused project details with the same visual system.

## Design Direction

The visual language should feel technical, polished, and cinematic: deep sunset-inspired backgrounds, coral accents, bold typography, and procedural 3D elements instead of heavy imported assets. The experience should communicate both creative execution and engineering depth, especially around agentic AI systems, data pipelines, and product thinking.

## Implementation Notes

- Prefer procedural geometry over large model files.
- Keep the scene responsive with mobile-oriented quality controls.
- Make the project timeline data-driven so new projects can be added from content storage rather than code changes.
- Keep the CV download action persistent and easy to reach.
- Treat the case study route as a focused storytelling surface for architecture, impact, and technical detail.
