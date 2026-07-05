#!/usr/bin/env python3
"""DEPRECATED for production — writes staging only. Never updates runtime directly."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

if __name__ == "__main__":
    print(
        json.dumps(
            {
                "error": "backfill-popular-courses.py is disabled for production.",
                "reason": "Tag-derived courses are not allowed in runtime.",
                "use_instead": [
                    "docs/plans/kursoko-data2/official-site-enrichment-phase-c/",
                    "scripts/merge-official-site-enrichment.py",
                    "scripts/enforce-production-courses.py",
                ],
            },
            indent=2,
        ),
        file=sys.stderr,
    )
    raise SystemExit(1)
