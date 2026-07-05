# Landing Footer + Smart Navbar — Design Spec (v1)

**Status:** Implemented (v1)  
**References:** Truus footer (floating card + sticker collage), NEUBOX navbar (rest → compressed pill)  
**Product:** KursoKo — free public RIASEC career tool for Filipino students  
**Agent:** UI Designer · ui-ux-proj-pro-max design system pass

---

## 1. Goals

| Goal | Success looks like |
|------|-------------------|
| **Creative footer** | Memorable closing frame; floating card with inset margins; room for sticker assets you supply |
| **Smart navbar** | Sticky; hides on scroll down; shows on scroll up; morphs full bar → compressed pill |
| **Correct IA** | Nav links land on real sections; CTA always reachable |
| **Brand fit** | Playful + trustworthy for a public education tool — not agency portfolio vibes |

---

## 2. Current state audit

### 2.1 Navbar (`src/components/public/Navbar/Navbar.jsx`)

| Aspect | Current | Verdict |
|--------|---------|---------|
| Position | `sticky top-0` inside `landingFold` | ⚠️ **Broken for long-page sticky** — parent is `h-dvh overflow-hidden`; nav scrolls away with hero fold |
| Scroll behavior | `scrolled` boolean at `scrollY > 24` → blur + border | ❌ No hide/show; no pill morph |
| Links | `#hero`, `#how`, `#faq` (3 items) | ⚠️ **Incomplete** — misses `#riasec`, `#features`; `#stats` optional |
| CTA | “Start Assessment” desktop; mobile drawer | ✅ Good |
| Smooth scroll | Lenis + `smoothScrollToHash` offset 72px | ✅ Good |
| Mobile | Hamburger drawer | ✅ OK; pill state may replace drawer on scroll |

### 2.2 Missing footer

- `HomePage.jsx` ends at `FAQSection` — no `<footer>` landmark
- Skip links / a11y expect footer landmark eventually
- PRD + design spec mention privacy near CTAs — footer is natural home

### 2.3 Section map (for nav targets)

| Section | `id` | In nav today? | Recommend nav? |
|---------|------|---------------|----------------|
| Hero | `#hero` | ✅ Home | ✅ Keep |
| Stats | `#stats` | ❌ | ❌ Skip (supporting strip, not a chapter) |
| RIASEC intro | `#riasec` | ❌ | ✅ Add “RIASEC” or “Personality types” |
| How it works | `#how` | ✅ | ✅ Keep |
| Features | `#features` | ❌ | ✅ Add “Features” or merge with How |
| FAQ | `#faq` | ✅ | ✅ Keep |

**Recommended nav (5 items max on desktop pill):**  
`Home · RIASEC · How it works · Features · FAQ` + CTA

---

## 3. Typography analysis

### 3.1 Reference fonts (from attached images)

| Reference | Font character | KursoKo equivalent |
|-----------|----------------|-------------------|
| **Truus** footer headlines | Bold geometric sans, often lowercase (Inter / Gilroy / Montserrat ExtraBold) | **Montserrat 700–800** — already `--font-display` |
| **Truus** pill labels | Small caps sans in white pills | **Inter 600** at `text-xs` uppercase tracking-wide |
| **Truus** script wordmark | Custom blobby script | **Do not clone** — use **KursoKo wordmark SVG** large + optional **Fredoka One** display fallback for decorative scale only |
| **NEUBOX** nav | Clean geometric sans (logo bold, links regular) | **Poppins** logo weight / **Inter** links — already in stack |

### 3.2 KursoKo stack (already loaded — no new fonts required)

| Role | Font | Use in footer/nav |
|------|------|-------------------|
| Display / big footer wordmark | Montserrat | Oversized “KursoKo” or tagline lockup |
| Headings | Poppins | Footer column titles |
| Body / links | Inter | Nav links, footer copy, legal |
| Accent / playful | Fredoka One | **Sparingly** — sticker-adjacent labels only, not body |
| Body alt | Nunito | Optional FAQ-style warmth in footer blurb |

### 3.3 ui-ux-pro-max recommendation

Design system query suggested **Fredoka + Nunito** for playful/education — aligns with existing tokens. **Do not adopt Kinetic Brutalism** (acid yellow, 0px radius) — conflicts with KursoKo lavender/cream system.

### 3.4 Type scale (footer)

| Element | Size | Weight | Case |
|---------|------|--------|------|
| Pill label | `0.6875rem` (11px) | 600 | uppercase, tracking `0.08em` |
| Column headline | `clamp(1.25rem, 2vw, 1.75rem)` | 700 | sentence case |
| Body / links | `0.875–1rem` | 400–500 | normal |
| Giant wordmark | `clamp(4rem, 18vw, 12rem)` | 800 | brand lockup |
| Legal / credits | `0.75rem` | 400 | muted |

---

## 4. Navbar — behavior spec

### 4.1 Architecture fix (required before polish)

Move navbar **outside** `landingFold` in `HomePage.jsx`:

