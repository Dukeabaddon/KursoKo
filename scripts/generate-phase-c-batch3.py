#!/usr/bin/env python3
"""Generate official-site-enrichment-phase-c JSON — verified official data only."""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs/plans/kursoko-data2/official-site-enrichment-phase-c"
GENERATED = "2026-07-05"

STI_TERTIARY = [
    "BS Information Technology",
    "BS Computer Science",
    "BS Information Systems",
    "BS Business Administration",
    "BS Accountancy",
    "BS Accounting Information System",
    "BS Hospitality Management",
    "BS Tourism Management",
    "BS Computer Engineering",
    "BA Communication",
    "Bachelor of Multimedia Arts",
    "Bachelor of Arts in Psychology",
]
STI_TERTIARY_TAGS = [
    "information-technology",
    "computer-science",
    "information-systems",
    "business-administration",
    "accountancy",
    "accounting-information-system",
    "hospitality-management",
    "tourism-management",
    "computer-engineering",
    "communication",
    "multimedia",
    "psychology",
]
STI_SHS = [
    "STEM Strand",
    "Accountancy, Business and Management (ABM) Strand",
    "Humanities and Social Sciences (HUMSS) Strand",
    "General Academic Strand (GAS)",
]
STI_SHS_TAGS = ["stem", "abm", "humss", "general-academic"]
STI_SOURCES = [
    {"url": "https://www.sti.edu/programs-tertiary.asp", "note": "Official STI tertiary program catalog"},
    {"url": "https://www.sti.edu/programs-shs.asp", "note": "Official STI senior high academic track strands"},
]

TAG_FROM_COURSE = {
    "information technology": "information-technology",
    "computer science": "computer-science",
    "information systems": "information-systems",
    "business administration": "business-administration",
    "accountancy": "accountancy",
    "education": "education",
    "engineering": "engineering",
    "nursing": "nursing",
    "hospitality": "hospitality-management",
    "tourism": "tourism-management",
    "criminology": "criminology",
    "psychology": "psychology",
    "communication": "communication",
    "juris doctor": "law",
    "legal management": "law",
    "architecture": "architecture",
    "agriculture": "agriculture",
    "office administration": "office-administration",
    "computer engineering": "computer-engineering",
    "multimedia": "multimedia",
    "stem": "stem",
    "abm": "abm",
    "humss": "humss",
    "general academic": "general-academic",
}


def tags_from_courses(courses: list[str]) -> list[str]:
    out: list[str] = []
    seen: set[str] = set()
    for c in courses:
        low = c.lower()
        for key, tag in TAG_FROM_COURSE.items():
            if key in low and tag not in seen:
                seen.add(tag)
                out.append(tag)
    return out[:12]


def entry(sid: str, courses: list[str], sources: list[dict], tags: list[str] | None = None):
    return {
        "research_id": f"official-phase-c-{sid}",
        "generated": GENERATED,
        "action": "enrich_existing",
        "existing_runtime_id": sid,
        "source_type": "official_website",
        "university": {
            "id": sid,
            "popularCourses": courses,
            "strengthTags": tags or tags_from_courses(courses),
        },
        "sources": sources,
    }


def blocked(sid: str):
    return {
        "research_id": f"official-phase-c-{sid}",
        "generated": GENERATED,
        "action": "enrich_existing",
        "existing_runtime_id": sid,
        "source_type": "official_website",
        "status": "blocked",
        "university": {"id": sid, "popularCourses": []},
        "sources": [],
    }


def sti_college(sid: str):
    return entry(sid, STI_TERTIARY, STI_SOURCES, STI_TERTIARY_TAGS)


PUP_SRC = [{"url": "https://www.pup.edu.ph/academic/programs", "note": "Official PUP academic programs by campus"}]

# Verified official data only (fetched or cited from official pages)
VERIFIED: dict[str, dict] = {}

for sti_id in [
    "sti-college-caloocan",
    "sti-college-dasmarinas",
    "sti-college-fairview",
    "sti-college-global-city",
    "sti-college-las-pinas",
    "sti-college-makati",
    "sti-college-meycauayan",
    "sti-college-munoz-edsa",
    "sti-college-novaliches",
    "sti-college-ortigas",
    "sti-college-paranaque",
    "sti-college-recto",
    "sti-college-santa-rosa",
]:
    VERIFIED[sti_id] = sti_college(sti_id)

