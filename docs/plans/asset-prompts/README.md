# RIASEC sticker asset prompts

**Reference sticker:** letter **A** (approved style) — all others must match.

| Letter | Type | JSON | Drop file here |
|--------|------|------|----------------|
| R | Realistic | `riasec-r.json` | `src/assets/landing/placeholders/riasec/r.png` |
| I | Investigative | `riasec-i.json` | `src/assets/landing/placeholders/riasec/i.png` |
| A | Artistic | `riasec-a.json` | `src/assets/landing/placeholders/riasec/a.png` |
| S | Social | `riasec-s.json` | `src/assets/landing/placeholders/riasec/s.png` |
| E | Enterprising | `riasec-e.json` | `src/assets/landing/placeholders/riasec/e.png` |
| C | Conventional | `riasec-c.json` | `src/assets/landing/placeholders/riasec/c.png` |

**Specs:** 512×512 PNG, transparent background, 48px safe padding.

**After drop:** tell agent `wire riasec images` to show stickers on landing (UI still uses letter badges until then).

Copy `prompt_for_image_ai` from each JSON into your image AI. Add: *"Match the attached letter A sticker exactly for style."*
