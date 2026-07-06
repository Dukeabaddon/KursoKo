#!/usr/bin/env python3
"""Retry EduRank enrichment + categorized unmapped report."""
from __future__ import annotations

import importlib.util
import json
import re
import time
import unicodedata
import urllib.error
import urllib.request
from datetime import date
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys_path = ROOT / "scripts"
import sys

sys.path.insert(0, str(sys_path))
from university_riasec_derive import derive_riasec_tags

_spec = importlib.util.spec_from_file_location("edurank_enrich", ROOT / "scripts" / "edurank-enrich.py")
_edu = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_edu)

RUNTIME = ROOT / "src/data/universities.json"
PH_UPLOAD = Path(
    "/Users/macbookair/.cursor/projects/Users-macbookair-Documents-Visual-Studio-Code-React-KursoKo/uploads/ph-0.md"
)
OUT_DIR = ROOT / "docs/plans/kursoko-data2/edurank-validation"
REPORT = OUT_DIR / f"edurank-patch-report-{date.today()}.json"
UNMAPPED = OUT_DIR / f"edurank-unmapped-{date.today()}.json"
APPROACH = OUT_DIR / "APPROACH.md"

# Campus / brand → parent EduRank slug (inherit subject tags when page has no table)
PARENT_EDURANK: dict[str, str] = {
    "pup-paranaque": "polytechnic-university-of-the-philippines",
    "pup-quezon-city": "polytechnic-university-of-the-philippines",
    "pup-san-juan": "polytechnic-university-of-the-philippines",
    "pup-tagui": "polytechnic-university-of-the-philippines",
    "pups-taguig": "polytechnic-university-of-the-philippines",
    "tup-tagui": "technological-university-of-the-philippines",
    "ue-caloocan": "university-of-the-east",
    "dlsu-dasmarinas": "de-la-salle-university",
    "nu-moa": "national-university",
    "nu-santa-rosa": "national-university",
    "arellano-university-malabon": "arellano-university",
    "arellano-university-pasay": "arellano-university",
    "centro-escolar-university-makati": "centro-escolar-university",
    "lyceum-of-the-philippines-university-cavite": "lyceum-of-the-philippines-university",
    "lyceum-of-the-philippines-university-pampanga": "lyceum-of-the-philippines-university",
    "lyceum-batangas": "lyceum-of-the-philippines-university",
    "feu-institute-of-technology": "far-eastern-university",
    "rtu-pasig": "rizal-technological-university",
    "trinity-university-general-trias": "trinity-university-of-asia",
    "mapua-malayan-colleges-laguna": "mapua-university",
    "mcl": "mapua-university",
    "benilde": "de-la-salle-college-of-saint-benilde",
    "ama-computer-college": "ama-computer-university",
    "ama-computer-santa-rosa": "ama-computer-university",
}


def slugify(text: str) -> str:
    return _edu.slugify(text)


def norm_name(text: str) -> str:
    return _edu.norm_name(text)


def load_edurank_catalog() -> dict[str, str]:
    """slug -> display name"""
    catalog: dict[str, str] = {}
    if PH_UPLOAD.exists():
        for name in re.findall(r"^## \d+\. (.+?)\s*$", PH_UPLOAD.read_text(encoding="utf-8"), re.M):
            catalog[slugify(name)] = name
    try:
        req = urllib.request.Request("https://edurank.org/geo/ph/", headers={"User-Agent": "Mozilla/5.0"})
        html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", errors="replace")
        for slug, title in re.findall(r'/uni/([^"/]+)/"[^>]*>([^<]+)</a>', html):
            catalog[slug] = title.strip()
    except (urllib.error.URLError, TimeoutError):
        pass
    return catalog


def fuzzy_slug(name: str, catalog: dict[str, str], threshold: float = 0.82) -> str | None:
    nk = norm_name(name)
    best_slug = None
    best = 0.0
    for slug, ename in catalog.items():
        score = SequenceMatcher(None, nk, norm_name(ename)).ratio()
        if score > best:
            best = score
            best_slug = slug
    return best_slug if best >= threshold else None


def resolve_slug(uni: dict, catalog: dict[str, str]) -> tuple[str | None, str]:
    uid = uni["id"]
    if uid in _edu.SKIP_EDURANK_IDS:
        return None, "policy_skip"
    if uid in _edu.SLUG_ALIASES:
        alias = _edu.SLUG_ALIASES[uid]
        if alias is None:
            return None, "policy_skip"
        return alias, "alias"
    if uid in PARENT_EDURANK:
        return PARENT_EDURANK[uid], "parent_inherit"
    name = uni["name"]
    s = slugify(name)
    if s in catalog:
        return s, "exact_slug"
    short = slugify(name.split(" - ")[0].split(" – ")[0])
    if short in catalog:
        return short, "short_name"
    fuzzy = fuzzy_slug(name, catalog)
    if fuzzy:
        return fuzzy, "fuzzy_match"
    return s, "guessed_slug"


