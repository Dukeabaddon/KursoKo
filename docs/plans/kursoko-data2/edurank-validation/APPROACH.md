# EduRank validation approach

## What EduRank provides
- **Not** degree catalogs (BS Nursing, etc.)
- **Research subject rankings** from publications/citations per institution
- Source: `https://edurank.org/geo/ph/` + `/uni/{slug}/` majors table

## Pipeline (3 passes)

### Pass 1 — Direct match
1. Load runtime `universities.json` (209 schools)
2. Map each school → EduRank slug (alias table + slugify name)
3. Fetch `/uni/{slug}/`, parse majors HTML table
4. Map top 12 subjects → `strengthTags` (matcher vocabulary)
5. Re-derive `riasecTags` via `university_riasec_derive.py`
6. Merge: EduRank tags **prepended**, existing official tags kept

### Pass 2 — Retry (parent + fuzzy)
1. **Parent inherit**: campus rows → parent EduRank slug (PUP*, FEU Tech→FEU, etc.)
2. **Fuzzy match**: `difflib` name match against EduRank PH top-100 index
3. Cache slug fetches (one HTTP call per unique slug)

### Pass 3 — Unmapped report
Schools still without subjects → categorized:
| Category | Meaning |
|----------|---------|
| `edurank_listed_no_publications` | Page exists, no majors table (low research output) |
| `not_on_edurank` | No EduRank listing (404 / not in PH index) |
| `campus_branch_unlisted` | Branch campus; parent may or may not exist on EduRank |
| `chain_campus_no_edurank` | STI/AMA/Access-style chains |
| `tvet_shs_no_edurank` | TVET/SHS out of scope |
| `policy_skip` | Manual skip (e.g. UP Clark) |

## Limits (mentor)
- ~229 PH HEIs on EduRank vs 209 runtime rows (many are campuses)
- Subject tags ≠ program accuracy — official `popularCourses` still primary for UI
- Auto-patch enriches matcher only; does not replace manual research files
