#!/usr/bin/env python3
"""Write Phase C official-site enrichment JSON for batch research run."""
import json
import re
from datetime import date
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "docs/plans/kursoko-data2/official-site-enrichment-phase-c"
TODAY = "2026-07-05"


def slugify(course: str) -> str:
    s = course.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def make_entry(school_id: str, courses: list[str], sources: list[dict], *, blocked=False, note=""):
    entry = {
        "research_id": f"official-phase-c-{school_id}",
        "generated": TODAY,
        "action": "enrich_existing",
        "existing_runtime_id": school_id,
        "source_type": "official_website",
        "university": {"id": school_id},
        "sources": sources,
    }
    if blocked:
        entry["status"] = "blocked"
        entry["university"]["popularCourses"] = []
        if note:
            entry["blocked_note"] = note
    else:
        entry["university"]["popularCourses"] = courses
        entry["university"]["strengthTags"] = [slugify(c) for c in courses]
        if note:
            entry["courses_research_notes"] = note
    return entry


VERIFIED = {
    "plmun": make_entry(
        "plmun",
        [
            "Bachelor of Arts in Communication",
            "Bachelor of Science in Psychology",
            "Bachelor of Science in Accountancy",
            "Bachelor of Science in Business Administration major in Marketing Management",
            "Bachelor of Science in Criminology",
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Information Technology",
            "Bachelor of Elementary Education",
            "Bachelor of Secondary Education major in English",
            "Bachelor of Arts in Political Science",
            "Bachelor of Public Administration",
            "Bachelor of Science in Social Work",
        ],
        [{"url": "https://plmun.edu.ph/program-offered.php", "note": "Official PLMun academic programs page"}],
    ),
    "tcu": make_entry(
        "tcu",
        [
            "Bachelor of Elementary Education",
            "Bachelor of Secondary Education major in English",
            "Bachelor of Secondary Education major in Mathematics",
            "Bachelor of Secondary Education major in Science",
            "Bachelor of Science in Business Administration major in Human Resource Management",
            "Bachelor of Science in Business Administration major in Marketing Management",
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Criminology",
            "Bachelor of Science in Entrepreneurship",
            "Bachelor of Science in Hospitality Management",
            "Bachelor of Science in Information Systems",
            "Bachelor of Science in Psychology",
        ],
        [{"url": "https://portal.tcu.edu.ph/admission", "note": "Official TCU admission program choices"}],
    ),
    "lyceum-batangas": make_entry(
        "lyceum-batangas",
        [
            "BS Accountancy",
            "BS Computer Science",
            "BS Information Technology",
            "BS Cybersecurity",
            "Bachelor of Arts in Communication",
            "BS Criminology",
            "BS Nursing",
            "BS Pharmacy",
            "BS Marine Transportation",
            "BS Marine Engineering",
            "BS International Hospitality Management",
            "BS International Tourism Management",
        ],
        [
            {
                "url": "https://lpubatangas.edu.ph/admissions/college-high-school-and-certificate-programs/",
                "note": "Official LPU Batangas board and non-board program list",
            }
        ],
    ),
    "university-of-batangas": make_entry(
        "university-of-batangas",
        [
            "Bachelor of Science in Accountancy",
            "Bachelor of Science in Business Administration",
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Information Technology",
            "Bachelor of Science in Information Systems",
            "Bachelor of Arts in Communication",
            "Bachelor of Science in Psychology",
            "Bachelor of Elementary Education",
            "Bachelor of Secondary Education",
            "Bachelor of Early Childhood Education",
            "Bachelor of Science in International Hospitality Management",
            "Bachelor of Science in Tourism Management",
        ],
        [
            {"url": "https://ub.edu.ph/ubbc/college-of-business-accountancy-and-hospitality-management/", "note": "UB Batangas CBAHM"},
            {"url": "https://ub.edu.ph/ubbc/information-and-communications-technology/", "note": "UB Batangas CICT"},
            {"url": "https://ub.edu.ph/ubbc/college-of-education/", "note": "UB Batangas College of Education"},
        ],
    ),
    "ucc": make_entry(
        "ucc",
        [
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Information Technology",
            "Bachelor of Science in Information System",
            "Bachelor of Science in Entertainment and Multimedia Computing",
            "Bachelor of Science in Psychology",
            "Bachelor of Science in Mathematics",
            "AB Political Science",
            "BA Communication",
            "Bachelor of Public Administration",
        ],
        [
            {
                "url": "https://ucc-caloocan.edu.ph/acad.php?acad=college-of-liberal-arts-and-sciences",
                "note": "University of Caloocan City CLAS official programs (ucc-caloocan.edu.ph)",
            }
        ],
        note="Runtime website field points to Union Christian College domain; verified via official UCC Caloocan portal.",
    ),
    "southville-international": make_entry(
        "southville-international",
        [
            "BS Accountancy",
            "BS Business Administration",
            "BS Information Technology",
            "BS Nursing",
            "BS Psychology",
            "AB Communication",
            "AB Multimedia Arts",
            "BS Tourism",
            "BS Entrepreneurship",
            "BS Computer Engineering",
            "BS Industrial Engineering",
            "Bachelor in Elementary Education major in Special Education",
        ],
        [
            {
                "url": "https://www.southville.edu.ph/college-degree-programs-philippines/",
                "note": "Official SISC college degree programs catalog",
            },
            {
                "url": "https://www.southville.edu.ph/incoming-college-students/",
                "note": "Official SISC program majors and specializations",
            },
        ],
    ),
    "systems-plus": make_entry(
        "systems-plus",
        [
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Information Technology",
            "Bachelor of Science in Information Systems",
            "Bachelor of Science in Entertainment and Multimedia Computing",
            "Bachelor of Science in Computer Engineering",
            "Bachelor of Science in Electronics and Communications Engineering",
            "Bachelor of Science in Accountancy",
            "Bachelor of Science in Business Administration",
            "Bachelor of Science in Customs Administration",
            "Bachelor of Science in Real Estate Management",
            "Bachelor of Science in Tourism",
            "Bachelor of Science in Hospitality Management",
        ],
        [
            {"url": "https://www.spcf.edu.ph/academics/ccis", "note": "SPCF College of Computing and Information Sciences"},
            {"url": "https://spcf.edu.ph/academics/cob", "note": "SPCF College of Business"},
            {"url": "https://www.spcf.edu.ph/academics/coe", "note": "SPCF College of Engineering"},
            {"url": "https://spcf.edu.ph/academics/chm", "note": "SPCF College of Hospitality Management"},
        ],
    ),
    "world-citi-colleges": make_entry(
        "world-citi-colleges",
        [
            "Bachelor of Science in Nursing",
            "Bachelor of Science in Medical Technology",
            "Bachelor of Science in Pharmacy",
            "Bachelor of Science in Psychology",
            "Bachelor of Science in Information Technology specialized in Cyber Security",
            "Bachelor of Science in Business Administration major in Marketing Management",
            "Bachelor of Science in Tourism Management leading to Flight Attendant",
            "Bachelor of Science in Hospitality Management specialized in Cruise Ship Management",
            "Bachelor of Public Administration",
            "Bachelor of Science in Biology",
            "Bachelor of Science in Radiologic Technology",
            "Bachelor of Science in Physical Therapy specialized in Sports Therapy",
        ],
        [
            {
                "url": "https://www.worldciti.edu.ph/academic-programs/bachelors-degree",
                "note": "Official WCC Quezon City campus bachelor's degree list",
            }
        ],
        note="Quezon City campus catalog; Antipolo campus has separate file.",
    ),
    "world-citi-colleges-antipolo": make_entry(
        "world-citi-colleges-antipolo",
        [
            "Bachelor of Science in Accountancy",
            "Bachelor of Science in Information Technology specialized in Cyber Security",
            "Bachelor of Science in Tourism Management leading to Flight Attendant",
            "Bachelor of Science in Hospitality Management specialized in Cruise Ship Management",
            "Bachelor of Science in Criminology",
            "Bachelor of Science in Business Administration major in Marketing Management",
            "Bachelor of Arts in Communication",
            "Bachelor of Science in Entertainment and Multimedia Computing major in Game Development",
            "Bachelor of Science in Real Estate Management",
            "Bachelor of Science in Nursing",
        ],
        [
            {
                "url": "https://www.worldciti.edu.ph/academic-programs/bachelors-degree",
                "note": "Official WCC Antipolo Rizal campus bachelor's degree list",
            }
        ],
    ),
    "ue-caloocan": make_entry(
        "ue-caloocan",
        [
            "Bachelor of Science in Accountancy",
            "BS Business Administration major in Marketing Management",
            "BS Business Administration major in Business Management",
            "Bachelor of Arts in Communication",
            "Bachelor of Science in Hospitality Management",
            "Bachelor of Science in Tourism Management",
            "Bachelor of Science in Psychology",
            "Bachelor of Science in Criminology with specialization in Cybersecurity",
            "Bachelor of Science in Civil Engineering",
            "Bachelor of Science in Computer Engineering",
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Information Technology",
        ],
        [
            {"url": "https://www.ue.edu.ph/cal/college-of-arts-and-sciences-2/", "note": "UE Caloocan CAS programs"},
            {"url": "https://www.ue.edu.ph/cal/college-of-engineering-2/", "note": "UE Caloocan College of Engineering"},
            {"url": "https://www.ue.edu.ph/cal/bs-business-administration/", "note": "UE Caloocan CBA programs"},
        ],
    ),
    "udm": make_entry(
        "udm",
        [
            "Bachelor of Arts in Communication",
            "Bachelor of Science in Psychology",
            "Bachelor of Science in Accountancy",
            "BS Business Administration major in Marketing Management",
            "Bachelor of Science in Criminology",
            "Bachelor of Science in Nursing",
            "Bachelor of Science in Information Technology",
            "Bachelor in Information Technology with Specialization in Cybersecurity",
            "Bachelor of Science in Computer Engineering",
            "Bachelor of Secondary Education major in English",
            "Bachelor of Secondary Education major in Mathematics",
            "Bachelor of Public Administration",
        ],
        [
            {"url": "https://udmwebsite.udm.edu.ph/registrar-admission/", "note": "Official UDM registrar academic programs"},
            {"url": "https://udmwebsite.udm.edu.ph/colleges/", "note": "Official UDM colleges listing"},
        ],
    ),
    "plp": make_entry(
        "plp",
        [
            "Bachelor of Science in Accountancy",
            "Bachelor of Science in Business Administration major in Marketing Management",
            "Bachelor of Science in Business Administration major in Entrepreneurship",
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Information Technology",
            "Bachelor of Science in Electronics and Communications Engineering",
            "Bachelor of Science in Nursing",
            "Bachelor of Science in Hospitality Management",
            "Bachelor of Science in Mathematics with Computer",
            "Bachelor of Secondary Education major in English",
            "Bachelor of Secondary Education major in Filipino",
            "Bachelor of Elementary Education",
        ],
        [
            {"url": "https://plpasig.edu.ph/college-of-computer-studies/", "note": "Official PLP College of Computer Studies"},
            {"url": "https://plpasig.edu.ph/college-of-engineering/", "note": "Official PLP College of Engineering"},
            {"url": "https://plpasig.weebly.com/degree-programs.html", "note": "Official PLP degree programs summary"},
        ],
        note="Runtime website plp.edu.ph redirects; verified via official plpasig.edu.ph.",
    ),
    "plv": make_entry(
        "plv",
        [
            "Bachelor of Science in Electrical Engineering",
            "Bachelor of Science in Civil Engineering",
            "Bachelor of Science in Information Technology",
            "Bachelor of Science in Accountancy",
            "Bachelor of Science in Business Administration major in Financial Management",
            "Bachelor of Science in Business Administration major in Marketing Management",
            "Bachelor of Science in Public Administration",
            "Bachelor of Science in Psychology",
            "Bachelor of Science in Social Work",
            "Bachelor of Elementary Education",
            "Bachelor of Secondary Education major in English",
            "Bachelor of Secondary Education major in Mathematics",
        ],
        [
            {
                "url": "https://valenzuela.gov.ph/pamantasan-ng-lungsod-ng-valenzuela/",
                "note": "Official Valenzuela City government PLV academic tracks page",
            }
        ],
    ),
}

