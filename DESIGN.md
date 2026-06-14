---
name: "KursoKo Landing"
theme: "light"
text-case: "selective-uppercase"
colors:
  background: "#FDFCF8"
  surface: "#F9F9F8"
  text-primary: "#2D2D2D"
  text-muted: "#64748B"
  accent: "#4B2C7F"
  accent-hover: "#3D2468"
  brand-teal: "#4DB6AC"
  brand-yellow: "#FFD54F"
  brand-lavender: "#9575CD"
  outline: "#2D2D2D"
typography:
  display:
    family: "Montserrat"
    weight: 700-800
  body:
    family: "Inter"
    size: "clamp(0.9375rem, 0.45vw + 0.75rem, 1.125rem)"
  meta:
    transform: "uppercase"
    tracking: "0.18em"
    color: "#4DB6AC"
effects:
  texture: "none"
  ambient: "soft-blobs"
  blobs:
    - color: "rgba(255, 213, 79, 0.32)"
      position: "top-left"
    - color: "rgba(255, 183, 150, 0.22)"
      position: "center-right"
    - color: "rgba(149, 117, 205, 0.18)"
      position: "bottom-right"
hero:
  layout: "split-text-image"
  eyebrow: "Free career assessment"
  headline: "Choose the career that fits you"
  voice: "SCOPE-inspired — plain student language, no RIASEC jargon above fold"
logo:
  type: "svg-geometric"
  mark: "pill K — teal stem, yellow upper, lavender lower, #2D2D2D outline"
---

# Design Decisions

- **Palette** from KursoKo mockup: cream paper, deep purple CTAs, teal/yellow/lavender logo accents.
- **Content tone** follows [SCOPE](https://scope.sti.edu/) — “know yourself”, “choose the right career”, free assessment — without copying layout or illustrations.
- **Hero** avoids RIASEC; students see “career assessment” only.
- **Logo** is simple geometric SVG (Rule 2 safe). No hand-drawn illustrations on landing fold.
- **Background** uses soft blob gradients only — no heavy grain, no purple-to-blue slop gradients.
