<div align="center">

<p>
  <img src="assets/kursoko-banner.png" alt="KursoKo" width="100%" />
</p>

### **Free RIASEC career guidance for Filipino SHS students.**

**KursoKo** — take a short Holland-code assessment, then get matched careers, schools, and scholarships. Client-side scoring. No account required for the MVP.

| Problem | With KursoKo |
|---------|--------------|
| Career advice feels generic | RIASEC primary-code matching blocks bad career fits |
| Endless school lists | Top careers → schools with program hints → scholarships |
| Backend / login friction | Static Vite app — works offline after load |
| Docs scattered | Numbered `docs/` + Playwright coverage |

</div>

<p align="center">
  <a href="https://kurso-ko.vercel.app"><img src="https://img.shields.io/badge/status-live-brightgreen?style=flat-square" alt="Status: live"></a>&nbsp;
  <img src="https://img.shields.io/badge/stack-React%2019%20%7C%20Vite%207%20%7C%20Tailwind%204-6E4FB8?style=flat-square" alt="Stack">&nbsp;
  <img src="https://img.shields.io/badge/backend-none%20(MVP)-lightgrey?style=flat-square" alt="No backend">&nbsp;
  <img src="https://img.shields.io/badge/repo-private-lightgrey?style=flat-square" alt="Private repo">
</p>

<p align="center">
  <a href="https://kurso-ko.vercel.app"><strong>Live demo</strong></a> ·
  <a href="#get-started">Get started</a> ·
  <a href="#catalog">Catalog</a> ·
  <a href="#matching">Matching</a> ·
  <a href="#privacy--security">Privacy</a> ·
  <a href="docs/00-index.md">Docs</a>
</p>

---

> **Private GitHub repo** · public demo at [kurso-ko.vercel.app](https://kurso-ko.vercel.app)

## Why KursoKo

- Built for **Filipino SHS** students exploring college and training paths
- **RIASEC** questionnaire → personalized results (careers, schools, scholarships)
- **No AI black box** for matching — deterministic Holland-code rules
- Shareable result cards (PNG export)

---

<a id="get-started"></a>

## Get started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run test:unit
npm run test:e2e # Playwright (starts dev server)
npm run knip     # unused files/deps check
```

Requires Node for Vite; Playwright browsers for e2e.

---

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + Vite 7 |
| Styles | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Motion | Framer Motion + Lenis |
| Tests | Vitest + Playwright |
| Analytics | Vercel Web Analytics (optional) |
| Data | Static JSON catalogs in `src/data/` |

---

<a id="catalog"></a>

## Catalog (NCR + nearby Luzon)

| Dataset | Count |
|--------|------:|
| Careers | 88 |
| Universities / campuses | 240 |
| Scholarships | 301 |

Includes SUC, private, LUC, TESDA, and military paths (PMA, PNPA, Coast Guard, enlisted).

---

<a id="matching"></a>

## Matching (no AI)

- RIASEC → careers: primary Holland code must be the career’s peak code (blocks Builder → Midwife-style mismatches)
- Results show top **10** careers, then schools (with suggested programs) and scholarships; each list has See all
- Specialty academies (PMA / PNPA / PCG) are allowlisted to related careers only
- School lists prefer program keyword hits; RIASEC campus fit is a fallback when catalogs lack keywords yet

---

## Project layout

```
docs/              # Numbered documentation (start at 00-index.md)
public/            # Static assets + logos
assets/            # README banner / brand exports
src/
  components/      # Feature folders (landing/, Results/, …)
  data/            # JSON (careers, scholarships, universities)
  styles/          # CSS by area
  utils/           # Scoring, validation, session
tests/e2e/         # Playwright specs
```

---

## Deploy

Single **static** deployment (Vercel / Netlify / GitLab Pages):

- Build: `npm run build`
- Output: `dist/`
- Optional: set `VITE_SITE_URL` for canonical SEO links

See [docs/02-architecture.md](./docs/02-architecture.md).

---

## Privacy & security

- MVP scoring runs **in the browser** — no account required
- Session / progress stored in **localStorage** only
- No API keys required for the core assessment
- Docs that mention `JWT_SECRET` are **future backend guidance**, not live credentials
- Production CSP headers configured in `vercel.json`

### Audit note (2026-07-26)

Scanned working tree + recent history for common secret patterns (`sk_live`, `ghp_`, private keys, Supabase service keys). **No live secrets found** in source. Placeholder env examples exist only under `docs/`.

---

## Status

| Surface | State |
|---------|--------|
| Demo | **Live** — https://kurso-ko.vercel.app |
| GitHub | **Private** |

---

## Docs

Start at [docs/00-index.md](./docs/00-index.md).

## Contributing

Repo is private. Open an issue with the maintainers if you need access.

---

<p align="center">
  <a href="https://kurso-ko.vercel.app">Live</a> ·
  <a href="https://github.com/Dukeabaddon/KursoKo">GitHub</a>
</p>
