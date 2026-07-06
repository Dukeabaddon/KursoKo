#!/usr/bin/env python3
"""Strip copy-paste careerTag boilerplate; infer 1-3 careers from name/RIASEC.

Usage: python3 scripts/audit-scholarship-career-boilerplate.py [--dry-run]
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCHOLARSHIPS = ROOT / "src/data/scholarships.json"
CAREERS = ROOT / "src/data/careers.json"
OUT = ROOT / "docs/plans/kursoko-data2/scholarship-career-boilerplate-report.json"

BOILERPLATE_THRESHOLD = 5

NAME_RULES: list[tuple[str, list[str]]] = [
    (r"nursing|nurse|midwif", ["nurse", "midwife"]),
    (r"medic|health|pharm|dental|dmd", ["nurse", "medical-technologist"]),
    (r"teach|educ|normal", ["teacher", "guidance-counselor"]),
    (r"engineer|stem|science|dost|tech", ["software-engineer", "mechanical-engineer"]),
    (r"business|entrepreneur|commerce|account", ["entrepreneur", "accountant"]),
    (r"law|legal|criminology|pnp|police", ["lawyer", "criminology-graduate"]),
    (r"military|afp|army|navy|air force|pma|rotc", ["military-officer"]),
    (r"maritime|seafarer|marine", ["seafarer-deck-officer", "marine-engineer"]),
    (r"agri|farm|fisher", ["agricultural-technician", "food-technologist"]),
    (r"art|design|creative|media", ["graphic-designer", "multimedia-artist"]),
    (r"tvet|tesda|trade|vocational|welding|electric", ["electrician", "welder"]),
    (r"4ps|merit|financial aid|general|lgu|municipal|city scholarship", []),
]


def load_riasec_index() -> dict[str, list[str]]:
    careers = json.loads(CAREERS.read_text(encoding="utf-8"))["careers"]
    index: dict[str, list[tuple[float, str]]] = {ch: [] for ch in "RIASEC"}
    for career in careers:
        for letter, weight in (career.get("riasecWeights") or {}).items():
            if letter in index and weight >= 0.55:
                index[letter].append((weight, career["id"]))
    return {k: [cid for _, cid in sorted(v, reverse=True)] for k, v in index.items()}


def infer_from_name(scholarship: dict) -> list[str]:
    text = f"{scholarship.get('name', '')} {scholarship.get('provider', '')}".lower()
    for pattern, tags in NAME_RULES:
        if re.search(pattern, text):
            return tags[:3]
    return []


def infer_from_riasec(scholarship: dict, index: dict[str, list[str]], limit: int = 2) -> list[str]:
    out: list[str] = []
    for letter in scholarship.get("riasecTags") or []:
        for cid in index.get(letter, []):
            if cid not in out:
                out.append(cid)
            if len(out) >= limit:
                return out
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    data = json.loads(SCHOLARSHIPS.read_text(encoding="utf-8"))
    scholarships = data["scholarships"]
    index = load_riasec_index()

    set_counts = Counter(tuple(sorted(s.get("careerTags") or [])) for s in scholarships)
    boilerplate_keys = {
        k for k, n in set_counts.items() if n >= BOILERPLATE_THRESHOLD and len(k) >= 3
    }

    fixed: list[dict] = []
    for sch in scholarships:
        key = tuple(sorted(sch.get("careerTags") or []))
        if key not in boilerplate_keys:
            continue
        old = list(sch.get("careerTags") or [])
        new = infer_from_name(sch)
        source = "name"
        if not new:
            new = infer_from_riasec(sch, index, limit=2)
            source = "riasec"
        if new == old:
            new = infer_from_riasec(sch, index, limit=3)
            source = "riasec_fallback"
        fixed.append({"id": sch["id"], "before": old, "after": new, "source": source})
        if not args.dry_run:
            sch["careerTags"] = new

    four_plus = sum(1 for s in scholarships if len(s.get("careerTags") or []) >= 4)

    report = {
        "date": str(date.today()),
        "boilerplateSets": len(boilerplate_keys),
        "fixed": len(fixed),
        "fourPlusCareerTagsAfter": four_plus,
        "sample": fixed[:20],
    }
    OUT.write_text(json.dumps(report, indent=2), encoding="utf-8")

    if not args.dry_run and fixed:
        data["metadata"]["careerTagsBoilerplatePass"] = str(date.today())
        data["metadata"]["lastUpdated"] = str(date.today())
        SCHOLARSHIPS.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(json.dumps({"fixed": len(fixed), "four_plus_after": four_plus}, indent=2))


if __name__ == "__main__":
    main()
