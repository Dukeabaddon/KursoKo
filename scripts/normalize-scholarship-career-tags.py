#!/usr/bin/env python3
"""Normalize scholarship careerTags to valid careers.json ids; infer when empty."""
from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCHOLARSHIPS = ROOT / "src/data/scholarships.json"
CAREERS = ROOT / "src/data/careers.json"
REPORT = ROOT / "docs/plans/kursoko-data2/scholarship-career-tags-report.json"

# Slug → valid career.id (only targets that exist in careers.json)
FREEFORM_TO_CAREER: dict[str, str] = {
    "business-manager": "marketing-manager",
    "business-leader": "business-development-manager",
    "businesswoman": "entrepreneur",
    "business": "entrepreneur",
    "management": "business-development-manager",
    "project-manager": "business-development-manager",
    "criminologist": "criminology-graduate",
    "chemical-engineer": "mechanical-engineer",
    "industrial-engineer": "mechanical-engineer",
    "electrical-engineer": "electrician",
    "electrical-engineering": "electrician",
    "electronics-engineering": "software-engineer",
    "electronics-engineer": "software-engineer",
    "computer-engineering": "software-engineer",
    "environmental-engineer": "environmental-scientist",
    "mining-engineer": "mechanical-engineer",
    "materials-engineer": "mechanical-engineer",
    "packaging-engineer": "mechanical-engineer",
    "manufacturing-engineer": "mechanical-engineer",
    "aeronautical-engineer": "aircraft-maintenance-technician",
    "naval-architect": "marine-engineer",
    "agricultural-engineering": "agricultural-technician",
    "telecom-engineer": "software-engineer",
    "network-engineer": "cybersecurity-analyst",
    "it-specialist": "software-engineer",
    "it-technician": "software-engineer",
    "it-support": "administrative-assistant",
    "technology": "software-engineer",
    "public-servant": "social-worker",
    "development-worker": "social-worker",
    "ngo-worker": "social-worker",
    "academic-administrator": "teacher",
    "school-administrator": "teacher",
    "professor": "teacher",
    "environmental-science": "environmental-scientist",
    "chemistry": "research-scientist",
    "biology": "research-scientist",
    "biologist": "research-scientist",
    "geology": "research-scientist",
    "science": "research-scientist",
    "physics": "research-scientist",
    "mathematics": "data-analyst",
    "research": "research-scientist",
    "academe": "research-scientist",
    "astronomer": "research-scientist",
    "chemist": "research-scientist",
    "agriculture": "agricultural-technician",
    "fisheries": "food-technologist",
    "fisheries-technologist": "food-technologist",
    "forestry": "agricultural-technician",
    "forester": "agricultural-technician",
    "veterinary-medicine": "agricultural-technician",
    "animation": "multimedia-artist",
    "game-development": "game-developer",
    "digital-media": "content-creator",
    "film": "multimedia-artist",
    "design": "graphic-designer",
    "arts": "graphic-designer",
    "fashion-design": "graphic-designer",
    "interior-design": "interior-designer",
    "musician": "content-creator",
    "broadcaster": "journalist",
    "producer": "content-creator",
    "media-professional": "journalist",
    "streamer": "content-creator",
    "esports-manager": "game-developer",
    "digital-marketer": "marketing-manager",
    "physical-therapy": "physical-therapist",
    "occupational-therapy": "physical-therapist",
    "speech-language-pathology": "speech-language-pathologist",
    "nutritionist": "nutritionist-dietitian",
    "medicine": "nurse",
    "medical-doctor": "nurse",
    "medical-specialist": "medical-technologist",
    "surgeon": "medical-technologist",
    "midwifery": "midwife",
    "medical-technology": "medical-technologist",
    "public-health-specialist": "nurse",
    "food-service-worker": "chef",
    "service-crew": "restaurant-manager",
    "food-and-beverage": "restaurant-manager",
    "hospitality-management": "hotel-manager",
    "hospitality-manager": "hotel-manager",
    "tourism": "hotel-manager",
    "financial-advisor": "accountant",
    "financial-technology": "data-analyst",
    "banker": "accountant",
    "retail": "sales-representative",
    "customer-service": "administrative-assistant",
    "service-provider": "administrative-assistant",
    "service-advisor": "automotive-technician",
    "commercial-pilot": "flight-attendant",
    "pilot": "flight-attendant",
    "first-officer": "seafarer-deck-officer",
    "marine-officer": "seafarer-deck-officer",
    "aviation": "aircraft-maintenance-technician",
    "firefighter": "welder",
    "safety-officer": "quality-assurance-analyst",
    "quality-assurance": "quality-assurance-analyst",
    "mechanic": "automotive-technician",
    "machinist": "welder",
    "electrical-technician": "electrician",
    "electro-mechanical-technician": "mechanical-engineer",
    "maintenance-technician": "hvac-technician",
    "production-technician": "welder",
    "industrial-technician": "welder",
    "mechanical-technician": "automotive-technician",
    "manufacturing-technician": "welder",
    "construction-worker": "civil-engineer",
    "construction-manager": "civil-engineer",
    "carpenter": "welder",
    "woodcarver": "welder",
    "various-tvet-careers": "electrician",
    "technical-trainee": "electrician",
    "language-specialist": "teacher",
    "priest-religious": "teacher",
    "professional": "administrative-assistant",
    "visual-merchandising": "sales-representative",
    "telecom-specialist": "software-engineer",
    "sanitation-specialist": "environmental-scientist",
    "air-force-officer": "seafarer-deck-officer",
    "army-officer": "seafarer-deck-officer",
    "naval-officer": "seafarer-deck-officer",
    "military-officer": "seafarer-deck-officer",
    "renewable-energy-specialist": "environmental-scientist",
    "technologist": "medical-technologist",
}