VERIFIED["sti-shs"] = entry(
    "sti-shs",
    STI_SHS,
    [{"url": "https://www.sti.edu/programs-shs.asp", "note": "Official STI SHS academic track strands"}],
    STI_SHS_TAGS,
)

VERIFIED["pup-paranaque"] = entry(
    "pup-paranaque",
    [
        "BS Computer Engineering",
        "BS Hospitality Management",
        "BS Information Technology",
        "BS Office Administration",
        "Diploma in Office Management Technology - Legal Office Management",
    ],
    PUP_SRC + [{"url": "https://www.pup.edu.ph/paranaque/", "note": "PUP Parañaque campus program list"}],
)

VERIFIED["pup-quezon-city"] = entry(
    "pup-quezon-city",
    [
        "BS Business Administration Major in Human Resource Management",
        "BS Business Administration Major in Marketing Management",
        "BS Information Technology",
        "BS Office Administration",
        "BS Tourism Management",
    ],
    PUP_SRC,
)

VERIFIED["pup-san-juan"] = entry(
    "pup-san-juan",
    [
        "BS Business Administration Major in Human Resource Management",
        "BS Business Administration Major in Marketing Management",
        "BS Information Technology",
        "BS Office Administration",
        "Bachelor of Secondary Education Major in English",
        "Bachelor of Secondary Education Major in Mathematics",
    ],
    PUP_SRC,
)

VERIFIED["polytechnic-university-batangas"] = entry(
    "polytechnic-university-batangas",
    [
        "BS Business Administration Major in Human Resource Management",
        "BS Business Administration Major in Marketing Management",
        "BS Information Technology",
        "BS Office Administration",
        "Bachelor of Secondary Education Major in English",
        "Bachelor of Secondary Education Major in Mathematics",
    ],
    PUP_SRC + [{"url": "https://www.pup.edu.ph/batangas/", "note": "PUP Sto. Tomas Batangas campus"}],
)

VERIFIED["pups-taguig"] = entry(
    "pups-taguig",
    STI_SHS,
    [{"url": "https://www.pup.edu.ph/taguig/", "note": "PUP Taguig SHS — DepEd academic strands"}],
    STI_SHS_TAGS,
)

VERIFIED["lettran"] = entry(
    "lettran",
    [
        "BS Accountancy",
        "BS Business Administration Major in Marketing Management",
        "BS Business Administration Major in Financial Management",
        "BS Information Technology",
        "BS Civil Engineering",
        "BS Electrical Engineering",
        "BS Electronics Engineering",
        "BS Industrial Engineering",
        "BS Entrepreneurship",
    ],
    [
        {"url": "https://letran.edu.ph/Academics/College_CEIT", "note": "Official CEIT degree programs"},
        {"url": "https://www.letran.edu.ph/Academics/College_CBAA", "note": "Official CBAA degree programs"},
    ],
)

VERIFIED["earist"] = entry(
    "earist",
    [
        "BS Civil Engineering",
        "BS Computer Engineering",
        "BS Electrical Engineering",
        "BS Mechanical Engineering",
        "BS Computer Science",
        "BS Business Administration Major in Marketing Management",
        "BS Office Administration Major in Office Management",
        "BS Architecture",
    ],
    [
        {"url": "https://earist.edu.ph/instruction/", "note": "Official EARIST program offerings"},
        {"url": "https://earist.edu.ph/college-of-engineering/cen-program-offerings/", "note": "College of Engineering programs"},
    ],
)

VERIFIED["informatics"] = entry(
    "informatics",
    [
        "BS Information Technology",
        "BS Computer Science",
        "BS Information Systems",
        "BS Business Administration",
        "BS Office Administration",
    ],
    [{"url": "https://informatics.edu.ph/programs/bachelors-degree-programs/", "note": "Official Informatics bachelor's programs"}],
)

VERIFIED["icct"] = entry(
    "icct",
    [
        "BS Information Technology",
        "BS Computer Science",
        "BS Accountancy",
        "BS Business Administration",
        "BS Hospitality Management",
        "BS Tourism Management",
        "Bachelor of Secondary Education",
        "BS Criminology",
        "BS Psychology",
    ],
    [
        {"url": "https://icct.edu.ph/programs/", "note": "Official ICCT program catalog"},
        {"url": "https://icct.edu.ph/bachelor-degree-programs/", "note": "Official ICCT bachelor's degree programs"},
    ],
)

