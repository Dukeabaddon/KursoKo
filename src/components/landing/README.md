# Landing (`src/components/landing/`)

Homepage feature — **one folder per section**, global CSS/utilities at landing root.

## Layout

```
landing/
├── HomePage.jsx              # Page composer
├── index.js                  # Feature barrel
├── landingClasses.js         # Shared Tailwind presets (Navbar imports too)
├── LandingBlobs.jsx          # Cross-section blob decor
├── index.css                 # CSS entry
├── tokens.css                # Global design tokens
├── effects.css               # Hero clip, CTA, glow
├── animations.css            # Keyframes
├── sections.css              # Below-hero section styles
├── hero/
│   ├── index.js
│   ├── HeroSection.jsx      ← clouds/stars: edit Tailwind on each <img>
│   └── heroBannerPath.js
├── stats/
│   ├── index.js
│   └── StatsBar.jsx
├── riasec/
│   ├── index.js
│   ├── RiasecIntro.jsx
│   ├── RiasecCard.jsx
│   └── riasecAssets.js
├── how-it-works/
│   ├── index.js
│   ├── HowItWorks.jsx
│   └── howItWorksAssets.js
├── features/
│   ├── index.js
│   └── FeaturesGrid.jsx
└── faq/
    ├── index.js
    ├── FAQSection.jsx
    └── FaqToggleIcon.jsx
```

## Section map

| Folder | DOM id | Role |
|--------|--------|------|
| `hero/` | `#hero` | Fold hero + character |
| `stats/` | `#stats` | Quick facts bar |
| `riasec/` | `#riasec` | RIASEC intro grid |
| `how-it-works/` | `#how` | 3-step flow |
| `features/` | — | Feature cards |
| `faq/` | `#faq` | Accordion FAQ |

## Global (landing root — not `utils/`)

| File | Why here, not `utils/` |
|------|-------------------------|
| `landingClasses.js` | Tailwind class presets — UI concern; Navbar imports it |
| `LandingBlobs.jsx` | Landing-only decor used by 4 sections |
| `*.css` | Feature styles (tokens, effects, animations, sections) |
| `hero/heroBannerPath.js` | SVG clip path — hero-only constant, lives with hero |
| `*/assets.js` | Section PNG maps — co-located with section |

`src/utils/` = **logic** (scoring, validation, matchers). Not CSS or Tailwind presets.
