# 🎨 KursoKo Homepage Design Plan v1.1
*Creative, Playful Career Assessment for Filipino Youth (15-18)*

---

## 📋 OBJECTIVE
- Build a mobile-first homepage that motivates Filipino high school students to start the KursoKo RIASEC questionnaire, clearly explains value, and sets expectations (questions, time, results) without business/marketing claims.

## 🔍 ASSUMPTIONS
- Assessment length: ~60 questions; estimated time: ~15 minutes (proposed).
- Primary CTA routes to existing `Questionnaire` flow and uses `sessionManager` for session + rate limit (proposed).
- Homepage uses local UI state only; assessment state handled by Questionnaire (proposed).
- Tailwind CSS v4 with CSS-first tokens via `@theme` and CSS variables in `src/index.css` (proposed).
- Content language: Filipino-English mix; no multi-language toggle in v1 (proposed).

## 🧠 USER QUESTIONS (for confirmation)
- Logo/brand constraints? Vector logo availability or text-only “KursoKo”? Impacts header/hero.
- Any mandated fonts from brand? If none, proceed with Poppins (headings) + Inter (body).
- Privacy copy preference: Link to `documentation/SECURITY.md` or short inline note? Impacts CTA area.
- Analytics: Should we instrument basic events (home_cta_click, sample_interaction) locally for UX improvement? No network by default.

## 📐 SCOPE
- In: Hero, Value Proposition, RIASEC Intro, How It Works, Sample Question (non-persistent), Final CTA, small FAQ, “By the numbers” strip (time/questions/results only).
- Out (v1): Testimonials, login/sign-up, account resume, multi-language toggle, deep resource library.

## 🏗️ ARCHITECTURE
- File structure (aligned to repo conventions):
  - `src/components/Home/`
    - `HomePage.jsx` (container)
    - `HeroSection.jsx`, `ValueProposition.jsx`, `RIASECIntro.jsx`, `HowItWorks.jsx`, `SampleQuestion.jsx`, `FinalCTA.jsx`
    - `index.js` (barrel)
- Contracts
  - Hero/Final CTA: `onStart` → invokes `sessionManager.checkRateLimit()` → `sessionManager.startSession()` → navigate to `Questionnaire` or surface `ErrorState` on violation.
  - SampleQuestion: read-only from `src/data/questions.json`; no session creation; emits `onTryFullAssessment`.
- State: Local UI only (hover/expanded/toggles). No cross-page state on homepage.
- Accessibility: Landmarks, aria-labels, keyboard activation, visible focus, motion-safe.

## 💭 DESIGN OPTIONS
- A. Playful Pastel (recommended)
  - Pros: Highest teen engagement; friendly; aligns with flat 2D illustrations.
  - Cons: Must watch contrast; avoid over-gamification.
- B. Clean Academic
  - Pros: Credibility with parents/teachers; easy contrast.
  - Cons: Less engaging for teens.
- C. Gamified Bold
  - Pros: Strong interaction and memorability.
  - Cons: Heavier motion; performance risk; extra build effort.

## ⚠️ RISKS / OPEN ITEMS
- Illustration sourcing and license fit; ensure consistent art style.
- Motion on low-end devices; respect `prefers-reduced-motion` and keep durations 150–200ms.
- Contrast on pastel backgrounds; verify AA minimum.
- Content scope creep (FAQ/testimonials); keep MVP focused on starting assessment.

---

## 📋 PROJECT BRIEF

### Target Audience
- **Age:** 15-18 years old (high school students)
- **Location:** Urban Philippines
- **Tech Level:** Simplified UI with creative elements
- **Language:** Conversational Filipino-English mix

### Brand Personality
**Youthful & Energetic** (Option A)
- Bright pastel colors
- Playful, creative design
- Casual, conversational language
- Inspired by STI SCOPE's approachable style

### Primary Goals
1. **Primary:** Help students discover their career path
2. **Secondary:** Educate about RIASEC system
3. **Conversion:** Maximize assessment starts

---

## 🎯 COMPETITIVE ANALYSIS: STI SCOPE

### What They Do Well
✅ Clear hero message: "Know more about yourself!"  
✅ Simple CTA: "Let's Get Started"  
✅ Educational sections (What is SCOPE, Career Explorer)  
✅ Trust signals (testimonials from professionals)  
✅ Resource library (Career Toolbox)  
✅ Clean, organized navigation  

