#!/usr/bin/env python3
"""Apply the verified data3 university corrections to runtime catalogs."""

from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path
from typing import Any

from university_riasec_derive import narrow_riasec_tags


ROOT = Path(__file__).resolve().parents[1]
RESEARCH = ROOT / "docs/plans/kursoko-data3/newData.json"
INTEGRATION = ROOT / "docs/plans/kursoko-data3/verified-integration.json"
POPULAR_RESEARCH = ROOT / "docs/plans/kursoko-data3/popularCourse.json"
POPULAR_INTEGRATION = (
    ROOT / "docs/plans/kursoko-data3/verified-popular-course-integration.json"
)
UNIVERSITIES = ROOT / "src/data/universities.json"
SCHOLARSHIPS = ROOT / "src/data/scholarships.json"


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def validate_contract(research: dict[str, Any], integration: dict[str, Any]) -> None:
    research_meta = research["metadata"]
    integration_meta = integration["metadata"]
    expected_total = research_meta["totalActions"]
    reviewed_total = sum(
        integration_meta[key]
        for key in ("appliedActions", "alreadySatisfiedActions", "deferredActions")
    )
    if reviewed_total != expected_total:
        raise ValueError(f"Reviewed actions {reviewed_total} != requested {expected_total}")
    if research_meta["reviewSummary"] != {
        "applied": integration_meta["appliedActions"],
        "alreadySatisfied": integration_meta["alreadySatisfiedActions"],
        "deferred": integration_meta["deferredActions"],
    }:
        raise ValueError("newData.json review summary does not match verified integration")


def validate_popular_contract(
    research: dict[str, Any],
    integration: dict[str, Any],
) -> None:
    institutions = [
        institution
        for region in research["institutions"].values()
        for institution in region
    ]
    actual_integrate = sum(
        institution.get("action") == "INTEGRATE"
        for institution in institutions
    )
    metadata = integration["metadata"]
    if len(institutions) != metadata["actualInstitutionCount"]:
        raise ValueError("popularCourse.json institution count changed")
    if actual_integrate != metadata["actualIntegrateTagCount"]:
        raise ValueError("popularCourse.json INTEGRATE count changed")
    if len(integration["coveredRuntimeIds"]) != metadata["runtimeCoveredBefore"]:
        raise ValueError("Popular-course covered-id count is inconsistent")
    if len(integration["add"]) != metadata["additions"]:
        raise ValueError("Popular-course addition count is inconsistent")
    if len(integration["update"]) != metadata["updates"]:
        raise ValueError("Popular-course update count is inconsistent")


def combine_integrations(
    integration: dict[str, Any],
    popular_integration: dict[str, Any],
) -> dict[str, Any]:
    metadata = {
        **integration["metadata"],
        "targetVersion": popular_integration["metadata"]["targetVersion"],
        "targetCount": popular_integration["metadata"]["targetCount"],
    }
    return {
        "metadata": metadata,
        "remove": integration["remove"],
        "update": [*integration["update"], *popular_integration["update"]],
        "add": [*integration["add"], *popular_integration["add"]],
    }


def apply_university_changes(
    catalog: dict[str, Any],
    integration: dict[str, Any],
) -> dict[str, Any]:
    rows = catalog["universities"]
    by_id = {row["id"]: row for row in rows}
    if len(by_id) != len(rows):
        raise ValueError("University ids are not unique before data3 integration")

    remove_ids = {item["id"] for item in integration["remove"]}
    rows = [row for row in rows if row["id"] not in remove_ids]
    by_id = {row["id"]: row for row in rows}

    for item in integration["update"]:
        university_id = item["id"]
        if university_id not in by_id:
            raise KeyError(f"Cannot update missing university: {university_id}")
        by_id[university_id].update(item["changes"])

    for addition in integration["add"]:
        existing = by_id.get(addition["id"])
        if existing is None:
            runtime_addition = deepcopy(addition)
            rows.append(runtime_addition)
            by_id[addition["id"]] = runtime_addition
        else:
            existing.clear()
            existing.update(deepcopy(addition))

    target_count = integration["metadata"]["targetCount"]
    if len(rows) < target_count:
        raise ValueError(f"University count {len(rows)} is below verified baseline {target_count}")
    if len({row["id"] for row in rows}) != len(rows):
        raise ValueError("University ids are not unique after data3 integration")
    if remove_ids.intersection(row["id"] for row in rows):
        raise ValueError("Removed university ids remain in runtime catalog")

    current_version = catalog["metadata"].get("version", "0.0.0")
    target_version = integration["metadata"]["targetVersion"]
    latest_version = max(
        (current_version, target_version),
        key=lambda value: tuple(int(part) for part in value.split(".")),
    )

    catalog["universities"] = rows
    catalog["metadata"].update(
        {
            "region": (
                "NCR + CALABARZON + Central Luzon + Ilocos Region "
                "+ Western Visayas (partial)"
            ),
            "version": latest_version,
            "lastUpdated": max(
                catalog["metadata"].get("lastUpdated", ""),
                integration["metadata"]["verifiedDate"],
            ),
            "count": len(rows),
            "source": (
                "docs/plans/kursoko-data + docs/plans/kursoko-data2 "
                "+ docs/plans/kursoko-data3/verified-integration.json "
                "+ docs/plans/kursoko-data3/verified-popular-course-integration.json"
            ),
            "data3Verification": integration["metadata"]["verifiedDate"],
            "popularCourseVerification": "2026-07-17",
        }
    )
    return catalog


