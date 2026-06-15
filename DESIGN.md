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
assessment:
  choices-max-width: "44rem"
  choices-max-height: "25rem"
  image-ratio: "3:4"
  motion:
    ease: "cubic-bezier(0.16, 1, 0.3, 1)"
    exit-ms: 420
    enter-ms: 520
    stagger-ms: 70
results:
  layout: "hybrid-hero-2col"
  container-max: "72rem"
  hero-split: "58% identity / 42% riasec"
  character-size: "200px mobile / 260px desktop"
  text-case: "selective-uppercase"
  colors:
    surface: "#FFFFFF"
    surface-muted: "#F9F9F8"
    archetype-title: "#4B2C7F"
    trait-pill-bg: "rgba(149, 117, 205, 0.14)"
    trait-pill-text: "#4B2C7F"
    section-border: "rgba(45, 45, 45, 0.08)"
    riasec:
      R: "#F97316"
      I: "#2563EB"
      A: "#EC4899"
      S: "#22C55E"
      E: "#EAB308"
      C: "#9333EA"
    match-excellent: "#16A34A"
    match-good: "#2563EB"
    label-shs: "#D97706"
    label-degree: "#4DB6AC"
    label-why: "#DB2777"
    scholarship-border: "rgba(22, 163, 74, 0.28)"
  typography:
    display: "Montserrat 700-800"
    body: "Inter 400 1rem leading-1.65"
    meta: "uppercase 0.12em #64748B 0.6875rem"
  effects:
    card-depth: "border-only"
    scroll-reveal: true
    scroll-reveal-duration: "520ms"
    scroll-reveal-easing: "cubic-bezier(0.16, 1, 0.3, 1)"
  sections:
    - shell
    - hero
    - riasec
    - course
    - universities
    - scholarships
    - footer
---

# Design Decisions

- **Palette** from KursoKo mockup: cream paper, deep purple CTAs, teal/yellow/lavender logo accents.
- **Content tone** follows [SCOPE](https://scope.sti.edu/) — “know yourself”, “choose the right career”, free assessment — without copying layout or illustrations.
- **Hero** avoids RIASEC; students see “career assessment” only.
- **Logo** is simple geometric SVG (Rule 2 safe). No hand-drawn illustrations on landing fold.
- **Background** uses soft blob gradients only — no heavy grain, no purple-to-blue slop gradients.
- **Results (Resulta)** uses hybrid hero: identity column + RIASEC panel on desktop; scroll sections for course, NCR universities, scholarships. Border-only surfaces (no shadow-md slop). RIASEC shown only on results — earned after assessment.