def load_career_ids() -> set[str]:
    data = json.loads(CAREERS.read_text(encoding="utf-8"))
    return {c["id"] for c in data["careers"]}


def build_riasec_index(careers: list[dict]) -> dict[str, list[str]]:
    """Map RIASEC letter → career ids sorted by weight."""
    index: dict[str, list[tuple[float, str]]] = {ch: [] for ch in "RIASEC"}
    for career in careers:
        for letter, weight in (career.get("riasecWeights") or {}).items():
            if letter in index and weight >= 0.5:
                index[letter].append((weight, career["id"]))
    return {k: [cid for _, cid in sorted(v, reverse=True)] for k, v in index.items()}


def infer_career_tags(riasec_tags: list[str], riasec_index: dict[str, list[str]], limit: int = 4) -> list[str]:
    seen: list[str] = []
    for letter in riasec_tags:
        for cid in riasec_index.get(letter, []):
            if cid not in seen:
                seen.append(cid)
            if len(seen) >= limit:
                return seen
    return seen


def normalize_tag(tag: str, valid_ids: set[str]) -> str | None:
    if not tag or not isinstance(tag, str):
        return None
    tag = tag.strip()
    if tag in valid_ids:
        return tag
    mapped = FREEFORM_TO_CAREER.get(tag)
    if mapped and mapped in valid_ids:
        return mapped
    # partial slug match (e.g. software-engineering → software-engineer)
    for cid in valid_ids:
        if tag == cid or tag.replace("_", "-") == cid:
            return cid
    return None


def main() -> None:
    valid_ids = load_career_ids()
    careers_data = json.loads(CAREERS.read_text(encoding="utf-8"))
    riasec_index = build_riasec_index(careers_data["careers"])

    data = json.loads(SCHOLARSHIPS.read_text(encoding="utf-8"))
    report = {
        "date": str(date.today()),
        "mapped_freeform": 0,
        "dropped_invalid": 0,
        "inferred_empty": 0,
        "unchanged_exact": 0,
        "samples": {"dropped": [], "inferred": []},
    }

    for sch in data["scholarships"]:
        raw = sch.get("careerTags") or []
        normalized: list[str] = []
        for tag in raw:
            hit = normalize_tag(tag, valid_ids)
            if hit:
                if hit not in normalized:
                    normalized.append(hit)
                if tag in valid_ids:
                    report["unchanged_exact"] += 1
                else:
                    report["mapped_freeform"] += 1
            else:
                report["dropped_invalid"] += 1
                if len(report["samples"]["dropped"]) < 15:
                    report["samples"]["dropped"].append({"scholarship": sch["id"], "tag": tag})

        if not normalized and sch.get("riasecTags"):
            normalized = infer_career_tags(sch["riasecTags"], riasec_index)
            if normalized:
                report["inferred_empty"] += 1
                if len(report["samples"]["inferred"]) < 10:
                    report["samples"]["inferred"].append({"scholarship": sch["id"], "tags": normalized})

        sch["careerTags"] = normalized

    data["metadata"]["careerTagsNormalized"] = str(date.today())
    data["metadata"]["lastUpdated"] = str(date.today())
    SCHOLARSHIPS.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
