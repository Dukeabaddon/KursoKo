"""Derive RIASEC tags for universities from strengthTags — shared by backfill + sync."""
from __future__ import annotations

RIASEC_ORDER = list("RIASEC")

FLAGSHIP_OVERRIDES: dict[str, list[str]] = {
    "up-diliman": ["A", "E", "I", "R", "S"],
    "ateneo-manila": ["A", "C", "E", "I", "S"],
    "pup-manila": ["A", "C", "E", "I", "R", "S"],
    "plm": ["A", "E", "I", "R", "S"],
    "ust": ["A", "I", "S"],
    "dlsu-manila": ["C", "E", "I", "S"],
    "feu-manila": ["A", "I", "S"],
    "nu-manila": ["C", "E", "I"],
    "letran": ["C", "E", "I", "R"],
    "san-beda-university": ["C", "E", "S"],
    "jru": ["C", "E", "I"],
    "ue-manila": ["C", "E", "I"],
    "bulacan-state-university": ["I", "R"],
    "laguna-state-polytechnic-university": ["I", "R"],
    "pangasinan-state-university": ["I", "R"],
    "tarlac-state-university": ["I", "R"],
    "don-honorio-ventura": ["I", "R"],
    "pampanga-state-university": ["I", "R"],
}

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
    (["education", "teacher", "teacher-education", "guidance", "counseling"], ["S", "I"]),
    (["law", "criminology", "governance", "public-administration", "political", "legal"], ["E", "S"]),
    (
        [
            "arts",
            "design",
            "multimedia",
            "communication",
            "liberal-arts",
            "humanities",
            "music",
            "film",
            "visual",
            "creative",
        ],
        ["A", "I"],
    ),
    (["psychology", "social-sciences", "social-work", "community", "social-science"], ["S", "I"]),
    (["research", "sciences", "science", "public-service"], ["I", "R"]),
    (["architecture", "interior"], ["I", "R", "A"]),
    (["international-programs", "global"], ["E", "I"]),
    (["stem"], ["I", "R"]),
    (["abm"], ["C", "E"]),
    (["humss"], ["A", "S"]),
    (["tvl"], ["R", "C"]),
    (["shs"], ["I", "R"]),
]

TYPE_DEFAULTS: dict[str, list[str]] = {
    "public": ["I", "R"],
    "private": ["C", "I"],
    "shs": ["I", "R"],
    "tvet": ["R", "C"],
}


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
    blob, desc, courses = _haystack(university)
    full = f"{blob} {desc} {courses}"

    for needles, codes in STRENGTH_RULES:
        strength_hits = sum(1 for n in needles if n in blob)
        course_hits = sum(1 for n in needles if n in courses)
        desc_hits = sum(1 for n in needles if n in desc)
        weight = strength_hits * 1.0 + course_hits * 1.5 + desc_hits * 0.5
        if weight > 0:
            for code in codes:
                scores[code] += weight

    for code in TYPE_DEFAULTS.get(university.get("type", ""), []):
        scores[code] += 0.35

    if max(scores.values()) == 0:
        if university.get("type") == "private":
            scores["I"] += 1.0
            scores["C"] += 0.8
        else:
            scores["I"] += 1.0
            scores["R"] += 0.8

    return scores


def narrow_riasec_tags(university: dict, max_tags: int = 3) -> list[str]:
    """Pick top 2–3 RIASEC codes from scored program signals (not copy-paste all six)."""
    uid = university.get("id", "")
    if uid in FLAGSHIP_OVERRIDES:
        override = FLAGSHIP_OVERRIDES[uid]
        cap = min(4, max_tags + 1)
        return override[: min(len(override), cap)]

    scores = score_riasec_dimensions(university)
    ranked = sorted(RIASEC_ORDER, key=lambda c: scores[c], reverse=True)
    positive = [c for c in ranked if scores[c] > 0]
    if not positive:
        return ["I", "C"] if university.get("type") == "private" else ["I", "R"]

    picked = positive[:2]
    if len(positive) >= 3 and max_tags >= 3:
        third = positive[2]
        second_score = scores[picked[1]]
        third_score = scores[third]
        if third_score >= second_score * 0.55 or third_score >= 2.0:
            picked.append(third)

    return [c for c in RIASEC_ORDER if c in picked]


def derive_riasec_tags(university: dict) -> list[str]:
    uid = university.get("id", "")
    if uid in FLAGSHIP_OVERRIDES:
        return FLAGSHIP_OVERRIDES[uid][:]

    letters: set[str] = set()
    blob = normalize_strength(university.get("strengthTags", []))
    desc = str(university.get("description", "")).lower()
    courses = " ".join(str(c).lower() for c in (university.get("popularCourses") or []))
    haystack = f"{blob} {desc} {courses}"

    for needles, codes in STRENGTH_RULES:
        if any(n in haystack for n in needles):
            letters.update(codes)

    for code in TYPE_DEFAULTS.get(university.get("type", ""), []):
        letters.add(code)

    if not letters:
        letters = {"I", "C"} if university.get("type") == "private" else {"I", "R"}

    ordered = [c for c in RIASEC_ORDER if c in letters]
    return ordered[:6]
