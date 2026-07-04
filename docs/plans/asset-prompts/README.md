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

## RIASEC landing stickers (2D) — v2.5 questionnaire-sticker hybrid

**Schema:** `_schema-riasec-landing-v2.json`  
**Mode:** Keep the current landing sticker composition, border shape, large letter, and corner badge. Replace only the inside character with questionnaire-style art.

### Locked rules

| Rule | Value |
|------|-------|
| Canvas fill | Full canvas `#FDFCF8` landing paper |
| Transparency | Not required |
| Inside frame | `#FDFCF8` paper fill, **not** black |
| Character style | Questionnaire-style unDraw flat vector |
| Outline | Thin `#2D2D2D` outline on **character only** |
| Eyes | Minimal dot eyes |
| Facing | Character angles slightly inward-left toward large letter |
| Props | 1 hero prop + at most 1 support prop |
| Forbidden | Cloud backdrops, black fill, white sticker cutout, extra clutter |

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
