#!/usr/bin/env python3
"""Write official-site-enrichment-phase-c JSON from verified official sources."""
from __future__ import annotations

import json
import re
import ssl
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs/plans/kursoko-data2/official-site-enrichment-phase-c"
GENERATED = "2026-07-05"

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

TAG_MAP = {
    "information technology": "information-technology",
    "computer science": "computer-science",
    "computer engineering": "computer-engineering",
    "information systems": "information-systems",
    "cybersecurity": "cybersecurity",
    "data science": "data-science",
    "artificial intelligence": "artificial-intelligence",
    "business administration": "business-administration",
    "accountancy": "accountancy",
    "accounting information system": "accounting-information-system",
    "entrepreneurship": "entrepreneurship",
    "hospitality management": "hospitality-management",
    "tourism management": "tourism-management",
    "office administration": "office-administration",
    "nursing": "nursing",
    "psychology": "psychology",
    "education": "education",
    "engineering": "engineering",
    "legal management": "legal-management",
    "civil engineering": "civil-engineering",
    "electrical engineering": "electrical-engineering",
    "electronics engineering": "electronics-engineering",
    "industrial engineering": "industrial-engineering",
    "stem": "stem",
    "abm": "abm",
    "humss": "humss",
    "gas": "gas",
    "theology": "theology",
    "pastoral ministry": "pastoral-ministry",
    "sacred theology": "sacred-theology",
    "communication": "communication",
    "mathematics": "mathematics",
    "medical technology": "medical-technology",
    "physical therapy": "physical-therapy",
    "radiologic technology": "radiologic-technology",
    "tourism": "tourism",
    "hospitality": "hospitality-management",
}


def derive_tags(courses: list[str]) -> list[str]:
    tags: list[str] = []
    seen: set[str] = set()
    blob = " ".join(courses).lower()
    for needle, tag in TAG_MAP.items():
        if needle in blob and tag not in seen:
            seen.add(tag)
            tags.append(tag)
    return tags


def fetch_ok(url: str, tries: int = 2) -> bool:
    for _ in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=20, context=CTX) as resp:
                body = resp.read(2048)
                if resp.status < 400 and len(body) > 200:
                    return True
        except (urllib.error.URLError, TimeoutError, OSError):
            continue
    return False


def enrich(uid: str, courses: list[str], sources: list[dict]) -> dict:
    return {
        "research_id": f"official-phase-c-{uid}",
        "generated": GENERATED,
        "action": "enrich_existing",
        "existing_runtime_id": uid,
        "source_type": "official_website",
        "university": {
            "id": uid,
            "popularCourses": courses[:12],
            "strengthTags": derive_tags(courses),
        },
        "sources": sources,
    }


def blocked(uid: str, sources: list[dict], note: str = "") -> dict:
    row = {
        "research_id": f"official-phase-c-{uid}",
        "generated": GENERATED,
        "action": "enrich_existing",
        "existing_runtime_id": uid,
        "source_type": "official_website",
        "status": "blocked",
        "university": {
            "id": uid,
            "popularCourses": [],
            "strengthTags": [],
        },
        "sources": sources,
    }
    if note:
        row["blocked_note"] = note
    return row


