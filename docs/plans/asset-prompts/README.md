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

## RIASEC landing stickers (2D) — v2.4 Option 1

**Schema:** `_schema-riasec-landing-v2.json`  
**Mode:** Faithful to original `placeholders/riasec/*.png` — frame, border, clouds, letter colors per letter. **Only character art** refreshes (lineless Memphis + bead eyes).

| Letter | Frame | Clouds | Letter fill |
|--------|-------|--------|-------------|
| R | Lavender | Teal-green | `#4DB6AC` |
| I | Lavender | Mint teal | `#6E4FB8` |
| A | Lavender | **Purple** | `#FFD54F` |
| S | Lavender | Purple + yellow | `#9575CD` |
| E | **Coral** | Peach + yellow | `#FF8A65` |
| C | Lavender | Blue + lavender | `#81D4FA` |

| Letter | Archetype | JSON |
|--------|-----------|------|
| R | The Builder | `riasec-r.json` |
| I | The Pathfinder | `riasec-i.json` |
| A | The Creator | `riasec-a.json` |
| S | The Guardian | `riasec-s.json` |
| E | The Visionary | `riasec-e.json` |
| C | The Strategist | `riasec-c.json` |

**Output:** `placeholders/riasec/{r,i,a,s,e,c}.png` — 512×512, tight crop to border.

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
