# Landing asset prompts

## Generate order (hero hybrid: 3D character + 2D props in code)

| Step | Asset | JSON | Output path | Style |
|------|-------|------|-------------|-------|
| **1** | Hero character | `hero-character.json` | `src/assets/landing/kursoko-hero-v4-cutout.png` | **3D** Play Together NPR — see `reference_visual_lock` in JSON (external tools: no repo paths) |
| **2** | Star sparkle | `hero-asset-star.json` | `src/assets/landing/hero/star-sparkle.png` | **2D** flat |
| **3** | Lavender blob | `hero-asset-blob-lavender.json` | `src/assets/landing/hero/blob-lavender.png` | **2D** flat |
| **4** | Teal blob | `hero-asset-blob-teal.json` | `src/assets/landing/hero/blob-teal.png` | **2D** flat |

**Code (no image gen):** radial glow behind character column, gentle float CSS, hide props on mobile `< md`.

**After step 1:** tell agent `wire hero v4`.  
**After steps 2–4:** tell agent `wire hero floating assets`.

Optional: skip steps 3–4 if reusing `src/assets/landing/placeholders/blobs/*.png` at smaller CSS scale.

---

## RIASEC stickers (2D)

**Reference:** letter **A** — all others must match.

| Letter | JSON | Drop file |
|--------|------|-----------|
| R | `riasec-r.json` | `placeholders/riasec/r.png` |
| I | `riasec-i.json` | `placeholders/riasec/i.png` |
| A | `riasec-a.json` | `placeholders/riasec/a.png` |
| S | `riasec-s.json` | `placeholders/riasec/s.png` |
| E | `riasec-e.json` | `placeholders/riasec/e.png` |
| C | `riasec-c.json` | `placeholders/riasec/c.png` |

**Specs:** 512×512 PNG, transparent, 48px safe padding.

---

## Questionnaire choices (60 scenes)

**Folder:** `questionnaire/` — flat `q01.1.json` … `q30.2.json` + `manifest.json`

| Spec | Value |
|------|--------|
| Style | Flat vector scene — **no letter, no border** (RIASEC vibe minus frame) |
| Size | 640×640 PNG → `src/assets/questionnaire/NN.M.png` |
| People | Hands only · neutral locale · subtle RIASEC accent |

**Regenerate prompts:** `python3 scripts/generate-questionnaire-prompts.py`

**After PNGs:** tell agent `wire questionnaire assets` (update `Questionnaire.jsx` imports).
