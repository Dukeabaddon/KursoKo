# Landing (`src/components/landing/`)

Homepage feature — **one folder per section**. Each section is a single
`index.jsx` (data + component; comment at top lists exports). Tailwind is
primary for layout/spacing/typography/colors/radius/transitions; a sibling
`index.css` holds only genuine CSS (animations, clip-paths, pseudo-element
decoration, color-mix). Global tokens/utilities stay at landing root.

## Layout

```
landing/
├── HomePage.jsx              # Page composer
├── index.js                  # Feature barrel
├── landingClasses.js         # Shared Tailwind presets (Navbar imports too)
├── index.css                 # CSS entry (imports the roots below)
├── tokens.css                # Global design tokens
├── effects.css               # Hero/nav CTA, skip links, spotlight
├── animations.css            # Keyframes
├── sections.css              # Shared page body + primary CTA button
├── decors/                   # RIASEC edge-cloud parallax decor
├── motion/                   # Lenis, Reveal, scroll hooks
├── hero/
│   ├── index.jsx            # Section + decor helpers + banner path
│   └── index.css            # Banner stage, clip-path, glow
├── stats/
│   └── index.jsx            # Full Tailwind (no CSS file)
├── riasec/
│   ├── index.jsx
│   └── index.css            # Cloud parallax + color-mix code badge
├── how-it-works/
│   ├── index.jsx
│   └── index.css            # Step-card entrance + hover motion
├── features/
│   └── index.jsx            # Full Tailwind (no CSS file)
└── faq/
    ├── index.jsx
    └── index.css            # Accordion height + toggle-icon morph
```

## Section map

| Folder | DOM id | Role | Section CSS |
|--------|--------|------|-------------|
| `hero/` | `#hero` | Fold hero + character | `index.css` (clip-path, glow) |
| `stats/` | `#stats` | Quick facts bar | — (Tailwind only) |
| `riasec/` | `#riasec` | RIASEC intro grid + clouds | `index.css` (clouds, badge) |
| `how-it-works/` | `#how` | 3-step flow | `index.css` (card motion) |
| `features/` | — | Feature cards | — (Tailwind only) |
| `faq/` | `#faq` | Accordion FAQ | `index.css` (accordion) |

## Global (landing root — not `utils/`)

| File | Why here, not `utils/` |
|------|-------------------------|
| `landingClasses.js` | Tailwind class presets — UI concern; Navbar imports it |
| `tokens.css` | Global design tokens (colors, fonts, radii) |
| `effects.css` / `animations.css` | Shared CTA/keyframes across sections |
| `sections.css` | Shared page body + `.landing-btn-primary` only |

`src/utils/` = **logic** (scoring, validation, matchers). Not CSS or Tailwind presets.
