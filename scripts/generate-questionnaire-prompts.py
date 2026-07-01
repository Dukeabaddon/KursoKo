#!/usr/bin/env python3
"""Generate questionnaire choice asset prompt JSONs from questions.json + choice specs."""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from questionnaire_choice_specs import CHOICE_SPECS

ROOT = Path(__file__).resolve().parents[1]
QUESTIONS_PATH = ROOT / "src/data/questions.json"
OUT_DIR = ROOT / "docs/plans/asset-prompts/questionnaire"
SPECS_OUT = OUT_DIR / "choice-specs.json"

RIASEC = {
    "R": {"type": "Realistic", "accent": "#4DB6AC", "secondary": "#9575CD"},
    "I": {"type": "Investigative", "accent": "#4B2C7F", "secondary": "#4DB6AC"},
    "A": {"type": "Artistic", "accent": "#FFD54F", "secondary": "#9575CD"},
    "S": {"type": "Social", "accent": "#9575CD", "secondary": "#4DB6AC"},
    "E": {"type": "Enterprising", "accent": "#FF8A65", "secondary": "#FFD54F"},
    "C": {"type": "Conventional", "accent": "#81D4FA", "secondary": "#4B2C7F"},
}

GLOBAL_ART_STYLE = {
    "medium": "flat vector illustration",
    "line_weight_px": 2,
    "outline_hex": "#2D2D2D",
    "fill": "solid flat fills",
    "shading": "minimal cel shadow under hands and hero prop only",
    "mood": "friendly career education for students",
    "reference": "KursoKo RIASEC sticker family — minus letter, minus border frame",
    "forbidden": [
        "RIASEC letter on image",
        "colored border frame or sticker card",
        "text labels or captions on image",
        "full faces or identifiable people",
        "photorealistic render",
        "purple-blue SaaS gradient UI",
        "distressing or graphic imagery",
    ],
}


def build_prompt_text(
    choice_text: str,
    code: str,
    riasec: dict,
    spec: dict,
    sensitive: bool,
) -> str:
    subj = spec["subject"]
    pose = spec["pose"]
    clothes = spec["clothes"]
    color = spec["color"]
    art = spec["art_style"]
    props = ", ".join(subj["primary_objects"])

    parts = [
        f"Flat vector education illustration, 640x640 square, transparent PNG.",
        f"KursoKo quiz choice — NO letter, NO border frame, NO text on image.",
        f"Activity: {choice_text}.",
        f"Subject focus: {subj['activity']}.",
        f"Props: {props}.",
        f"Environment: {subj['environment']}.",
        f"Pose: {pose['gesture']}. Camera: {pose['camera_angle']}.",
        f"Left hand: {pose['left_hand']}. Right hand: {pose['right_hand']}.",
        f"Clothes: {clothes['sleeves']}. Accessories: {clothes['accessories']}.",
        f"Colors — RIASEC {riasec['type']}: accent {riasec['accent']}, secondary {riasec['secondary']}, "
        f"skin {color['skin_tone']}, outline {art['outline']}.",
        f"Accent on: {', '.join(color['accent_placement'])}.",
        f"Art: {art['medium']}, {art['line_weight_px']}px outline, {art['fill']}.",
        f"Energy: {pose['energy']}. Safe margin 40px.",
    ]
    if subj.get("symbolic") or sensitive:
        parts.append(
            "Symbolic hopeful tone only — no distress, no graphic medical or crisis imagery."
        )
    return " ".join(parts)


