# KursoKo documentation index

Numbered docs — read in order for onboarding; skip to topic as needed.

| # | File | Purpose |
|---|------|---------|
| 01 | [01-prd.md](./01-prd.md) | Product requirements |
| 02 | [02-architecture.md](./02-architecture.md) | System design, deploy model |
| 03 | [03-dev-guide.md](./03-dev-guide.md) | Local dev setup |
| 04 | [04-design-spec.md](./04-design-spec.md) | UI design spec |
| 05 | [05-homepage-design-plan.md](./05-homepage-design-plan.md) | Landing page plan |
| 06 | [06-security.md](./06-security.md) | Security notes |
| 07 | [07-refactor-summary.md](./07-refactor-summary.md) | Refactor history |
| 08 | [08-design-system.md](./08-design-system.md) | Design tokens & patterns |
| 09 | [09-implementation-plan.md](./09-implementation-plan.md) | **Archive** — Loop 1 plan (historical) |
| 10 | [10-project-audit.md](./10-project-audit.md) | Audit snapshot |
| 11 | [11-quality-report.md](./11-quality-report.md) | Quality scores |
| 12 | [12-frontend-ui-rules.md](./12-frontend-ui-rules.md) | Frontend conventions |
| 13 | [13-backend-security-rules.md](./13-backend-security-rules.md) | Backend/security conventions |
| 14 | [14-plan-redo-organization.md](./14-plan-redo-organization.md) | Org redo notes |

## Doc types (where things live)

| Type | Folder | Example |
|------|--------|---------|
| **Stable reference** | `docs/01–14` | PRD, architecture, security |
| **Active plan (WIP)** | `docs/plans/` | `2026-07-ui-polish.md` |
| **Tasks / sprint** | `docs/tasks/TODO.md` | Checkboxes agent updates |
| **Live design system** | `design-system/kursoko/MASTER.md` | uipro generated (Jul 2026) |
| **Code tokens** | `src/styles/*/tokens.css` | Shipped CSS |
| **Spec-kit (optional)** | `specs/` | Only if you install [spec-kit](https://github.com/github/spec-kit) |

### Spec-kit vs numbered `docs/`

| | **Numbered `docs/`** | **[spec-kit](https://github.com/github/spec-kit)** |
|--|----------------------|-----------------------------------------------------|
| Best for | Onboarding, audits, design refs | New features with `/speckit.plan` → tasks |
| KursoKo today | ✅ Already using | ⏸ Optional — add when a big feature ships |
| Recommendation | Keep both; don't merge WIP into 01–14 |

## Deploy model (quick reference)

- **Today:** static **Vite SPA** — RIASEC scoring runs in the browser (`src/utils/`).
- **Serverless?** Not required. No `backend/` folder needed for current MVP.
- **Vercel:** one project, `npm run build`, output `dist/`. Add root `api/` only if you need serverless routes later.
- **GitLab CI:** lint, build, Playwright — see `.gitlab-ci.yml`.
