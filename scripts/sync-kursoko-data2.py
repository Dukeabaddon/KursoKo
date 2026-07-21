#!/usr/bin/env python3
"""Sync docs/plans/kursoko-data2 staging JSON into src/data runtime files.

Handles semi-structured research dumps:
- mixed university/scholarship objects in universities*.json
- string fields that must become arrays
- category/type/level vocabulary mapping
- id + name dedupe against production
"""
from __future__ import annotations

import json
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from university_riasec_derive import derive_riasec_tags

ROOT = Path(__file__).resolve().parents[1]
STAGING = ROOT / "docs/plans/kursoko-data2"
RUNTIME_UNI = ROOT / "src/data/universities.json"
RUNTIME_SCH = ROOT / "src/data/scholarships.json"
REPORT = STAGING / "sync-report.json"
VALIDATION = STAGING / "validation-report.json"

ALLOWED_RIASEC = set("RIASEC")

TYPE_MAP = {
    "private": "private",
    "private-college": "private",
    "private-university": "private",
    "private-school": "private",
    "specialty-school": "private",
    "chain-school": "private",
    "public": "public",
    "public-college": "public",
    "suc": "public",
    "luc": "public",
    "tvet": "tvet",
    "shs": "shs",
}

CATEGORY_MAP = {
    "government": "government",
    "lgu": "government",
    "private": "private",
    "private-foundation": "private",
    "corporate": "private",
    "university": "university",
    "university-specific": "university",
    "international": "international",
    "tvet": "government",
    "shs": "government",
}

LEVEL_MAP = {
    "undergraduate": "college",
    "college": "college",
    "graduate": "graduate",
    "shs": "shs",
    "senior high": "shs",
    "senior-high": "shs",
    "tvet": "tvet",
    "training": "training",
    "continuing-education": "continuing-education",
    "elementary": "elementary",
    "all-levels": "college",
    "all levels": "college",
}

LOCATION_LGU = {
    "quezon city": ("Quezon City", "quezon-city"),
    "manila": ("Manila", "manila"),
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
    "dasmarinas": ("Dasmariñas", "dasmarinas"),
    "dasmariñas": ("Dasmariñas", "dasmarinas"),
    "general trias": ("General Trias", "general-trias"),
    "gen. trias": ("General Trias", "general-trias"),
    "imus": ("Imus", "imus"),
    "bacoor": ("Bacoor", "bacoor"),
    "silang": ("Silang", "silang"),
    "laguna": ("Laguna", "laguna"),
    "santa rosa": ("Santa Rosa", "santa-rosa"),
    "sta. rosa": ("Santa Rosa", "santa-rosa"),
    "calamba": ("Calamba", "calamba"),
    "san pedro": ("San Pedro", "san-pedro"),
    "binan": ("Biñan", "binan"),
    "biñan": ("Biñan", "binan"),
    "bulacan": ("Bulacan", "bulacan"),
    "malolos": ("Malolos", "malolos"),
    "meycauayan": ("Meycauayan", "meycauayan"),
    "guiguinto": ("Guiguinto", "guiguinto"),
    "rizal": ("Rizal", "rizal"),
    "antipolo": ("Antipolo", "antipolo"),
    "binangonan": ("Binangonan", "binangonan"),
    "pampanga": ("Pampanga", "pampanga"),
    "angeles": ("Angeles", "angeles"),
    "san fernando": ("San Fernando", "san-fernando"),
    "apalit": ("Apalit", "apalit"),
    "canlubang": ("Calamba", "calamba"),
    "ortigas": ("Pasig", "pasig"),
    "global city": ("Taguig", "taguig"),
    "bgc": ("Taguig", "taguig"),
    "munoz": ("Quezon City", "quezon-city"),
    "muñoz": ("Quezon City", "quezon-city"),
    "novaliches": ("Quezon City", "quezon-city"),
    "recto": ("Manila", "manila"),
    "cubao": ("Quezon City", "quezon-city"),
    "arca south": ("Taguig", "taguig"),
}

# Near-duplicate production names (staging name -> skip reason)
NAME_SKIP_ALIASES = {
    "de la salle santiago zobel": "de-la-salle-zobel",
    "st michael s college of laguna shs college": "saint-michael-college-laguna",
    "st michaels college of laguna shs college": "saint-michael-college-laguna",
    "tesda women s center twc": "tesda-women-center",
    "tesda womens center twc": "tesda-women-center",
}

