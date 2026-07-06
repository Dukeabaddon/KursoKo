#!/usr/bin/env python3
"""Crosswalk uniRank/QS composite top-100 PH universities vs runtime catalog."""
import json
import re
import unicodedata
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "src/data/universities.json"
OUT = ROOT / "docs/plans/kursoko-data2/research-top100-universities-2026-07-05.json"


def slug(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower().replace("mapúa", "mapua")
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


ALIASES = {
    slug("University of the Philippines Diliman"): "up-diliman",
    slug("University of the Philippines Manila"): "up-manila",
    slug("University of the Philippines Los Baños"): "uplb",
    slug("University of the Philippines Los Banos"): "uplb",
    slug("University of the Philippines System"): "up-diliman",
    slug("De La Salle University"): "dlsu-manila",
    slug("De La Salle University - Dasmarinas"): "dlsu-dasmarinas",
    slug("Ateneo de Manila University"): "ateneo-manila",
    slug("University of Santo Tomas"): "ust",
    slug("Polytechnic University of the Philippines"): "pup-manila",
    slug("Mapua University"): "mapua-university",
    slug("Far Eastern University"): "feu-manila",
    slug("FEU Institute of Technology"): "feu-institute-of-technology",
    slug("Adamson University"): "adamson-university",
    slug("Pamantasan ng Lungsod ng Maynila"): "plm",
    slug("Technological University of the Philippines"): "tup-manila",
    slug("National University"): "nu-manila",
    slug("University of Perpetual Help System DALTA"): "uphsl",
    slug("Our Lady of Fatima University"): "our-lady-of-fatima-university-pampanga",
    slug("Jose Rizal University"): "jru",
    slug("Centro Escolar University"): "ceu",
    slug("Arellano University"): "arellano-university",
    slug("Colegio de San Juan de Letran"): "lettran",
    slug("San Beda University"): "san-beda-university",
    slug("Holy Angel University"): "hau",
    slug("Angeles University Foundation"): "auf",
    slug("Bulacan State University"): "bulacan-state-university",
    slug("Batangas State University"): "batangas-state-university",
    slug("Central Luzon State University"): "central-luzon-state-university",
    slug("Pangasinan State University"): "pangasinan-state-university",
    slug("Philippine Normal University"): "pnu",
    slug("Lyceum of the Philippines University"): "lpu-manila",
    slug("Chiang Kai Shek College"): "chiang-kai-shek-college",
    slug("Asian Institute of Management"): None,
    slug("Southwestern University - PHINMA"): None,
    slug("University of the East"): "ue-manila",
    slug("Emilio Aguinaldo College"): "emilio-aguinaldo-college",
    slug("University of Science and Technology of Southern Philippines"): "university-of-science-and-technology-southern-philippines",
    slug("Nueva Ecija University of Science and Technology"): "nueva-ecija-university",
    slug("Manuel S. Enverga University Foundation"): "manuel-enverga",
    slug("Rizal Technological University"): "rtu",
    slug("Quezon City University"): "qcu",
    slug("University of Makati"): "umak",
    slug("Laguna State Polytechnic University"): "laguna-state-polytechnic-university",
    slug("Tarlac State University"): "tarlac-state-university",
    slug("University of Batangas"): "university-of-batangas",
    slug("New Era University"): "new-era-university",
    slug("Trinity University of Asia"): "trinity-university",
    slug("AMA Computer University"): "ama-computer-college",
    slug("De La Salle-College of Saint Benilde"): "benilde",
    slug("Mapua Malayan Colleges Laguna"): "mcl",
    slug("Technological Institute of the Philippines"): "tip-manila",
    slug("University of Asia and the Pacific"): "university-of-asia-and-the-pacific",
    slug("Quirino State University"): "quirino-state-university",
    slug("Adventist University of the Philippines"): "adventist-university-of-the-philippines",
    slug("University of Caloocan City"): "university-of-caloocan-city",
    slug("University of Rizal System"): "university-of-rizal-system",
    slug("Northwest Samar State University"): "northwest-samar-state-university",
    slug("Sorsogon State University"): "sorsogon-state-university",
    slug("Lorma Colleges"): "lorma-colleges",
    slug("St. Scholastica's College"): "st-scholasticas-college",
    slug("University of Assumption"): "ua",
}

# uniRank 2026 top 100 (web metrics) — primary list for crosswalk
UNIRANK_TOP100 = [
    "University of the Philippines Diliman",
    "Ateneo de Manila University",
    "De La Salle University",
    "University of the Philippines System",
    "University of Santo Tomas",
    "Polytechnic University of the Philippines",
    "University of the Philippines Los Baños",
    "Mapua University",
    "Ateneo de Davao University",
    "University of the Philippines Manila",
    "De La Salle-College of Saint Benilde",
    "University of San Carlos",
    "Silliman University",
    "Mindanao State University - Iligan Institute of Technology",
    "Far Eastern University",
    "Adamson University",
    "University of Mindanao",
    "Central Philippine University",
    "University of the East",
    "University of Perpetual Help System DALTA",
    "Lyceum of the Philippines University",
    "University of Southeastern Philippines",
    "Saint Louis University",
    "Xavier University - Ateneo de Cagayan",
    "West Visayas State University",
    "Technological University of the Philippines",
    "Bulacan State University",
    "Visayas State University",
    "Cebu Technological University",
    "University of the Immaculate Conception",
    "University of Baguio",
    "Bicol University",
    "Cagayan State University",
    "Central Luzon State University",
    "Pangasinan State University",
    "Philippine Normal University",
    "San Beda University",
    "University of Cebu",
    "Cebu Normal University",
    "University of Northern Philippines",
    "St. Paul University Philippines",
    "Isabela State University",
    "Colegio de San Juan de Letran",
    "Arellano University",
    "Holy Angel University",
    "Jose Rizal University",
    "Our Lady of Fatima University",
    "Centro Escolar University",
    "Emilio Aguinaldo College",
    "Pamantasan ng Lungsod ng Maynila",
    "National University",
    "University of Science and Technology of Southern Philippines",
    "Mariano Marcos State University",
    "Batangas State University",
    "Angeles University Foundation",
    "University of Southern Mindanao",
    "Western Mindanao State University",
    "University of the Philippines Visayas",
    "University of the Philippines Mindanao",
    "University of the Philippines Baguio",
    "University of the Philippines Open University",
    "University of the Philippines Cebu",
    "Mindanao State University",
    "Caraga State University",
    "Ifugao State University",
    "Notre Dame University",
    "Ateneo de Naga University",
    "Foundation University",
    "University of Assumption",
    "Laguna State Polytechnic University",
    "Tarlac State University",
    "Quezon City University",
    "University of Makati",
    "Don Mariano Marcos Memorial State University",
    "Iloilo Science and Technology University",
    "Leyte Normal University",
    "Samar State University",
    "Central Bicol State University of Agriculture",
    "Nueva Ecija University of Science and Technology",
    "University of Eastern Philippines",
    "Southern Leyte State University",
    "University of Cordilleras",
    "Western Philippine University",
    "Virgen Milagrosa University Foundation",
    "De La Salle University - Dasmarinas",
    "FEU Institute of Technology",
    "Mapua Malayan Colleges Laguna",
    "University of the Philippines Clark",
    "Eastern Visayas State University",
    "University of Batangas",
    "Manuel S. Enverga University Foundation",
    "New Era University",
    "Trinity University of Asia",
    "Philippine Women's University",
    "University of San Agustin",
    "University of Negros Occidental - Recoletos",
    "Rizal Technological University",
    "Southwestern University - PHINMA",
    "AMA Computer University",
    "Chiang Kai Shek College",
    "Asian Institute of Management",
    "University of Asia and the Pacific",
    "Technological Institute of the Philippines",
    "Quirino State University",
    "Adventist University of the Philippines",
    "University of Caloocan City",
    "University of Rizal System",
    "Northwest Samar State University",
    "Sorsogon State University",
    "Lorma Colleges",
    "St. Scholastica's College",
]

QS_ASIA_2026 = [
    "University of the Philippines",
    "Ateneo de Manila University",
    "De La Salle University",
    "University of Santo Tomas",
    "Adamson University",
    "University of San Carlos",
    "Mapua University",
    "Polytechnic University of the Philippines",
    "Silliman University",
    "Mindanao State University - Iligan Institute of Technology",
    "Far Eastern University",
    "Ateneo de Davao University",
    "Saint Louis University",
    "Xavier University - Ateneo de Cagayan",
    "Mindanao State University",
    "Cebu Technological University",
    "Visayas State University",
    "Angeles University Foundation",
    "Central Philippine University",
    "National University",
    "University of Southeastern Philippines",
    "West Visayas State University",
    "Technological University of the Philippines",
    "University of Mindanao",
    "Batangas State University",
    "Caraga State University",
    "Mariano Marcos State University",
    "University of Science and Technology of Southern Philippines",
    "Bulacan State University",
    "Ifugao State University",
    "University of Southern Mindanao",
    "Western Mindanao State University",
    "Lyceum of the Philippines University",
]


# Geographic bucket for product scope (Visayas/Mindanao = Phase 3 deferred)
SCHOOL_GEO = {
    "University of the Philippines Diliman": "NCR",
    "University of the Philippines System": "NCR",
    "Ateneo de Manila University": "NCR",
    "De La Salle University": "NCR",
    "University of Santo Tomas": "NCR",
    "Polytechnic University of the Philippines": "NCR",
    "University of the Philippines Manila": "NCR",
    "Mapua University": "NCR",
    "De La Salle-College of Saint Benilde": "NCR",
    "Far Eastern University": "NCR",
    "Adamson University": "NCR",
    "University of the East": "NCR",
    "University of Perpetual Help System DALTA": "NCR",
    "Lyceum of the Philippines University": "NCR",
    "Technological University of the Philippines": "NCR",
    "San Beda University": "NCR",
    "Colegio de San Juan de Letran": "NCR",
    "Arellano University": "NCR",
    "Jose Rizal University": "NCR",
    "Centro Escolar University": "NCR",
    "Emilio Aguinaldo College": "NCR",
    "Pamantasan ng Lungsod ng Maynila": "NCR",
    "National University": "NCR",
    "Philippine Normal University": "NCR",
    "Quezon City University": "NCR",
    "University of Makati": "NCR",
    "FEU Institute of Technology": "NCR",
    "New Era University": "NCR",
    "Trinity University of Asia": "NCR",
    "Rizal Technological University": "NCR",
    "AMA Computer University": "NCR",
    "Chiang Kai Shek College": "NCR",
    "Asian Institute of Management": "NCR",
    "University of Asia and the Pacific": "NCR",
    "Technological Institute of the Philippines": "NCR",
    "University of Caloocan City": "NCR",
    "St. Scholastica's College": "NCR",
    "Philippine Women's University": "NCR",
    "University of the Philippines Los Baños": "CALABARZON",
    "De La Salle University - Dasmarinas": "CALABARZON",
    "Mapua Malayan Colleges Laguna": "CALABARZON",
    "Laguna State Polytechnic University": "CALABARZON",
    "University of Batangas": "CALABARZON",
    "Batangas State University": "CALABARZON",
    "University of the Philippines Open University": "CALABARZON",
    "Adventist University of the Philippines": "CALABARZON",
    "University of Rizal System": "CALABARZON",
    "Manuel S. Enverga University Foundation": "CALABARZON",
    "Bulacan State University": "Central Luzon",
    "Central Luzon State University": "Central Luzon",
    "Holy Angel University": "Central Luzon",
    "Angeles University Foundation": "Central Luzon",
    "Tarlac State University": "Central Luzon",
    "Nueva Ecija University of Science and Technology": "Central Luzon",
    "University of Assumption": "Central Luzon",
    "University of the Philippines Clark": "Central Luzon",
    "Our Lady of Fatima University": "Central Luzon",
    "Pangasinan State University": "Ilocos",
    "Don Mariano Marcos Memorial State University": "Ilocos",
    "University of Northern Philippines": "Ilocos",
    "Mariano Marcos State University": "Ilocos",
    "Virgen Milagrosa University Foundation": "Ilocos",
    "Lorma Colleges": "Ilocos",
    "St. Paul University Philippines": "Cagayan Valley",
    "Isabela State University": "Cagayan Valley",
    "Cagayan State University": "Cagayan Valley",
    "Quirino State University": "Cagayan Valley",
    "Saint Louis University": "CAR",
    "University of Baguio": "CAR",
    "University of the Philippines Baguio": "CAR",
    "Ifugao State University": "CAR",
    "University of Cordilleras": "CAR",
    "Bicol University": "Bicol",
    "Central Bicol State University of Agriculture": "Bicol",
    "Ateneo de Naga University": "Bicol",
    "Sorsogon State University": "Bicol",
    "University of Eastern Philippines": "Bicol",
    "University of San Carlos": "Visayas",
    "Silliman University": "Visayas",
    "Central Philippine University": "Visayas",
    "West Visayas State University": "Visayas",
    "Visayas State University": "Visayas",
    "Cebu Technological University": "Visayas",
    "University of Cebu": "Visayas",
    "Cebu Normal University": "Visayas",
    "Iloilo Science and Technology University": "Visayas",
    "University of San Agustin": "Visayas",
    "University of Negros Occidental - Recoletos": "Visayas",
    "Southwestern University - PHINMA": "Visayas",
    "University of the Philippines Visayas": "Visayas",
    "University of the Philippines Cebu": "Visayas",
    "Eastern Visayas State University": "Visayas",
    "Leyte Normal University": "Visayas",
    "Samar State University": "Visayas",
    "Southern Leyte State University": "Visayas",
    "Northwest Samar State University": "Visayas",
    "Western Philippine University": "Visayas",
    "Foundation University": "Visayas",
    "Ateneo de Davao University": "Mindanao",
    "Mindanao State University - Iligan Institute of Technology": "Mindanao",
    "University of Mindanao": "Mindanao",
    "University of Southeastern Philippines": "Mindanao",
    "Xavier University - Ateneo de Cagayan": "Mindanao",
    "University of the Immaculate Conception": "Mindanao",
    "University of Southern Mindanao": "Mindanao",
    "Western Mindanao State University": "Mindanao",
    "University of the Philippines Mindanao": "Mindanao",
    "Mindanao State University": "Mindanao",
    "Caraga State University": "Mindanao",
    "Notre Dame University": "Mindanao",
    "University of Science and Technology of Southern Philippines": "Mindanao",
}

CORE_LUZON = {"NCR", "CALABARZON", "Central Luzon"}
EXTENDED_LUZON = {"Ilocos", "Cagayan Valley", "CAR", "Bicol"}
DEFERRED_GEO = {"Visayas", "Mindanao"}


def geo_bucket(name: str) -> str:
    return SCHOOL_GEO.get(name, "unknown")


def scoped_summary(all_entries):
    core = [e for e in all_entries if geo_bucket(e["name"]) in CORE_LUZON]
    extended = [e for e in all_entries if geo_bucket(e["name"]) in CORE_LUZON | EXTENDED_LUZON]
    deferred = [e for e in all_entries if geo_bucket(e["name"]) in DEFERRED_GEO]

    def stats(items):
        present = [e for e in items if e["status"] == "in_catalog"]
        absent = [e for e in items if e["status"] == "missing"]
        total = len(items)
        return {
            "total": total,
            "in_catalog": len(present),
            "missing": len(absent),
            "coverage_pct": round(len(present) / total * 100, 1) if total else 0,
            "missing_names": [e["name"] for e in absent],
        }

    return {
        "product_scope": "NCR + Luzon (Visayas/Mindanao deferred to Phase 3)",
        "core_ncr_calabarzon_central_luzon": stats(core),
        "extended_luzon_includes_north_bicol": stats(extended),
        "deferred_visayas_mindanao": stats(deferred),
    }


def resolve(name: str, by_id, by_slug, all_names):
    key = slug(name)
    if key in ALIASES:
        rid = ALIASES[key]
        if rid is None:
            return None, None, "excluded_specialty"
        if rid not in by_id:
            return None, None, "alias_missing_runtime"
        return rid, by_id[rid]["name"], "alias"
    if key in by_slug:
        u = by_slug[key]
        return u["id"], u["name"], "exact_slug"
    return None, None, "missing"


def priority(rank: int, qs: bool) -> str:
    if rank <= 20 or qs:
        return "P0"
    if rank <= 50:
        return "P1"
    return "P2"


def main():
    data = json.loads(RUNTIME.read_text())
    universities = data["universities"]
    by_id = {u["id"]: u for u in universities}
    by_slug = {slug(u["name"]): u for u in universities}
    all_names = [(u["id"], u["name"], slug(u["name"])) for u in universities]

    seen = set()
    top100 = []
    for name in UNIRANK_TOP100:
        key = slug(name)
        if key in seen:
            continue
        seen.add(key)
        top100.append(name)
        if len(top100) == 100:
            break

    qs_set = {slug(n) for n in QS_ASIA_2026}
    in_catalog = []
    missing = []
    for rank, name in enumerate(top100, 1):
        rid, rname, how = resolve(name, by_id, by_slug, all_names)
        qs = slug(name) in qs_set or any(slug(q) in slug(name) or slug(name) in slug(q) for q in QS_ASIA_2026)
        entry = {
            "rank": rank,
            "name": name,
            "qs_asia_2026": qs,
            "priority": priority(rank, qs),
        }
        if rid:
            u = by_id[rid]
            in_catalog.append(
                {
                    **entry,
                    "status": "in_catalog",
                    "runtime_id": rid,
                    "runtime_name": rname,
                    "region": u.get("region"),
                    "match_method": how,
                    "geo": geo_bucket(name),
                    "in_product_scope": geo_bucket(name) in CORE_LUZON | EXTENDED_LUZON,
                }
            )
        else:
            missing.append(
                {
                    **entry,
                    "status": "missing",
                    "suggested_id": slug(name),
                    "match_method": how,
                    "geo": geo_bucket(name),
                    "in_product_scope": geo_bucket(name) in CORE_LUZON | EXTENDED_LUZON,
                }
            )

    all_entries = in_catalog + missing
    scoped = scoped_summary(all_entries)

    # QS schools not in uniRank top100 slice but nationally ranked
    qs_only_missing = []
    for name in QS_ASIA_2026:
        key = slug(name)
        if key in seen:
            continue
        rid, rname, how = resolve(name, by_id, by_slug, all_names)
        if not rid:
            qs_only_missing.append({"name": name, "suggested_id": slug(name), "source": "QS Asia 2026 only"})

    out = {
        "generated": str(date.today()),
        "research_id": "top100-universities-2026-07-05",
        "methodology": {
            "primary_list": "uniRank.org Philippine University Ranking 2026 (top 100 of 235 HEIs, web-presence metrics)",
            "secondary_list": "QS Asia University Rankings 2026 (35 Philippine HEIs — academic/reputation metrics)",
            "note": "No single official CHED top-100 exists. Crosswalk uses uniRank top-100 as coverage target; QS flags nationally visible gaps.",
            "product_scope": "NCR + Luzon only — Visayas/Mindanao tracked as deferred Phase 3, not current gaps",
            "runtime_catalog": {
                "count": len(universities),
                "region_scope": "NCR + CALABARZON + Central Luzon (partial)",
            },
        },
        "summary": {
            "top100_in_catalog": len(in_catalog),
            "top100_missing": len(missing),
            "coverage_pct": round(len(in_catalog) / 100 * 100, 1),
            "qs_asia_2026_total": len(QS_ASIA_2026),
            "qs_asia_in_catalog": sum(1 for n in QS_ASIA_2026 if resolve(n, by_id, by_slug, all_names)[0]),
            "qs_asia_missing": len(QS_ASIA_2026) - sum(1 for n in QS_ASIA_2026 if resolve(n, by_id, by_slug, all_names)[0]),
            "p0_missing_count": sum(1 for m in missing if m["priority"] == "P0"),
            "scoped": scoped,
        },
        "in_catalog": in_catalog,
        "missing": missing,
        "qs_only_missing": qs_only_missing,
        "merge_priority": [
            m
            for m in sorted(missing, key=lambda x: (x["priority"], x["rank"]))
            if m.get("in_product_scope")
        ][:20],
        "excluded_from_prior_research_gaps": "See research-gaps-2026-07-05.json — this file adds top-100 coverage lens only",
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps(out["summary"], indent=2))
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
