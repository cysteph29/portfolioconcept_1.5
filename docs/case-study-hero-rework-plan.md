# Case Study Hero Rework Plan

## Goal
Make the case-study hero feel immersive and intentional while reducing hero overgrowth through controlled media sizing.

## Current Issues
- Hero takes too much vertical space and pushes core content below the fold.
- Navbar is still shown on case-study routes, but design direction is to remove it there.
- Hero behavior and media sizing are coupled in ways that are hard to tune predictably.

## Target Experience
- No top site navbar on case-study pages.
- Hero extends from left gutter to right gutter (not capped to body content width).
- Hero content block (title + timeline/role) remains constrained for readability.
- Hero media acts like a stage (solid area, centered prototype content, side breathing room).
- A close button appears in hero and routes back to homepage.

## Implementation Plan

### 1) Route-Specific Navbar Behavior
- Add a route-group layout for case-study pages so navbar can be excluded there without affecting home/work index.
- Keep existing global layout for non-case-study routes.

Files:
- `app/layout.tsx` (minimal shared root)
- `app/(site)/layout.tsx` (contains `SiteNavbar`)
- `app/work/[slug]/page.tsx` moved into a no-navbar group (or equivalent route-group structure)

### 2) Hero Structure Cleanup
- Keep hero as a separate block above body shell.
- Ensure shell (`article.case-study-shell`) remains the narrower reading column.
- Add explicit hero sub-structure:
  - `case-study-hero-media` (wide stage)
  - `case-study-hero-content` (capped text/meta block)
  - `case-study-hero-close` (top-right close control)

File:
- `src/components/case-study/CaseStudyLayout.tsx`

### 3) Stable Width Rules
- Hero outer width: edge-to-gutter (`100% - 2 * page gutter`).
- Hero content width cap: `--measure-work-card` (1120).
- Keep body shell cap unchanged for narrative readability.

File:
- `app/globals.css`

### 4) Predictable Height Budget (Desktop/Tablet)
- Replace intrinsic image growth with stage sizing rules.
- Use image-height capping as the primary control:
  - media stage height capped via `clamp(...)`
  - keep hero block sizing natural unless additional tuning is needed
  - optionally reduce title/meta spacing only if the hero still feels too tall
- Keep mobile behavior less strict (allow natural stacking).

File:
- `app/globals.css`

### 5) Close Button + Interaction
- Add close button in top-right of hero.
- Route to `/` using `Link`.
- Match visual reference (compact circular button, subtle contrast).

File:
- `src/components/case-study/CaseStudyLayout.tsx`

### 6) Verify and Tune
- Validate in browser at common breakpoints:
  - Desktop (1440, 1280)
  - Tablet (~1024, ~834)
  - Mobile (~390)
- Confirm:
  - hero no longer dominates vertical space on first load
  - hero remains edge-to-gutter
  - text/meta stays readable and aligned
  - close button navigation works

## Acceptance Criteria
- Navbar is hidden on case-study pages and unchanged elsewhere.
- Hero spans gutter-to-gutter, not limited by body shell width.
- Hero title/meta content remains capped at 1120px.
- Hero media height is capped responsively and no longer drives excessive page height.
- No React key warnings or layout regressions.

## Notes
- Keep current type/color specs unless explicitly changed.
- Do not change case-study copy in this pass.