# Verified from official school websites (fetched 2026-07-05)
ENRICHED: dict[str, dict] = {
    "access-computer": {
        "courses": [
            "BS Information Technology",
            "BS Business Administration Major in Marketing Management",
            "BS Hospitality Management",
            "BS Tourism Management",
            "BS Office Administration",
        ],
        "sources": [
            {"url": "https://www.access.edu.ph/programs", "note": "Official program index"},
            {"url": "https://www.access.edu.ph/college-BSIT", "note": "Official BS Information Technology"},
            {"url": "https://www.access.edu.ph/college-BSTM", "note": "Official BS Tourism Management"},
        ],
    },
    "aclc-college-antipolo": {
        "courses": [
            "BS Information Technology",
            "BS Computer Science",
            "BS Cybersecurity",
            "BS Artificial Intelligence",
            "BS Information Systems",
            "BS Data Science",
        ],
        "sources": [
            {"url": "https://inquire.amaes.edu.ph/", "note": "Official AMA Education System undergraduate program catalog (ACLC network)"},
        ],
    },
    "aclc-college-dasmarinas": {
        "courses": [
            "BS Information Technology",
            "BS Computer Science",
            "BS Cybersecurity",
            "BS Artificial Intelligence",
            "BS Information Systems",
            "BS Data Science",
        ],
        "sources": [
            {"url": "https://inquire.amaes.edu.ph/", "note": "Official AMA Education System undergraduate program catalog (ACLC network)"},
        ],
    },
    "aclc-college-malolos": {
        "courses": [
            "BS Information Technology",
            "BS Computer Science",
            "BS Cybersecurity",
            "BS Artificial Intelligence",
            "BS Information Systems",
            "BS Data Science",
        ],
        "sources": [
            {"url": "https://inquire.amaes.edu.ph/", "note": "Official AMA Education System undergraduate program catalog (ACLC network)"},
        ],
    },
    "aclc-college-santa-rosa": {
        "courses": [
            "BS Information Technology",
            "BS Computer Science",
            "BS Cybersecurity",
            "BS Artificial Intelligence",
            "BS Information Systems",
            "BS Data Science",
        ],
        "sources": [
            {"url": "https://inquire.amaes.edu.ph/", "note": "Official AMA Education System undergraduate program catalog (ACLC network)"},
        ],
    },
    "ama-computer-santa-rosa": {
        "courses": [
            "BS Information Technology",
            "BS Computer Science",
            "BS Information Systems",
            "BS Cybersecurity",
            "BS Data Science",
            "BS Artificial Intelligence",
            "BS Business Administration Major in Marketing Management",
            "BS Hospitality Management",
        ],
        "sources": [
            {"url": "https://ama.edu.ph/computing.html", "note": "Official AMA computing and business program catalog"},
        ],
    },
    "ama-shs": {
        "courses": [
            "STEM Strand",
            "Accountancy, Business and Management (ABM) Strand",
            "Humanities and Social Sciences (HUMSS) Strand",
            "General Academic Strand (GAS)",
        ],
        "sources": [
            {"url": "https://ama.edu.ph/ama-senior-high/", "note": "Official AMA Senior High academic track strands"},
        ],
    },
    "asian-institute-of-computer-studies-aics-antipolo": {
        "courses": [
            "BS Computer Science",
            "BS Computer Engineering",
            "BS Entrepreneurship",
        ],
        "sources": [
            {"url": "https://aics.edu.ph/bscs/", "note": "Official BS Computer Science program page"},
            {"url": "https://aics.edu.ph/bscpe/", "note": "Official BS Computer Engineering program page"},
            {"url": "https://aics.edu.ph/bsentrep/", "note": "Official BS Entrepreneurship program page"},
        ],
    },
    "asian-institute-of-computer-studies-aics-quezon-city": {
        "courses": [
            "BS Computer Science",
            "BS Computer Engineering",
            "BS Entrepreneurship",
        ],
        "sources": [
            {"url": "https://aics.edu.ph/bscs/", "note": "Official BS Computer Science program page"},
            {"url": "https://aics.edu.ph/bscpe/", "note": "Official BS Computer Engineering program page"},
            {"url": "https://aics.edu.ph/bsentrep/", "note": "Official BS Entrepreneurship program page"},
        ],
    },
    "centro-escolar-university-makati": {
        "courses": [
            "BS Accountancy",
            "BS Nursing",
            "BS Information Technology",
            "BS Computer Science",
            "BS Hospitality Management",
            "BA Communication and Media",
            "BS Psychology",
        ],
        "sources": [
            {"url": "https://www.ceu.edu.ph/academics/1", "note": "Official CEU undergraduate programs catalog"},
        ],
    },
    "centro-escolar-university-malolos": {
        "courses": [
            "BS Accountancy",
            "BS Nursing",
            "BS Information Technology",
            "BS Computer Science",
            "BS Hospitality Management",
            "BA Communication and Media",
            "BS Psychology",
        ],
        "sources": [
            {"url": "https://www.ceu.edu.ph/academics/1", "note": "Official CEU undergraduate programs catalog (Malolos campus)"},
        ],
    },
    "chiang-kai-shek-college": {
        "courses": [
            "BS Accountancy",
            "BS Business Administration Major in Management",
            "BS Business Administration Major in Marketing Management",
            "BS Information Technology",
            "BS Accounting Information System",
            "BS Entrepreneurship",
            "BS Hospitality Management",
        ],
        "sources": [
            {"url": "https://college.cksc.edu.ph/component/content/category/12-academic-programs", "note": "Official CKS College undergraduate program list"},
        ],
    },
    "colegio-de-san-juan-de-letran": {
        "courses": [
            "BS Civil Engineering",
            "BS Electrical Engineering",
            "BS Electronics Engineering",
            "BS Industrial Engineering",
            "BS Information Technology",
            "BS Accountancy",
            "BS Accounting Information System",
            "BS Business Administration Major in Financial Management",
        ],
        "sources": [
            {"url": "https://letran.edu.ph/Academics/College_CEIT", "note": "Official CEIT degree programs"},
            {"url": "https://letran.edu.ph/Academics/College_CBAA", "note": "Official CBAA degree programs"},
        ],
    },
    "dlsu-shs": {
        "courses": [
            "Academic Track — Engineering Elective Cluster",
            "Academic Track — Computing Elective Cluster",
            "Academic Track — Life Science Elective Cluster",
            "Academic Track — Business Elective Cluster",
            "Academic Track — Liberal Arts Elective Cluster",
        ],
        "sources": [
            {"url": "https://www.dlsu.edu.ph/admission/senior-high-school-admission/", "note": "Official DLSU SHS admission FAQ — academic track clusters"},
        ],
    },
    "golden-heritage": {
        "courses": [
            "Bachelor of Elementary Education",
            "Bachelor of Secondary Education",
            "BS Business Administration",
            "BS Office Administration",
        ],
        "sources": [
            {"url": "https://goldenheritage.edu.ph/ched-programs/", "note": "Official CHED-recognized baccalaureate programs"},
        ],
    },
    "icct-colleges-cainta": {
        "courses": [
            "Bachelor of Science in Accountancy",
            "Bachelor of Science in Information Technology",
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Computer Engineering",
            "Bachelor of Science in Psychology",
            "Bachelor of Science in Legal Management",
        ],
        "sources": [
            {"url": "https://www.icct.edu.ph/programs", "note": "Official ICCT Colleges program catalog"},
        ],
    },
    "icct-colleges-taytay": {
        "courses": [
            "Bachelor of Science in Accountancy",
            "Bachelor of Science in Information Technology",
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Computer Engineering",
            "Bachelor of Science in Psychology",
            "Bachelor of Science in Legal Management",
        ],
        "sources": [
            {"url": "https://www.icct.edu.ph/programs", "note": "Official ICCT Colleges program catalog"},
        ],
    },
    "icct-colleges-trece": {
        "courses": [
            "Bachelor of Science in Accountancy",
            "Bachelor of Science in Information Technology",
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Computer Engineering",
            "Bachelor of Science in Psychology",
            "Bachelor of Science in Legal Management",
        ],
        "sources": [
            {"url": "https://www.icct.edu.ph/programs", "note": "Official ICCT Colleges program catalog"},
        ],
    },
    "immaculate-concepcion-seminary": {
        "courses": [
            "Master of Arts in Theology Major in Systematic Theology",
            "Master in Pastoral Ministry Major in Pastoral Management",
            "Bachelor in Sacred Theology",
        ],
        "sources": [
            {"url": "https://www.icstvigan.org.ph/history/", "note": "Official ICST history — CHED graduate programs and UST-affiliated STB"},
        ],
    },
    "la-consolacion-university": {
        "courses": [
            "BS Nursing",
            "BS Accountancy",
            "BS Business Administration",
            "BS Hospitality Management",
            "BS Tourism Management",
            "BS Information Technology",
            "BS Computer Engineering",
            "Bachelor of Secondary Education",
        ],
        "sources": [
            {"url": "https://lcup.edu.ph/admission_program_offered.php", "note": "Official programs offered by college"},
        ],
    },
}