def apply_cross_catalog_changes(
    catalog: dict[str, Any],
    integration: dict[str, Any],
) -> dict[str, Any]:
    by_id = {row["id"]: row for row in catalog["scholarships"]}
    for item in integration["crossCatalogUpdate"]:
        if item["catalog"] != "src/data/scholarships.json":
            raise ValueError(f"Unsupported cross-catalog target: {item['catalog']}")
        scholarship = by_id.get(item["id"])
        if scholarship is None:
            raise KeyError(f"Cannot update missing scholarship: {item['id']}")
        replacement = item["replaceInstitutionTag"]
        scholarship["institutionTags"] = [
            replacement["to"] if tag == replacement["from"] else tag
            for tag in scholarship.get("institutionTags", [])
        ]
    return catalog


def recalculate_riasec_tags(catalog: dict[str, Any]) -> dict[str, Any]:
    for university in catalog["universities"]:
        university["riasecTags"] = narrow_riasec_tags(university, max_tags=3)
    catalog["metadata"]["riasecNarrowPass"] = "2026-07-17"
    return catalog


def validate_result(
    universities: dict[str, Any],
    scholarships: dict[str, Any],
    integration: dict[str, Any],
    popular_integration: dict[str, Any],
) -> None:
    by_id = {row["id"]: row for row in universities["universities"]}
    for verified in (integration, popular_integration):
        for addition in verified["add"]:
            runtime = by_id.get(addition["id"])
            if runtime != addition:
                raise ValueError(
                    f"Runtime addition differs from verified source: {addition['id']}"
                )
            if runtime["programSource"] != "official_website":
                raise ValueError(f"Unverified program source: {addition['id']}")
            if not 1 <= len(runtime["popularCourses"]) <= 12:
                raise ValueError(f"Invalid program count: {addition['id']}")

    if any(len(row.get("riasecTags", [])) > 3 for row in universities["universities"]):
        raise ValueError("Over-broad RIASEC tags remain after data3 integration")
    investigative_share = sum(
        "I" in row.get("riasecTags", [])
        for row in universities["universities"]
    ) / len(universities["universities"])
    if investigative_share >= 0.9:
        raise ValueError("Investigative RIASEC coverage remains ownership-default biased")

    updates = {
        item["id"]: item["changes"]
        for verified in (integration, popular_integration)
        for item in verified["update"]
    }
    for university_id, changes in updates.items():
        runtime = by_id[university_id]
        for key, expected in changes.items():
            if runtime.get(key) != expected:
                raise ValueError(f"Update mismatch: {university_id}.{key}")

    scholarship_by_id = {row["id"]: row for row in scholarships["scholarships"]}
    pampanga_tags = scholarship_by_id["pampanga-province-scholarship"]["institutionTags"]
    if "pampanga-state-university" in pampanga_tags:
        raise ValueError("Removed Pampanga duplicate id remains in scholarship tags")
    if "don-honorio-ventura" not in pampanga_tags:
        raise ValueError("Merged Pampanga university is missing from scholarship tags")


def main() -> None:
    integration = load_json(INTEGRATION)
    popular_integration = load_json(POPULAR_INTEGRATION)
    universities = load_json(UNIVERSITIES)
    scholarships = load_json(SCHOLARSHIPS)

    # Raw research packages are local audit inputs. Verified integration files are
    # the reproducible source of truth and remain required in clean checkouts.
    if RESEARCH.exists():
        validate_contract(load_json(RESEARCH), integration)
    if POPULAR_RESEARCH.exists():
        validate_popular_contract(load_json(POPULAR_RESEARCH), popular_integration)
    combined_integration = combine_integrations(integration, popular_integration)
    universities = apply_university_changes(universities, combined_integration)
    universities = recalculate_riasec_tags(universities)
    scholarships = apply_cross_catalog_changes(scholarships, integration)
    validate_result(
        universities,
        scholarships,
        integration,
        popular_integration,
    )

    write_json(UNIVERSITIES, universities)
    write_json(SCHOLARSHIPS, scholarships)
    print(
        "Applied data3:",
        f"{universities['metadata']['count']} universities,",
        f"version {universities['metadata']['version']}",
    )


if __name__ == "__main__":
    main()
