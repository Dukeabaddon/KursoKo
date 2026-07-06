#!/usr/bin/env python3
"""Narrow scholarships with 4+ careerTags to 1-3 accurate careers (curated + inference).

Usage: python3 scripts/audit-scholarship-career-narrow.py [--dry-run]
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCHOLARSHIPS = ROOT / "src/data/scholarships.json"
CAREERS = ROOT / "src/data/careers.json"
OUT = ROOT / "docs/plans/kursoko-data2/scholarship-career-narrow-report.json"

MAX_TAGS = 3

# Curated per scholarship — sourced from provider mission / official program focus
CURATED: dict[str, list[str]] = {
    "benilde-sda-scholarship": ["graphic-designer", "interior-designer", "multimedia-artist"],
    "cebu-pacific-scholarship": ["flight-attendant", "aircraft-maintenance-technician"],
    "ciit-scholarship": ["game-developer", "multimedia-artist", "graphic-designer"],
    "doh-scholarship": ["nurse", "midwife", "medical-technologist"],
    "dost-sei-undergraduate": ["research-scientist", "software-engineer", "mechanical-engineer"],
    "megaworld-foundation": ["architect", "hotel-manager", "accountant"],
    "pup-presidential-scholarship": ["software-engineer", "accountant", "teacher"],
    "sch-corp-eei": ["civil-engineer", "mechanical-engineer", "electrician"],
    "sch-gov-092": ["research-scientist", "software-engineer", "mechanical-engineer"],
    "sch-gov-093": ["research-scientist", "software-engineer", "mechanical-engineer"],
    "sch-gov-095": ["agricultural-technician", "research-scientist", "food-technologist"],
    "sch-intl-005": ["research-scientist", "software-engineer", "mechanical-engineer"],
    "sch-intl-006": ["teacher", "research-scientist", "software-engineer"],
    "sch-intl-008": ["research-scientist", "software-engineer", "accountant"],
    "sch-intl-009": ["research-scientist", "teacher", "social-worker"],
    "sch-intl-010": ["teacher", "journalist", "research-scientist"],
    "sch-intl-011": ["environmental-scientist", "research-scientist", "agricultural-technician"],
    "sch-intl-012": ["graphic-designer", "chef", "marketing-manager"],
    "sch-priv-092": ["civil-engineer", "mechanical-engineer", "accountant"],
    "sch-priv-102": ["food-technologist", "mechanical-engineer", "marketing-manager"],
    "sch-priv-103": ["marketing-manager", "supply-chain-manager", "entrepreneur"],
    "sch-priv-105": ["food-technologist", "nutritionist-dietitian", "mechanical-engineer"],
    "sch-priv-108": ["marketing-manager", "accountant", "architect"],
    "sch-priv-zonta-pamp": ["teacher", "social-worker", "entrepreneur"],
    "sch-tvet-003": ["welder", "electrician", "automotive-technician"],
    "sch-tvet-005": ["welder", "electrician", "automotive-technician"],
    "sch-uni-094": ["software-engineer", "accountant", "teacher"],
    "sch-uni-099": ["research-scientist", "mechanical-engineer", "teacher"],
    "sch-uni-100": ["mechanical-engineer", "software-engineer", "teacher"],
    "sch-uni-101": ["food-technologist", "agricultural-technician", "research-scientist"],
    "sch-uni-103": ["teacher", "research-scientist", "software-engineer"],
    "sch-uni-106": ["teacher", "psychologist", "social-worker"],
    "sch-uni-107": ["agricultural-technician", "environmental-scientist", "research-scientist"],
    "sch-uni-108": ["nurse", "medical-technologist", "criminology-graduate"],
    "sch-uni-109": ["nurse", "pharmacist", "medical-technologist"],
    "sch-uni-110": ["teacher", "nutritionist-dietitian", "social-worker"],
    "sch-uni-111": ["teacher", "criminology-graduate", "marketing-manager"],
    "sch-uni-113": ["hotel-manager", "entrepreneur", "marketing-manager"],
    "sch-uni-114": ["software-engineer", "mechanical-engineer", "accountant"],
    "sch-uni-115": ["teacher", "psychologist", "research-scientist"],
    "sch-uni-ama-grades": ["software-engineer", "data-scientist", "cybersecurity-analyst"],
    "sch-uni-pup-grades": ["accountant", "bookkeeper", "entrepreneur"],
    "sm-foundation-college": ["accountant", "teacher", "entrepreneur"],
    "unilever-scholarship": ["marketing-manager", "entrepreneur", "supply-chain-manager"],
    "up-dost-scholarship": ["research-scientist", "software-engineer", "data-analyst"],
    "ust-santo-tomas-academic": ["nurse", "pharmacist", "teacher"],
}

NAME_RULES: list[tuple[str, list[str]]] = [
    (r"design|benilde|arts|creative|ciit|multimedia|game", ["graphic-designer", "multimedia-artist"]),
    (r"health|doh|nursing|medical|pharm|midwif|olfu|ust", ["nurse", "medical-technologist"]),
    (r"dost|science and technology|sei|stem", ["research-scientist", "software-engineer"]),
    (r"dar|agrarian|agri|uplb", ["agricultural-technician", "research-scientist"]),
    (r"tesda|tvet|mfi|train program|welding|electric", ["electrician", "welder"]),
    (r"engineering|eei|san miguel|nestl", ["mechanical-engineer", "civil-engineer"]),
    (r"hotel|hospitality|tourism|lpu|megaworld", ["hotel-manager", "entrepreneur"]),
    (r"food|nestl|san miguel|lspu", ["food-technologist", "nutritionist-dietitian"]),
    (r"teach|education|scholastica|pwu", ["teacher", "guidance-counselor"]),
    (r"criminology|pcu", ["criminology-graduate", "lawyer"]),
    (r"aviation|cebu pacific|pilot|aircraft", ["aircraft-maintenance-technician", "flight-attendant"]),
    (r"fulbright|erasmus|international|kgsp|csc|asean|zealand|french", ["research-scientist", "teacher"]),
    (r"aboitiz|filinvest|sm college|unilever|p&g|marketing", ["marketing-manager", "entrepreneur"]),
    (r"pup|presidential|academic scholarship", ["software-engineer", "accountant", "teacher"]),
    (r"zonta|women", ["teacher", "social-worker", "entrepreneur"]),
]


def load_valid_ids() -> set[str]:
    data = json.loads(CAREERS.read_text(encoding="utf-8"))
    return {c["id"] for c in data["careers"]}


def infer_from_name(scholarship: dict) -> list[str]:
    text = " ".join(
        [
            scholarship.get("name", ""),
            scholarship.get("provider", ""),
            " ".join(scholarship.get("eligibility") or []),
        ]
    ).lower()
    for pattern, tags in NAME_RULES:
        if re.search(pattern, text):
            return tags[:MAX_TAGS]
    return []


def narrow_tags(scholarship: dict, valid: set[str]) -> list[str]:
    sid = scholarship["id"]
    if sid in CURATED:
        tags = [t for t in CURATED[sid] if t in valid][:MAX_TAGS]
        if tags:
            return tags
    inferred = infer_from_name(scholarship)
    if inferred:
        return [t for t in inferred if t in valid][:MAX_TAGS]
    # Keep top-weight overlap: first 3 existing that are valid
    existing = [t for t in scholarship.get("careerTags") or [] if t in valid]
    return existing[:MAX_TAGS]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    valid = load_valid_ids()
    data = json.loads(SCHOLARSHIPS.read_text(encoding="utf-8"))
    fixed: list[dict] = []

    for sch in data["scholarships"]:
        old = list(sch.get("careerTags") or [])
        if len(old) < 4:
            continue
        new = narrow_tags(sch, valid)
        if new != old:
            fixed.append({"id": sch["id"], "name": sch.get("name"), "before": old, "after": new})
            if not args.dry_run:
                sch["careerTags"] = new

    four_plus = sum(1 for s in data["scholarships"] if len(s.get("careerTags") or []) >= 4)
    report = {"date": str(date.today()), "fixed": len(fixed), "fourPlusAfter": four_plus, "rows": fixed}
    OUT.write_text(json.dumps(report, indent=2), encoding="utf-8")

    if not args.dry_run and fixed:
        data["metadata"]["careerTagsNarrowPass"] = str(date.today())
        data["metadata"]["lastUpdated"] = str(date.today())
        SCHOLARSHIPS.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(json.dumps({"fixed": len(fixed), "four_plus_after": four_plus}, indent=2))


if __name__ == "__main__":
    main()
