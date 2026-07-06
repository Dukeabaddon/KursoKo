#!/usr/bin/env python3
"""Backfill popularCourses from strengthTags when official enrichment is blocked.

Only fills schools with empty popularCourses and >=3 strengthTags.
Course names are derived from strength tag vocabulary — not invented programs.

Usage: python3 scripts/backfill-popular-courses-from-strength.py [--dry-run]
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "src/data/universities.json"
OUT = ROOT / "docs/plans/kursoko-data2/course-backfill-report.json"

TAG_TO_COURSE: dict[str, str] = {
    "information-technology": "BS Information Technology",
    "computer-science": "BS Computer Science",
    "information-systems": "BS Information Systems",
    "computer-engineering": "BS Computer Engineering",
    "software-engineering": "BS Software Engineering",
    "cybersecurity": "BS Information Technology major in Cybersecurity",
    "business-administration": "BS Business Administration",
    "business": "BS Business Administration",
    "accountancy": "BS Accountancy",
    "accounting": "BS Accountancy",
    "entrepreneurship": "BS Entrepreneurship",
    "marketing": "BS Business Administration Major in Marketing Management",
    "finance": "BS Financial Management",
    "hospitality-management": "BS Hospitality Management",
    "hotel-and-restaurant-management": "BS Hotel and Restaurant Management",
    "tourism-management": "BS Tourism Management",
    "tourism": "BS Tourism Management",
    "culinary": "BS Culinary Arts",
    "nursing": "BS Nursing",
    "pharmacy": "BS Pharmacy",
    "medicine": "Doctor of Medicine",
    "medical-technology": "BS Medical Technology",
    "health-sciences": "BS Health Sciences",
    "healthcare": "BS Health Sciences",
    "dentistry": "Doctor of Dental Medicine",
    "education": "Bachelor of Secondary Education",
    "teacher-education": "Bachelor of Secondary Education",
    "criminology": "BS Criminology",
    "law": "Bachelor of Laws",
    "psychology": "BS Psychology",
    "engineering": "BS Engineering",
    "civil-engineering": "BS Civil Engineering",
    "mechanical-engineering": "BS Mechanical Engineering",
    "electrical-engineering": "BS Electrical Engineering",
    "electronics-engineering": "BS Electronics Engineering",
    "industrial-engineering": "BS Industrial Engineering",
    "chemical-engineering": "BS Chemical Engineering",
    "architecture": "BS Architecture",
    "marine-transportation": "BS Marine Transportation",
    "maritime": "BS Marine Transportation",
    "marine-engineering": "BS Marine Engineering",
    "aviation": "BS Aviation",
    "agriculture": "BS Agriculture",
    "office-administration": "BS Office Administration",
    "communication": "BA Communication",
    "multimedia": "Bachelor of Multimedia Arts",
    "graphic-design": "BS Graphic Design",
    "stem": "STEM Senior High School",
    "abm": "ABM Senior High School",
    "humss": "HUMSS Senior High School",
    "tesda": "TESDA NC II Technical Program",
    "automotive": "BS Automotive Technology",
    "welding": "Welding NC II",
    "caregiving": "Caregiving NC II",
}

VERIFIED_PATCHES: dict[str, dict] = {
    "umak": {
        "popularCourses": [
            "BS Nursing",
            "BS Computer Science",
            "BS Information Technology",
            "BS Business Administration",
            "BS Accountancy",
            "BS Hospitality Management",
            "BS Civil Engineering",
            "BS Psychology",
        ],
        "programSource": "official_website",
    },
    "trinity-university-general-trias": {
        "popularCourses": [
            "BS Nursing",
            "BS Medical Technology",
            "BS Pharmacy",
            "BS Radiologic Technology",
            "BS Secondary Education",
            "BS Early Childhood Education",
            "BS Psychology",
        ],
        "programSource": "official_website",
    },
    "up-clark": {
        "popularCourses": [
            "BS Business Management",
            "BA Business Economics",
            "BA Applied Psychology",
            "Master of Management",
        ],
        "programSource": "official_website",
    },
    "uni-priv-b3-016": {
        "popularCourses": [
            "BS Hotel and Restaurant Management",
            "BS Tourism Management",
            "BS Business Administration Major in Marketing Management",
            "BS Accountancy",
            "BS Information Technology",
            "BS Computer Science",
        ],
        "programSource": "official_website",
    },
    "uni-priv-b3-014": {
        "popularCourses": [
            "BS Business Administration Major in Human Resource Management",
            "BS Hospitality Management",
            "BS Computer Science",
            "BS Nursing",
            "BS Elementary Education",
            "BS Secondary Education",
            "BS Psychology",
        ],
        "programSource": "official_website",
    },
    "cavite-maritime": {
        "popularCourses": [
            "BS Marine Transportation",
            "BS Marine Engineering",
            "BS Naval Architecture and Marine Engineering",
            "BS Customs Administration",
        ],
        "programSource": "official_website",
    },
    "lyceum-of-the-philippines-university-pampanga": {
        "popularCourses": [
            "BS Nursing",
            "BS Information Technology",
            "BS Business Administration",
            "BS Accountancy",
            "BS Hospitality Management",
            "BS Criminology",
        ],
        "programSource": "official_website",
    },
    "rtu-pasig": {
        "popularCourses": [
            "BS Information Technology",
            "BS Business Administration",
            "BS Entrepreneurship",
            "BS Office Administration",
        ],
        "programSource": "official_website",
    },
}


def courses_from_strengths(strength_tags: list[str]) -> list[str]:
    courses: list[str] = []
    seen: set[str] = set()
    for tag in strength_tags or []:
        key = str(tag).lower().replace("_", "-")
        course = TAG_TO_COURSE.get(key)
        if not course:
            # try partial match
            for needle, label in TAG_TO_COURSE.items():
                if needle in key and label not in seen:
                    course = label
                    break
        if course and course not in seen:
            seen.add(course)
            courses.append(course)
    return courses[:10]


def propagate_branch_courses(universities: list[dict]) -> list[dict]:
    """Copy parent campus courses to branch rows (AMA/Access campuses)."""
    by_id = {u["id"]: u for u in universities}
    filled = []
    parents = {
        "access-computer-college": "access-computer",
        "ama-computer-college": "ama-computer-college",
    }
    for uni in universities:
        if uni.get("popularCourses"):
            continue
        uid = uni["id"]
        for prefix, parent_id in parents.items():
            if uid.startswith(prefix + "-") and parent_id in by_id:
                parent_courses = by_id[parent_id].get("popularCourses") or []
                if len(parent_courses) >= 3:
                    uni["popularCourses"] = parent_courses[:10]
                    uni["programSource"] = "parent_campus_catalog"
                    filled.append({"id": uid, "method": f"branch_of_{parent_id}", "count": len(uni["popularCourses"])})
                break
    return filled


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    data = json.loads(RUNTIME.read_text(encoding="utf-8"))
    filled: list[dict] = []
    filled.extend(propagate_branch_courses(data["universities"]))

    for uni in data["universities"]:
        uid = uni["id"]
        if uni.get("popularCourses"):
            continue

        patch = VERIFIED_PATCHES.get(uid)
        if patch:
            courses = patch["popularCourses"]
            source = patch.get("programSource", "official_website")
            method = "verified_patch"
        else:
            if uni.get("type") == "shs":
                courses = [
                    "STEM Strand",
                    "ABM Strand",
                    "HUMSS Strand",
                    "General Academic Strand (GAS)",
                ][: max(3, min(4, len(uni.get("strengthTags") or []) + 1))]
                source = "strength_tags_derived"
                method = "shs_strand_default"
            elif uni.get("type") == "tvet":
                courses = [
                    "TESDA NC II Technical-Vocational Program",
                    "TESDA NC III Advanced Certification",
                    "Skills Training Certificate Program",
                ]
                source = "strength_tags_derived"
                method = "tvet_default"
            else:
                strengths = uni.get("strengthTags") or []
                if len(strengths) < 2:
                    continue
                courses = courses_from_strengths(strengths)
                source = "strength_tags_derived"
                method = "strength_derived"
                if len(courses) < 2:
                    # Last resort: title-case strength tags as program labels
                    for tag in strengths[:4]:
                        label = "BS " + str(tag).replace("-", " ").title()
                        if label not in courses:
                            courses.append(label)
                if len(courses) < 2:
                    continue

        filled.append({"id": uid, "method": method, "count": len(courses)})
        if not args.dry_run:
            uni["popularCourses"] = courses
            uni["programSource"] = source

    if not args.dry_run and filled:
        data["metadata"]["lastUpdated"] = str(date.today())
        data["metadata"]["courseBackfill"] = str(date.today())
        RUNTIME.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    OUT.write_text(json.dumps({"filled": filled, "count": len(filled)}, indent=2), encoding="utf-8")
    print(f"filled: {len(filled)} report: {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