# Prod already carries campus-level AMA (ama-computer-santa-rosa), so
# AMA/Access campuses now sync like STI campuses. Keep set for future policy skips.
SKIP_UNIVERSITY_IDS: set[str] = set()

# Runtime rows superseded by a richer duplicate (removed during merge)
REMOVE_RUNTIME_IDS = {
    # dup of san-beda-college-alabang (richer courses/strength tags)
    "san-beda-alabang",
}

# Scholarship soft-dups / branding overlaps (sch agent)
SKIP_SCHOLARSHIP_IDS = {
    "sch-gov-099",
    "sch-gov-100",
    "sch-gov-101",
    "sch-gov-pma-cadetship",
    "sch-lgu-qcydo-acad",
    "sch-lgu-qcydo-athlete",
    "sch-lgu-qcydo-pwd",
    "sch-uni-feu-grades",
    "sch-uni-105",  # Miriam FA — prod miriam-financial-aid
}

# Known bad application links to rewrite in runtime
LINK_FIXES = {
    "sch-gov-092": "https://www.sei.dost.gov.ph/",
    "sch-gov-093": "https://www.sei.dost.gov.ph/",
}

CAREER_TAG_MAP = {
    "software engineering": "software-engineer",
    "computer science": "software-engineer",
    "information technology": "software-engineer",
    "it professional": "software-engineer",
    "engineer": "mechanical-engineer",
    "engineering": "mechanical-engineer",
    "mechanical engineering": "mechanical-engineer",
    "civil engineering": "civil-engineer",
    "architecture": "architect",
    "business administration": "entrepreneur",
    "entrepreneur": "entrepreneur",
    "small business owner": "entrepreneur",
    "accountancy": "accountant",
    "accounting": "accountant",
    "psychology": "psychologist",
    "nursing": "nurse",
    "education": "teacher",
    "teacher": "teacher",
    "marketing": "marketing-manager",
    "data science": "data-analyst",
    "social work": "social-worker",
    "social worker": "social-worker",
    "pharmacy": "pharmacist",
    "culinary": "chef",
    "hospitality": "chef",
    "law": "lawyer",
    "lawyer": "lawyer",
    "legal studies": "lawyer",
    "graphic design": "graphic-designer",
    "multimedia arts": "content-creator",
    "artist": "graphic-designer",
    "performer": "content-creator",
    "athlete": "content-creator",
    "human resources": "hr-specialist",
    "hr": "hr-specialist",
    "scientist": "research-scientist",
    "researcher": "research-scientist",
    "mathematician": "research-scientist",
    "agriculturist": "research-scientist",
    "agricultural engineer": "mechanical-engineer",
    "veterinarian": "nurse",
    "counselor": "psychologist",
}


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = text.replace("ñ", "n").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u")
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def norm_name(text: str) -> str:
    text = (text or "").lower().strip()
    text = text.replace("ñ", "n")
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def to_str_list(val) -> list[str]:
    if val is None:
        return []
    if isinstance(val, list):
        return [str(x).strip() for x in val if str(x).strip()]
    if isinstance(val, str):
        s = val.strip()
        if not s:
            return []
        if ";" in s:
            return [p.strip() for p in s.split(";") if p.strip()]
        return [s]
    return [str(val)]


def normalize_riasec_tags(raw) -> list[str]:
    if not raw:
        return []
    letters: set[str] = set()
    for token in to_str_list(raw):
        for ch in token.upper():
            if ch in ALLOWED_RIASEC:
                letters.add(ch)
    return sorted(letters)


def normalize_career_tags(raw) -> list[str]:
    out: list[str] = []
    for tag in to_str_list(raw):
        if re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", tag):
            out.append(tag)
            continue
        mapped = CAREER_TAG_MAP.get(tag.lower().strip())
        out.append(mapped or slugify(tag))
    return list(dict.fromkeys(out))


def normalize_strength_tags(tags) -> list[str]:
    out = []
    for tag in to_str_list(tags):
        out.append(slugify(tag.replace("_", " ")))
    return list(dict.fromkeys(out))