```
LenisProvider
  Navbar (fixed/sticky at page level)
  landingFold (hero only)
  landing-page-body (sections)
  Footer
```

Without this, pill/sticky behavior cannot work past the first viewport.

### 4.2 Scroll states (3 modes)

```
┌─────────────────────────────────────────────────────────┐
│  A. REST (scrollY ≈ 0)                                  │
│  Full-width bar inside page gutters — current look       │
│  Transparent → cream; logo · links · CTA spread out      │
└─────────────────────────────────────────────────────────┘
                          │ user scrolls down
                          ▼
┌─────────────────────────────────────────────────────────┐
│  B. SCROLLED PILL (scrollY > threshold, nav visible)    │
│  Floating pill: max-width shrinks, border-radius 9999px  │
│  Items compress — gap → tight padding only (NEUBOX ref)  │
│  Centered horizontally; inset from top ~12–16px          │
│  Shadow + backdrop-blur                                  │
└─────────────────────────────────────────────────────────┘
                          │ user scrolls down further
                          ▼
┌─────────────────────────────────────────────────────────┐
│  C. HIDDEN (scroll direction down, past hide threshold) │
│  translateY(-120%) + opacity 0                           │
│  Instant show when scroll direction ↑                    │
└─────────────────────────────────────────────────────────┘
```

Return to **A** when `scrollY < 8px` (top snap — shape expands fluidly).

### 4.3 Motion tokens

| Property | Rest → Pill | Pill → Hidden |
|----------|-------------|---------------|
| `max-width` | `100%` → `min(100% - 2rem, 56rem)` compressed inner | — |
| `border-radius` | `0` bottom / full width → `9999px` | — |
| `padding-inline` | `1rem–2rem` → `0.75rem–1rem` | — |
| `gap` (links) | `0.25rem` → `0` (links touch pill padding) | — |
| `transform` | — | `translateY` 320ms `cubic-bezier(0.4,0,0.2,1)` |
| Duration | **400–520ms** single easing `--ease-landing` | **280ms** hide (faster exit) |

**Reduced motion:** jump between states; no width animation; keep show/hide via opacity only.

### 4.4 Pill compression layout (desktop)

**Rest (NEUBOX “Primary”):**
```
[ Logo                    ] [ About  Services  Pricing  Contact ] [ Get in touch ]
```

**Pill (NEUBOX “Scroll variant”):**
```
[ Logo ] [ About Services Pricing Contact ] [ Get in touch ]
         └─ tight gap, single padded capsule ─┘
```

**KursoKo mapping:**
```
[ KursoKo ] [ Home RIASEC How Features FAQ ] [ Start Assessment ]
```

Mobile pill: `[ Logo ] [ ☰ or CTA ]` — links collapse to menu icon inside pill.

### 4.5 Scroll detection logic

| Signal | Source | Threshold |
|--------|--------|-----------|
| `scrollY` | Lenis `instance.scroll` | Pill: `> 48px`; Rest: `< 8px` only |
| Direction | `scrollY - lastScrollY` | Hide after morph delay (400ms) + 40px down |
| Show | Direction up | Pill until `scrollY < 8px` |

Debounce direction checks ~10ms via Lenis scroll event (already wired partially).

### 4.6 Sticky offset

Keep `smoothScrollToHash` offset **dynamic**: rest nav height ~64px; pill height ~52px + top inset 16px → **~72–80px** (current 72 OK).

---

## 5. Footer — design spec

### 5.1 Layout concept (Truus-inspired, KursoKo-adapted)

Page background stays **`--color-landing-paper`**. Footer is a **floating card** — not edge-to-edge:

```
┌─ viewport ────────────────────────────────────────┐
│  margin: 16px mobile / 24px tablet / 32px desktop │
│  ┌─ footer card ───────────────────────────────┐ │
│  │  TOP: cream or white inner (optional)         │ │
│  │  ─────────────────────────────────────────── │ │
│  │  MAIN: accent block (--landing-accent-deep)   │ │
│  │  3-column info + giant wordmark layer         │ │
│  │  sticker assets (absolute, user-provided)     │ │
│  │  credits pill bottom-right                    │ │
│  └───────────────────────────────────────────────┘ │
│  margin-bottom: same as sides (floats above bg)     │
└────────────────────────────────────────────────────┘
```

| Token | Value |
|-------|-------|
| Card `border-radius` | `1.5rem` mobile → `2rem` desktop |
| Inset margin | `1rem` / `1.5rem` / `2rem` (left, right, **bottom**) |
| Footer card bg | `--color-landing-accent-deep` `#4b2c7f` or teal variant `#4db6ac` for contrast play |
| Inner text | `#fff` primary; `rgba(255,255,255,0.75)` muted |
| Pill labels | white bg, `#2d2d2d` text, `rounded-full px-3 py-1` |

### 5.2 Content columns (public tool — not agency)

