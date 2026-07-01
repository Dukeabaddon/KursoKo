# Questionnaire choice asset prompts

**60 illustrations** — one per assessment option (30 questions × 2 choices).

## Spec (locked)

| Rule | Value |
|------|--------|
| Style | Flat vector scene, 2px `#2D2D2D` outline |
| Size | **640×640** PNG, transparent |
| People | **Hands / partial arms only** — no faces |
| Locale | Neutral global |
| Sensitive topics | **Symbolic, hopeful** — no distress imagery |
| RIASEC | **Subtle accent** per option `code` field |
| On image | **No** letter, border frame, sticker card, or text |

## Naming

| Prompt JSON | Slot | Choice | Output PNG |
|-------------|------|--------|------------|
| `q01.1.json` | 1.1 | Q1 option A | `src/assets/questionnaire/01.1.png` |
| `q01.2.json` | 1.2 | Q1 option B | `src/assets/questionnaire/01.2.png` |
| … | … | … | … |
| `q30.2.json` | 30.2 | Q30 option B | `src/assets/questionnaire/30.2.png` |

**Index:** `manifest.json` lists all 60 with choice text, RIASEC code, and output path.

## RIASEC accent (subtle)

| Code | Type | Accent |
|------|------|--------|
| R | Realistic | `#4DB6AC` |
| I | Investigative | `#4B2C7F` |
| A | Artistic | `#FFD54F` |
| S | Social | `#9575CD` |
| E | Enterprising | `#FF8A65` |
| C | Conventional | `#81D4FA` |

## Generate prompts (regenerate from script)

```bash
python3 scripts/generate-questionnaire-prompts.py
```

**Source of truth for scene detail:** `scripts/questionnaire_choice_specs.py`  
**Master index:** `choice-specs.json` (all 60 — subject, pose, clothes, color)  
Edits specs → re-run script → 60 `qNN.M.json` files update.

## JSON schema (v2)

Each `qNN.M.json` includes:

| Block | Contents |
|-------|----------|
| `art_style` | line weight, fill, forbidden list |
| `color` | RIASEC accent, skin tone, accent placement |
| `pose` | camera, left/right hand, gesture, energy |
| `clothes` | sleeves, accessories (hands-only framing) |
| `subject` | activity, props[], environment |
| `prompt_for_image_ai` | single copy-paste string synthesized from above |

**No image generation in repo yet** — export PNGs externally, drop in `src/assets/questionnaire/`.

## Image generation workflow

1. Open `qNN.M.json` → copy `prompt_for_image_ai`
2. Generate in your image tool (same pipeline as RIASEC stickers)
3. Export PNG → path in `deliverable.filename`
4. Repeat for all 60 (or batch in parallel)

## Wire into app (after PNGs exist)

`Questionnaire.jsx` still points at `public/assets/{id}.{1|2}.png` for Q1–14 only.

**Next code step:** import from `src/assets/questionnaire/` and enable all 30 questions.

Tell agent: `wire questionnaire assets`.

## Sensitive slots (symbolic scenes)

| Slot | Choice |
|------|--------|
| 17.1 | Helping refugees settle locally |
| 19.2 | Studying virus mutations |
| 23.2 | Developing cancer treatment trials |
| 24.1 | Counseling at-risk youth |
| 27.1 | Art therapy for trauma survivors |