def infer_city_lgu(location: str, region: str) -> tuple[str, str]:
    loc = (location or "").lower()
    # Prefer longer needles first
    for needle, (city, lgu) in sorted(LOCATION_LGU.items(), key=lambda x: -len(x[0])):
        if needle in loc:
            return city, lgu
    if region:
        return region, slugify(region)
    return location or "Philippines", slugify(location or "philippines")


def map_type(raw: str, row_id: str = "") -> str:
    rid = (row_id or "").lower()
    if rid.startswith("uni-shs") or "-shs-" in rid:
        return "shs"
    if rid.startswith("uni-tvet") or "-tvet-" in rid:
        return "tvet"
    return TYPE_MAP.get((raw or "private").lower(), "private")


def map_category(raw: str) -> str:
    return CATEGORY_MAP.get((raw or "government").lower(), "private")


def map_levels(raw) -> list[str]:
    levels = []
    for item in to_str_list(raw):
        mapped = LEVEL_MAP.get(item.lower().strip())
        if mapped:
            levels.append(mapped)
        else:
            levels.append(slugify(item))
    return list(dict.fromkeys(levels)) or ["college"]


def map_locations(raw) -> list[str]:
    items = to_str_list(raw)
    out = []
    for item in items:
        low = item.lower()
        if "national" in low or "philippines" in low:
            out.append("Philippines")
        else:
            out.append(item)
    return list(dict.fromkeys(out)) or ["Philippines"]


def website_from_row(row: dict) -> str:
    website = row.get("website") or row.get("applicationLink") or ""
    link_check = row.get("linkCheck")
    if isinstance(link_check, dict) and link_check.get("finalUrl"):
        return link_check["finalUrl"]
    return website


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def load_staging_universities() -> list[dict]:
    rows: list[dict] = []
    combined = STAGING / "_staging-universities.json"
    if combined.exists():
        rows.extend(load_json(combined).get("universities", []))
    else:
        for name, key in (
            ("universities.json", "universities"),
            ("universities2.json", "newUniversities"),
            ("universities2.json", "universities"),
        ):
            path = STAGING / name
            if path.exists():
                data = load_json(path)
                rows.extend(data.get(key, []))
    by_id = {}
    for row in rows:
        if row.get("id") and not str(row["id"]).startswith("sch-") and not row.get("provider"):
            by_id[row["id"]] = row
    return list(by_id.values())


def load_staging_scholarships() -> list[dict]:
    rows: list[dict] = []
    combined = STAGING / "_staging-scholarships.json"
    if combined.exists():
        rows.extend(load_json(combined).get("scholarships", []))
    else:
        for name in ("scholarships.json", "scholarships2.json", "scholarships-recovered.json"):
            path = STAGING / name
            if path.exists():
                rows.extend(load_json(path).get("scholarships", []))
    by_id = {}
    for row in rows:
        if row.get("id") and (str(row["id"]).startswith("sch-") or row.get("provider")):
            by_id[row["id"]] = row
    return list(by_id.values())


def normalize_university(row: dict) -> dict:
    city, lgu_id = infer_city_lgu(row.get("location", ""), row.get("region", ""))
    location = row.get("location") or city
    return {
        "id": row["id"],
        "name": row["name"],
        "type": map_type(row.get("type", "private"), row.get("id", "")),
        "city": city,
        "lguId": lgu_id,
        "region": row.get("region") or city,
        "location": location,
        "description": row.get("description") or "",
        "tuition": row.get("tuition") or "Verify on official site",
        "popularCourses": row.get("popularCourses") or [],
        "website": website_from_row(row),
        "riasecTags": normalize_riasec_tags(row.get("riasecTags")),
        "strengthTags": normalize_strength_tags(row.get("strengthTags")),
    }


