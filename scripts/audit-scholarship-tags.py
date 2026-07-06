#!/usr/bin/env python3
"""Reduce over-broad riasecTags (all 6) on scholarships to 2-3 focused tags.

Primary signal: average riasecWeights of the scholarship's careerTags
(from careers.json). However, careerTag sets shared verbatim by many
6-tag scholarships are boilerplate (copy-paste artifacts, e.g. the same
4 trade careers on Jollibee/Coca-Cola/LGU general scholarships) and are
NOT trusted for RIASEC derivation; those entries use name/provider
keyword heuristics with a category fallback instead. careerTags are
left untouched either way.

Usage: python3 scripts/audit-scholarship-tags.py [--dry-run]
"""

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCHOLARSHIPS = ROOT / "src" / "data" / "scholarships.json"
CAREERS = ROOT / "src" / "data" / "careers.json"

RIASEC_ORDER = ["R", "I", "A", "S", "E", "C"]

# identical careerTag sets shared by this many 6-tag scholarships are
# treated as copy-paste boilerplate and ignored for RIASEC derivation
BOILERPLATE_THRESHOLD = 5

# name/provider keyword -> tags, checked in order; first match wins
KEYWORD_RULES = [
    (r"\bstem\b|science|engineer|technolog|research|dost", ["I", "R"]),
    (r"business|entrepreneur|commerce|management", ["E", "C"]),
    (r"\barts?\b|design|creative|music|cultur", ["A", "I"]),
    (r"health|nursing|medic|midwif", ["S", "I"]),
    (r"tvet|tesda|trade|vocational|technical|skills", ["R", "C"]),
    (r"teach|educators|normal college", ["S", "A"]),
    (r"agri|farm|fisher", ["R", "I"]),
    (r"veteran|military|afp\b|pnp\b", ["R", "C"]),
]

# generic merit/need-based programs with no domain signal
CATEGORY_FALLBACK = {
    "government": ["I", "C"],  # academic-merit subsidies
    "university": ["I", "C"],  # academic scholarships
    "private": ["E", "C"],  # corporate foundations
}


def tags_from_careers(career_ids, weights_by_id):
    resolved = [weights_by_id[c] for c in career_ids if c in weights_by_id]
    if not resolved:
        return None
    avg = {
        dim: sum(w[dim] for w in resolved) / len(resolved)
        for dim in RIASEC_ORDER
    }
    ranked = sorted(RIASEC_ORDER, key=lambda d: avg[d], reverse=True)
    picked = ranked[:2]
    # include a 3rd dimension only when it is nearly as strong as the 2nd
    third = ranked[2]
    if avg[third] >= 0.5 or (avg[ranked[1]] - avg[third]) <= 0.1:
        picked.append(third)
    return [d for d in RIASEC_ORDER if d in picked]


def tags_from_heuristics(scholarship):
    text = " ".join(
        [scholarship.get("name", ""), scholarship.get("provider", "")]
    ).lower()
    for pattern, tags in KEYWORD_RULES:
        if re.search(pattern, text):
            return tags
    return CATEGORY_FALLBACK.get(scholarship.get("category", ""), ["I", "C"])


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    data = json.loads(SCHOLARSHIPS.read_text(encoding="utf-8"))
    careers = json.loads(CAREERS.read_text(encoding="utf-8"))["careers"]
    weights_by_id = {c["id"]: c["riasecWeights"] for c in careers}

    targets = [
        s for s in data["scholarships"]
        if len(s.get("riasecTags", [])) >= 6
    ]
    set_counts = {}
    for s in targets:
        key = tuple(sorted(s.get("careerTags", [])))
        set_counts[key] = set_counts.get(key, 0) + 1

    fixed = []
    for s in targets:
        tags = s["riasecTags"]
        key = tuple(sorted(s.get("careerTags", [])))
        boilerplate = set_counts[key] >= BOILERPLATE_THRESHOLD
        new_tags = None
        source = "heuristic"
        if not boilerplate:
            new_tags = tags_from_careers(
                s.get("careerTags", []), weights_by_id
            )
            source = "careers"
        if new_tags is None:
            new_tags = tags_from_heuristics(s)
            source = "heuristic"
        fixed.append((s["id"], tags, new_tags, source))
        s["riasecTags"] = new_tags

    if not args.dry_run and fixed:
        SCHOLARSHIPS.write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    print(f"scholarships scanned: {len(data['scholarships'])}")
    print(f"fixed (had all 6 riasecTags): {len(fixed)}")
    by_source = {}
    for _, _, _, src in fixed:
        by_source[src] = by_source.get(src, 0) + 1
    print(f"tag source breakdown: {by_source}")
    dist = {}
    for _, _, new, _ in fixed:
        dist["".join(new)] = dist.get("".join(new), 0) + 1
    print(f"resulting tag sets: {dict(sorted(dist.items(), key=lambda x: -x[1]))}")
    print("\nsample before/after:")
    for sid, old, new, src in fixed[:15]:
        print(f"  {sid}: {''.join(old)} -> {''.join(new)} ({src})")
    if args.dry_run:
        print("\n(dry run — file not written)")


if __name__ == "__main__":
    main()