| Column | Pill label | Content |
|--------|------------|---------|
| **1 — Tool** | `free tool` | One-line mission: “Find courses and paths that fit your RIASEC profile.” + **Start Assessment** button (outline on dark) |
| **2 — Learn** | `about riasec` | Short Holland attribution + link scroll to `#riasec` |
| **3 — Trust** | `privacy & data` | “No account. Answers stay in your browser.” + link to `docs/SECURITY.md` or `/privacy` route when exists |

Optional row: social icons (Lucide) — only if you have real profiles.

### 5.3 Hero wordmark layer

- Large **KursoKo** wordmark (SVG from brand kit) at ~40% footer height, centered, `opacity 0.15–0.25` or cream fill like Truus script
- **Sticker slots** (you supply PNG/WebP, transparent):

| Slot | Position | Suggested asset theme |
|------|----------|------------------------|
| `footer-sticker-1` | top-left of wordmark | RIASEC letter badge (R/I/A…) |
| `footer-sticker-2` | mid-right | Star / sparkle |
| `footer-sticker-3` | bottom-left | Grad cap / path icon |
| `footer-sticker-4` | bottom-right | Heart / “100” playful badge |
| `footer-sticker-5` | overlap wordmark | Camera → **clipboard/quiz** icon for KursoKo |

Asset folder (planned): `src/assets/landing/footer/stickers/`  
Format: WebP pipeline (`npm run assets:webp`) after PNG drop-in.

### 5.4 Footer micro-interactions

- Links: underline on hover, 200ms
- Stickers: subtle `translateY` float loop (reuse `landing-hero-float` keyframes) — **off** under `prefers-reduced-motion`
- CTA: same radial fill as `.landing-nav-cta` but inverted for dark bg

### 5.5 Accessibility

- `<footer role="contentinfo">` with labelled columns (`aria-labelledby`)
- Sticker images: `alt=""` decorative + `aria-hidden="true"`
- Focus order: columns → CTA → credits
- Contrast: white on `#4b2c7f` passes AA for body text

---

## 6. Color & style alignment

Use existing landing tokens — **no new palette required**.

| Element | Token |
|---------|-------|
| Page bg | `--color-landing-paper` |
| Footer card | `--color-landing-accent-deep` or `--color-landing-teal` (pick one in implementation) |
| Nav pill bg | `--color-landing-paper/95` + blur |
| Nav pill border | `--color-landing-ink/10` |
| CTA in nav | existing `landingBtnPrimary` |
| Sticker accents | pull from `--color-landing-yellow`, `--color-landing-lavender`, `--color-landing-teal` |

---

## 7. Component plan (implementation phase)

| Component | Path | Notes |
|-----------|------|-------|
| `LandingFooter` | `src/components/landing/footer/LandingFooter.jsx` | Card shell + columns + wordmark layer |
| `FooterSticker` | `src/components/landing/footer/FooterSticker.jsx` | Positioned asset wrapper |
| `SmartNavbar` | refactor `Navbar.jsx` or `landing/nav/SmartNavbar.jsx` | Scroll FSM + pill morph |
| `useScrollNavbar` | `src/components/landing/motion/useScrollNavbar.js` | Lenis direction + mode enum |
| CSS | `src/components/landing/footer/index.css` | Card inset, wordmark, stickers |
| Spec update | `docs/04-design-spec.md` | Add footer + nav states after build |

---

## 8. Asset checklist (for you)

- [ ] 4–6 sticker PNGs (transparent, ~512px), on-brand
- [ ] Confirm KursoKo wordmark SVG for giant footer type
- [ ] Optional: footer background texture (noise) — subtle
- [ ] Privacy doc URL (GitHub raw or onsite route)

---

## 9. Anti-patterns (mentor gate)

| Avoid | Why |
|-------|-----|
| Copy Truus “looking for a job” copy | Wrong audience |
| Custom script font for KursoKo | Brand already has logo system |
| Edge-to-edge footer | You explicitly want floating margins |
| Navbar inside `landingFold` | Breaks sticky/pill |
| >5 nav links in compressed pill | Unreadable — collapse to menu <768px |
| Scroll-jacking | Lenis smooth wheel only |

---

## 10. Implementation order (when approved)

1. Move navbar to page level + `useScrollNavbar` hook  
2. Pill morph CSS + hide/show  
3. Expand nav links + verify hash targets  
4. `LandingFooter` shell (no stickers)  
5. Drop in sticker assets + motion  
6. E2E: footer visible, nav sticky, anchor scroll  
7. Update `docs/04-design-spec.md`

---

## 11. Open decisions (pick one — default in **bold**)

| # | Question | Options |
|---|----------|---------|
| 1 | Footer accent color | **Purple deep** / Teal / Split gradient |
| 2 | Nav link “RIASEC” label | **“RIASEC”** / “Personality types” |
| 3 | Mobile scrolled nav | **Pill + hamburger** / Pill + bottom sheet |
| 4 | Footer CTA duplicate | **Yes** (Start Assessment) / No |

---

*Generated from ui-ux-pro-max design-system query + codebase audit. Ready for implementation approval.*
