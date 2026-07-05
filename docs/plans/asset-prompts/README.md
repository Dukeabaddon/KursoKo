# Landing asset prompts

## Generate order (hero v4 — waist-up scene composite)

**Schema:** `_schema-hero-landing-v3.json` (v4 `hero-scene-composite` mode)  
**Style:** 2D flat vector — RIASEC sticker DNA. Thin 2px `#2D2D2D` outline. **One PNG** = waist-up character + floating campus props. Transparent background.

| Step | Asset | JSON | Output path |
|------|-------|------|-------------|
| **1** | Hero scene (all-in-one) | `hero-character-2d-waist-scene.json` (**v3** — crayon polo, no outlines, true alpha) | `src/assets/landing/landing.png` |

**Gold ref:** `src/assets/landing/placeholders/riasec/s.png` (character). User poster refs = layout inspiration only (not grain/3D/faceless).

**After PNG exists:** tell agent `wire hero waist scene` — updates `heroDecor.js`, trims duplicate cloud/star decors.

**Archived (do not use for new gen):**
- `hero-character.json` (3D chibi)
- `hero-character-2d-full.json` (full-body cutout)
- `hero-asset-cloud-*.json`, `hero-asset-star-*.json` (split decors — scene is baked in)
- `hero-asset-blob-*.json` (soft blobs)

---

## RIASEC landing stickers (2D) — v2.9 identical width + height

**Schema:** `_schema-riasec-landing-v2.json`  
**Mode:** Every letter uses the **same frame width and height**. Large letters follow R/S/C recipe. Waist-up flush crop.

### Locked rules

| Rule | Value |
|------|-------|
| Canvas | Exact **1024×1024**, fill `#FDFCF8` |
| Sticker frame | Exact **780 wide × 640 tall** on **every** letter (incl. A) |
| Margins | Left/right **122px**, top/bottom **192px** |
| Frame border | Lavender `#B39DDB` (E only: coral `#FF8A65`) |
| Large letter | Bold rounded **sans** — fill + white inner + dark outer `#2D2D2D`; height ~**420px** |
| Character height | Head near top inner border; waist **flush** to bottom inner border |
| Letter A | Same **780×640** — never wider, never shorter; frame lavender |
| Letter I | **Sans** block I — never serif/slab |
| Letter C clipboard | **Back** faces viewer — not checklist front |
| Forbidden | Different frame heights, short wide A, serif I, floating gap, full body |

| Letter | Archetype | Results color | JSON |
|--------|-----------|---------------|------|
| R | The Builder | `#4DB6AC` | `riasec-r.json` |
| I | The Pathfinder | `#6E4FB8` | `riasec-i.json` |
| A | The Creator | `#FFD54F` | `riasec-a.json` |
| S | The Guardian | `#9575CD` | `riasec-s.json` |
| E | The Visionary | `#FF8A65` | `riasec-e.json` |
| C | The Strategist | `#81D4FA` | `riasec-c.json` |

**Output:** `placeholders/riasec/{r,i,a,s,e,c}.png` — 512×512.

---

## Questionnaire choices (60 scenes)

**Folder:** `questionnaire/` — **v4 JSON** full-body style (matches `src/assets/1.1.png` & `1.2.png`)

| Spec | Value |
|------|--------|
| Schema | `questionnaire/_schema-v4.json` |
| Gold JSON | `questionnaire/q01.1.json` |
| Style | Full-body unDraw flat vector, thin outline, transparent PNG |
| Size | 640×640 → `src/assets/questionnaire/NN.M.png` |

**Edit JSON directly.** Rebuild index: `python3 scripts/build-questionnaire-manifest.py`
