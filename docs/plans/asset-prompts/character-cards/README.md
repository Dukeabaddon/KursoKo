# Character card prompts (share export) — v5

Six RIASEC **flat vector 2D** poster cards for results **share collectible**. Same cast as landing `riasec-*.json` — **questionnaire art style** (not crayon, not chibi).

## v5 direction

| Rule | v5 |
|------|-----|
| Style | **Flat vector** — `01.1.webp`, `02.1.png` questionnaire refs |
| Outline | **Thin 2px `#2D2D2D`** on figure + props |
| Face | **Dot eyes**, small smile — minimal |
| Proportions | **Realistic youth** — not chibi |
| Poster | Cream `#FDFCF8` + **~20% RIASEC accent wash** |
| Framing | **Loose waist-up** — ~70% height, **15% bottom safe zone** (see v5.1 regen for S/C/E) |
| Cast | **Same** as `riasec-{letter}.json` |
| Text / letter | **None** |

## NOT this

- ~~Crayon / colored pencil~~ (v4)
- ~~3D chibi vinyl~~ (v3)
- ~~Lineless Memphis~~ (v2)

## Style refs

| File | Use |
|------|-----|
| `src/assets/questionnaire/01.1.webp` | Primary vector lock |
| `src/assets/questionnaire/01.2.png` | Secondary vector lock |
| `src/assets/questionnaire/02.1.png` | Creative scene ref |
| `questionnaire/q01.1.json` | Prompt recipe |

## Files

| Archetype | Wash | JSON |
|-----------|------|------|
| The Builder | teal | `char-r-builder.json` |
| The Pathfinder | purple | `char-i-pathfinder.json` |
| The Creator | yellow | `char-a-creator.json` |
| The Guardian | lavender | `char-s-guardian.json` |
| The Visionary | coral | `char-e-visionary.json` |
| The Strategist | sky blue | `char-c-strategist.json` |

Attach **questionnaire refs** + **`riasec-{letter}.json`** when your tool supports images. Otherwise paste **`prompt_for_image_ai` only** — v5.2 prompts are self-contained (no file paths inside). Fresh chat per letter. WebP → `src/assets/character/`.
