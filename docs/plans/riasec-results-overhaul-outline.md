# KursoKo RIASEC + Results overhaul — execution outline

**Status:** Phase B complete — all 35 Drawbridge tasks **done** (2026-07-05).  
**Audience:** ~90% SHS (15–17), Philippines.  
**Sources:** `.moat/moat-tasks.md`, gatemcp, graphify-out, subagent audits.

---

## Tool map (repo)

| Tool | Finding |
|------|---------|
| **graphify-out** | `Results()` god node (11 edges); report stale (`a770fac` vs HEAD) — refresh after structural edits |
| **gatemcp** | `questions.json` compressed; matchers located via file paths below |
| **Drawbridge** | **35 / 35 done** — `.moat/moat-tasks-detail.json` (last: #33 overflow, #34 CTA hover, #35 step frame, #22 RIASEC panel) |

### Touch files (by workstream)

| Area | Files |
|------|-------|
| Questions | `src/data/questions.json` |
| Scoring | `src/utils/riasecScoring.js` (unchanged — copy only) |
| Scholarships | `src/utils/scholarshipMatcher.js`, `src/data/scholarships.json` |
| Schools | `src/utils/universityMatcher.js`, `src/data/universities.json`, **new** `src/data/schoolInsights.json` |
| Results UI | `src/components/results/Results.jsx`, `ProfessionAccordionSection.jsx`, `ResultHero.jsx`, `RiasecBreakdown.jsx` |
| Career copy | `src/utils/careerMatcher.js` (`CAREER_NARRATIVES`) |
| Staging data | `docs/plans/kursoko-data/scholarships.json`, `links.json` |

---

## Workstream A — Questionnaire copy (SHS)

**Owner roles:** Career counselor + psychometrician → UX writer → SHS teacher (readability) → youth UX research (5 students) → content designer (image alignment).

### Problem

Prior Q7/Q9/Q13/Q15 suggestions still too advanced (science fair, contests, master lists). Root cause: **assignment/chore/adult frames**, not teen **choice**.

### Copy framework: SCENE

```
[Simple verb] + [Concrete thing] + [Familiar place/moment]
```

- Write at **Grade 6–7** for Grade 9–10 users.
- Stems: neutral preference only — **no** “technical”, “business”, “professional”, “role”.
- Options: 4–8 words; matched length/coolness per pair.
- **Hints not shown in UI today** — `text` must stand alone; put RIASEC fidelity in internal `construct_note` (new author field, optional).

### Simplification ladder (Q7/Q9/Q13/Q15)

| Pair | Contrast | Level 1 target (not final copy) |
|------|----------|----------------------------------|
| Q7 R vs I | fix/do vs figure out why | flickering light vs why outlet stopped |
| Q9 E vs C | lead/sell vs keep correct/ordered | convince friends join booth vs who paid for snacks |
| Q13 R vs I | hands-on repair vs test/explore | fix bike chain vs test if online hack works |
| Q15 E vs C | run/sell vs track/record | run snack booth vs tally money correctly |

### Phases (no code until B2 approved)

| Phase | Action | Gate |
|-------|--------|------|
| A1 | Add `docs/plans/questionnaire-copy-rubric.md` from SCENE framework | — |
| A2 | Draft **4 pilot pairs** (Q7, Q9, Q13, Q15) at Level 1–2 | User approve |
| A3 | 5× SHS cognitive interviews (“what would you be doing?”) | Comprehension pass |
| A4 | Rewrite remaining 26 questions using rubric | User approve batch |
| A5 | Sync `docs/plans/asset-prompts/questionnaire/q*.json` + regen images | After copy lock |

**Explicitly out of scope until A2:** editing `src/data/questions.json`.

---

## Workstream B — Scholarships & schools (data + matcher)

**Owner roles:** Research analyst → data engineer → architect reviewer.

### Root causes (verified)

1. Runtime: **8 QCYDO** vs **1 PUP** scholarship.
2. `scholarshipMatcher.js` — no residency filter; `NCR` location = +1 for everyone.
3. `Results.jsx` fetches 2 schools, UI shows **1**; matcher supports 3.
4. `buildInsight()` — generic RIASEC template, not career×school facts.

### Phases

| Phase | Action | Files |
|-------|--------|-------|
| B1 | Add `residencyRule` schema; backfill QC rows | `scholarships.json` |
| B2 | `passesResidencyFilter()` in matcher; hide strict LGU until city known | `scholarshipMatcher.js` |
| B3 | Promote PUP: `pup-free-tuition`, `sch-uni-094` (normalize tags) | staging → runtime |
| B4 | Optional city capture (NCR LGUs) | new `LocationPrompt.jsx`, `sessionManager.js` |
| B5 | Top **3** schools in accordion; slanted rank colors per Moat #12 | `Results.jsx`, `ProfessionAccordionSection.jsx` |
| B6 | `schoolInsights.json` — career×school verified blurbs | new data + `universityMatcher.js` |

### PUP official programs (research)

OSFA: Entrance Scholarship, Student Assistantship, TES, government grants, private donors — [pup.edu.ph/students/scholarships](https://www.pup.edu.ph/students/scholarships).

---

## Workstream C — Results UI (Drawbridge / Moat)

**Owner roles:** UI designer + ui-ux-pro-max → performance engineer (motion).

### Moat backlog (19 tasks) — grouped

| Group | Tasks | Intent |
|-------|-------|--------|
| **Cognitive load** | #4, #5, #7, #8, #16–18, #20–22 | Remove disclaimers, icons, hero clutter, trait pill hovers |
| **Copy depth** | #6 | Expand “Why this path feels promising” per career (MBTI-style) — ties to `CAREER_NARRATIVES` |
| **Motion** | #9, #10, #11, #13, #14 | Progress bar 0→%, scroll reveal, accordion smooth open, framer-motion |
| **Top 3 visual** | #12 | Slanted `/` band: #1 purple, #2 green, #3 yellow (35% width) |
| **RIASEC panel** | #22 | ui-ux-pro-max pass on breakdown container |

### Implementation order

1. **Quick wins** — remove text/icons (#4, #5, #7, #8, #16–18, #20–21) — low risk  
2. **Copy** — career narratives (#6) — parallel with B6 insights  
3. **Schools UI** — top 3 + slanted bands (#12) — needs B5  
4. **Motion pass** — #9–11, #13–14 — test `prefers-reduced-motion`  
5. **RIASEC panel polish** — #22  

**Drawbridge protocol:** status `to do` → `doing` → `done` per task in `.moat/moat-tasks-detail.json`.

---

## Workstream D — Career narratives (“MBTI-style”)

**Owner roles:** Prompt engineer + career counselor.

- Expand `CAREER_NARRATIVES` in `careerMatcher.js` (Moat #6).
- Per career: 2–3 sentences, strengths-you-show, friendly second-person, no jargon.
- Pilot top **5 careers** from user traffic before all 20.

---

## Agent / subagent roster

| Step | VoltAgent role | Subagent task |
|------|----------------|---------------|
| Copy rubric | `05-data-ai/prompt-engineer.md` | SHS SCENE framework ✅ |
| Scholarship audit | `10-research-analysis/research-analyst.md` | Matcher + PUP promote list ✅ |
| School insights research | `10-research-analysis/research-analyst.md` | Per school×career facts (next) |
| UI Moat batch | `01-core-development/ui-designer.md` | Group C quick wins |
| Matcher impl | `04-quality-security/architect-reviewer.md` | Residency schema review |
| Motion | `04-quality-security/performance-engineer.md` | Lenis + framer budget |
| E2E after copy | `explore` / Playwright | Questionnaire still scores same codes |

---

## Recommended execution order

```
1. B1–B3  Scholarship filter + PUP data     (fixes wrong QC results)
2. C1     Moat cognitive-load removals      (fast UX win)
3. A1–A2  Copy rubric + 4-pair pilot        (user approves text)
4. B5–B6  Top 3 schools + insights          (Moat #12 + school why)
5. D      Career narratives                 (Moat #6)
6. C4     Motion polish                     (after layout stable)
7. A4–A5  Full question + asset sync        (last — expensive)
```

---

## Decisions needed (user)

| # | Question | Options |
|---|----------|---------|
| 1 | Copy pilot | Approve A1 rubric doc, then A2 four pairs |
| 2 | LGU scholarships | B2 filter first **or** remove QC from runtime until filter |
| 3 | City capture | B4 now **or** hide LGU rows until later |
| 4 | Moat mode | **step** (one batch approve) **or** **batch** quick wins |
| 5 | Top schools | Confirm top **3** with slanted colors (Moat #12) |

---

## Mentor flags

- Do **not** rewrite all 30 questions before pilot validates SCENE ladder.
- Do **not** add more LGU scholarships until B2 ships.
- Refresh `graphify update .` after Results structural changes.
