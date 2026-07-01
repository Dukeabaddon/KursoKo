# Loop 1 — Foundation Plan

**Goal:** Fix broken report UX, clean dead paths, add archetype layer, test + CI.  
**Rule:** Do not rebuild assessment engine.

## Tasks

| # | Task | Verify |
|---|------|--------|
| 1 | Add `archetypes.js` — RIASEC → archetype name, copy, card label | Unit smoke via node import |
| 2 | Fix `App.jsx` — remove fake scoring; pass responses only | Lint clean on file |
| 3 | Fix `Results.jsx` — real copy, archetype, share stub, stable card | Playwright results test |
| 4 | Fix `CharacterCard` — responsive, one image/code, dynamic import | Build smaller chunk |
| 5 | Wire `accessibilityController` in `main.jsx` | App loads |
| 6 | Playwright — landing, assessment start, results mock path | `npx playwright test` |
| 7 | GitLab CI — install, lint, build, test | Pipeline file valid |
| 8 | `QUALITY_REPORT.md` — re-score categories | File exists |

## Agents / skills used

- `.agents/workflows/enhance.md` — iterative change, test after
- `.agents/skills/verify-changes` — build + Playwright evidence
- `.agents/skills/plan-writing` — short plan, verify last
- `.agents/agent/frontend-specialist` — UI fixes, no template spam

## Out of scope (Loop 2+)

- `scholarships.json` verified data
- Full report accordions + career %
- Design token / editorial pass
