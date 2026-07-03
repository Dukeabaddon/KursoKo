# Character card prompts (share export)

Six RIASEC archetype PNGs for the results **share collectible**. Generate externally, drop into `src/assets/characters/`.

## Specs

| Field | Value |
|-------|--------|
| Schema | `_schema-character-card.json` |
| Size | 640×640 PNG-24 alpha |
| Background | **Transparent** outside border stroke |
| Art | Lineless flat vector (Corporate Memphis edu) |
| Border | Wonky skewed rounded quadrilateral — **not** a straight rectangle |

## Border shape (plain language)

Your sketch is a **soft parallelogram sticker frame**:

- Left edge: nearly vertical (may lean slightly per type)
- Top edge: slopes **down** left → right
- Right edge: tapers **inward** toward the top
- Bottom edge: slopes **up** left → right
- Corners: **heavily rounded** (bubble / inflated sticker feel)
- Stroke: solid **5px** in that type’s RIASEC primary color
- Interior: transparent except character + props
- Character: **off-center toward the right** inside the frame

Each type varies skew direction slightly so cards feel related but not cloned.

## Files

| Archetype | RIASEC | Border color | JSON |
|-----------|--------|--------------|------|
| The Builder | R | `#4DB6AC` teal | `char-r-builder.json` |
| The Pathfinder | I | `#4B2C7F` purple | `char-i-pathfinder.json` |
| The Creator | A | `#FFD54F` gold | `char-a-creator.json` |
| The Guardian | S | `#9575CD` lavender | `char-s-guardian.json` |
| The Visionary | E | `#FF8A65` coral | `char-e-visionary.json` |
| The Strategist | C | `#81D4FA` sky blue | `char-c-strategist.json` |

## Output paths

```
src/assets/characters/builder.png
src/assets/characters/pathfinder.png
src/assets/characters/creator.png
src/assets/characters/guardian.png
src/assets/characters/visionary.png
src/assets/characters/strategist.png
```

## Generation tip

Copy **`prompt_for_image_ai`** from each JSON into your external tool. If the model draws a straight rectangle, add to negative prompt: `axis-aligned rectangle, perfect square frame, ticket border`.

After all six land, tell the agent: **wire character share card**.
