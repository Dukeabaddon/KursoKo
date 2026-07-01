# Questionnaire choice asset prompts (v4)

**Source of truth:** each `qNN.M.json` — **not Python**.

## Style reference (approved)

| File | Use |
|------|-----|
| `src/assets/1.1.png` | Full-body flat vector — robot kit |
| `src/assets/1.2.png` | Full-body flat vector — data/charts |
| `q01.1.json` | Gold JSON prompt structure |

## v4 rules (locked)

| Rule | Value |
|------|--------|
| Figure | **Full body** head-to-feet — NOT hands-only POV |
| Style | unDraw-inspired flat vector, **thin 2px** `#2D2D2D` outline |
| Face | Minimal dot eyes, simple smile |
| Cast | **Diverse unique character** per choice |
| Garments | KursoKo purple `#4B2C7F` base + **subtle RIASEC** accent on props/trim |
| Background | **Transparent PNG** — faint grey circles + thin floor line only |
| Forbidden | Letter, border frame, readable text |

## Schema

`_schema-v4.json` — superseded v3 hands-only schema.

## Files

| Pattern | Example |
|---------|---------|
| Prompt | `q15.1.json` |
| Output PNG | `src/assets/questionnaire/15.1.png` |
| Index | `manifest.json` |

## External workflow

1. Open `qNN.M.json`
2. Copy `prompt_for_image_ai` + `generation.negative_prompt`
3. Attach reference images `1.1.png` / `1.2.png` if your tool supports it
4. Save PNG to `deliverable.filename`

## Rebuild manifest

```bash
python3 scripts/build-questionnaire-manifest.py
```

## Deprecated

- `_schema-v3.json` — hands-only era
- `generate-questionnaire-prompts.py`
- `questionnaire_choice_specs.py`

## Sensitive slots

`17.1` `19.2` `23.2` `24.1` `27.1` — symbolic hopeful full-body scenes only
