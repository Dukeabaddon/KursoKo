#!/usr/bin/env python3
"""Fetch EduRank subject majors → strengthTags + riasecTags; patch runtime catalog."""
from __future__ import annotations

import json
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from university_riasec_derive import derive_riasec_tags

RUNTIME = ROOT / "src/data/universities.json"
PH_UPLOAD = Path(
    "/Users/macbookair/.cursor/projects/Users-macbookair-Documents-Visual-Studio-Code-React-KursoKo/uploads/ph-0.md"
)
OUT_DIR = ROOT / "docs/plans/kursoko-data2/edurank-validation"
REPORT = OUT_DIR / f"edurank-patch-report-{date.today()}.json"

USER_AGENT = "Mozilla/5.0 (compatible; KursoKo-DataValidator/1.0)"
TOP_SUBJECTS = 12
REQUEST_DELAY_S = 0.8

# EduRank research topic → KursoKo strengthTag (matcher vocabulary)
SUBJECT_TO_STRENGTH: dict[str, str] = {
    "computer science": "computer-science",
    "artificial intelligence (ai)": "computer-science",
    "information technology": "information-technology",
    "engineering": "engineering",
    "electrical engineering": "engineering",
    "chemical engineering": "engineering",
    "mechanical engineering": "engineering",
    "civil engineering": "engineering",
    "optical engineering": "engineering",
    "metallurgical engineering": "engineering",
    "business": "business",
    "economics": "economics",
    "accounting": "accountancy",
    "medicine": "medicine",
    "nursing": "nursing",
    "pharmacy": "pharmacy",
    "psychology": "psychology",
    "education": "education",
    "law": "law",
    "art & design": "arts-and-design",
    "liberal arts & social sciences": "liberal-arts",
    "environmental science": "environmental-science",
    "environmental management": "environmental-science",
    "chemistry": "chemistry",
    "biology": "biology",
    "biochemistry": "biology",
    "mathematics": "mathematics",
    "statistics": "mathematics",
    "physics": "physics",
    "agriculture": "agriculture",
    "veterinary": "veterinary",
    "architecture": "architecture",
    "hospitality": "hospitality",
    "tourism": "tourism",
    "communication": "communication",
    "political science": "political-science",
    "sociology": "sociology",
    "history": "history",
    "philosophy": "philosophy",
    "linguistics": "linguistics",
    "criminology": "criminology",
    "social work": "social-work",
    "public health": "public-health",
    "dentistry": "dentistry",
    "food science": "food-science",
    "music": "music",
}

# Runtime id → EduRank slug overrides
SLUG_ALIASES: dict[str, str] = {
    "up-diliman": "university-of-the-philippines-diliman",
    "uplb": "university-of-the-philippines-los-banos",
    "up-manila": "university-of-the-philippines-manila",
    "dlsu-manila": "de-la-salle-university",
    "ateneo-manila": "ateneo-de-manila-university",
    "ust": "university-of-santo-tomas",
    "pup-manila": "polytechnic-university-of-the-philippines",
    "mapua-university": "mapua-university",
    "adamson-university": "adamson-university",
    "feu-manila": "far-eastern-university",
    "nu-manila": "national-university",
    "lpu-manila": "lyceum-of-the-philippines-university",
    "benilde": "de-la-salle-college-of-saint-benilde",
    "san-beda-university": "san-beda-university",
    "bulacan-state-university": "bulacan-state-university",
    "central-luzon-state-university": "central-luzon-state-university",
    "pnu": "philippine-normal-university",
    "emilio-aguinaldo-college": "emilio-aguinaldo-college",
    "philippine-womens-university": "philippine-womens-university",
    "up-open-university": "university-of-the-philippines-open-university",
    "up-clark": None,  # no EduRank page; do not inherit UP Diliman subjects
    "ua": "university-of-the-assumption",
}

SKIP_EDURANK_IDS = {"up-clark"}


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower().replace("mapúa", "mapua").replace("los baños", "los banos")
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def load_edurank_index() -> dict[str, str]:
    """name slug -> edurank uni slug from uploaded ph-0.md top-100 list."""
    index: dict[str, str] = {}
    if PH_UPLOAD.exists():
        text = PH_UPLOAD.read_text(encoding="utf-8")
        for name in re.findall(r"^## \d+\. (.+?)\s*$", text, re.M):
            s = slugify(name)
            index[s] = s
            index[norm_name(name)] = s
    return index


def norm_name(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()
    return re.sub(r"\s+", " ", text)


def edurank_slug_for(uni: dict, index: dict[str, str]) -> str | None:
    uid = uni["id"]
    if uid in SKIP_EDURANK_IDS:
        return None
    if uid in SLUG_ALIASES:
        alias = SLUG_ALIASES[uid]
        if alias is None:
            return None
        return alias
    name = uni["name"]
    s = slugify(name)
    if s in index:
        return index[s]
    nk = norm_name(name)
    if nk in index:
        return index[nk]
    # strip campus suffixes
    base = re.sub(r"-(?:manila|quezon-city|taguig|paranaque|caloocan|cavite|laguna|pampanga|batangas)$", "", s)
    if base in index:
        return index[base]
    # try slugify of name without hyphen suffix after " - "
    short = name.split(" - ")[0].split(" – ")[0]
    ss = slugify(short)
    if ss in index:
        return index[ss]
    return ss  # attempt direct slug URL even if not in top-100 index


def fetch_edurank_html(slug: str) -> str | None:
    url = f"https://edurank.org/uni/{slug}/"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            if resp.status != 200:
                return None
            return resp.read().decode("utf-8", errors="replace")
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError):
        return None


