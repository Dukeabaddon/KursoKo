# KursoKo — Career Assessment

React RIASEC assessment for SHS students: landing → questionnaire → personalized results.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run test:e2e # Playwright (starts dev server)
npm run knip     # unused files/deps check
```

## Stack

- React 19 + Vite 7
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Playwright e2e
- Client-side scoring — **no backend required** for MVP

## Project layout

```
.cursor/           # Cursor rules + gatemcp config
docs/              # Numbered documentation (start at 00-index.md)
public/            # Static assets
src/
  components/      # Feature folders (landing/, Home/, Results/, …)
  data/            # JSON (careers, scholarships, universities)
  styles/          # CSS by area (landing, assessment, results)
  utils/           # Scoring, validation, session
tests/e2e/         # Playwright specs
```

## Deploy

Single **static** deployment (Vercel, GitLab Pages, Netlify):

- Build: `npm run build`
- Output: `dist/`
- Optional serverless: add Vercel `api/` routes only when you need server-side logic

See [docs/02-architecture.md](./docs/02-architecture.md) and [docs/00-index.md](./docs/00-index.md).

## Docs

All project docs live in [`docs/`](./docs/) with numeric prefixes. Start with [docs/00-index.md](./docs/00-index.md).