def build_prompt(
    qid: int,
    option_key: str,
    choice_text: str,
    hint: str,
    code: str,
    spec: dict,
) -> dict:
    slot = f"{qid}.{option_key}"
    q_pad = f"{qid:02d}"
    filename = f"src/assets/questionnaire/{q_pad}.{option_key}.png"
    riasec = RIASEC[code]
    sensitive = spec["subject"].get("symbolic", False)

    palette = {
        "riasec_code": code,
        "riasec_type": riasec["type"],
        "accent": riasec["accent"],
        "secondary": riasec["secondary"],
        "ink": "#2D2D2D",
        "paper": "#FDFCF8",
        "skin_tone": spec["color"]["skin_tone"],
        "background": spec["color"]["background"],
        "accent_placement": spec["color"]["accent_placement"],
        "shading": spec["color"]["shading"],
        "rule": "Accent on props and sleeve trim only — not full background wash",
    }

    return {
        "project": "KursoKo",
        "asset_set": f"Questionnaire Q{qid} option {option_key} — {choice_text}",
        "questionnaire": {
            "question_id": qid,
            "option_key": option_key,
            "slot": slot,
            "choice_text": choice_text,
            "hint": hint,
            "riasec_code": code,
            "riasec_type": riasec["type"],
            "sensitive_topic": sensitive,
        },
        "deliverable": {
            "filename": filename,
            "width_px": 640,
            "height_px": 640,
            "aspect_ratio": "1:1",
            "background": "transparent PNG",
            "safe_padding_px": 40,
        },
        "art_style": {**GLOBAL_ART_STYLE, **spec["art_style"]},
        "color": palette,
        "pose": spec["pose"],
        "clothes": spec["clothes"],
        "subject": {
            "choice_label": choice_text,
            "activity_hint": hint,
            **spec["subject"],
        },
        "composition": {
            "layout": "single clear scene, centered focal activity",
            "focal_point": spec["subject"]["activity"],
            "text_on_image": "none",
            "readable_at": "assessment card thumbnail ~160px width",
        },
        "technical": {
            "export": "PNG-24 alpha",
            "max_file_kb": 200,
            "crisp_edges": True,
            "no_drop_shadow_on_canvas": True,
        },
        "prompt_for_image_ai": build_prompt_text(choice_text, code, riasec, spec, sensitive),
    }


def main() -> None:
    data = json.loads(QUESTIONS_PATH.read_text(encoding="utf-8"))
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # Master specs index for external tools
    specs_index: dict[str, dict] = {
        "project": "KursoKo",
        "version": 2,
        "global_art_style": GLOBAL_ART_STYLE,
        "riasec_palette": RIASEC,
        "choices": {},
    }

    manifest_entries = []

    for q in data["questions"]:
        qid = q["id"]
        for opt_key, opt_field in (("1", "optionA"), ("2", "optionB")):
            slot = f"{qid}.{opt_key}"
            opt = q[opt_field]
            if slot not in CHOICE_SPECS:
                raise KeyError(f"Missing spec for {slot}")

            spec = CHOICE_SPECS[slot]
            doc = build_prompt(qid, opt_key, opt["text"], opt["hint"], opt["code"], spec)

            fname = f"q{qid:02d}.{opt_key}.json"
            out_path = OUT_DIR / fname
            out_path.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

            specs_index["choices"][slot] = {
                "prompt_file": fname,
                "choice_text": opt["text"],
                "riasec_code": opt["code"],
                "subject": spec["subject"],
                "pose": spec["pose"],
                "clothes": spec["clothes"],
                "color": {**spec["color"], "accent": RIASEC[opt["code"]]["accent"]},
                "art_style": spec["art_style"],
            }

            manifest_entries.append(
                {
                    "prompt_file": f"questionnaire/{fname}",
                    "slot": slot,
                    "question_id": qid,
                    "option_key": opt_key,
                    "choice_text": opt["text"],
                    "riasec_code": opt["code"],
                    "output_png": doc["deliverable"]["filename"],
                    "sensitive": doc["questionnaire"]["sensitive_topic"],
                }
            )

    SPECS_OUT.write_text(json.dumps(specs_index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    manifest = {
        "project": "KursoKo",
        "asset_set": "Questionnaire choice illustrations",
        "version": 2,
        "total_questions": 30,
        "total_choices": 60,
        "spec_file": "questionnaire/choice-specs.json",
        "regenerate": "python3 scripts/generate-questionnaire-prompts.py",
        "spec": {
            "style": "flat vector scene, hands only, no letter, no border",
            "size_px": "640x640",
            "output_dir": "src/assets/questionnaire/",
            "naming": "{qq}.{option}.png e.g. 01.1.png = Q1 option A",
        },
        "choices": manifest_entries,
    }
    (OUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(f"Wrote {len(manifest_entries)} prompts + choice-specs.json to {OUT_DIR}")


if __name__ == "__main__":
    main()
