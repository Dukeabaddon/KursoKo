# Phase C — Official program verification (production)

## Policy

- **Runtime `popularCourses` require `programSource: official_website`**
- Tag-derived / legacy lists are **stripped** by `scripts/enforce-production-courses.py`
- `scripts/backfill-popular-courses.py` is **disabled** (exit 1)
- Merge via `scripts/merge-official-site-enrichment.py` (Phase A + Phase C dirs)

## Staging layout

| Folder | Content |
|--------|---------|
| `official-site-enrichment/` | Phase A (21 schools) |
| `official-site-enrichment-phase-c/` | Phase C batches + C1 fixes |

## JSON contract

- `source_type`: must be `official_website`
- `sources[]`: at least one official URL
- `university.popularCourses`: 4–12 verified names
- Optional `"status": "blocked"` if site unreachable — **no invented fallback**

## Workflow

1. Research official program page(s)
2. Write `{id}.json` to phase-c staging
3. `python3 scripts/merge-official-site-enrichment.py`
4. Spot-check 2 schools per batch vs source URL

## QC rules

- SHS: academic strands only (no TVL unless official)
- Law: Juris Doctor / BS Legal Management — not "Bachelor of Laws"
- Campus-specific: Manila catalog ≠ Cavite catalog
- Polytechnic: prefer BSIS/BTVTED over invented engineering degrees