def parse_subjects(html: str) -> list[tuple[str, int, int]]:
    """Return [(subject_name, pubs, cites), ...] ordered as on page."""
    import html as html_module

    rows: list[tuple[str, int, int]] = []
    seen: set[str] = set()

    # Live EduRank HTML (table-collapsing majors section)
    pattern_html = re.compile(
        r'<th scope="row">\s*<a[^>]*>(?P<name>[^<]+)</a>\s*</th>\s*<td[^>]*>.*?'
        r'<span>(?P<pubs>[\d,]+)</span>\s*<span[^>]*>\s*/\s*(?P<cites>[\d,]+)',
        re.I | re.S,
    )
    for m in pattern_html.finditer(html):
        name = html_module.unescape(m.group("name").strip())
        pubs = int(m.group("pubs").replace(",", ""))
        cites = int(m.group("cites").replace(",", ""))
        if name not in seen:
            seen.add(name)
            rows.append((name, pubs, cites))

    if rows:
        return rows

    # Markdown captures / saved uploads
    pattern_md = re.compile(
        r"\[(?P<name>[^\]]+)\]\([^)]+\)\s*\|\s*(?P<pubs>[\d,]+)\s*/\s*(?P<cites>[\d,]+)",
        re.I,
    )
    for m in pattern_md.finditer(html):
        name = m.group("name").strip()
        pubs = int(m.group("pubs").replace(",", ""))
        cites = int(m.group("cites").replace(",", ""))
        if name not in seen:
            seen.add(name)
            rows.append((name, pubs, cites))

    return rows


def subjects_to_strengths(subjects: list[tuple[str, int, int]], limit: int = TOP_SUBJECTS) -> list[str]:
    tags: list[str] = []
    seen: set[str] = set()
    for name, _pubs, _cites in subjects[:limit]:
        key = name.lower().strip()
        tag = SUBJECT_TO_STRENGTH.get(key)
        if not tag:
            # partial match
            for subj, mapped in SUBJECT_TO_STRENGTH.items():
                if subj in key or key in subj:
                    tag = mapped
                    break
        if not tag:
            tag = slugify(name)
        if tag and tag not in seen:
            seen.add(tag)
            tags.append(tag)
    return tags


def merge_strengths(existing: list[str], edurank: list[str]) -> list[str]:
    out: list[str] = []
    seen: set[str] = set()
    for tag in edurank + existing:
        if tag and tag not in seen:
            seen.add(tag)
            out.append(tag)
    return out


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    index = load_edurank_index()
    data = json.loads(RUNTIME.read_text(encoding="utf-8"))
    universities = data["universities"]

    report = {
        "generated": str(date.today()),
        "source": "https://edurank.org/geo/ph/",
        "method": "EduRank subject majors (publication/citation) → strengthTags; riasec derived",
        "runtime_count": len(universities),
        "patched": [],
        "skipped_no_page": [],
        "skipped_no_subjects": [],
        "errors": [],
    }

    for i, uni in enumerate(universities):
        slug = edurank_slug_for(uni, index)
        if not slug:
            report["skipped_no_page"].append({"id": uni["id"], "name": uni["name"]})
            continue

        html = fetch_edurank_html(slug)
        time.sleep(REQUEST_DELAY_S)
        if not html or "404" in html[:500].lower():
            report["skipped_no_page"].append({"id": uni["id"], "name": uni["name"], "slug": slug})
            continue

        subjects = parse_subjects(html)
        if not subjects:
            report["skipped_no_subjects"].append({"id": uni["id"], "slug": slug})
            continue

        edurank_strengths = subjects_to_strengths(subjects)
        before_strength = list(uni.get("strengthTags") or [])
        before_riasec = list(uni.get("riasecTags") or [])
        merged_strength = merge_strengths(before_strength, edurank_strengths)
        uni["strengthTags"] = merged_strength
        uni["riasecTags"] = derive_riasec_tags(uni)

        if merged_strength != before_strength or uni["riasecTags"] != before_riasec:
            report["patched"].append(
                {
                    "id": uni["id"],
                    "edurank_slug": slug,
                    "subjects_found": len(subjects),
                    "top_subjects": [s[0] for s in subjects[:TOP_SUBJECTS]],
                    "strengthTags_before": before_strength,
                    "strengthTags_after": merged_strength,
                    "riasecTags_before": before_riasec,
                    "riasecTags_after": uni["riasecTags"],
                }
            )

        if (i + 1) % 10 == 0:
            print(f"Processed {i + 1}/{len(universities)}...", flush=True)

    data["metadata"]["lastUpdated"] = str(date.today())
    data["metadata"]["edurankEnrichment"] = str(date.today())
    data["metadata"]["count"] = len(universities)
    RUNTIME.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    report["summary"] = {
        "patched": len(report["patched"]),
        "no_page": len(report["skipped_no_page"]),
        "no_subjects": len(report["skipped_no_subjects"]),
    }
    REPORT.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(report["summary"], indent=2))
    print(f"Report: {REPORT}")


if __name__ == "__main__":
    main()
