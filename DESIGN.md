# KursoKo Landing — Editorial Redesign

**Status:** Approved · English only · Section-by-section build  
**Vibe:** Editorial guidance (Persona energy in accent only — not gaming UI)

## Tokens

| Role | Value |
|------|-------|
| Paper | `#F5F2EB` |
| Ink | `#1C1917` |
| Muted | `#78716C` |
| Accent | `#C2410C` |
| Accent hover | `#9A3412` |
| Surface | `#FAFAF8` |
| Dark band | `#1C1917` |
| Display font | Montserrat |
| Body font | Inter |
| Max width | `72rem` (1152px) |
| Motion | `400ms cubic-bezier(0.22, 1, 0.36, 1)` |
| Scroll reveal | opacity + 12px Y |

## Asset placeholders

Gray dashed boxes with uppercase labels. Replace with final art later.

| Slot | Label |
|------|-------|
| Logo | `Logo mark — KursoKo icon or mascot` |
| Hero | `Hero illustration — student at career crossroads (editorial, 3:4)` |
| Why | `Illustration — student discovering strengths` |
| How steps | `Screenshot — question UI / archetype card / careers / scholarships` |
| Proof band | `Testimonial photo or quote card` |
| Scholarships | `Illustration — scholarship discovery` |

## Hero fold

- **Height:** `100dvh` (nav + hero together, no scroll within fold)
- **Layers:** paper base → accent radial (top-left) → ink vignette (bottom-right) → grain (3.5% multiply)
- **No:** blur orbs, purple gradients, glass cards, WebGL

## Page order (build sequence)

1. ✅ Foundation + Navbar  
2. ✅ Hero  
3. Sample question  
4. How it works (timeline)  
5. What you get (dark band)  
6. Scholarships teaser  
7. FAQ + closing CTA  

## CTA

Single style everywhere: solid accent, no purple gradient.

## Motion rules

- Hero: entrance stagger on load  
- Other sections: scroll reveal (later)  
- Respect `prefers-reduced-motion`  
- No hover lift on every card  
