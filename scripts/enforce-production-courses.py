#!/usr/bin/env python3
"""Strip non-official popularCourses — production gate (no tag-derived / legacy fallback)."""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "src/data/universities.json"
PHASE_B_REPORT = ROOT / "docs/plans/kursoko-data2/official-site-enrichment-phase-b/backfill-report.json"
REPORT = ROOT / "docs/plans/kursoko-data2/production-course-gate-report.json"


def main() -> None:
    data = json.loads(RUNTIME.read_text(encoding="utf-8"))
    phase_b_ids: set[str] = set()
    if PHASE_B_REPORT.exists():
        phase_b_ids = {row["id"] for row in json.loads(PHASE_B_REPORT.read_text())["filled"]}

    cleared = []
    kept = []
    for uni in data["universities"]:
        source = uni.get("programSource")
        courses = uni.get("popularCourses") or []
        if not courses:
            continue
        if source == "official_website":
            kept.append(uni["id"])
            continue
        # Remove tag-derived, legacy, or unverified course lists.
        uni.pop("popularCourses", None)
        cleared.append({"id": uni["id"], "was_phase_b": uni["id"] in phase_b_ids, "had_source": source})

    data["metadata"]["productionCourseGate"] = str(date.today())
    data["metadata"]["lastUpdated"] = str(date.today())
    data["metadata"].pop("popularCoursesBackfill", None)
    RUNTIME.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    summary = {
        "date": str(date.today()),
        "cleared_count": len(cleared),
        "kept_official_count": len(kept),
        "cleared_sample": cleared[:20],
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