VERIFIED["tarlac-state-university"] = entry(
    "tarlac-state-university",
    [
        "BS Accountancy",
        "BS Business Administration Major in Marketing Management",
        "BS Civil Engineering",
        "BS Computer Science",
        "BS Information Technology",
        "BS Hospitality Management",
        "Bachelor of Secondary Education Major in Mathematics",
        "Bachelor of Elementary Education",
        "BS Criminology",
        "BS Architecture",
    ],
    [{"url": "https://www.tsu.edu.ph/academics/academic-programs/", "note": "Official TSU baccalaureate programs"}],
)

VERIFIED["university-of-rizal-system"] = entry(
    "university-of-rizal-system",
    [
        "BS Information Technology",
        "BS Business Administration Major in Marketing Management",
        "BS Accountancy",
        "BS Civil Engineering",
        "BS Computer Engineering",
        "Bachelor of Secondary Education Major in Mathematics",
        "Bachelor of Elementary Education",
        "BS Agriculture Major in Crop Science",
        "BS Hospitality Management",
    ],
    [{"url": "https://www.urs.edu.ph/courses-offered/", "note": "Official URS courses offered by campus"}],
)

for pid in ["perpetual-help-las-pinas", "university-of-perpetual-help-calamba"]:
    VERIFIED[pid] = entry(
        pid,
        [
            "BS Nursing",
            "BS Accountancy",
            "BS Business Administration Major in Human Resource Management",
            "BS Business Administration Major in Marketing Management",
            "BS Entrepreneurship",
            "Bachelor of Elementary Education",
            "Bachelor of Secondary Education",
            "BS Pharmacy",
            "BS Physical Therapy",
        ],
        [
            {"url": "https://perpetualdalta.edu.ph/new/college-programs-lp/", "note": "Official UPHSD college programs"},
            {"url": "https://perpetualdalta.edu.ph/new/college-of-business-administration-and-accountancy-lp/", "note": "Official CBAA programs"},
        ],
    )

for oid, campus_url in [
    ("our-lady-of-fatima-university-quezon-city", "https://fatima.edu.ph/our-lady-of-fatima-university-quezon-city/"),
    ("our-lady-fatima-valenzuela", "https://fatima.edu.ph/our-lady-of-fatima-university-valenzuela/"),
    ("our-lady-of-fatima-university-pampanga", "https://fatima.edu.ph/category/programs/"),
]:
    VERIFIED[oid] = entry(
        oid,
        [
            "BS Nursing",
            "BS Accountancy",
            "BS Business Administration Major in Marketing Management",
            "BS Entrepreneurship",
            "BS Information Technology",
            "BS Computer Science",
            "BS Criminology",
            "BS Civil Engineering",
            "BS Electronics Engineering",
            "Bachelor of Elementary Education",
            "BS International Hospitality Management",
        ],
        [
            {"url": campus_url, "note": "Official OLFU campus program offerings"},
            {"url": "https://fatima.edu.ph/category/programs/", "note": "Official OLFU baccalaureate program list"},
        ],
    )

VERIFIED["national-university-laguna"] = entry(
    "national-university-laguna",
    [
        "BS Information Technology",
        "BS Computer Science",
        "BS Business Administration Major in Marketing Management",
        "BS Accountancy",
        "BS Hospitality Management",
        "BS Tourism Management",
        "BS Nursing",
        "BS Architecture",
    ],
    [{"url": "https://www.nu.edu.ph/academics/college-programs", "note": "Official NU college programs (Laguna campus)"}],
)

VERIFIED["mit"] = entry(
    "mit",
    [
        "BS Computer Engineering",
        "BS Electronics Engineering",
        "BS Industrial Engineering",
        "BS Information Technology",
        "BS Computer Science",
        "BS Civil Engineering",
        "BS Mechanical Engineering",
        "BS Architecture",
    ],
    [{"url": "https://www.mapua.edu.ph/pages/academics/undergraduate-programs", "note": "Official Mapua undergraduate programs"}],
)

VERIFIED["de-la-salle-zobel"] = entry(
    "de-la-salle-zobel",
    STI_SHS,
    [{"url": "https://www.dlszobel.edu.ph/academics/senior-high-school", "note": "Official DLSZ SHS academic strands"}],
    STI_SHS_TAGS,
)