BLOCKED = {
    "asia-pacific-aviation": "Official site unreachable; no verified program catalog fetched",
    "canossa-college": "Official site unreachable; no verified program catalog fetched",
    "cavite-maritime": "Official site unreachable; no verified program catalog fetched",
    "golden-state": "Official site unreachable; no verified program catalog fetched",
    "imus-computer-college": "Official site unreachable; no verified program catalog fetched",
    "ici-culinary": "Official site unreachable; no verified program catalog fetched",
    "laguna-northwestern-college": "Official site unreachable; no verified program catalog fetched",
    "marcelino-fule": "Official site unreachable; no verified program catalog fetched",
    "maria-aurora": "Official site unreachable; no verified program catalog fetched",
    "st-josephs-college": "Official site unreachable; no verified program catalog fetched",
    "trece-martires-city-college": "Official site unreachable; no verified program catalog fetched",
    "umak": "Official umak.edu.ph timed out; no verified program page fetched",
    "cavite-westpoint": "Official site unreachable; no verified program catalog fetched",
    "ptc": "Only 3 verified four-year programs (BSIT, BSOA, BSAIS); below 4-program minimum",
    "philippine-science": "PSHS uses 6-year specialized STEM curriculum, not standard SHS academic strands",
    "quezon-city-science": "Official qcscience.gov.ph unreachable; no SHS strand catalog",
    "rtu-pasig": "Pasig campus lists only BSIT and BS Architecture; below 4-program minimum",
    "roosevelt": "Official site unreachable; no verified program catalog fetched",
    "saint-clare": "Official site unreachable; no verified program catalog fetched",
    "saint-francis-assisi": "Official site unreachable; no verified program catalog fetched",
    "saint-joseph-batangas": "Official site unreachable; no verified program catalog fetched",
    "san-juan-de-dios": "Official site unreachable; no verified program catalog fetched",
    "santo-nino-dasma": "Official site unreachable; no verified program catalog fetched",
    "st-clare-caloocan": "Official site unreachable; no verified program catalog fetched",
    "st-dominic-college-of-arts-and-sciences": "Official site unreachable; no verified program catalog fetched",
    "santisimo-rosario": "Official sdca.edu.ph has no degree name catalog on fetched pages",
    "saint-la-salle": "Official site unreachable; no verified program catalog fetched",
    "dolores-tayamin": "Official twa.edu.ph unreachable; no verified program catalog fetched",
    "trinity-university-general-trias": "No General Trias campus program list on official tua.edu.ph",
    "unciano": "Official unciano.edu.ph unreachable; third-party listings not used",
    "valenzuela-city-school": "Official valenzuela.gov.ph blocked; no SHS strand catalog",
    "vctc": "Official valenzuela.gov.ph blocked; no verified program catalog",
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    written_official = []
    written_blocked = []
    skipped = []

    all_ids = set(VERIFIED) | set(BLOCKED)

    for school_id, entry in VERIFIED.items():
        path = OUT / f"{school_id}.json"
        path.write_text(json.dumps(entry, indent=2, ensure_ascii=False) + "\n")
        written_official.append(school_id)

    for school_id, note in BLOCKED.items():
        entry = make_entry(school_id, [], [], blocked=True, note=note)
        path = OUT / f"{school_id}.json"
        path.write_text(json.dumps(entry, indent=2, ensure_ascii=False) + "\n")
        written_blocked.append(school_id)

    report = {
        "generated": TODAY,
        "batch": "phase-c-remaining-plus-batch2-retry",
        "official_count": len(written_official),
        "blocked_count": len(written_blocked),
        "total_written": len(all_ids),
        "official": sorted(written_official),
        "blocked": sorted(written_blocked),
    }
    (OUT / "batch-c-research-report.json").write_text(json.dumps(report, indent=2) + "\n")

    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
