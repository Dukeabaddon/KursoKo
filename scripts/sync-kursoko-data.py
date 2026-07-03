#!/usr/bin/env python3
"""Sync docs/plans/kursoko-data staging JSON into src/data runtime files."""
from __future__ import annotations

import json
import re
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / "docs/plans/kursoko-data"
RUNTIME_UNI = ROOT / "src/data/universities.json"
RUNTIME_SCH = ROOT / "src/data/scholarships.json"
REPORT = ROOT / "docs/plans/kursoko-data/sync-report.json"

ALLOWED_RIASEC = set("RIASEC")

UNIVERSITY_ID_ALIASES = {
    "pup-main": "pup-manila",
    "ateneo-de-manila": "ateneo-manila",
}

WEBSITE_FIXES = {
    "up-diliman": "https://upd.edu.ph/",
}

LOCATION_LGU = {
    "quezon city": ("Quezon City", "quezon-city"),
    "manila": ("Manila", "manila"),
    "sta. mesa": ("Manila", "manila"),
    "santa mesa": ("Manila", "manila"),
    "san juan": ("San Juan", "san-juan"),
    "pasig": ("Pasig", "pasig"),
    "makati": ("Makati", "makati"),
    "taguig": ("Taguig", "taguig"),
    "pasay": ("Pasay", "pasay"),
    "muntinlupa": ("Muntinlupa", "muntinlupa"),
    "paranaque": ("Parañaque", "paranaque"),
    "parañaque": ("Parañaque", "paranaque"),
    "las pinas": ("Las Piñas", "las-pinas"),
    "las piñas": ("Las Piñas", "las-pinas"),
    "caloocan": ("Caloocan", "caloocan"),
    "malabon": ("Malabon", "malabon"),
    "navotas": ("Navotas", "navotas"),
    "valenzuela": ("Valenzuela", "valenzuela"),
    "marikina": ("Marikina", "marikina"),
    "mandaluyong": ("Mandaluyong", "mandaluyong"),
    "cavite": ("Cavite", "cavite"),
    "laguna": ("Laguna", "laguna"),
    "bulacan": ("Bulacan", "bulacan"),
    "rizal": ("Rizal", "rizal"),
    "antipolo": ("Antipolo", "antipolo"),
    "pampanga": ("Pampanga", "pampanga"),
}

SCHOLARSHIP_ID_ALIASES = {
    "dlsu-archer-achiever": "dlsu-archer-achiever-tier",
    "ateneo-financial-aid": "admu-financial-aid",
}


CAREER_TAG_MAP = {
    "software engineering": "software-engineer",
    "computer science": "software-engineer",
    "information technology": "software-engineer",
    "engineering": "mechanical-engineer",
    "mechanical engineering": "mechanical-engineer",
    "civil engineering": "civil-engineer",
    "architecture": "architect",
    "business administration": "entrepreneur",
    "accountancy": "accountant",
    "accounting": "accountant",
    "psychology": "psychologist",
    "nursing": "nurse",
    "education": "teacher",
    "marketing": "marketing-manager",
    "data science": "data-analyst",
    "social work": "social-worker",
    "pharmacy": "pharmacist",
    "culinary": "chef",
    "hospitality": "chef",
    "law": "lawyer",
    "legal studies": "lawyer",
    "graphic design": "graphic-designer",
    "multimedia arts": "content-creator",
    "human resources": "hr-specialist",
    "hr": "hr-specialist",
}


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = text.replace("ñ", "n").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def normalize_career_tags(raw: list | None) -> list[str]:
    if not raw:
        return []
    out: list[str] = []
    for tag in raw:
        if not isinstance(tag, str):
            continue
        if re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", tag):
            out.append(tag)
            continue
        mapped = CAREER_TAG_MAP.get(tag.lower().strip())
        if mapped:
            out.append(mapped)
        else:
            out.append(slugify(tag))
    return list(dict.fromkeys(out))
    text = text.lower().strip()
    text = text.replace("ñ", "n").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def normalize_riasec_tags(raw: list | None) -> list[str]:
    if not raw:
        return []
    letters: set[str] = set()
    for token in raw:
        if not isinstance(token, str):
            continue
        for ch in token.upper():
            if ch in ALLOWED_RIASEC:
                letters.add(ch)
    return sorted(letters)


def infer_city_lgu(location: str, region: str) -> tuple[str, str]:
    loc = (location or "").lower()
    for needle, (city, lgu) in LOCATION_LGU.items():
        if needle in loc:
            return city, lgu
    if region == "NCR":
        return location or "NCR", slugify(location or "ncr")
    return location or region or "Philippines", slugify(location or region or "philippines")


