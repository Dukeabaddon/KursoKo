#!/usr/bin/env python3
"""Audit universities for duplicates, broad tags, and career keyword gaps."""
from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "src/data/universities.json"
STAGING_DIR = ROOT / "docs/plans/kursoko-data2"
OUT = STAGING_DIR / "dedupe-audit.json"

CRIM_KEYWORDS = ("criminology", "public safety", "law enforcement", "forensic", "security management")


def norm_name(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", (name or "").lower())


def load_universities(path: Path) -> list[dict]:
    if not path.exists():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict):
        return data.get("universities", [])
    return data


def tag_bag(u: dict) -> str:
    parts = [
        u.get("description") or "",
        u.get("name") or "",
        " ".join(u.get("strengthTags") or []),
        " ".join(u.get("popularCourses") or []),
    ]
    return " ".join(parts).lower()


def main() -> None:
    runtime = load_universities(RUNTIME)
    staging_paths = [
        STAGING_DIR / "_staging-universities.json",
        STAGING_DIR / "universities2.json",
        STAGING_DIR / "universities.json",
    ]
    staging: list[dict] = []
    for p in staging_paths:
        staging.extend(load_universities(p))

    by_norm: dict[str, list[str]] = defaultdict(list)
    for u in runtime:
        by_norm[norm_name(u.get("name", ""))].append(u["id"])

    runtime_dupes = {k: v for k, v in by_norm.items() if len(v) > 1 and k}
    runtime_ids = {u["id"] for u in runtime}
    runtime_norms = {norm_name(u.get("name", "")) for u in runtime}

    staging_new = []
    staging_dupes = []
    for u in staging:
        nid = u.get("id")
        nname = norm_name(u.get("name", ""))
        if nid in runtime_ids or nname in runtime_norms:
            staging_dupes.append({"id": nid, "name": u.get("name")})
        else:
            staging_new.append({"id": nid, "name": u.get("name")})

    broad_riasec = [u["id"] for u in runtime if len(u.get("riasecTags") or []) >= 5]
    chinese = [
        {"id": u["id"], "name": u["name"]}
        for u in runtime
        if re.search(r"chinese|chiang|cksc|sun yat|hope christian", u.get("name", ""), re.I)
    ]
    crim_schools = [
        u["id"]
        for u in runtime
        if any(k in tag_bag(u) for k in CRIM_KEYWORDS)
    ]
    bestlink = next((u for u in runtime if u.get("id") == "bestlink"), None)
    bestlink_crim = bestlink and any(k in tag_bag(bestlink) for k in CRIM_KEYWORDS)

    report = {
        "runtimeCount": len(runtime),
        "stagingScanned": len(staging),
        "runtimeNameDupes": runtime_dupes,
        "stagingWouldDuplicate": staging_dupes[:30],
        "stagingWouldDuplicateCount": len(staging_dupes),
        "stagingWouldAdd": staging_new[:20],
        "stagingWouldAddCount": len(staging_new),
        "broadRiasecTagSchools": len(broad_riasec),
        "chineseNamedSchools": chinese,
        "criminologyTaggedSchoolCount": len(crim_schools),
        "bestlinkHasCriminologyKeywords": bestlink_crim,
        "bestlinkRecord": {
            "strengthTags": (bestlink or {}).get("strengthTags"),
            "popularCourses": (bestlink or {}).get("popularCourses"),
        },
    }
    OUT.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps({k: report[k] for k in report if k != "bestlinkRecord"}, indent=2))


if __name__ == "__main__":
    main()
