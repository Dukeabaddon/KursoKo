# Questionnaire choice asset prompts (v3)

**Source of truth:** each `qNN.M.json` file in this folder — **not** Python.

| What | File |
|------|------|
| Schema + global rules | `_schema-v3.json` |
| Gold example | `q01.1.json` |
| Index | `manifest.json` (auto-built) |
| Prompts | `q01.1.json` … `q30.2.json` (60 files) |

## v3 JSON blocks (every file)

| Block | Purpose |
|-------|---------|
| `questionnaire` | id, question text, choice, RIASEC code |
| `deliverable` | output PNG path, 640×640 |
| `art_style` | line weight, mood, forbidden list |
| `color.palette` | accent/secondary hex, `prop_colors[]` |
| `lighting` | direction, highlights, shadow |
| `pose` | camera, left/right hand objects, gesture |
| `clothes` | garment, fabric, hex, accessories |
| `subject` | `scene_narrative`, detailed `primary_objects[]` |
| `composition` | focal hierarchy, depth layers |
| `technical` | export settings |
| `generation` | `negative_prompt`, recommended models |
| `prompt_for_image_ai` | **copy-paste for external image gen** |

## Rules (locked)

- Flat vector, 2px `#2D2D2D` outline
- **Hands/forearms only** — no faces
- **No** RIASEC letter, border frame, or text on image
- Transparent PNG 640×640 → `src/assets/questionnaire/NN.M.png`
- Subtle RIASEC accent per option code (see `_schema-v3.json`)
- Sensitive slots (`17.1`, `19.2`, `23.2`, `24.1`, `27.1`): symbolic, hopeful only

## External image workflow

1. Open `qNN.M.json`
2. Copy `prompt_for_image_ai` (+ optional `generation.negative_prompt`)
3. Generate in Flux / DALL·E / Midjourney / Ideogram
4. Save to path in `deliverable.filename`

## Edit prompts

Edit the JSON file directly. Rebuild index:

```bash
python3 scripts/build-questionnaire-manifest.py
```

## Deprecated (do not use for prompts)

- `scripts/generate-questionnaire-prompts.py` — old Python→JSON generator
- `scripts/questionnaire_choice_specs.py` — superseded by v3 JSON files
- `choice-specs.json` — legacy aggregate; remove after review

## Wire app (after PNGs)

Tell agent: `wire questionnaire assets`