def classify_unmapped(uni: dict, reason: str, slug: str | None) -> str:
    n = uni["name"].lower()
    t = uni.get("type", "")
    if reason == "policy_skip":
        return "policy_skip"
    if t in ("tvet", "shs"):
        return "tvet_shs_no_edurank"
    if any(x in n for x in ("sti college", "aclc", "access computer", "i-tech", "tvet")):
        return "chain_campus_no_edurank"
    if " - " in uni["name"] or "campus" in n:
        return "campus_branch_unlisted"
    if reason == "no_subjects_table":
        return "edurank_listed_no_publications"
    if reason == "no_page":
        return "not_on_edurank"
    return "unknown"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    catalog = load_edurank_catalog()
    data = json.loads(RUNTIME.read_text(encoding="utf-8"))
    universities = {u["id"]: u for u in data["universities"]}

    slug_cache: dict[str, list[tuple[str, int, int]] | None] = {}
    enriched_ids: set[str] = set()
    report = {
        "generated": str(date.today()),
        "pass": "retry_with_parent_inherit_and_fuzzy",
        "patched": [],
        "inherited_from_parent": [],
        "retry_recovered": [],
        "skipped_no_page": [],
        "skipped_no_subjects": [],
    }

    for uni in data["universities"]:
        slug, method = resolve_slug(uni, catalog)
        if not slug:
            report["skipped_no_page"].append({"id": uni["id"], "name": uni["name"], "reason": method})
            continue

        if slug not in slug_cache:
            html = _edu.fetch_edurank_html(slug)
            time.sleep(_edu.REQUEST_DELAY_S)
            if not html or "404" in html[:800].lower() or "not found" in html[:800].lower():
                slug_cache[slug] = None
            else:
                parsed = _edu.parse_subjects(html)
                slug_cache[slug] = parsed  # [] = page exists, no majors table
        subjects = slug_cache.get(slug)

        if subjects is None:
            report["skipped_no_page"].append(
                {"id": uni["id"], "name": uni["name"], "slug": slug, "method": method}
            )
            continue
        if len(subjects) == 0:
            report["skipped_no_subjects"].append(
                {"id": uni["id"], "name": uni["name"], "slug": slug, "method": method}
            )
            continue

        edurank_strengths = _edu.subjects_to_strengths(subjects)
        before_strength = list(uni.get("strengthTags") or [])
        before_riasec = list(uni.get("riasecTags") or [])
        merged = _edu.merge_strengths(before_strength, edurank_strengths)
        uni["strengthTags"] = merged
        uni["riasecTags"] = derive_riasec_tags(uni)
        enriched_ids.add(uni["id"])

        if merged != before_strength or uni["riasecTags"] != before_riasec:
            entry = {
                "id": uni["id"],
                "edurank_slug": slug,
                "resolve_method": method,
                "subjects_found": len(subjects),
                "top_subjects": [s[0] for s in subjects[: _edu.TOP_SUBJECTS]],
            }
            report["patched"].append(entry)
            if method == "parent_inherit":
                report["inherited_from_parent"].append(entry)

    patched_ids = enriched_ids
    unmapped_rows = []
    for uni in data["universities"]:
        if uni["id"] in enriched_ids:
            continue
        slug, method = resolve_slug(uni, catalog)
        if slug and slug in slug_cache:
            if slug_cache[slug] is None:
                reason = "no_page"
            elif len(slug_cache[slug]) == 0:
                reason = "no_subjects_table"
            else:
                reason = "no_page"  # had data but this row missed — should not happen
        elif slug:
            reason = "no_page"
        else:
            reason = "no_page"
        category = classify_unmapped(uni, reason, slug)
        unmapped_rows.append(
            {
                "id": uni["id"],
                "name": uni["name"],
                "type": uni.get("type"),
                "region": uni.get("region"),
                "category": category,
                "attempted_slug": slug,
                "resolve_method": method,
                "recommendation": {
                    "policy_skip": "Keep manual strengthTags; no EduRank crosswalk",
                    "tvet_shs_no_edurank": "Out of EduRank scope; use official TESDA/DepEd sources",
                    "chain_campus_no_edurank": "Keep umbrella entry or inherit parent if added later",
                    "campus_branch_unlisted": "Inherit parent institution EduRank tags or skip",
                    "edurank_listed_no_publications": "EduRank page exists but no research majors table; keep official site tags",
                    "not_on_edurank": "Not in EduRank PH index; official site only",
                    "unknown": "Manual review",
                }.get(category, "Manual review"),
            }
        )

    data["metadata"]["edurankEnrichment"] = str(date.today())
    data["metadata"]["edurankRetry"] = str(date.today())
    RUNTIME.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    from collections import Counter

    cat_counts = Counter(r["category"] for r in unmapped_rows)
    report["summary"] = {
        "enriched_total": len(enriched_ids),
        "patched_changed_this_run": len(report["patched"]),
        "inherited_from_parent": len(report["inherited_from_parent"]),
        "unmapped_total": len(unmapped_rows),
        "unmapped_by_category": dict(cat_counts),
    }
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    unmapped_doc = {
        "generated": str(date.today()),
        "source": "https://edurank.org/geo/ph/",
        "runtime_total": len(data["universities"]),
        "patched_total": len(enriched_ids),
        "patched_changed_this_run": len(report["patched"]),
        "unmapped_total": len(unmapped_rows),
        "by_category": dict(cat_counts),
        "schools": unmapped_rows,
    }
    UNMAPPED.write_text(json.dumps(unmapped_doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    APPROACH.write_text(
        """# EduRank validation approach

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
""",
        encoding="utf-8",
    )

    print(json.dumps(report["summary"], indent=2))
    print(f"Unmapped report: {UNMAPPED}")


if __name__ == "__main__":
    main()
