#!/usr/bin/env python3
"""Build manifest.json from v3 JSON prompt files (read-only index — not a prompt source)."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / "docs/plans/asset-prompts/questionnaire"


def main() -> None:
    entries = []
    for path in sorted(DIR.glob("q*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        q = data["questionnaire"]
        entries.append(
            {
                "prompt_file": f"questionnaire/{path.name}",
                "schema_version": data.get("schema_version", 3),
                "slot": q["slot"],
                "question_id": q["question_id"],
                "option_key": q["option_key"],
                "choice_text": q["choice_text"],
                "riasec_code": q["riasec_code"],
                "output_png": data["deliverable"]["filename"],
                "sensitive": q.get("sensitive_topic", False),
            }
        )

    manifest = {
        "project": "KursoKo",
        "asset_set": "Questionnaire choice illustrations",
        "version": 3,
        "source_of_truth": "individual qNN.M.json files in this folder",
        "schema": "questionnaire/_schema-v3.json",
        "total_questions": 30,
        "total_choices": len(entries),
        "spec": {
            "style": "flat vector scene v3, hands only, no letter, no border",
            "size_px": "640x640",
            "output_dir": "src/assets/questionnaire/",
            "naming": "NN.M.png — e.g. 01.1.png = Q1 option A",
        },
        "choices": entries,
    }
    out = DIR / "manifest.json"
    out.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote manifest with {len(entries)} entries")


if __name__ == "__main__":
    main()
