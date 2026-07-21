"""Derive RIASEC tags for universities from strengthTags — shared by backfill + sync."""
from __future__ import annotations

RIASEC_ORDER = list("RIASEC")

STRENGTH_RULES: list[tuple[list[str], list[str]]] = [
    (
        [
            "information-technology",
            "computer-science",
            "computer-studies",
            "software",
            "programming",
            "cybersecurity",
            "data-science",
            "analytics",
            "information-systems",
        ],
        ["I", "C"],
    ),
    (
        [
            "engineering",
            "mechanical",
            "electrical",
            "civil",
            "industrial",
            "technology",
            "technical-vocational",
            "vocational-training",
            "skills-training",
            "automotive",
            "welding",
            "maritime",
            "marine",
            "aviation",
            "airframe",
        ],
        ["I", "R"],
    ),
    (["agriculture", "forestry", "veterinary", "agribusiness", "farming", "crop"], ["I", "R"]),
    (
        [
            "business",
            "accountancy",
            "accounting",
            "finance",
            "management",
            "entrepreneurship",
            "marketing",
            "hospitality",
            "tourism",
            "hotel",
            "culinary",
            "logistics",
            "supply-chain",
            "office-administration",
        ],
        ["C", "E"],
    ),
    (
        [
            "nursing",
            "medicine",
            "health",
            "healthcare",
            "health-sciences",
            "allied-health",
            "pharmacy",
            "midwifery",
            "caregiving",
            "medical",
            "public-health",
            "rehabilitation",
            "laboratory",
        ],
        ["S", "I"],
    ),
    (["education", "teacher", "teacher-education", "guidance", "counseling"], ["S"]),
    (["law", "criminology", "governance", "public-administration", "political", "legal"], ["E", "S"]),
    (
        [
            "arts",
            "design",
            "multimedia",
            "music",
            "film",
            "visual",
            "creative",
        ],
        ["A"],
    ),
    (["communication", "liberal-arts", "humanities"], ["A", "S"]),
    (["psychology", "social-sciences", "social-work", "community", "social-science"], ["S", "I"]),
    (["research", "sciences", "science"], ["I", "R"]),
    (["public-service"], ["S", "E"]),
    (["architecture", "interior"], ["I", "R", "A"]),
    (["international-programs", "global"], ["E", "S"]),
    (["stem"], ["I", "R"]),
    (["abm"], ["C", "E"]),
    (["humss"], ["A", "S"]),
    (["tvl"], ["R", "C"]),
    (["shs"], []),
]


def normalize_strength(strength_tags: list) -> str:
    return " ".join(str(t).lower().replace("_", "-") for t in (strength_tags or []))


def _haystack(university: dict) -> tuple[str, str, str]:
    blob = normalize_strength(university.get("strengthTags", []))
    desc = str(university.get("description", "")).lower()
    courses = " ".join(str(c).lower() for c in (university.get("popularCourses") or []))
    return blob, desc, courses


def score_riasec_dimensions(university: dict) -> dict[str, float]:
    """Weighted RIASEC scores from program signals (strengthTags, courses, description)."""
    scores: dict[str, float] = {c: 0.0 for c in RIASEC_ORDER}
    blob, _desc, courses = _haystack(university)

    for needles, codes in STRENGTH_RULES:
        strength_hits = sum(1 for n in needles if n in blob)
        course_hits = sum(1 for n in needles if n in courses)
        weight = strength_hits * 1.0 + course_hits * 1.5
        if weight > 0:
            for code in codes:
                scores[code] += weight

    return scores


def narrow_riasec_tags(university: dict, max_tags: int = 3) -> list[str]:
    """Pick top 2–3 RIASEC codes from scored program signals (not copy-paste all six)."""
    scores = score_riasec_dimensions(university)
    ranked = sorted(RIASEC_ORDER, key=lambda c: scores[c], reverse=True)
    positive = [c for c in ranked if scores[c] > 0]
    if not positive:
        existing = [
            code
            for code in university.get("riasecTags", [])
            if code in RIASEC_ORDER
        ]
        if existing:
            return existing[:max_tags]
        raise ValueError(f"No program evidence for RIASEC tags: {university.get('id')}")

    picked = positive[:2]
    if len(positive) >= 3 and max_tags >= 3:
        third = positive[2]
        second_score = scores[picked[1]]
        third_score = scores[third]
        if third_score >= second_score * 0.55 or third_score >= 2.0:
            picked.append(third)

    return [c for c in RIASEC_ORDER if c in picked]


def derive_riasec_tags(university: dict) -> list[str]:
    return narrow_riasec_tags(university, max_tags=3)
