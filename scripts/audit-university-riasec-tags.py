#!/usr/bin/env python3
"""Narrow over-broad riasecTags (5+) on universities using scored program signals.

Uses strengthTags, popularCourses, and description via university_riasec_derive.narrow_riasec_tags.
Flagship overrides are capped at 4. Schools with >=5 tags are re-scored; others unchanged unless --all.

Usage:
  python3 scripts/audit-university-riasec-tags.py --dry-run
  python3 scripts/audit-university-riasec-tags.py
"""

from __future__ import annotations

import argparse
import json
from collections import Counter
from datetime import date
from pathlib import Path

from university_riasec_derive import FLAGSHIP_OVERRIDES, narrow_riasec_tags

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "src/data/universities.json"
OUT = ROOT / "docs/plans/kursoko-data2/riasec-narrow-report.json"

BROAD_THRESHOLD = 5
MAX_TAGS = 3


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--all", action="store_true", help="Re-narrow every university")
    args = parser.parse_args()

    data = json.loads(RUNTIME.read_text(encoding="utf-8"))
    universities = data["universities"]
    fixed: list[dict] = []

    for uni in universities:
        old = list(uni.get("riasecTags") or [])
        should_fix = args.all or len(old) >= BROAD_THRESHOLD
        if not should_fix:
            continue

        new = narrow_riasec_tags(uni, max_tags=MAX_TAGS)
        if new != old:
            fixed.append(
                {
                    "id": uni["id"],
                    "name": uni.get("name"),
                    "before": old,
                    "after": new,
                    "strengthCount": len(uni.get("strengthTags") or []),
                    "courseCount": len(uni.get("popularCourses") or []),
                    "flagship": uni["id"] in FLAGSHIP_OVERRIDES,
                }
            )
            if not args.dry_run:
                uni["riasecTags"] = new

    broad_after = sum(
        1 for u in universities if len(u.get("riasecTags") or []) >= BROAD_THRESHOLD
    )
    dist = Counter("".join(u.get("riasecTags") or []) for u in universities)

    report = {
        "generatedAt": str(date.today()),
        "scanned": len(universities),
        "fixedCount": len(fixed),
        "broadBefore": sum(1 for f in fixed if len(f["before"]) >= BROAD_THRESHOLD)
        + (0 if args.all else 0),
        "broadAfter": broad_after,
        "topTagSetsAfter": dist.most_common(12),
        "sample": fixed[:40],
    }
    OUT.write_text(json.dumps(report, indent=2), encoding="utf-8")

    if not args.dry_run and fixed:
        data["metadata"]["lastUpdated"] = str(date.today())
        data["metadata"]["riasecNarrowPass"] = str(date.today())
        RUNTIME.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    print(f"universities scanned: {len(universities)}")
    print(f"narrowed: {len(fixed)}")
    print(f"broad (>=5) after: {broad_after}")
    print(f"report: {OUT.relative_to(ROOT)}")
    if fixed[:5]:
        print("\nsample:")
        for row in fixed[:5]:
            print(f"  {row['id']}: {row['before']} -> {row['after']}")


if __name__ == "__main__":
    main()