def normalize_scholarship(row: dict, report: dict) -> dict | None:
    status = (row.get("status") or "active").lower()
    if status != "active":
        report["scholarships_skipped_status"].append({"id": row.get("id"), "status": status})
        return None

    category = map_category(row.get("category", "government"))
    out = {
        "id": row["id"],
        "provider": row.get("provider") or "",
        "category": category,
        "name": row.get("name") or "",
        "status": "active",
        "eligibility": to_str_list(row.get("eligibility")),
        "benefits": to_str_list(row.get("benefits")),
        "coverage": to_str_list(row.get("coverage")),
        "requirements": to_str_list(row.get("requirements")),
        "location": map_locations(row.get("location")),
        "level": map_levels(row.get("level")),
        "riasecTags": normalize_riasec_tags(row.get("riasecTags")),
        "careerTags": normalize_career_tags(row.get("careerTags")),
        "institutionTags": [slugify(t) for t in to_str_list(row.get("institutionTags"))],
        "applicationLink": row.get("applicationLink") or website_from_row(row),
        "deadlineNotes": row.get("deadlineNotes") or "Check official provider for current deadlines.",
        "verificationDate": row.get("verificationDate") or str(date.today()),
        "verificationSource": row.get("verificationSource") or row.get("applicationLink") or "",
    }

    if row.get("applicantNotes"):
        out["deadlineNotes"] = f"{out['deadlineNotes']} {row['applicantNotes']}".strip()

    # Broad RIASEC fallback so matcher still surfaces need-based aid
    if not out["riasecTags"] and not out["careerTags"]:
        out["riasecTags"] = ["R", "I", "A", "S", "E", "C"]
        report["scholarships_broad_riasec_fallback"].append(out["id"])

    return out


def should_skip_university(row: dict, report: dict) -> bool:
    rid = row.get("id") or ""
    if rid in SKIP_UNIVERSITY_IDS:
        report["universities_skipped_policy"].append({"id": rid, "reason": "umbrella-brand-policy"})
        return True
    name_key = norm_name(row.get("name", ""))
    if "st michael" in name_key and "laguna" in name_key:
        report["universities_skipped_policy"].append({"id": rid, "reason": "near-dup-smcl"})
        return True
    return False


def merge_universities(staging: list[dict], runtime: list[dict], report: dict) -> list[dict]:
    # Fix known prod id typo (leading space)
    cleaned_runtime = []
    for row in runtime:
        if row.get("id") in REMOVE_RUNTIME_IDS:
            report["universities_removed"].append(row["id"])
            continue
        if row.get("id") == " access-computer":
            row = {**row, "id": "access-computer"}
            report["universities_id_fixes"].append({"from": " access-computer", "to": "access-computer"})
        cleaned_runtime.append(row)

    by_id = {row["id"]: row for row in cleaned_runtime}
    by_name = {norm_name(row["name"]): row["id"] for row in cleaned_runtime}

    for row in staging:
        if row.get("status") and str(row["status"]).lower() not in ("active", "unknown", ""):
            report["universities_skipped_status"].append(row.get("id"))
            continue

        if should_skip_university(row, report):
            continue

        name_key = norm_name(row.get("name", ""))
        alias_target = NAME_SKIP_ALIASES.get(name_key)
        if alias_target and alias_target in by_id:
            report["universities_skipped_name_dup"].append(
                {"staging": row["id"], "runtime": alias_target, "name": row.get("name")}
            )
            continue

        if name_key in by_name:
            report["universities_skipped_name_dup"].append(
                {"staging": row["id"], "runtime": by_name[name_key], "name": row.get("name")}
            )
            continue

        if row["id"] in by_id:
            report["universities_skipped_id_dup"].append(row["id"])
            continue

        norm = normalize_university(row)
        # Prefer slug ids for new HEIs (keep staging id only if already slug-like without batch prefix)
        if re.match(r"^uni-(priv|tvet|shs|pub)-b\d+-", norm["id"]):
            slug = slugify(norm["name"])
            if slug and slug not in by_id:
                report["universities_id_rewrites"].append({"from": norm["id"], "to": slug})
                norm["id"] = slug

        if not norm.get("website"):
            report["universities_missing_website"].append(norm["id"])
        if not norm.get("riasecTags"):
            norm["riasecTags"] = derive_riasec_tags(norm)
            report.setdefault("universities_derived_riasec", []).append(norm["id"])

        # Drop SHS-* strength tags on HEI rows
        if norm["type"] == "private":
            norm["strengthTags"] = [t for t in norm["strengthTags"] if not t.startswith("shs")]

        by_id[norm["id"]] = norm
        by_name[name_key] = norm["id"]
        report["universities_added"].append(norm["id"])

    return sorted(by_id.values(), key=lambda u: u["name"].lower())


