#!/usr/bin/env python3
"""Merge official-site enrichment JSON into runtime universities.json (production gate)."""
from __future__ import annotations

import importlib.util
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from university_riasec_derive import derive_riasec_tags

RUNTIME = ROOT / "src/data/universities.json"
DEFAULT_DIRS = [
    ROOT / "docs/plans/kursoko-data2/official-site-enrichment",
    ROOT / "docs/plans/kursoko-data2/official-site-enrichment-phase-c",
]


def merge_strengths(existing: list[str], new: list[str]) -> list[str]:
    out, seen = [], set()
    for tag in (new or []) + (existing or []):
        if tag and tag not in seen:
            seen.add(tag)
            out.append(tag)
    return out


def collect_files(dirs: list[Path]) -> list[Path]:
    files: list[Path] = []
    for staging in dirs:
        if not staging.exists():
            continue
        for path in sorted(staging.glob("*.json")):
            if path.name in ("merge-report.json", "backfill-report.json"):
                continue
            files.append(path)
    return files


MIN_PROGRAMS = 4
MAX_PROGRAMS = 12


def main() -> None:
    dirs = [Path(a) for a in sys.argv[1:]] if len(sys.argv) > 1 else DEFAULT_DIRS
    files = collect_files(dirs)
    if not files:
        raise SystemExit(f"No staging files in {dirs}")

    data = json.loads(RUNTIME.read_text(encoding="utf-8"))
    by_id = {u["id"]: u for u in data["universities"]}
    report = {
        "mergedAt": str(date.today()),
        "dirs": [str(d) for d in dirs],
        "enriched": [],
        "cleared": [],
        "skipped": [],
    }

    for path in files:
        row = json.loads(path.read_text(encoding="utf-8"))
        if row.get("status") != "blocked":
            continue
        uid = row.get("existing_runtime_id") or row.get("university", {}).get("id")
        if not uid or uid not in by_id:
            report["skipped"].append({"file": path.name, "reason": "blocked_missing_runtime", "id": uid})
            continue
        uni = by_id[uid]
        before = len(uni.get("popularCourses") or [])
        if before or uni.get("programSource"):
            uni.pop("popularCourses", None)
            uni.pop("programSource", None)
            report["cleared"].append({"id": uid, "file": path.name, "courses_cleared": before})
        report["skipped"].append({"file": path.name, "reason": "blocked", "id": uid})

    for path in files:
        row = json.loads(path.read_text(encoding="utf-8"))
        if row.get("status") == "blocked":
            continue
        if row.get("source_type") != "official_website":
            report["skipped"].append({"file": path.name, "reason": "not_official", "id": row.get("existing_runtime_id")})
            continue

        uid = row.get("existing_runtime_id") or row.get("university", {}).get("id")
        patch = row.get("university") or {}
        courses = patch.get("popularCourses") or []
        if not uid or uid not in by_id:
            report["skipped"].append({"file": path.name, "reason": "missing_runtime", "id": uid})
            continue
        if not courses:
            report["skipped"].append({"file": path.name, "reason": "empty_courses", "id": uid})
            continue
        if len(courses) < MIN_PROGRAMS:
            report["skipped"].append(
                {
                    "file": path.name,
                    "reason": "below_minimum_programs",
                    "id": uid,
                    "count": len(courses),
                }
            )
            continue

        uni = by_id[uid]
        before_courses = list(uni.get("popularCourses") or [])

        # Official data replaces prior lists — no tag-derived fallback merge.
        uni["popularCourses"] = courses[:MAX_PROGRAMS]
        uni["programSource"] = "official_website"
        if patch.get("strengthTags"):
            uni["strengthTags"] = merge_strengths(list(uni.get("strengthTags") or []), patch["strengthTags"])
            uni["riasecTags"] = derive_riasec_tags(uni)
        if patch.get("website"):
            uni["website"] = patch["website"]
        for key in ("description", "tuition"):
            if patch.get(key):
                uni[key] = patch[key]

        report["enriched"].append(
            {
                "id": uid,
                "file": path.name,
                "courses_before": len(before_courses),
                "courses_after": len(uni["popularCourses"]),
            }
        )

    data["metadata"]["officialSiteEnrichment"] = str(date.today())
    data["metadata"]["lastUpdated"] = str(date.today())
    data["metadata"].pop("popularCoursesBackfill", None)
    RUNTIME.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    report["count"] = len(report["enriched"])
    out_report = dirs[-1] / "merge-report.json"
    out_report.parent.mkdir(parents=True, exist_ok=True)
    out_report.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "merged": report["count"],
                "cleared": len(report["cleared"]),
                "skipped": len(report["skipped"]),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
