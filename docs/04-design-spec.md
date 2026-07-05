# KursoKo Design Specification

This document defines the design tokens, typography, spacing, and interaction patterns for the KursoKo homepage and related UI.

---

## Theme Tokens (Tailwind v4 CSS-first)

Define tokens in `src/index.css` using `@theme` and CSS custom properties.

```css
@theme {
  /* Pastels */
  --color-pastel-blue: #A8D8EA;
  --color-pastel-purple: #D4A5F3;
  --color-pastel-pink: #FFD3E1;
  --color-pastel-yellow: #FFF4A3;
  --color-pastel-green: #B8E6D5;
  --color-pastel-orange: #FFCBA4;

  /* Neutrals */
  --color-neutral-dark: #2D3748;
  --color-neutral-gray: #718096;
  --color-neutral-cream: #FFFEF9;

  /* Radii */
  --radius-card: 24px;
  --radius-button: 999px;
}

:root {
  --heading-font: "Poppins", system-ui, sans-serif;
  --body-font: "Inter", system-ui, sans-serif;
  --accent-font: "Fredoka One", cursive;
}
```

Usage with Tailwind utilities (examples):
- Background gradient: `bg-gradient-to-br from-[var(--color-pastel-blue)] to-[var(--color-pastel-pink)]`
- Text color: `text-[var(--color-neutral-dark)]`
- Rounded: `rounded-[var(--radius-card)]`

---

## Typography Scale

- Headings: Poppins (700–900)
- Body: Inter (400–600)
- Accent: Fredoka One (CTA-only)

Recommended clamp sizes (already present in `src/index.css`):
- h1: `text-5xl md:text-6xl`
- h2: `text-3xl`
- h3: `text-xl`
- body: `text-base`/`text-lg`

---

## Spacing & Grid

- 8px base grid; Tailwind spacing scale.
- Section gaps: `gap-24 sm:gap-28 md:gap-32` between homepage sections.
- Container widths: `max-w-6xl mx-auto` (content), `max-w-4xl` (sample).

---

## Components Token Mapping

ButtonPrimary
- Base: `px-6 py-3 rounded-full font-semibold`
- Colors: `bg-gradient-to-r from-[var(--color-accent-orange-300)] to-[var(--color-accent-pink-200)]`
- Focus: `focus:outline-none focus:ring-2 focus:ring-slate-400`
- Motion: `transition active:scale-95`

Card
- Base: `bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md`

RIASEC Card
- Base: `bg-white border rounded-xl p-4`
- Type bar: `bg-[var(--type-color)]` inline style
- Interaction: `focus:ring-2` + hover hints

---

## Interaction & Motion

- Easing: `ease-out` 150–200ms; GPU-accelerated transforms.
- Respect `prefers-reduced-motion` and provide UI toggle for motion reduction.
- Hover states lift cards slightly; buttons scale on active.

---

## Accessibility

- Landmarks: header/main/footer; skip link at top.
- Keyboard: Enter/Space for buttons; `tabIndex=0` on interactive cards.
- Color contrast: AA minimum; prefer dark text on pastel backgrounds.
- Announce loading via `aria-live` where relevant (outside of homepage core).

---

## Assets

- Illustrations: unDraw/Storyset/Humaaans (review license/attribution).
- Icons: Heroicons/Lucide/Phosphor via packages.
- Fonts: Google Fonts (OFL).

Folder plan:
- `public/assets/illustrations/` (hero, riasec, steps, final-cta)
- `public/assets/textures/` (optional noise overlays)

---

## Landing navbar (smart pill)

Three scroll modes via `useScrollNavbar` + `nav.css`:

| Mode | When | Look |
|------|------|------|
| **Rest** | `scrollY < 8px` | Full-width transparent bar |
| **Pill** | Scrolled | Floating capsule, compressed link gaps |
| **Hidden** | Scroll down 60px+ | Off-screen; returns on scroll up |

- Fixed at page level (outside hero fold).
- Links: Types, How it works, Why KursoKo, FAQ + Start Assessment CTA.
- Mobile: pill + hamburger menu dropdown.

---

## Landing footer (floating card)

- Inset margins: `1rem` / `1.5rem` / `2rem` (left, right, bottom).
- Card radius: `1.5rem` → `2rem` desktop; bg `--color-landing-accent-deep`.
- Three columns: tool mission, RIASEC note, privacy/local data.
- Giant wordmark layer + optional sticker slots (`src/assets/landing/footer/stickers/`).
- Component: `src/components/landing/footer/LandingFooter.jsx`.

---

## Privacy & Language Notes

- No commercial claims (no "free"/"no sign-up" wording). Keep neutral.
- Footer links to FAQ for privacy; see also `docs/06-security.md`.

---

Last updated: 2026-07-05