def merge_scholarships(staging: list[dict], runtime: list[dict], report: dict) -> list[dict]:
    by_id = {row["id"]: row for row in runtime}
    by_name = {norm_name(row["name"]): row["id"] for row in runtime}
    by_name_provider = {
        f"{norm_name(row['name'])}|{norm_name(row.get('provider', ''))}": row["id"] for row in runtime
    }

    # Fix known bad links on existing runtime rows
    for rid, url in LINK_FIXES.items():
        if rid in by_id and "phd-scholarships" in (by_id[rid].get("applicationLink") or ""):
            by_id[rid] = {**by_id[rid], "applicationLink": url, "verificationSource": url}
            report["scholarships_link_fixes"].append(rid)

    for row in staging:
        rid = row.get("id") or ""
        if rid in SKIP_SCHOLARSHIP_IDS:
            report["scholarships_skipped_policy"].append(rid)
            continue

        name_key = norm_name(row.get("name", ""))
        name_prov = f"{name_key}|{norm_name(row.get('provider', ''))}"

        if rid in by_id:
            report["scholarships_skipped_id_dup"].append(rid)
            continue
        if name_prov in by_name_provider:
            report["scholarships_skipped_name_dup"].append(
                {"staging": rid, "runtime": by_name_provider[name_prov], "name": row.get("name")}
            )
            continue
        if name_key in by_name:
            report["scholarships_skipped_name_dup"].append(
                {"staging": rid, "runtime": by_name[name_key], "name": row.get("name")}
            )
            continue

        norm = normalize_scholarship(row, report)
        if not norm:
            continue

        if norm["id"] in LINK_FIXES:
            norm["applicationLink"] = LINK_FIXES[norm["id"]]

        # Fix known typo id
        if norm["id"] == "sch-lgu-rod riguez" or "rod riguez" in norm["id"]:
            norm["id"] = "sch-lgu-rodriguez"

        by_id[norm["id"]] = norm
        by_name[name_key] = norm["id"]
        by_name_provider[name_prov] = norm["id"]
        report["scholarships_added"].append(norm["id"])

    return sorted(by_id.values(), key=lambda s: s["name"].lower())


def validate(universities: list, scholarships: list, report: dict) -> None:
    uni_ids = [u["id"] for u in universities]
    if len(uni_ids) != len(set(uni_ids)):
        report["validation_errors"].append({"type": "university_duplicate_ids"})

    sch_ids = [s["id"] for s in scholarships]
    if len(sch_ids) != len(set(sch_ids)):
        report["validation_errors"].append({"type": "scholarship_duplicate_ids"})

    for uni in universities:
        missing = [k for k in ("id", "name", "website", "region", "city", "lguId") if not uni.get(k)]
        if missing:
            report["validation_errors"].append({"type": "university", "id": uni.get("id"), "missing": missing})
        bad = [t for t in uni.get("riasecTags", []) if t not in ALLOWED_RIASEC]
        if bad:
            report["validation_errors"].append({"type": "university_riasec", "id": uni["id"], "bad": bad})

    for sch in scholarships:
        if not sch.get("applicationLink"):
            report["validation_warnings"].append({"type": "scholarship_no_link", "id": sch["id"]})
        if not isinstance(sch.get("eligibility"), list):
            report["validation_errors"].append({"type": "scholarship_not_array", "id": sch["id"], "field": "eligibility"})


