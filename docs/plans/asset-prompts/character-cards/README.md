# Character card prompts (share export) — v2

Six RIASEC archetype PNGs for results **share collectible**. Generate externally, drop into `src/assets/character/`.

## v2 changes

| Rule | v2 |
|------|-----|
| Interior inside border | **Fully transparent** — no black, no clouds |
| White sticker cutout | **Removed** — solid flat colors only |
| Props | **Max 2** small theme items per card |
| Letters on image | **Forbidden** — no large glyph, no badge |
| Eyes | **Minimal dot eyes** (unchanged) |
| Frame | **Wonky skewed** quadrilateral stroke only |

## Specs

| Field | Value |
|-------|--------|
| Schema | `_schema-character-card.json` v2 |
| Size | 640×640 PNG-24 alpha |
| Generation | **Fresh chat per archetype** — avoids cast/prop bleed |

## Files

| Archetype | Border | JSON |
|-----------|--------|------|
| The Builder | `#4DB6AC` | `char-r-builder.json` |
| The Pathfinder | `#4B2C7F` | `char-i-pathfinder.json` |
| The Creator | `#FFD54F` | `char-a-creator.json` |
| The Guardian | `#9575CD` | `char-s-guardian.json` |
| The Visionary | `#FF8A65` | `char-e-visionary.json` |
| The Strategist | `#81D4FA` | `char-c-strategist.json` |

Copy **`prompt_for_image_ai`** into your tool. After all six land: **wire character share card**.
