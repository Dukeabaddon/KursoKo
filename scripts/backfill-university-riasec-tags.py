#!/usr/bin/env python3
"""Backfill empty riasecTags on src/data/universities.json."""
from __future__ import annotations

import json
from datetime import date
from pathlib import Path

from university_riasec_derive import derive_riasec_tags

ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "src/data/universities.json"


def main() -> None:
    data = json.loads(RUNTIME.read_text(encoding="utf-8"))
    filled = 0
    skipped = 0

    for uni in data.get("universities", []):
        if uni.get("riasecTags"):
            skipped += 1
            continue
        uni["riasecTags"] = derive_riasec_tags(uni)
        filled += 1

    if "metadata" in data:
        data["metadata"]["count"] = len(data.get("universities", []))
        data["metadata"]["riasecTagsBackfill"] = str(date.today())

    RUNTIME.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Backfill complete: {filled} filled, {skipped} already tagged, {len(data['universities'])} total")


if __name__ == "__main__":
    main()