def main() -> None:
    staging_uni = load_staging_universities()
    staging_sch = load_staging_scholarships()
    runtime_uni = load_json(RUNTIME_UNI)
    runtime_sch = load_json(RUNTIME_SCH)

    report = {
        "syncedAt": str(date.today()),
        "source": "docs/plans/kursoko-data2",
        "staging_counts": {
            "universities": len(staging_uni),
            "scholarships": len(staging_sch),
        },
        "universities_added": [],
        "universities_removed": [],
        "universities_skipped_id_dup": [],
        "universities_skipped_name_dup": [],
        "universities_skipped_status": [],
        "universities_skipped_policy": [],
        "universities_missing_website": [],
        "universities_broad_riasec_fallback": [],
        "universities_id_fixes": [],
        "universities_id_rewrites": [],
        "scholarships_added": [],
        "scholarships_skipped_id_dup": [],
        "scholarships_skipped_name_dup": [],
        "scholarships_skipped_status": [],
        "scholarships_skipped_policy": [],
        "scholarships_broad_riasec_fallback": [],
        "scholarships_link_fixes": [],
        "validation_errors": [],
        "validation_warnings": [],
        "notes": [
            "Careers/programs claimed in manifest.json are not present in data2 files — not synced.",
            "Misplaced scholarships recovered from universities*.json via scholarships-recovered.json.",
            "Policy: campus-level rows ADD (STI, AMA, Access); TVET/SHS staging rows ADD with mapped type.",
            "Policy: san-beda-alabang removed — duplicate of richer san-beda-college-alabang.",
            "Policy: QCYDO soft-dups SKIP (prod has QCSP suite); non-active scholarships SKIP.",
        ],
    }

    universities = merge_universities(staging_uni, runtime_uni.get("universities", []), report)
    for uni in universities:
        if not uni.get("riasecTags"):
            uni["riasecTags"] = derive_riasec_tags(uni)
    scholarships = merge_scholarships(staging_sch, runtime_sch.get("scholarships", []), report)
    validate(universities, scholarships, report)

    uni_out = {
        "metadata": {
            "region": "NCR + CALABARZON + Central Luzon (partial)",
            "version": "2.1.0",
            "lastUpdated": str(date.today()),
            "count": len(universities),
            "disclaimer": "Match labels are guidance only. Verify programs, fees, and admission on each school's official site.",
            "source": "docs/plans/kursoko-data + docs/plans/kursoko-data2",
        },
        "universities": universities,
    }
    sch_out = {
        "metadata": {
            "version": "2.1.0",
            "lastUpdated": str(date.today()),
            "count": len(scholarships),
            "disclaimer": "Verify eligibility, award amount, and application windows on each official provider site before applying. KursoKo does not process applications.",
            "verificationPolicy": "Entries include verificationDate and verificationSource from official scholarship, university, or government pages.",
            "source": "docs/plans/kursoko-data + docs/plans/kursoko-data2",
        },
        "scholarships": scholarships,
    }

    RUNTIME_UNI.write_text(json.dumps(uni_out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    RUNTIME_SCH.write_text(json.dumps(sch_out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    summary = {
        **report,
        "counts": {
            "universities_before": len(runtime_uni.get("universities", [])),
            "universities_after": len(universities),
            "universities_added": len(report["universities_added"]),
            "scholarships_before": len(runtime_sch.get("scholarships", [])),
            "scholarships_after": len(scholarships),
            "scholarships_added": len(report["scholarships_added"]),
        },
    }
    REPORT.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    validation = {
        "staging": report["staging_counts"],
        "skipped": {
            "universities_name_dup": len(report["universities_skipped_name_dup"]),
            "universities_id_dup": len(report["universities_skipped_id_dup"]),
            "scholarships_name_dup": len(report["scholarships_skipped_name_dup"]),
            "scholarships_id_dup": len(report["scholarships_skipped_id_dup"]),
        },
        "added": {
            "universities": report["universities_added"],
            "scholarships_count": len(report["scholarships_added"]),
            "scholarships_sample": report["scholarships_added"][:20],
        },
        "quality": {
            "broad_riasec_fallback_scholarships": len(report["scholarships_broad_riasec_fallback"]),
            "skipped_non_active_status": report["scholarships_skipped_status"],
            "missing_website_universities": report["universities_missing_website"],
        },
        "manifest_gaps": {
            "careers": "manifest claims +35 careers but no careers file in data2",
            "programs": "manifest claims +120 programs but no programs file in data2",
        },
        "runtime_counts": summary["counts"],
        "validation_errors": report["validation_errors"],
        "validation_warnings_count": len(report["validation_warnings"]),
    }
    VALIDATION.write_text(json.dumps(validation, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"Universities: {summary['counts']['universities_before']} -> {summary['counts']['universities_after']} (+{summary['counts']['universities_added']})")
    print(f"Scholarships: {summary['counts']['scholarships_before']} -> {summary['counts']['scholarships_after']} (+{summary['counts']['scholarships_added']})")
    print(f"Skipped uni name dups: {len(report['universities_skipped_name_dup'])}")
    print(f"Skipped sch name dups: {len(report['scholarships_skipped_name_dup'])}")
    print(f"Validation errors: {len(report['validation_errors'])}")
    print(f"Report: {REPORT.relative_to(ROOT)}")

    if report["validation_errors"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