def normalize_strength_tags(tags: list | None) -> list[str]:
    if not tags:
        return []
    out = []
    for tag in tags:
        if not isinstance(tag, str):
            continue
        out.append(slugify(tag.replace("_", " ")))
    return list(dict.fromkeys(out))


def build_program_index(programs: list) -> dict[str, list[str]]:
    by_inst: dict[str, list[str]] = defaultdict(list)
    for row in programs:
        inst = row.get("institutionId")
        name = row.get("name")
        if inst and name and row.get("status", "active") == "active":
            by_inst[inst].append(name)
    expanded: dict[str, list[str]] = {}
    for inst, names in by_inst.items():
        trimmed = names[:5]
        expanded[inst] = trimmed
        runtime_id = UNIVERSITY_ID_ALIASES.get(inst)
        if runtime_id:
            expanded[runtime_id] = trimmed
    return expanded


def normalize_university(row: dict, programs_by_inst: dict[str, list[str]], report: dict) -> dict:
    uni_id = row["id"]
    runtime_id = UNIVERSITY_ID_ALIASES.get(uni_id, uni_id)
    if runtime_id != uni_id:
        report["university_id_aliases"].append({"staging": uni_id, "runtime": runtime_id})

    city, lgu_id = infer_city_lgu(row.get("location", ""), row.get("region", ""))
    website = WEBSITE_FIXES.get(uni_id, row.get("website", ""))
    if uni_id not in WEBSITE_FIXES and row.get("linkCheck", {}).get("finalUrl"):
        website = row["linkCheck"]["finalUrl"]

    riasec_before = row.get("riasecTags") or []
    riasec = normalize_riasec_tags(riasec_before)
    if riasec_before and riasec != sorted({c for t in riasec_before for c in t.upper() if c in ALLOWED_RIASEC}):
        report["riasec_normalized_universities"].append(uni_id)

    popular = programs_by_inst.get(uni_id) or programs_by_inst.get(runtime_id) or []

    return {
        "id": runtime_id,
        "name": row["name"],
        "type": row.get("type", "private"),
        "city": city,
        "lguId": lgu_id,
        "region": row.get("region", "NCR"),
        "location": row.get("location", city),
        "description": row.get("description", ""),
        "tuition": row.get("tuition", "Verify on official site"),
        "popularCourses": popular,
        "website": website,
        "riasecTags": riasec,
        "strengthTags": normalize_strength_tags(row.get("strengthTags")),
    }


def normalize_scholarship(row: dict, report: dict) -> dict:
    sch_id = row["id"]
    runtime_id = SCHOLARSHIP_ID_ALIASES.get(sch_id, sch_id)
    if runtime_id != sch_id:
        report["scholarship_id_aliases"].append({"staging": sch_id, "runtime": runtime_id})

    level = row.get("level") or []
    if isinstance(level, str):
        level = [level]

    location = row.get("location") or []
    if isinstance(location, str):
        location = [location]

    benefits = row.get("benefits") or []
    if not benefits and row.get("benefitSummary"):
        benefits = [row["benefitSummary"]]

    out = {
        "id": runtime_id,
        "provider": row.get("provider", ""),
        "category": row.get("category", "government"),
        "name": row.get("name", ""),
        "status": row.get("status", "active"),
        "eligibility": row.get("eligibility") or [],
        "benefits": benefits,
        "coverage": row.get("coverage") or [],
        "requirements": row.get("requirements") or [],
        "location": location,
        "level": level,
        "riasecTags": normalize_riasec_tags(row.get("riasecTags")),
        "careerTags": normalize_career_tags(row.get("careerTags")),
        "institutionTags": [slugify(t) for t in (row.get("institutionTags") or [])],
        "applicationLink": row.get("applicationLink", ""),
        "deadlineNotes": row.get("deadlineNotes", "Check official provider for current deadlines."),
        "verificationDate": row.get("verificationDate", str(date.today())),
        "verificationSource": row.get("verificationSource", row.get("applicationLink", "")),
    }

    if row.get("residencyRule"):
        out["residencyRule"] = row["residencyRule"]

    if row.get("applicantNotes"):
        out["deadlineNotes"] = f"{out['deadlineNotes']} {row['applicantNotes']}".strip()

    if not out["riasecTags"] and not out["careerTags"] and out["category"] in ("government", "private"):
        out["riasecTags"] = ["R", "I", "A", "S", "E", "C"]
        report.setdefault("scholarships_broad_riasec_fallback", []).append(runtime_id)

    return out