### What We'll Do Better
🚀 **More playful illustrations** (they use photos, we'll use flat 2D art)  
🚀 **Stronger RIASEC education** (explain personality types upfront)  
🚀 **Gamified preview** (show sample questions as teasers)  
🚀 **Mobile-first design** (fully optimized for phones)  
🚀 **Pastel color palette** (softer, more modern than their blue/purple)  
🚀 **Character mascots** (visual representation of RIASEC types)  

---

## 🎨 DESIGN DIRECTION

### Visual Style
**Flat 2D Illustrations + Pastel Gradients**

**Color Palette:**
```css
/* Primary Pastels */
--pastel-blue: #A8D8EA      /* Trust, Calm */
--pastel-purple: #D4A5F3    /* Creativity, Dreams */
--pastel-pink: #FFD3E1      /* Warmth, Friendliness */
--pastel-yellow: #FFF4A3    /* Energy, Optimism */
--pastel-green: #B8E6D5     /* Growth, Success */
--pastel-orange: #FFCBA4    /* Enthusiasm, Action */

/* Neutrals */
--text-dark: #2D3748        /* Main text */
--text-gray: #718096        /* Secondary text */
--bg-cream: #FFFEF9         /* Page background */
--white: #FFFFFF            /* Cards, sections */
```

**Typography:**
```css
/* Headings */
font-family: 'Poppins', sans-serif
font-weight: 700-900 (Bold to Black)

/* Body */
font-family: 'Inter', sans-serif
font-weight: 400-600 (Regular to Semibold)

/* Accent */
font-family: 'Fredoka One', cursive (for playful CTAs)
```

**Illustration Style:**
- Flat 2D vector illustrations
- Rounded corners everywhere (16px-24px border-radius)
- Playful character designs representing RIASEC types:
  - **R (Realistic):** Mechanic with tools
  - **I (Investigative):** Scientist with microscope
  - **A (Artistic):** Artist with paintbrush
  - **S (Social):** Teacher with students
  - **E (Enterprising):** Business person with laptop
  - **C (Conventional):** Organizer with clipboard

**Suggested Illustration Sources:**
- **unDraw** (https://undraw.co) - Customizable SVG illustrations
- **Humaaans** (https://humaaans.com) - Mix-and-match characters
- **Storyset** (https://storyset.com) - Animated illustrations

---

## � BY THE NUMBERS (Homepage strip)
- ~60 questions
- ~15 minutes
- ⚡ Instant results
Note: No business/marketing claims; no “free” or “no sign-up” phrasing.

---

## �📐 COMPONENT HIERARCHY

### Page Structure (Mobile-First)

```
┌─────────────────────────────────────┐
│  1. HERO SECTION                    │
│     - Catchy headline               │
│     - Subheadline (conversational)  │
│     - Primary CTA button            │
│     - Hero illustration             │
├─────────────────────────────────────┤
│  2. VALUE PROPOSITION               │
│     - "Why take KursoKo?"           │
│     - 3 benefit cards               │
├─────────────────────────────────────┤
│  3. RIASEC INTRODUCTION             │
│     - "What's your type?"           │
│     - 6 personality cards           │
│     - Interactive preview           │
├─────────────────────────────────────┤
│  4. HOW IT WORKS                    │
│     - 3-step process                │
│     - Visual timeline               │
├─────────────────────────────────────┤
│  5. SAMPLE QUESTION PREVIEW         │
│     - "Try a sample question"       │
│     - Interactive demo              │
├─────────────────────────────────────┤
│  6. TRUST SIGNALS (Optional)        │
│     - Usage stats (if available)    │
│     - Simple testimonial            │
├─────────────────────────────────────┤
│  7. FINAL CTA                       │
│     - Big button "Start Assessment" │
│     - Reassurance text              │
└─────────────────────────────────────┘
```

---

## 🎨 SECTION DESIGNS

### 1. HERO SECTION

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│     [Playful Character Illustration] │
│                                     │
│   🎯 Ano ang tamang career mo?      │
│                                     │
│   Alamin ang iyong personality type │
│   at i-discover ang best career     │
│   path para sa'yo! 🚀               │
│                                     │
│   [ Simulan ang Assessment → ]      │
│                                     │
│   ⏱️ ~15 minutes lang | ⚡ Instant results │
│                                     │
└─────────────────────────────────────┘
```

**Design Details:**
- **Background:** Soft gradient (pastel-blue → pastel-purple)
- **Headline:** 48px Poppins Bold, conversational Filipino
- **CTA Button:** Rounded pill shape, bright orange, hover animation
- **Illustration:** Character thinking with question marks
- **Trust badges:** Time + Results reassurance below CTA
- **Privacy link (inline):** “Privacy & data use” → `documentation/SECURITY.md`

---

### 2. VALUE PROPOSITION

**Title:** "Bakit dapat mong i-try ang KursoKo?"

**3 Benefit Cards:**

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  🎯 Kilala   │  │  📚 I-explore│  │  🚀 Sigurado │
│  ang sarili  │  │  ang careers │  │  sa future   │
│              │  │              │  │              │
│ Matuto kung  │  │ Makita ang   │  │ Gumawa ng    │
│ ano talaga   │  │ iba't ibang  │  │ matalinong   │
│ ang hilig mo │  │ career paths │  │ career choice│
└──────────────┘  └──────────────┘  └──────────────┘
```

**Design Details:**
- **Cards:** White background, pastel border, subtle shadow
- **Icons:** Large emoji or custom SVG icons
- **Text:** Short, punchy Filipino phrases
- **Layout:** 3 columns desktop, stack on mobile

---

### 3. RIASEC INTRODUCTION

**Title:** "Ano ang iyong Personality Type?"

**6 RIASEC Cards (Interactive):**

```
┌─────────────────────────────────────┐
│  [Animated Character Icon]          │
│                                     │
│  THE DOER                           │
│  (Realistic)                        │
│                                     │
│  Gusto mo ng hands-on work?         │
│  Athletic, practical, builder       │
│                                     │
│  [Hover to see careers →]           │
└─────────────────────────────────────┘
```

**All 6 Types:**
1. **R - THE DOER** (Pastel Green) - Mechanic, Engineer, Chef
2. **I - THE THINKER** (Pastel Blue) - Scientist, Doctor, Researcher
3. **A - THE CREATOR** (Pastel Purple) - Artist, Designer, Writer
4. **S - THE HELPER** (Pastel Pink) - Teacher, Nurse, Counselor
5. **E - THE LEADER** (Pastel Orange) - Entrepreneur, Manager, Lawyer
6. **C - THE ORGANIZER** (Pastel Yellow) - Accountant, Admin, Analyst

**Design Details:**
- **Grid:** 2x3 on desktop, 1 column mobile
- **Interaction:** Hover reveals sample careers
- **Animation:** Cards gently float/pulse
- **Illustration:** Character representing each type

---

### 4. HOW IT WORKS

**Title:** "Paano gumagana ang KursoKo?"

**3-Step Timeline:**

```
    1️⃣                 2️⃣                 3️⃣
[Answer Icon]     [Calculate Icon]   [Results Icon]
                        ↓                   ↓
Sagutan ang          Kina-calculate      Makita ang
60 tanong           ang personality      career paths
(15 min lang!)      type mo             na perfect sa'yo!
```

**Design Details:**
- **Layout:** Horizontal timeline with connecting line
- **Icons:** Playful illustrations for each step
- **Text:** Conversational, reassuring language
- **Animation:** Steps appear on scroll (progressive disclosure)

---

### 5. SAMPLE QUESTION PREVIEW

**Title:** "Subukan muna! Try a sample question:"

**Interactive Demo:**
```
┌─────────────────────────────────────┐
│                                     │
│  Gusto mo bang mag-repair ng mga    │
│  appliances at machines?            │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ 😫  Hindi talaga              │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ 😐  Pwede naman               │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ 😊  Oo naman!                 │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ 🤩  Sobrang gusto ko!         │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Try the full assessment →]        │
│                                     │
└─────────────────────────────────────┘
```

**Design Details:**
- **Question:** Real RIASEC question
- **Scale:** 1-5 with emoji + Filipino text
- **Interaction:** Clickable options, animates on select
- **Purpose:** Lower barrier to entry, show it's easy

---

### 6. FINAL CTA

**Big, Impossible-to-Miss CTA:**

```
┌─────────────────────────────────────┐
│                                     │
│     [Happy Students Illustration]   │
│                                     │
│   🚀 Ready na ba?                   │
│   I-discover ang career path mo!    │
│                                     │
│   ┌───────────────────────────────┐ │
│   │  SIMULAN ANG ASSESSMENT  →    │ │
│   └───────────────────────────────┘ │
│                                     │
│   ✓ ~15 minutes lang                │
│   ✓ Instant results                 │
│   ✓ Clear, easy-to-read results     │
│                                     │
└─────────────────────────────────────┘
```

**Design Details:**
- **Background:** Gradient overlay on illustration
- **Button:** Extra large, animated gradient background
- **Reassurance:** 3 checkmarks below
- **Animation:** Gentle parallax scroll effect

---

## 🎭 COMPONENT SPECIFICATIONS

### Button Styles

**Primary CTA:**
```css
.btn-primary {
  background: linear-gradient(135deg, #FFCBA4 0%, #FFD3E1 100%);
  padding: 16px 48px;
  border-radius: 999px;
  font-family: 'Fredoka One', cursive;
  font-size: 18px;
  color: #2D3748;
  box-shadow: 0 8px 24px rgba(255, 203, 164, 0.4);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(255, 203, 164, 0.6);
}
```

**Secondary CTA:**
```css
.btn-secondary {
  background: white;
  border: 2px solid #A8D8EA;
  padding: 12px 32px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #2D3748;
}
```

---

### Card Styles

**Benefit Card:**
```css
.benefit-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  border: 3px solid transparent;
  background-image: 
    linear-gradient(white, white),
    linear-gradient(135deg, #A8D8EA, #D4A5F3);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-8px);
}
```

**RIASEC Type Card:**
```css
.riasec-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.riasec-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: var(--type-color); /* Pastel color per type */
}

.riasec-card:hover .careers-preview {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 📱 RESPONSIVE BEHAVIOR

### Breakpoints
```css
/* Mobile */
@media (max-width: 640px) {
  /* Stack all cards */
  /* Larger touch targets (min 48px) */
  /* Reduced spacing */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 2-column grids */
  /* Medium spacing */
}

/* Desktop */
@media (min-width: 1025px) {
  /* 3-column grids */
  /* Full spacing */
  /* Hover effects active */
}
```

### Mobile-First Strategy
1. Design for 375px width first
2. Touch-friendly buttons (min 48px height)
3. Swipeable RIASEC cards
4. Sticky CTA at bottom on mobile
5. Simplified animations (respect `prefers-reduced-motion`)

---

## ♿ ACCESSIBILITY REQUIREMENTS

### Semantic HTML
```html
<main role="main">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Ano ang tamang career mo?</h1>
  </section>
</main>
```

### ARIA Labels
- All buttons have `aria-label`
- Interactive cards have `role="button"` + `tabindex="0"`
- Form inputs have associated `<label>`
- Loading states announce with `aria-live="polite"`

### Keyboard Navigation
- All interactive elements reachable via Tab
- Enter/Space activates buttons
- Escape closes modals
- Focus indicators visible (2px outline)

### Color Contrast
- Text on pastel backgrounds: AAA level (7:1)
- Button text: AA level minimum (4.5:1)
- Use darker text colors where needed
- Provide a user-accessible “Reduce motion” toggle and always respect `prefers-reduced-motion`.

---

## 🎬 ANIMATION STRATEGY

### Micro-interactions
```javascript
// Hover animations
- Cards lift on hover (translateY -8px)
- Buttons scale slightly (scale 1.05)
- Colors brighten (filter: brightness(1.1))

// Click feedback
- Scale down on click (scale 0.95)
- Ripple effect on buttons
- Confetti on assessment start

// Scroll animations
- Fade in sections (opacity 0 → 1)
- Slide up cards (translateY 40px → 0)
- Stagger animations (delay per card)
```

### Performance
- Use CSS transforms (GPU accelerated)
- Avoid animating width/height
- Limit simultaneous animations
- Respect `prefers-reduced-motion`

---

## 📦 COMPONENT FILE STRUCTURE

```
src/components/Home/
├── HomePage.jsx              # Main container
├── HeroSection.jsx           # Hero with CTA
├── ValueProposition.jsx      # 3 benefit cards
├── RIASECIntro.jsx           # 6 personality types
├── HowItWorks.jsx            # 3-step process
├── SampleQuestion.jsx        # Interactive demo
├── FinalCTA.jsx              # Bottom CTA
└── index.js                  # Barrel export
```

---

## 🎨 TAILWIND THEME TOKENS (v4 CSS-first)

Define tokens in `src/index.css` using `@theme` and CSS custom properties. Keep `tailwind.config.js` minimal.

```css
/* src/index.css */
@theme {
  --color-pastel-blue: #A8D8EA;
  --color-pastel-purple: #D4A5F3;
  --color-pastel-pink: #FFD3E1;
  --color-pastel-yellow: #FFF4A3;
  --color-pastel-green: #B8E6D5;
  --color-pastel-orange: #FFCBA4;

  --color-neutral-dark: #2D3748;
  --color-neutral-gray: #718096;
  --color-neutral-cream: #FFFEF9;

  --radius-card: 24px;
  --radius-button: 999px;
}

:root {
  --heading-font: "Poppins", system-ui, sans-serif;
  --body-font: "Inter", system-ui, sans-serif;
  --accent-font: "Fredoka One", cursive;
}
```

Document mapping in `documentation/DESIGN_SPEC.md`.

---

## 📝 CONTENT COPY (Filipino-English Mix)

### Headlines
- Hero: **"Ano ang tamang career mo?"**
- Value Prop: **"Bakit dapat mong i-try ang KursoKo?"**
- RIASEC: **"Ano ang iyong Personality Type?"**
- How It Works: **"Paano gumagana ang KursoKo?"**
- Sample: **"Subukan muna! Try a sample question"**
- Final CTA: **"Ready na ba? I-discover ang career path mo!"**

### Body Copy Tone
- Conversational ("Gusto mo bang...?")
- Encouraging ("Kaya mo 'yan!")
- Reassuring ("15 minutes lang, walang bayad")
- Youth-friendly ("Sobrang cool, 'di ba?")

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Core Structure (Day 1)
- [ ] Create component files
- [ ] Build responsive grid layout
- [ ] Implement Tailwind theme
- [ ] Add font imports

### Phase 2: Hero + Value Prop (Day 1)
- [ ] Hero section with gradient
- [ ] Primary CTA button
- [ ] 3 benefit cards
- [ ] Basic animations

### Phase 3: RIASEC Section (Day 2)
- [ ] 6 personality type cards
- [ ] Hover interactions
- [ ] Character illustrations (source from unDraw)
- [ ] Career preview tooltips

### Phase 4: Process + Sample (Day 2)
- [ ] How It Works timeline
- [ ] Sample question component
- [ ] Interactive question demo
- [ ] Final CTA section

### Phase 5: Polish (Day 3)
- [ ] Scroll animations
- [ ] Micro-interactions
- [ ] Accessibility audit
- [ ] Mobile responsive testing
- [ ] Performance optimization

---

## ✅ ACCEPTANCE CRITERIA

### Visual Design
- [ ] Matches pastel color palette
- [ ] Flat 2D illustration style
- [ ] Playful, creative aesthetic
- [ ] Consistent with STI SCOPE approachability

### Functionality
- [ ] Mobile-first responsive
- [ ] All CTAs lead to questionnaire
- [ ] Sample question interactive
- [ ] Smooth animations

### Accessibility
- [ ] WCAG 2.2 AA compliant
- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Color contrast passes

### Performance
- [ ] Lighthouse score > 90
- [ ] First paint < 1.5s
- [ ] Smooth 60fps animations
- [ ] Optimized images

---

## ❓ MINI FAQ (Homepage footer)
- Gaano katagal ang assessment? ~15 minutes, 60 questions.
- Ano ang makukuha ko pagkatapos? Instant, malinaw na results at personality profile.
- Maaari bang subukan muna? Oo, may sample question sa homepage.
- Saan ko mababasa ang tungkol sa privacy? Tingnan ang “Privacy & data use” link.

---

## 🎯 SUCCESS METRICS

### Primary Metric
**Assessment Start Rate:** % of visitors who click "Simulan ang Assessment"
- Target: > 40%

### Secondary Metrics
- Time on homepage: > 60 seconds
- Scroll depth: > 75%
- Sample question interaction: > 30%

---

## 📚 NEXT STEPS

1. **Review & Approve** this plan
2. **Source illustrations** from unDraw/Humaaans
3. **Update Tailwind config** with pastel theme
4. **Create component structure**
5. **Build section by section**
6. **Test on real devices**
7. **Gather user feedback**

---

*Plan created: October 15, 2025*
*Following: `rules/frontend-ui.md` PLAN Mode*
*Ready for: ACT Mode implementation*

---

## 🖼️ ASSETS & LICENSING

Required assets (SVG preferred unless noted):
- Illustrations
  - 1 Hero illustration (diverse student/teen context)
  - 6 RIASEC type icons/mini-illustrations (R, I, A, S, E, C)
  - 3 step icons for “How it works”
  - 1 Final CTA illustration
- Icons
  - UI icons via library (Heroicons/Lucide/Phosphor) to avoid bundling heavy sets.
- Backgrounds/Textures
  - CSS gradients (no files) + optional subtle noise overlay (SVG/PNG ≤ 2KB)
- Fonts
  - Poppins (headings), Inter (body); optional Fredoka for CTA only.

Sources & license notes
- unDraw, Storyset, Humaaans for illustrations (review license/attribution as required).
- Heroicons/Lucide/Phosphor for icons (OSS-friendly licenses, check attribution policy).
- Google Fonts for typography (Open Font License).

Folder plan (on asset import):
- `public/assets/illustrations/` (hero, riasec, steps, final-cta)
- `public/assets/textures/` (optional noise overlays)
- Icons loaded via package/library; avoid duplicating SVGs locally when possible.
