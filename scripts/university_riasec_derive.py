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