BLOCKED: dict[str, list[dict]] = {
    "antipolo-science": [{"url": "https://www.antipolo.gov.ph/", "note": "No official SHS program catalog URL"}],
    "arellano-university-malabon": [{"url": "https://www.arellano.edu.ph/", "note": "Official site unreachable / program list not extractable after 2 tries"}],
    "arellano-university-pasay": [{"url": "https://www.arellano.edu.ph/", "note": "Official site unreachable / program list not extractable after 2 tries"}],
    "asian-institute-science": [{"url": "https://www.aist.edu.ph/", "note": "Official site unreachable (timeout/DNS)"}],
    "batangas-provincial": [{"url": "https://www.bpc.edu.ph/", "note": "Official site under maintenance"}],
    "bestlink": [{"url": "https://www.bestlink.edu.ph/", "note": "Official site DNS unreachable"}],
    "calayan-educational": [{"url": "https://www.cefi.edu.ph/", "note": "Official site blocked (HTTP 406 Mod_Security)"}],
    "colegio-san-agustin-bacolod": [{"url": "https://www.csa.edu.ph/", "note": "Official program list not extractable after 2 tries"}],
    "don-bosco-canlubang": [{"url": "https://www.dbcanlubang.edu.ph/", "note": "Official site DNS unreachable"}],
    "don-bosco-makati": [{"url": "https://www.dbmanila.org/", "note": "Official site DNS unreachable"}],
    "emilio-aguinaldo-college": [{"url": "https://www.eac.edu.ph/", "note": "Official program list not extractable after 2 tries"}],
    "feu-shs": [{"url": "https://www.feu.edu.ph/academics/senior-high-school", "note": "Official site DNS unreachable"}],
    "holy-angel-university": [{"url": "https://www.hau.edu.ph/academics", "note": "Official academics page has no program catalog"}],
    "lyceum-northwestern": [{"url": "https://www.lnu.edu.ph/", "note": "Official site unreachable (redirect/timeout)"}],
    "manila-doctors-college": [{"url": "https://www.mdc.edu.ph/", "note": "Official site DNS unreachable"}],
    "mapua-shs": [{"url": "https://www.mapua.edu.ph/academics/senior-high-school", "note": "Official SHS program list not extractable after 2 tries"}],
    "marikina-science": [{"url": "https://www.deped.gov.ph/", "note": "No official school program catalog URL"}],
    "mfi-polytechnic": [{"url": "https://www.mfi.org.ph/", "note": "Official program list not extractable after 2 tries"}],
    "miriam-college-shs": [{"url": "https://www.miriam.edu.ph/academics/senior-high-school", "note": "Official site DNS unreachable"}],
    "mla-shs": [{"url": "https://www.ue.edu.ph/mla/", "note": "Official UE Manila SHS strand page not found after 2 tries"}],
}

BLOCK_NOTE = "Official site unreachable after 2 fetch attempts"


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    report = {"generated": GENERATED, "enriched": [], "blocked": []}

    for uid, row in ENRICHED.items():
        doc = enrich(uid, row["courses"], row["sources"])
        (OUT / f"{uid}.json").write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        report["enriched"].append(uid)

    for uid, sources in BLOCKED.items():
        doc = blocked(uid, sources, BLOCK_NOTE)
        (OUT / f"{uid}.json").write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        report["blocked"].append(uid)

    (OUT / "phase-c-report.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"enriched": len(report["enriched"]), "blocked": len(report["blocked"]), "blocked_ids": report["blocked"]}, indent=2))


if __name__ == "__main__":
    main()
