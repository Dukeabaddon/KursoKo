# ChatGPT Project — KursoKo questionnaire assets

One-time setup. After this, each slot is paste → generate → save to inbox.

## 1. Create the Project

1. Open [ChatGPT](https://chatgpt.com) in Brave (or your browser).
2. **Projects → New project**
3. Name: `KursoKo Questionnaire`

## 2. Upload project files (once)

Upload these into the project knowledge / files area:

| Upload | Path in repo |
|--------|----------------|
| Style refs (required) | `src/assets/questionnaire/01.1.png` |
| Style refs (required) | `src/assets/questionnaire/01.2.png` |
| All prompt JSON | `docs/plans/asset-prompts/questionnaire/q*.json` (60 files) |

Tip: zip `q01.1.json` … `q30.2.json` and upload the zip if the UI allows batch upload.

## 3. Custom instructions (paste this)

```text
You generate KursoKo RIASEC questionnaire choice illustrations.

STYLE (non-negotiable)
- Match attached reference images 01.1.png and 01.2.png exactly.
- unDraw-inspired flat vector, full body head-to-feet.
- Thin 2px outline #2D2D2D, flat color fills, minimal dot-eye face.
- KursoKo purple garment base #4B2C7F with subtle RIASEC accent on props/trim only.
- Transparent PNG background — real alpha, not checkerboard, not white fill.
- Faint grey decorative circles + thin grey floor line only.
- NO readable text, NO RIASEC letter, NO border frame, NO photorealism, NO 3D.

WHEN USER SENDS: Create image @qNN.M.json (1-N)
1. Read the referenced JSON file in this project (full line range).
2. Use prompt_for_image_ai as the primary generation brief.
3. Respect generation.negative_prompt, art_style.forbidden, and deliverable specs.
4. Output: 640×640 PNG with true transparent background.
5. Diverse unique character per slot — do not reuse the same person design.

SENSITIVE SLOTS (17.1, 19.2, 23.2, 24.1, 27.1): hopeful symbolic full-body scenes only — no distressing detail.

If style drifts, regenerate until it matches 01.1 / 01.2 language.
```

## 4. Per-slot workflow (minimal hand work)

From repo root:

```bash
npm run assets:next
```

This copies a message like:

```text
Create image @q06.1.json (1-98)
```

### In ChatGPT Project chat

1. Paste the message (already on clipboard).
2. Ensure `q06.1.json` is available in the project (`@` autocomplete).
3. Attach **01.1.png** and **01.2.png** if the model does not auto-use project refs.
4. Wait for image → **download PNG** (do not screenshot).

### Save to inbox

Save/download as:

```text
src/assets/questionnaire/_inbox/06.1.png
```

Filename must match slot (`06.1.png`, not `image.png`).

### Install to app

```bash
npm run assets:install -- 6.1
# or install everything waiting in inbox:
npm run assets:install -- --all
```

### Check progress

```bash
npm run assets:status
```

## 5. Batch order (recommended)

| Batch | Slots | Count |
|-------|-------|-------|
| A | 06.1–06.2 | 2 |
| B | 07.1–10.2 | 8 |
| C | 11.1–15.2 | 10 |
| D | 16.1–20.2 | 10 |
| E | 21.1–25.2 | 10 |
| F | 26.1–30.2 | 10 |

Run `npm run assets:status` between batches. Spot-check in `npm run dev` questionnaire UI.

## 6. Troubleshooting

| Problem | Fix |
|---------|-----|
| Checkerboard background | Regenerate in ChatGPT — do not use Gemini/Cursor for these |
| Wrong filename in inbox | Rename to `NN.M.png` before `assets:install` |
| Style drift | Re-attach 01.1 + 01.2, regenerate in a fresh chat |
| `@q06.1.json` not found | Upload JSON files to the Project again |
