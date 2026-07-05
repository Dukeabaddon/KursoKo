# Landing (`src/components/landing/`)

Homepage feature — **one folder per section**, using a **file-split pattern**:

- `PascalCase.jsx` — **markup only** (JSX + `.map()` over imported data). No data
  arrays, no helper functions, no hooks defined inline.
- `sectionName.data.js` — static data, asset imports, icon imports.
- `sectionName.hooks.js` — only when the section needs `useState` / `useRef` /
  `useCallback` etc. (exported as a custom hook).
- `sectionName.utils.js` — only for pure helper functions (e.g. hero decor styles).
- `SubComponent.jsx` — repeating / extracted markup (RiasecCard, FaqToggleIcon,
  HeroDecorItem).
- `index.js` — barrel: comment block lists the folder's files + `export { X } from './X.jsx'`.
- `index.css` — kept only where genuine CSS is needed (animations, clip-paths,
  color-mix). Tailwind stays primary. Global tokens/utilities live at landing root.

## Layout

```
landing/
├── HomePage.jsx              # Page composer
├── index.js                  # Feature barrel (imports section barrels)
├── landingClasses.js         # Shared Tailwind presets (Navbar imports too)
├── index.css                 # CSS entry (imports the roots below)
├── tokens.css                # Global design tokens
├── effects.css               # Hero/nav CTA, skip links, spotlight
├── animations.css            # Keyframes
├── sections.css              # Shared page body + primary CTA button
├── decors/                   # RIASEC edge-cloud parallax decor
├── motion/                   # Lenis, Reveal, scroll hooks
├── hero/
│   ├── HeroSection.jsx      # Section markup (imports index.css)
│   ├── HeroDecorItem.jsx    # Single floating decor prop (markup only)
│   ├── hero.data.js         # HERO_BANNER_PATH, HERO_DECOR, HERO_CHARACTER + asset
│   ├── hero.utils.js        # Pure decor style helpers
│   ├── hero.hooks.js        # useHeroSection + useHeroDecorItem
│   ├── index.js             # Barrel
│   └── index.css            # Banner stage, clip-path, glow
├── stats/
│   ├── StatsBar.jsx         # Section markup (full Tailwind)
│   ├── stats.data.js        # STATS + webp asset imports
│   └── index.js             # Barrel
├── riasec/
│   ├── RiasecIntro.jsx      # Section markup (imports index.css)
│   ├── RiasecCard.jsx       # Single interest tile (markup only)
│   ├── riasec.data.js       # RIASEC_STICKERS + webp asset imports
│   ├── riasec.hooks.js      # useRiasecDecor (section ref + reduced motion)
│   ├── index.js             # Barrel
│   └── index.css            # Cloud parallax + color-mix code badge
├── how-it-works/
│   ├── HowItWorks.jsx       # Section markup (imports index.css)
│   ├── howItWorks.data.js   # STEPS + webp asset imports
│   ├── index.js             # Barrel
│   └── index.css            # Step-card entrance + hover motion
├── features/
│   ├── FeaturesSection.jsx  # Section markup (full Tailwind)
│   ├── features.data.js     # FEATURES + heroicon imports
│   └── index.js             # Barrel
├── faq/
│   ├── FAQSection.jsx       # Section markup (imports index.css)
│   ├── FaqToggleIcon.jsx    # Plus/minus morph icon (markup only)
│   ├── faq.data.js          # FAQS + CTA_POINTS
│   ├── faq.hooks.js         # useFaqAccordion (expanded item + toggle)
│   ├── index.js             # Barrel
│   └── index.css            # Accordion height + toggle-icon morph
└── footer/
    ├── LandingFooter.jsx     # Footer markup (imports index.css)
    ├── footer.data.js        # FOOTER_STICKERS
    ├── footer.hooks.js       # useFooterScroll (Lenis smooth anchor scroll)
    ├── index.js              # Barrel
    └── index.css             # Footer card, wordmark, sticker positioning
```

## Section map

| Folder | DOM id | Role | Section CSS |
|--------|--------|------|-------------|
| `hero/` | `#hero` | Fold hero + character | `index.css` (clip-path, glow) |
| `stats/` | `#stats` | Quick facts bar | — (Tailwind only) |
| `riasec/` | `#riasec` | RIASEC intro grid + clouds | `index.css` (clouds, badge) |
| `how-it-works/` | `#how` | 3-step flow | `index.css` (card motion) |
| `features/` | `#features` | Feature cards | — (Tailwind only) |
| `faq/` | `#faq` | Accordion FAQ | `index.css` (accordion) |
| `footer/` | — | Footer card + wordmark | `index.css` (card, stickers) |

## Global (landing root — not `utils/`)

| File | Why here, not `utils/` |
|------|-------------------------|
| `landingClasses.js` | Tailwind class presets — UI concern; Navbar imports it |
| `tokens.css` | Global design tokens (colors, fonts, radii) |
| `effects.css` / `animations.css` | Shared CTA/keyframes across sections |
| `sections.css` | Shared page body + `.landing-btn-primary` only |

`src/utils/` = **logic** (scoring, validation, matchers). Not CSS or Tailwind presets.
