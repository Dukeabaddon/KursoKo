#!/usr/bin/env python3
"""Merge top100-core-gaps research into runtime universities.json."""
from __future__ import annotations

import importlib.util
import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

_sync_spec = importlib.util.spec_from_file_location(
    "sync_kursoko_data2", ROOT / "scripts" / "sync-kursoko-data2.py"
)
sync_mod = importlib.util.module_from_spec(_sync_spec)
_sync_spec.loader.exec_module(sync_mod)

from university_riasec_derive import derive_riasec_tags

load_json = sync_mod.load_json
normalize_university = sync_mod.normalize_university
validate = sync_mod.validate
GAPS = ROOT / "docs/plans/kursoko-data2/top100-core-gaps"
RUNTIME = ROOT / "src/data/universities.json"
REPORT = GAPS / "merge-report.json"


def apply_row_overrides(norm: dict, row: dict) -> dict:
    """Keep explicit city/lguId from research when provided."""
    for key in ("city", "lguId", "region", "location"):
        if row.get(key):
            norm[key] = row[key]
    return norm


def enrich_existing(existing: dict, row: dict) -> dict:
    norm = apply_row_overrides(normalize_university({**existing, **row}), row)
    merged = {**existing, **norm}
    if row.get("popularCourses"):
        merged["popularCourses"] = row["popularCourses"]
    if row.get("strengthTags"):
        merged["strengthTags"] = norm["strengthTags"]
    if row.get("riasecTags"):
        merged["riasecTags"] = norm["riasecTags"]
    if not merged.get("riasecTags"):
        merged["riasecTags"] = derive_riasec_tags(merged)
    return merged


def main() -> None:
    gap_files = sorted(GAPS.glob("*.json"))
    if not gap_files:
        raise SystemExit(f"No gap files in {GAPS}")

    runtime = load_json(RUNTIME)
    universities = runtime.get("universities", [])
    by_id = {u["id"]: u for u in universities}

    report = {
        "mergedAt": str(date.today()),
        "added": [],
        "enriched": [],
        "skipped": [],
        "validation_errors": [],
        "validation_warnings": [],
    }

    for path in gap_files:
        data = load_json(path)
        action = data.get("action", "add_new")
        row = data.get("university") or {}
        if not row.get("id"):
            report["skipped"].append({"file": path.name, "reason": "no university.id"})
            continue

        if action == "enrich_existing":
            rid = data.get("existing_runtime_id") or row["id"]
            if rid not in by_id:
                report["skipped"].append({"file": path.name, "id": rid, "reason": "missing_runtime"})
                continue
            by_id[rid] = enrich_existing(by_id[rid], row)
            report["enriched"].append(rid)
            continue

        if row["id"] in by_id:
            report["skipped"].append({"file": path.name, "id": row["id"], "reason": "id_exists"})
            continue

        norm = apply_row_overrides(normalize_university(row), row)
        if not norm.get("riasecTags"):
            norm["riasecTags"] = derive_riasec_tags(norm)
        by_id[norm["id"]] = norm
        report["added"].append(norm["id"])

    merged = sorted(by_id.values(), key=lambda u: u["name"].lower())
    validate(merged, [], report)

    out = {
        **runtime,
        "metadata": {
            **runtime.get("metadata", {}),
            "lastUpdated": str(date.today()),
            "count": len(merged),
            "top100CoreGapsMerge": str(date.today()),
        },
        "universities": merged,
    }
    RUNTIME.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    report["counts"] = {"before": len(universities), "after": len(merged), "added": len(report["added"])}
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Universities: {report['counts']['before']} -> {report['counts']['after']}")
    print(f"Added: {report['added']}")
    print(f"Enriched: {report['enriched']}")
    if report["validation_errors"]:
        print("VALIDATION ERRORS:", report["validation_errors"])
        raise SystemExit(1)


if __name__ == "__main__":
    main()