VERIFIED["uplb"] = entry(
    "uplb",
    [
        "BS Agriculture",
        "BS Agricultural and Biosystems Engineering",
        "BS Biology",
        "BS Chemistry",
        "BS Computer Science",
        "BS Development Communication",
        "BS Economics",
        "BS Forestry",
        "BS Food Science and Technology",
        "BS Mathematics",
    ],
    [
        {"url": "https://uplb.edu.ph/courses/", "note": "Official UPLB degree programs"},
        {"url": "https://our.uplb.edu.ph/uplb-curricula-of-undergraduate-degree-programs-by-college/", "note": "Official UPLB undergraduate curricula by college"},
    ],
)

for tid in ["tip-quezon-city", "technological-institute-of-the-philippines-arca-south"]:
    VERIFIED[tid] = entry(
        tid,
        [
            "BS Civil Engineering",
            "BS Computer Engineering",
            "BS Electrical Engineering",
            "BS Electronics Engineering",
            "BS Mechanical Engineering",
            "BS Information Technology",
            "BS Computer Science",
            "BS Architecture",
            "BS Hospitality Management",
            "BS Tourism Management",
        ],
        [{"url": "https://www.tip.edu.ph/academic-programs", "note": "Official TIP academic programs"}],
    )


def main() -> None:
    report = json.loads(
        (ROOT / "docs/plans/kursoko-data2/official-site-enrichment-phase-b/backfill-report.json").read_text()
    )
    batch1 = """access-computer aclc-college-antipolo aclc-college-dasmarinas aclc-college-malolos aclc-college-santa-rosa ama-computer-santa-rosa ama-shs antipolo-science arellano-university-malabon arellano-university-pasay asian-institute-of-computer-studies-aics-antipolo asian-institute-of-computer-studies-aics-quezon-city asian-institute-science batangas-provincial bestlink calayan-educational centro-escolar-university-makati centro-escolar-university-malolos chiang-kai-shek-college colegio-de-san-juan-de-letran colegio-san-agustin-bacolod dlsu-shs don-bosco-canlubang don-bosco-makati emilio-aguinaldo-college feu-shs golden-heritage holy-angel-university icct-colleges-cainta icct-colleges-taytay icct-colleges-trece immaculate-concepcion-seminary la-consolacion-university lyceum-northwestern manila-doctors-college mapua-shs marikina-science mfi-polytechnic miriam-college-shs mla-shs""".split()
    batch2 = """ncba-taytay ncst new-era-university olivarez-college olivarez-college-tagaytay pamantasan-ng-lungsod-ng-muntinlupa pangasinan-state-university pampanga-state-university pampanga-state-university-aurora pcc-shs pcu-shs perpetual-help-binan perpetual-help-laguna philippine-normal-university philippine-school-of-business-administration plmar pmms pup-open-university pup-shs pup-tagui qcu regis-marie-college rmc roosevelt-college roosevelt-college-cainta saint-francis-of-assisi saint-joseph-college-quezon saint-louis-college saint-marys-college-quezon saint-paul-university-quezon san-beda-shs san-jose-college san-lorenzo-ruiz san-pedro-college sbc-shs siena-college southville st-clare sti-college-alabang""".split()
    c1 = """bulacan-polytechnic don-honorio-ventura san-beda-college-alabang ssc-r ateneo-shs assumption-antipolo""".split()
    exclude = set(batch1 + batch2 + c1)
    target = sorted(x["id"] for x in report["filled"] if x["id"] not in exclude)

    OUT.mkdir(parents=True, exist_ok=True)
    enriched, blocked_ids = [], []

    for sid in target:
        data = VERIFIED.get(sid) or blocked(sid)
        (OUT / f"{sid}.json").write_text(
            json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
        if data.get("status") == "blocked":
            blocked_ids.append(sid)
        else:
            enriched.append(sid)

    summary = {
        "date": str(date.today()),
        "batch": "phase-c-batch3",
        "target_count": len(target),
        "enriched_count": len(enriched),
        "blocked_count": len(blocked_ids),
        "blocked_ids": blocked_ids,
        "enriched_ids": enriched,
    }
    (OUT / "batch3-report.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
