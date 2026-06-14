# KursoKo — Project Audit

**Date:** 2026-06-13  
**Auditor role:** Autonomous product improvement team (audit phase only — no implementation)  
**Repo commit:** `acbab34` (feat: Heroicons + homepage exports)  
**Method:** Graphify dependency map, Gate-MCP compressed reads, build/lint verification, PRD cross-check, [SCOPE reference](https://scope.sti.edu/) study

---

## Executive Summary

KursoKo is a **working RIASEC career assessment** built with React 19 + Vite 7 + Tailwind 4. The core loop — **Home → 30 questions → scored results → course recommendations** — functions end-to-end.

The **~80% complete** claim is **accurate for the assessment engine**. It is **not accurate for the product vision** described in the mission brief (scholarships, archetype system, share cards, editorial redesign, Playwright tests, deployment pipeline).

| Layer | Status |
|-------|--------|
| Assessment engine | ✅ Complete |
| Question flow | ✅ Complete |
| Scoring + course matching | ✅ Complete |
| Results / report experience | ⚠️ Partial (layout started, content placeholder) |
| Character / archetype system | ⚠️ Partial (3D card exists, wrong model) |
| Scholarship system | ❌ Not implemented |
| Social sharing | ❌ Not implemented |
| Modern editorial design | ⚠️ Homepage improved; results/brand direction not applied |
| Tests + CI + deploy | ❌ Missing |

**Overall product readiness vs mission:** **6.2 / 10**

**Recommendation:** Do **not** rebuild. Preserve `riasecScoring.js`, `Questionnaire.jsx`, `questions.json`, and `courses.json` logic. Focus next loops on report completion, verified scholarship dataset, archetype migration, and design system — in that priority order per mission.

---

## Scorecard

| Category | Score | One-line verdict |
|----------|------:|------------------|
| Architecture Review | **6.5** | Solid SPA shell; dead code and split styling hurt maintainability |
| UI Review | **6.0** | Homepage is cleaner; results still generic with Lorem Ipsum |
| UX Review | **7.0** | Assessment UX is strong; post-assessment journey is thin |
| Accessibility Review | **6.5** | Good patterns exist but many are not wired into the app |
| Mobile Review | **6.0** | Responsive CSS yes; 400px card + heavy PNGs hurt phones |
| Design Review | **5.5** | Not yet Persona/editorial; still SaaS-template signals |
| Performance Review | **5.5** | ~5MB image payload dominates; JS bundle acceptable |
| Technical Debt Review | **5.0** | Unused subsystems, lint errors, stale TODOs, npm audit issues |
| Deployment Review | **4.0** | Builds locally; no CI, hosting, or release workflow |
| Scholarship System Review | **2.0** | Stub data only; not surfaced; unverified |
| Assessment System Review | **8.5** | Core RIASEC pipeline is complete and trustworthy |
| Report System Review | **5.0** | Two-column shell exists; missing mission-spec sections |

---

## 1. Architecture Review — 6.5 / 10

### What works

- **Simple page-state router** in `App.jsx`: `home | questionnaire | results`
- **Clear data layer:** `questions.json`, `courses.json`, scoring in `utils/`
- **Security-minded session layer:** `sessionManager.js`, `validation.js` (rate limit, sanitize)
- **Error boundary + loading states** integrated in main flow
- **Barrel exports** via `src/components/index.js`

### Findings

| Issue | Severity | Detail |
|-------|----------|--------|
| Dead calculation path | High | `App.jsx` lines 106–114 contain a **TODO** with fake `calculatedResults`. `Results.jsx` ignores the `results` prop and recalculates via `getPersonalityProfile(responses)` — confusing dual paths |
| Unused subsystems | High | `GamificationSystem`, `FeedbackSystem`, `PageTransition`, `accessibilityController`, `filipinoContent` — **exported or built but not mounted** in `App.jsx` |
| Styling split | Medium | Tailwind (most UI) + **styled-components** (`CharacterCard`) — two styling systems, larger bundle |
| Folder structure | Medium | Mission asks for `features/` layout; current structure is **component-centric**, not feature-based |
| Prop drift | Low | `Results` receives unused `results` prop; `questionnaireProgress` in App is never read (lint error) |
| Test hook in prod path | Low | Graphify shows `testPersonalityProfile()` linked to scoring utils |

### Recommendations

1. Remove or wire the fake calculation block in `App.jsx` — single source of truth in `riasecScoring.js`
2. Delete or integrate unused systems (don't leave 500+ lines of ghost features)
3. Migrate `CharacterCard` to Tailwind + CSS variables (drop styled-components if possible)
4. Introduce `features/assessment`, `features/results`, `features/scholarships` incrementally — **move, don't rewrite**

---

## 2. UI Review — 6.0 / 10

### What works

- **Homepage sections** compose cleanly: Navbar, Hero, Why/How, Features, FAQ
- **Heroicons** integrated; trust points visible
- **Questionnaire** has progress, rating UI, Filipino-friendly error copy
- **Results** has intended **two-column grid** (`lg:grid-cols-2`)

### Findings

| Issue | Severity | Detail |
|-------|----------|--------|
| Lorem Ipsum on results | Critical | `Results.jsx` lines 63–71 — placeholder text where archetype story should live |
| Generic hero aesthetics | Medium | Blur orbs + gradient CTA (`HeroSection.jsx`) — mission explicitly warns against "floating blobs" and "generic SaaS" |
| Missing homepage sections | Medium | PRD/graph show `RIASECCarousel`, `FinalCTA`, `SampleQuestion` — **not in current `HomePage.jsx`** (trimmed scope) |
| Character gender UI | High | 12 gendered PNG assets + `Math.random()` gender — conflicts with mission (gender-neutral archetypes) |
| No share UI | High | Zero share button, card export, or OG image flow |
| Inconsistent visual language | Medium | Homepage = modern Tailwind; Results = gray boxes + green recommendation panel |

### Recommendations

1. Replace all placeholder copy with archetype-driven content (even stub archetypes first)
2. Apply **one design system** across home + results (typography scale, color tokens, motion)
3. Add neutral gray placeholders for missing art per asset rule
4. Remove random gender assignment — use single archetype portrait slot

---

## 3. UX Review — 7.0 / 10

### What works

- **Low friction start:** one CTA → questionnaire
- **30 forced-choice paired questions** with Likert-style ratings — appropriate for SHS/college audience
- **Progress feedback** during assessment
- **Retake + home** actions on results
- **Filipino error messaging** ("May problema") — culturally aligned
- **Session + rate limiting** prevents spam submissions

### Findings

| Issue | Severity | Detail |
|-------|----------|--------|
| Post-result dead end | High | No scholarships, roadmaps, program links, or "what next" journey |
| No progressive disclosure | High | Mission wants career accordions with why/skills/path — flat course cards only |
| Simulated loading | Low | 1.5s fake delay in `App.jsx` adds wait without value (Results already computes instantly) |
| SCOPE comparison gap | Medium | [SCOPE](https://scope.sti.edu/) offers Career Explorer articles, toolbox, testimonials — KursoKo has FAQ but **no content library** for undecided students |
| Gamification orphaned | Medium | Achievement hooks for "view scholarships" exist in code but user never sees them |

### SCOPE reference (study only — do not copy)

| SCOPE strength | KursoKo opportunity |
|----------------|---------------------|
| Trusted institutional brand | KursoKo can win on **personality + collectible results** |
| Large career content library | Add lightweight "explore careers" hub later |
| Worksheet PDF output | Add downloadable / shareable report |
| Clear "< 15 min" promise | Already matched ("10 minutes" on hero) |
| Weakness: dated ASP UI | KursoKo can look modern **if** design direction is enforced |
| Weakness: Holland-only framing | Archetype layer is differentiation |

### Recommendations

1. Map post-assessment UX: Card → Top careers (accordion) → Scholarships → Roadmap
2. Remove fake calculation delay or replace with meaningful animation
3. Add "Save / Share result" before user leaves results page

---

## 4. Accessibility Review — 6.5 / 10

### What works

- Skip link on homepage
- ARIA roles on `App` shell (`role="application"`, `aria-live`)
- Focus-visible styles on hero CTA
- `accessibilityUtils.js` implements: high contrast, reduced motion, screen reader announce, focus trap, contrast checker
- Questionnaire buttons appear keyboard-operable

### Findings

| Issue | Severity | Detail |
|-------|----------|--------|
| AccessibilityController not mounted | High | Full a11y system built but **never initialized** in app |
| Character card fixed 400×560px | Medium | Too large for small screens; may cause horizontal scroll |
| Color-only dimension coding | Medium | RIASEC bars rely on color; need icons/patterns for colorblind users |
| `Math.random()` gender | Medium | Card image changes on re-render — confusing for assistive tech + cognitive load |
| CSS warnings in build | Low | Tailwind v4 warns on escaped hover classes in screen-reader mode |
| Lint: `process` undefined in ErrorBoundary | Low | Dev-only branch may break strict env |

### Recommendations

1. Wire `accessibilityController` at app root OR delete unused code
2. Add text labels alongside color for all RIASEC visualizations
3. Make character card responsive (`max-width: 100%`, aspect-ratio)
4. Target **WCAG AA** on results page first (mission requirement)

---

## 5. Mobile Review — 6.0 / 10

### What works

- Tailwind responsive breakpoints used on homepage
- `safe-area-padding`, `mobile-spacing` utility classes
- Questionnaire layout stacks on small screens
- Results grid collapses to single column below `lg`

### Findings

| Issue | Severity | Detail |
|-------|----------|--------|
| Character card not mobile-first | High | Fixed 400px width in styled-components |
| Image weight | High | Production build ships **~4.5MB** of character PNGs — slow on 3G/4G |
| Touch targets | Medium | Generally OK on questionnaire; card tilt may fight scroll on touch |
| No mobile share sheet | High | Mission requires Instagram-worthy share — missing entirely |
| No PWA / offline | Low | Acceptable for v1 but worth noting for school lab use |

### Recommendations

1. Lazy-load character assets; WebP with PNG fallback
2. Responsive card with touch-safe tilt (or disable tilt on coarse pointer)
3. Test on 360px width devices before next design pass

---

## 6. Design Review — 5.5 / 10

### Target vs current

| Mission target | Current state |
|----------------|---------------|
| Persona 5 + editorial + premium | Partially modern homepage; results feel like admin dashboard |
| Cinematic transitions | `PageTransition` exists but unused |
| Purposeful motion | Some CSS transitions; no orchestrated page motion |
| Collectible tarot/card feel | Holographic card **exists** — best asset in project — but tied to RIASEC+gender not archetypes |
| Avoid AI-generated look | Human PNG characters are good direction; Lorem Ipsum destroys credibility |
| Avoid glassmorphism spam | Hero has blur orbs — mild violation |

### Findings

- **Strongest design asset:** `CharacterCard.jsx` — 3D tilt, foil layers, mask overlays
- **Weakest screen:** Results description block (placeholder text)
- **Typography:** System fonts / Tailwind defaults — no editorial display font yet
- **Brand identity:** KursoKo name present; no cohesive archetype visual language

### Recommendations

1. Define design tokens: 1 display font, 1 body font, 3 accent colors, motion durations
2. Re-skin results to match card quality — card is the hero, page supports it
3. Rename archetypes (Pathfinder, Builder, etc.) and map from RIASEC internally — **don't expose Holland codes to students**

---

## 7. Performance Review — 5.5 / 10

### Build metrics (2026-06-13)

| Asset | Size |
|-------|------|
| JS bundle | 294 KB (92 KB gzip) — acceptable |
| CSS | 81 KB (15 KB gzip) |
| Character PNGs | ~4.5 MB total — **problem** |
| Build time | ~19s |

### Findings

| Issue | Severity | Detail |
|-------|----------|--------|
| Eager image imports | High | All 12 character PNGs imported in `CharacterCard` — all shipped regardless of result |
| styled-components runtime | Medium | Extra JS cost vs pure CSS |
| Unused components in graph | Medium | Dead code still parsed by bundler if imported anywhere |
| npm audit | Medium | 12 vulnerabilities (6 high) after install |
| No code splitting | Low | Single chunk for entire app — OK at current size |

### Recommendations

1. Dynamic import character image by archetype code only
2. Run `npm audit fix` and review remaining highs
3. Add Lighthouse budget: LCP < 2.5s on 4G

---

## 8. Technical Debt Review — 5.0 / 10

### Inventory

| Debt item | Location | Impact |
|-----------|----------|--------|
| Stale TODO + fake results | `App.jsx:106` | Misleading for future devs |
| Unused components | Gamification, Feedback, PageTransition, LoadingStates, IllustrationCard | Maintenance burden |
| `filipinoContent.js` unused | Entire file | Scholarship/university data orphaned |
| Typo in asset filename | `social-somale.png` | Professionalism |
| ESLint errors | 10+ across codebase | CI would fail |
| Dual tailwind configs | `tailwind.config.js` + `tailwind.config.cjs` | Confusion |
| `documentaion/` typo in gitignore | `.gitignore` | Wrong folder name ignored |
| PRD dated 2024 | `docs/prd.md` | Goals documented but not tracked to implementation |

### Recommendations

1. **Debt sprint 1:** Remove dead code OR wire it — no middle ground
2. Add ESLint to pre-commit
3. Align PRD with implementation checklist in GitHub/GitLab issues

---

## 9. Deployment Review — 4.0 / 10

### Findings

| Item | Status |
|------|--------|
| `npm run build` | ✅ Passes after `npm install` |
| `npm run preview` | Available (not verified in audit) |
| CI/CD (GitHub Actions / GitLab CI) | ❌ None |
| Hosting config (Vercel/Netlify/Cloudflare) | ❌ None |
| Environment variables | ❌ None needed today (static app) |
| Domain / HTTPS | Unknown |
| `graphify-out/` in repo | Not committed (local only) |
| README deploy section | Basic dev instructions only |

### Recommendations

1. Add GitLab CI: install → lint → build → Playwright (once tests exist)
2. Deploy preview on MR via static host
3. Document Node 20+ requirement (Vite 7)

---

## 10. Scholarship System Review — 2.0 / 10

### Current state

| Expected (mission) | Actual |
|--------------------|--------|
| `scholarships.json` with verified fields | ❌ File does not exist |
| CHED / DOST / LGU / private / university coverage | ❌ Not implemented |
| Matching by career + interests | ❌ No matching logic |
| UI on report page | ❌ No UI |
| Verification dates | ❌ N/A |

### Partial data found

`src/data/filipinoContent.js` → `PHILIPPINE_EDUCATION.scholarships` contains **4 entries** (DOST, CHED, SM, Jollibee) with minimal fields and **no verification date, eligibility depth, or application links**. This data is **not imported anywhere** in the live app.

### Critical compliance note

Mission states: **"No AI-generated scholarship information. Everything must be verified."**  
Current stub data must be treated as **untrusted** until manually verified against official sources.

### Recommendations (planning only)

1. Create `scholarships.json` schema per mission spec
2. Research workflow: official site → human verification → JSON entry with `verificationDate`
3. Build `scholarshipMatcher.js` — match on RIASEC/career tags, not random display
4. **Stop condition:** Scholarship content requires human verification pass — flag for approval before publish

---

## 11. Assessment System Review — 8.5 / 10

### What works (preserve — do not rebuild)

| Component | Status |
|-----------|--------|
| `questions.json` | 30 paired questions, RIASEC-coded options |
| `Questionnaire.jsx` | Load, progress, rating, navigation, completion |
| `riasecScoring.js` | Score aggregation, top-2 dimensions, combination code |
| `courseRecommendations.js` | Combination lookup + reverse fallback |
| `courses.json` | 15 combination profiles with course lists + match strength |
| `validation.js` | Response sanitization |
| `sessionManager.js` | Session lifecycle + rate limit |

### Minor issues

- `hasOwnProperty` lint warning in scoring
- Course recommendations show **program areas**, not individual careers with % match (mission wants "Software Engineer — 98%")
- Match strength is categorical (Excellent/Good), not numeric percentage

### Recommendations

1. Keep scoring algorithm untouched
2. Add **career-level mapping layer** on top of existing course data (new JSON, not scoring rewrite)
3. Map archetype codes from primary dimension — presentation change only

---

## 12. Report System Review — 5.0 / 10

### Mission spec vs implementation

| Spec section | Status |
|--------------|--------|
| Desktop two-column layout | ✅ Implemented |
| Left: character card + archetype + share | ⚠️ Card yes; archetype partial; **no share** |
| Right: top career matches with % | ❌ Shows course areas, not careers, no % |
| Expandable career accordions | ❌ |
| Below fold: strengths, weaknesses, learning style | ⚠️ Partial (traits in dimension cards only) |
| Scholarships section | ❌ |
| Recommended programs | ⚠️ Basic course cards |
| Roadmap | ❌ |
| Social share card | ❌ |

### Bugs

- `Math.random()` for gender re-roll on every render
- Lorem Ipsum body copy
- `getRiasecLabel` gives MBTI-adjacent nicknames ("The Doer") — mission wants unique archetypes (Pathfinder, Builder, etc.)

### Recommendations

1. Implement report as **composable sections** (`ReportHero`, `CareerMatches`, `ScholarshipPanel`, etc.)
2. Add share card generation (canvas or CSS export) in dedicated loop
3. Fix gender randomization immediately when execution phase starts

---

## Gap Analysis: Mission vs Reality

```
WORKING (keep)          PARTIAL (improve)           MISSING (build)
─────────────────────────────────────────────────────────────────────
30-question flow        Character 3D card           scholarships.json
RIASEC scoring          Two-column results          career % matching
Course matching         Homepage redesign           share cards
Session security        Filipino content (unused)   Playwright tests
Error handling          Archetype naming            CI/deploy
                        Editorial design system     content library
```

---

## Priority Roadmap (Plan Phase — Not Executed)

### Loop 1 — Foundation (no visual rebuild)
- [ ] Remove dead code paths in `App.jsx`
- [ ] Fix Results placeholders + gender bug
- [ ] Wire or delete orphaned subsystems
- [ ] Add Playwright + smoke tests
- [ ] Add GitLab CI build

### Loop 2 — Report experience
- [ ] Archetype mapping layer (RIASEC internal, archetype external)
- [ ] Career accordion with match reasons
- [ ] Share card MVP (static HTML/CSS export)
- [ ] Responsive character card

### Loop 3 — Scholarships (human-gated)
- [ ] Define schema + empty verified dataset
- [ ] **Human verification sprint** (CHED, DOST, SM, LGU samples)
- [ ] Matcher + results panel
- [ ] **Stop for approval** before public claims

### Loop 4 — Design polish
- [ ] Design tokens + editorial typography
- [ ] Reduce template signals on hero
- [ ] Motion system (minimal Framer/Motion or CSS only)
- [ ] Landing page modernization per Persona/editorial brief

### Loop 5 — Quality gate
- [ ] Generate `QUALITY_REPORT.md`
- [ ] Re-score all categories
- [ ] Target 9.5+ or escalate decisions

---

## Stop Conditions — Decisions Needed From Human

| Decision | Why blocked |
|----------|-------------|
| **Archetype name final list** | Mission gives examples but not final 6–8 names + RIASEC mapping |
| **Scholarship verification owner** | Cannot publish scholarship data without human source verification |
| **Gender-neutral art direction** | Current assets are gendered; need placeholder strategy or new art |
| **Deployment target** | GitLab host? Vercel? School server? |
| **SCOPE differentiation** | How aggressively to add content library vs stay assessment-focused |

---

## Audit Conclusion

KursoKo has a **solid assessment core** worth protecting. The gap to the mission is mostly **product completion and design cohesion**, not engineering restart.

**Do not rebuild working systems.**  
**Do not invent scholarship data.**  
**Do start with report + archetype + verified scholarships.**

Next artifact per loop philosophy: **`IMPLEMENTATION_PLAN.md`** (Loop 1 plan) → then execution.

---

*Generated by audit phase. No source code was modified during this audit.*
