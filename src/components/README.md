# Components map (KursoKo)

Vite + React SPA — grouped by **shared**, **public**, and **feature** folders. Each folder has `index.js`; feature folders with custom CSS have co-located `index.css`.

## Layout

```
src/components/
├── index.js              # App barrel (pages + chrome)
├── shared/               # Cross-feature primitives
│   ├── index.js
│   ├── ui/               # ClickSpark, SpotlightCursor
│   ├── assessment/       # Quiz shell (Questionnaire)
│   ├── ErrorBoundary/
│   ├── ErrorState/
│   └── LoadingSpinner/
├── public/               # Site chrome (public routes)
│   ├── index.js
│   ├── Navbar/
│   ├── brand/            # KursoKoLogo
│   └── SkipLinks/
├── landing/              # Marketing homepage
│   ├── index.js
│   ├── index.css         # + tokens, effects, animations, sections (global)
│   ├── hero/, stats/, riasec/, how-it-works/, features/, faq/
├── questionnaire/        # RIASEC quiz flow
│   ├── index.js
│   └── index.css
└── results/              # Report / summary
    ├── index.js
    └── index.css
```

## App entry

| Import from | Used by |
|-------------|---------|
| `components/index.js` | `App.jsx` |

## Feature: `landing/`

See [`landing/README.md`](landing/README.md) — **one folder per section** (`hero/`, `stats/`, `riasec/`, `how-it-works/`, `features/`, `faq/`).

Global at landing root: `landingClasses.js`, `LandingBlobs.jsx`, `index.css` + `tokens.css`, `effects.css`, `animations.css`, `sections.css`.

## Feature: `questionnaire/`

| File | Role |
|------|------|
| `Questionnaire.jsx` | Main flow |
| `questionnaireAssets.js` | Choice PNG glob loader |

Uses `shared/assessment/` for shell + choice cards.

## Feature: `results/`

| File | Role |
|------|------|
| `Results.jsx` | Page composer |
| `ResultHero.jsx`, `RiasecBreakdown.jsx`, sections… | Sections |
| `ShareCard.jsx` | Hidden export card |

## Shared vs public

| Group | Role |
|-------|------|
| `shared/` | UI primitives, quiz shell, error/loading states |
| `public/` | Navbar, logo, skip links — visible site chrome |

## Assets

| Path | Contents |
|------|----------|
| `src/assets/landing/` | Hero + marketing placeholders |
| `src/assets/questionnaire/` | Quiz choice PNGs `NN.M.png` |

## Cleanup

Run [Knip](https://github.com/webpro-nl/knip): `npm run knip`
