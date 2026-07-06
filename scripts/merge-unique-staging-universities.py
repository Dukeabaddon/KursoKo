#!/usr/bin/env python3
"""Merge non-duplicate staging universities into runtime."""
from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "src/data/universities.json"
STAGING_FILES = [
    ROOT / "docs/plans/kursoko-data2/_staging-universities.json",
    ROOT / "docs/plans/kursoko-data2/universities2.json",
]
REPORT = ROOT / "docs/plans/kursoko-data2/merge-unique-staging-report.json"


def norm_name(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", (name or "").lower())


def load_staging() -> list[dict]:
    rows: list[dict] = []
    for path in STAGING_FILES:
        if not path.exists():
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        rows.extend(data.get("universities", []))
    return rows


def main() -> None:
    spec = importlib.util.spec_from_file_location(
        "sync_mod", ROOT / "scripts/sync-kursoko-data2.py"
    )
    sync = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(sync)

    runtime_doc = json.loads(RUNTIME.read_text(encoding="utf-8"))
    runtime = runtime_doc["universities"]
    runtime_ids = {u["id"] for u in runtime}
    runtime_names = {norm_name(u.get("name", "")) for u in runtime}

    added = []
    skipped = []
    for raw in load_staging():
        sid = raw.get("id")
        sname = norm_name(raw.get("name", ""))
        if sid in runtime_ids or sname in runtime_names:
            skipped.append({"id": sid, "name": raw.get("name"), "reason": "dup"})
            continue
        try:
            normalized = sync.normalize_university(raw)
        except Exception as exc:  # noqa: BLE001
            skipped.append({"id": sid, "name": raw.get("name"), "reason": str(exc)})
            continue
        runtime.append(normalized)
        runtime_ids.add(normalized["id"])
        runtime_names.add(norm_name(normalized.get("name", "")))
        added.append(normalized["id"])

    before = len(runtime)
    runtime = [u for u in runtime if u.get("id") != "san-beda-alabang"]
    removed = before - len(runtime)

    runtime_doc["universities"] = runtime
    RUNTIME.write_text(json.dumps(runtime_doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    report = {
        "added": added,
        "addedCount": len(added),
        "removedIds": ["san-beda-alabang"] if removed else [],
        "skippedCount": len(skipped),
        "finalCount": len(runtime),
    }
    REPORT.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