def merge_universities(staging_rows: list, runtime_rows: list, programs_by_inst: dict, report: dict) -> list:
    by_id: dict[str, dict] = {}

    for row in staging_rows:
        if row.get("status") == "deprecated":
            continue
        norm = normalize_university(row, programs_by_inst, report)
        by_id[norm["id"]] = norm

    for row in runtime_rows:
        rid = row["id"]
        if rid in by_id:
            existing = by_id[rid]
            for key in ("popularCourses", "lguId", "city", "strengthTags"):
                if not existing.get(key) and row.get(key):
                    existing[key] = row[key]
            report["universities_merged"].append(rid)
        else:
            by_id[rid] = row
            report["universities_runtime_only"].append(rid)

    return sorted(by_id.values(), key=lambda u: u["name"].lower())


def merge_scholarships(staging_rows: list, runtime_rows: list, report: dict) -> list:
    by_id: dict[str, dict] = {}

    for row in staging_rows:
        if row.get("status") not in (None, "active"):
            continue
        norm = normalize_scholarship(row, report)
        by_id[norm["id"]] = norm

    for row in runtime_rows:
        rid = row["id"]
        if rid in by_id:
            report["scholarships_merged"].append(rid)
        else:
            by_id[rid] = row
            report["scholarships_runtime_only"].append(rid)

    return sorted(by_id.values(), key=lambda s: s["name"].lower())


def validate(universities: list, scholarships: list, report: dict) -> None:
    for uni in universities:
        missing = [k for k in ("id", "name", "website", "region") if not uni.get(k)]
        if missing:
            report["validation_errors"].append({"type": "university", "id": uni.get("id"), "missing": missing})
        bad_riasec = [t for t in uni.get("riasecTags", []) if t not in ALLOWED_RIASEC]
        if bad_riasec:
            report["validation_errors"].append({"type": "university_riasec", "id": uni["id"], "bad": bad_riasec})

    ids = [s["id"] for s in scholarships]
    if len(ids) != len(set(ids)):
        report["validation_errors"].append({"type": "scholarship_duplicate_ids"})

    for sch in scholarships:
        if not sch.get("applicationLink"):
            report["validation_warnings"].append({"type": "scholarship_no_link", "id": sch["id"]})


def main() -> None:
    staging_uni = json.loads((STAGING / "universities.json").read_text())
    staging_sch = json.loads((STAGING / "scholarships.json").read_text())
    programs = json.loads((STAGING / "programs.json").read_text())
    runtime_uni = json.loads(RUNTIME_UNI.read_text())
    runtime_sch = json.loads(RUNTIME_SCH.read_text())

    programs_by_inst = build_program_index(programs.get("programs", []))

    report = {
        "syncedAt": str(date.today()),
        "university_id_aliases": [],
        "scholarship_id_aliases": [],
        "riasec_normalized_universities": [],
        "universities_merged": [],
        "universities_runtime_only": [],
        "scholarships_merged": [],
        "scholarships_runtime_only": [],
        "validation_errors": [],
        "validation_warnings": [],
    }

    universities = merge_universities(
        staging_uni.get("universities", []),
        runtime_uni.get("universities", []),
        programs_by_inst,
        report,
    )
    scholarships = merge_scholarships(
        staging_sch.get("scholarships", []),
        runtime_sch.get("scholarships", []),
        report,
    )

    validate(universities, scholarships, report)

    uni_out = {
        "metadata": {
            "region": "NCR + CALABARZON + Central Luzon (partial)",
            "version": "2.0.0",
            "lastUpdated": str(date.today()),
            "count": len(universities),
            "disclaimer": "Match labels are guidance only. Verify programs, fees, and admission on each school's official site.",
            "source": "docs/plans/kursoko-data/universities.json",
        },
        "universities": universities,
    }
    sch_out = {
        "metadata": {
            "version": "2.0.0",
            "lastUpdated": str(date.today()),
            "count": len(scholarships),
            "disclaimer": "Verify eligibility, award amount, and application windows on each official provider site before applying. KursoKo does not process applications.",
            "verificationPolicy": "Entries include verificationDate and verificationSource from official scholarship, university, or government pages.",
            "source": "docs/plans/kursoko-data/scholarships.json",
        },
        "scholarships": scholarships,
    }

    RUNTIME_UNI.write_text(json.dumps(uni_out, indent=2, ensure_ascii=False) + "\n")
    RUNTIME_SCH.write_text(json.dumps(sch_out, indent=2, ensure_ascii=False) + "\n")
    REPORT.write_text(json.dumps({**report, "counts": {"universities": len(universities), "scholarships": len(scholarships)}}, indent=2) + "\n")

    print(f"Universities: {len(universities)}")
    print(f"Scholarships: {len(scholarships)}")
    print(f"Validation errors: {len(report['validation_errors'])}")
    print(f"Validation warnings: {len(report['validation_warnings'])}")
    print(f"Report: {REPORT.relative_to(ROOT)}")

    if report["validation_errors"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
