# 🎨 KursoKo Homepage Design Plan v2.0
*Conversion-Optimized RIASEC Career Assessment for Students*

---

## 📋 OBJECTIVE
Build a **conversion-focused, mobile-first homepage** that motivates students to start the KursoKo RIASEC questionnaire immediately. Inspired by riasectest.com's proven structure while maintaining approachable design for youth (15-18).

**Core Goal:** Maximize assessment start rate through clarity, credibility, and minimal friction.

---

## 🔍 CONFIRMED SPECIFICATIONS

### Assessment Details
- **Question Count:** 30 forced-choice pairs
- **Format:** Option A vs Option B (modern, contextual scenarios)
- **Time Estimate:** ~10 minutes
- **Language:** Pure English (no Filipino)
- **Results:** Instant RIASEC profile with career recommendations

### Design Direction
- **Style:** Professional with playful touches (Hybrid Minimalist-Modern)
- **Credibility:** Scientific backing emphasized
- **Youth Appeal:** Clean, modern UI without childish elements
- **Visual Assets:** Free resources (CSS gradients, blobs, grid patterns, Heroicons)

### Technical Foundation
- **Framework:** React + Vite + Tailwind CSS v4
- **Components:** Replace all 6 existing homepage components with 4 new streamlined ones
- **State:** Local UI only; assessment state handled by existing `Questionnaire` component
- **Session:** Uses existing `sessionManager` for rate limiting

---

## 📐 STREAMLINED MVP SCOPE

### ✅ Included (4 Core Sections)
1. **Hero Section** - Immediate value + primary CTA
2. **Why + How Combined** - Value props + process flow
3. **Features Grid** - 6 credibility/benefit highlights
4. **FAQ + Final CTA** - Address objections + conversion

### ❌ Excluded (v1 MVP)
- ~~Testimonials~~ (no user data available)
- ~~RIASEC character carousel~~ (adds complexity)
- ~~Sample question preview~~ (creates friction)
- ~~Multilingual toggle~~ (English-only v1)
- ~~Separate value proposition section~~ (merged with How It Works)

---

## 🏗️ ARCHITECTURE

### File Structure
```
src/components/Home/
├── HomePage.jsx              # Main container (NEW - replaces old)
├── HeroSection.jsx           # Above-fold conversion (NEW)
├── WhyHowSection.jsx         # Combined value + process (NEW)
├── FeaturesGrid.jsx          # 6 trust signals (NEW)
├── FAQSection.jsx            # Accordion + final CTA (NEW)
└── index.js                  # Barrel export

# REMOVE OLD FILES:
❌ ValueProposition.jsx
❌ RIASECIntro.jsx / RIASECCarousel/
❌ HowItWorks.jsx
❌ SampleQuestion.jsx
❌ FinalCTA.jsx
```

### Component Contracts

**HomePage.jsx**
```javascript
Props: { onStartQuestionnaire: () => void }
Renders: Hero, WhyHow, Features, FAQ in vertical stack
Handles: Skip link, main landmarks, scroll spacing
```

**HeroSection.jsx**
```javascript
Props: { onStart: () => void }
Renders: Headline, subheadline, primary CTA, trust badges, hero visual
Interaction: CTA invokes onStart → sessionManager.checkRateLimit()
```

**WhyHowSection.jsx**
```javascript
Props: None (static content)
Renders: 3 value props (cards) + 4-step process (timeline)
Layout: Mobile stack, desktop side-by-side or full-width sections
```

**FeaturesGrid.jsx**
```javascript
Props: None (static content)
Renders: 6 feature cards with icons
Layout: 2-col mobile, 3-col desktop
```

**FAQSection.jsx**
```javascript
Props: { onStart: () => void }
Renders: Accordion (8 Q&As) + Final CTA button
State: Local expanded/collapsed per question
Interaction: CTA invokes onStart
```

---

## 🎨 DESIGN SYSTEM

### Visual Style: Professional-Playful Hybrid

**Inspired by:** riasectest.com (credibility) + modern SaaS landing pages (clean)

**Color Palette:**
```css
/* Primary - Trust & Action */
--color-primary-600: #2563eb;      /* Primary CTA */
--color-primary-700: #1d4ed8;      /* CTA hover */
--color-primary-50: #eff6ff;       /* Subtle backgrounds */

/* Accent - Energy & Highlights */
--color-accent-500: #8b5cf6;       /* Feature highlights */
--color-accent-100: #f5f3ff;       /* Feature card backgrounds */

/* Success - Results & Completion */
--color-success-500: #10b981;      /* Trust badges */
--color-success-50: #ecfdf5;       /* Success highlights */

/* Neutrals */
--color-neutral-900: #0f172a;      /* Headings */
--color-neutral-700: #334155;      /* Body text */
--color-neutral-100: #f1f5f9;      /* Section backgrounds */
--color-neutral-50: #f8fafc;       /* Page background */
--color-white: #ffffff;            /* Cards */

/* Gradients (Hero Background) */
--gradient-hero: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 50%, #ecfdf5 100%);
--gradient-cta: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%);
```

**Typography:**
```css
/* Headings */
font-family: 'Inter', system-ui, sans-serif;
font-weight: 700-900 (Bold to Black);

/* Body */
font-family: 'Inter', system-ui, sans-serif;
font-weight: 400-600 (Regular to Semibold);

/* Scale */
h1: 3rem / 48px (mobile: 2.25rem / 36px)
h2: 2.25rem / 36px (mobile: 1.875rem / 30px)
h3: 1.5rem / 24px
body: 1rem / 16px (lg: 1.125rem / 18px)
```

**Visual Assets (Free Sources):**
- **Backgrounds:** CSS gradients + blob shapes (blobmaker.app or CSS-only)
- **Patterns:** Grid patterns via SVG or CSS repeating gradients
- **Icons:** Heroicons (MIT license) - already common in React ecosystem
- **Illustrations:** Abstract geometric shapes via CSS (no external images for MVP)

---

## 📋 SECTION SPECIFICATIONS

### 1. HERO SECTION

**Layout (Mobile-First):**
```
┌─────────────────────────────────────┐
│    [Gradient Background w/ Blobs]   │
│                                     │
│   🎯 Find Your Perfect Career Path  │
│                                     │
│   Discover your strengths and       │
│   ideal careers with our free       │
│   RIASEC assessment.                │
│                                     │
│   ┌───────────────────────────────┐ │
│   │   Start Assessment  →         │ │
│   └───────────────────────────────┘ │
│                                     │
│   ✓ 10 minutes  ✓ 30 questions     │
│   ✓ Instant results                │
│                                     │
│   [Geometric shapes/grid pattern]   │
│                                     │
└─────────────────────────────────────┘
```

**Content:**
- **Headline:** "Find Your Perfect Career Path"
- **Subheadline:** "Discover your strengths and ideal careers with our free RIASEC assessment. Get personalized insights in just 10 minutes."
- **Primary CTA:** "Start Assessment" (large gradient button)
- **Trust Badges:** 
  - ✓ 10 minutes
  - ✓ 30 questions
  - ✓ Instant results
  - ✓ Scientifically validated

**Visual Elements:**
- Background: Soft gradient (blue → purple → green tints)
- Decorative: CSS blob shapes in corners (abstract, non-distracting)
- Grid pattern overlay (subtle, 10% opacity)

**Accessibility:**
- Heading hierarchy: `<h1>` for headline
- CTA: `aria-label="Begin RIASEC career assessment"`
- Skip link to main content

---

### 2. WHY + HOW SECTION (Combined)

**Layout:**
```
┌─────────────────────────────────────┐
│  Why Take the RIASEC Assessment?    │
│                                     │
│  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │ Icon │  │ Icon │  │ Icon │      │
│  │Value │  │Value │  │Value │      │
│  │ #1   │  │ #2   │  │ #3   │      │
│  └──────┘  └──────┘  └──────┘      │
│                                     │
├─────────────────────────────────────┤
│  How It Works                       │
│                                     │
│  1 ──→ 2 ──→ 3 ──→ 4                │
│  Answer  Assess  Discover  Explore  │
│                                     │
└─────────────────────────────────────┘
```

**Why Content (3 Value Props):**

1. **Self-Awareness**
   - Icon: 🔍 (Heroicon: MagnifyingGlassIcon)
   - Title: "Know Your Strengths"
   - Text: "Understand your natural interests and abilities backed by psychology research."

2. **Career Clarity**
   - Icon: 🎯 (Heroicon: SparklesIcon)
   - Title: "Discover Ideal Careers"
   - Text: "Get matched with careers that align with your personality and goals."

3. **Smart Decisions**
   - Icon: 📊 (Heroicon: ChartBarIcon)
   - Title: "Make Informed Choices"
   - Text: "Choose your education path and career with confidence and data."

**How Content (4-Step Process):**

```
Step 1: Answer Questions
Icon: Heroicon CheckCircleIcon
"Respond to 30 real-world scenario questions"

Step 2: Assess Your Profile  
Icon: Heroicon CpuChipIcon
"Our system analyzes your responses using RIASEC theory"

Step 3: Discover Your Type
Icon: Heroicon LightBulbIcon
"Receive your unique career personality code"

Step 4: Explore Career Paths
Icon: Heroicon RocketLaunchIcon
"View matched careers and educational recommendations"
```

**Design Details:**
- Value cards: White bg, border, icon top, centered text
- Process timeline: Horizontal line connecting numbered steps (mobile: vertical stack)
- Spacing: `gap-8` between cards, `gap-12` between Why/How subsections

---

### 3. FEATURES GRID

**Title:** "Trusted Assessment Platform"

**6 Features (2x3 mobile, 3x2 desktop):**

1. **Scientifically Validated**
   - Icon: Heroicon AcademicCapIcon
   - "Based on Dr. John Holland's proven RIASEC theory used worldwide"

2. **Comprehensive Results**
   - Icon: Heroicon DocumentTextIcon
   - "Detailed personality profile with career recommendations and insights"

3. **Quick & Easy**
   - Icon: Heroicon ClockIcon
   - "Complete the assessment in just 10 minutes with straightforward questions"

4. **Free Forever**
   - Icon: Heroicon GiftIcon
   - "No hidden costs, no credit card required, no sign-up needed"

5. **Privacy Focused**
   - Icon: Heroicon ShieldCheckIcon
   - "Your data stays private and secure with no tracking or selling"

6. **Instant Access**
   - Icon: Heroicon BoltIcon
   - "Get your results immediately after completing the assessment"

**Design:**
- Cards: Light accent background (`bg-accent-50` or `bg-primary-50` alternating)
- Icon: Large (32px), accent color
- Text: Short, benefit-focused
- Hover: Subtle lift effect

---

### 4. FAQ + FINAL CTA SECTION

**FAQ Title:** "Common Questions"

**8 Questions (Accordion):**

```javascript
const faqs = [
  {
    question: "What is the RIASEC assessment?",
    answer: "RIASEC is a career interest assessment based on psychologist Dr. John Holland's theory. It categorizes people into six personality types: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional. By understanding your type, you can identify careers that match your interests and strengths."
  },
  {
    question: "How long does the assessment take?",
    answer: "The KursoKo RIASEC assessment takes approximately 10 minutes to complete. You'll answer 30 scenario-based questions where you choose between two options. There are no wrong answers—just pick what appeals to you more."
  },
  {
    question: "Is this assessment scientifically accurate?",
    answer: "Yes. Our assessment is based on Holland's RIASEC theory, which has been validated through decades of research and is widely used in career counseling worldwide. However, it's best used as one tool among many in your career exploration journey."
  },
  {
    question: "Do I need to create an account?",
    answer: "No account is required. You can start the assessment immediately and receive your results right away. However, results are shown once and not stored, so we recommend taking a screenshot or notes."
  },
  {
    question: "What will my results show?",
    answer: "You'll receive a personalized RIASEC profile showing your dominant personality types (typically your top 3). We'll also provide career suggestions that align with your profile, educational pathways to consider, and insights into work environments where you'd thrive."
  },
  {
    question: "Is the assessment really free?",
    answer: "Yes, completely free. KursoKo is designed to help students explore career options without any barriers. There are no hidden fees, no credit card required, and no premium upsells."
  },
  {
    question: "Can I retake the assessment?",
    answer: "Yes, though we recommend waiting at least a few months between attempts. Your interests can evolve over time, especially as you gain new experiences. Retaking periodically can provide updated insights."
  },
  {
    question: "Who should take this assessment?",
    answer: "This assessment is ideal for high school students, college students choosing majors, recent graduates exploring career options, or anyone considering a career change. It's particularly helpful if you're unsure which direction to pursue."
  }
]
```

**Final CTA Block:**
```
┌─────────────────────────────────────┐
│  Ready to Discover Your Career Path?│
│                                     │
│  ┌───────────────────────────────┐  │
│  │   Start Your Assessment  →    │  │
│  └───────────────────────────────┘  │
│                                     │
│  Join thousands of students who     │
│  have found clarity about their     │
│  future careers.                    │
└─────────────────────────────────────┘
```

**Design:**
- Accordion: Expand one at a time, smooth animation
- FAQ items: Question bold, answer regular weight
- CTA block: Gradient background, centered, large button
- Social proof text: Subtle, beneath CTA

---

## 🎯 BUTTON & INTERACTION DESIGN

### Primary CTA Button
```css
.btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%);
  color: white;
  font-size: 1.125rem; /* 18px */
  font-weight: 600;
  padding: 1rem 2rem; /* 16px 32px */
  border-radius: 0.75rem; /* 12px */
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

### Card Hover States
```css
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.value-card:hover {
  border-color: var(--color-primary-600);
}
```

---

## 📱 RESPONSIVE BEHAVIOR

### Breakpoints (Tailwind)
```css
/* Mobile: < 640px (default) */
- Single column layouts
- Stacked sections
- Smaller text (h1: 36px)
- Full-width CTAs

/* Tablet: 640px - 1024px */
- 2-column grids (features, value props)
- Medium spacing
- h1: 42px

/* Desktop: > 1024px */
- 3-column grids where applicable
- Horizontal timeline (How It Works)
- h1: 48px
- Max-width containers (max-w-6xl)
```

### Mobile-First Specifics
- Hero CTA: Sticky bottom bar on mobile (optional enhancement)
- FAQ: Full-width accordion items
- Typography: Use `clamp()` for fluid sizing
- Touch targets: Minimum 48px height for all interactive elements

---

## ♿ ACCESSIBILITY REQUIREMENTS

### Semantic Structure
```html
<header> - Navbar (existing)
<main role="main">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Find Your Perfect Career Path</h1>
  </section>
  <section aria-labelledby="why-how-heading">
    <h2 id="why-how-heading">Why Take the RIASEC Assessment?</h2>
  </section>
  <section aria-labelledby="features-heading">
    <h2 id="features-heading">Trusted Assessment Platform</h2>
  </section>
  <section aria-labelledby="faq-heading">
    <h2 id="faq-heading">Common Questions</h2>
  </section>
</main>
<footer> - (if added later)
```

### ARIA & Keyboard
- Skip link: "Skip to main content" (visible on focus)
- CTA buttons: `aria-label` with context
- FAQ accordion: 
  - `aria-expanded="true|false"`
  - `aria-controls="faq-answer-{id}"`
  - Enter/Space to toggle
- Focus indicators: 2px solid outline, 2px offset
- Color contrast: AA minimum (4.5:1 for body, 3:1 for large text)

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎬 ANIMATION STRATEGY

### Scroll Animations (Optional Enhancement)
```javascript
// Fade in sections on scroll using Intersection Observer
- Threshold: 0.1 (10% visible)
- Animation: opacity 0 → 1, translateY 20px → 0
- Duration: 600ms
- Easing: ease-out
- Stagger: 100ms per element
```

### Micro-interactions
- Button hover: lift 2px, shadow increase (200ms)
- Button active: press down (100ms)
- Card hover: lift 4px (300ms ease-out)
- FAQ expand: height auto, 300ms ease-in-out
- Icon hover: subtle rotate or scale (150ms)

**Performance:**
- Use `transform` and `opacity` only (GPU-accelerated)
- No layout-triggering animations (width/height/margin in static elements)
- Debounce scroll listeners if used

---

## 📦 COMPONENT IMPLEMENTATION DETAILS

### HomePage.jsx
```javascript
import HeroSection from './HeroSection'
import WhyHowSection from './WhyHowSection'
import FeaturesGrid from './FeaturesGrid'
import FAQSection from './FAQSection'

const HomePage = ({ onStartQuestionnaire }) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-4 py-2 rounded-md shadow-lg z-50">
        Skip to main content
      </a>

      <main id="main" role="main" className="flex flex-col">
        <HeroSection onStart={onStartQuestionnaire} />
        
        <div className="flex flex-col gap-20 sm:gap-24 md:gap-32 px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
          <WhyHowSection />
          <FeaturesGrid />
          <FAQSection onStart={onStartQuestionnaire} />
        </div>
      </main>
    </div>
  )
}

export default HomePage
```

### HeroSection.jsx
- Full viewport height on desktop (`min-h-screen md:min-h-[90vh]`)
- Centered content with max-width container
- Gradient background with CSS blob decorations
- Primary CTA prominent
- Trust badges below CTA
- Decorative grid pattern overlay

### WhyHowSection.jsx
- Two subsections in vertical flow
- "Why" subsection: 3-column grid (mobile: 1-col)
- "How" subsection: 4-step horizontal timeline (mobile: vertical)
- Clean separation with spacing
- Icons from Heroicons

### FeaturesGrid.jsx
- 6 feature cards
- Grid: 1-col mobile, 2-col tablet, 3-col desktop
- Alternating background colors (light blue/light purple)
- Icon + title + description layout
- Hover lift effect

### FAQSection.jsx
- Accordion component (controlled state)
- 8 FAQ items
- Expand/collapse one at a time
- Final CTA block below accordion
- Social proof text (generic, no specific numbers)

---

## 🎨 CSS & TAILWIND CONFIGURATION

### Update `src/index.css`
```css
@import 'tailwindcss';

@theme {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;

  /* Accent Colors */
  --color-accent-100: #f5f3ff;
  --color-accent-500: #8b5cf6;

  /* Success Colors */
  --color-success-50: #ecfdf5;
  --color-success-500: #10b981;

  /* Neutral Colors */
  --color-neutral-50: #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-700: #334155;
  --color-neutral-900: #0f172a;

  /* Spacing */
  --spacing-section: 5rem; /* 80px */

  /* Radii */
  --radius-card: 1rem; /* 16px */
  --radius-button: 0.75rem; /* 12px */
}

:root {
  --font-base: "Inter", system-ui, -apple-system, sans-serif;
  
  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 50%, #ecfdf5 100%);
  --gradient-cta: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%);
}

body {
  font-family: var(--font-base);
  color: var(--color-neutral-700);
  background-color: var(--color-neutral-50);
}

h1, h2, h3, h4, h5, h6 {
  color: var(--color-neutral-900);
  font-weight: 700;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Tailwind Config (Minimal - v4 CSS-first)
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 🔧 INTEGRATION WITH EXISTING CODE

### Session Management Flow
```javascript
// In HeroSection.jsx and FAQSection.jsx
const handleStartClick = () => {
  // Existing sessionManager handles rate limiting
  onStart() // Passed from App.jsx
  // sessionManager.checkRateLimit() → startSession() → navigate('/questionnaire')
}
```

### Questions Data
```javascript
// Use existing questionaires.json
// 30 questions, forced-choice format
// Rating scale: "Okay" (1), "Like" (2), "Love It" (3)
// Balanced across all 6 RIASEC dimensions
```

### Routing
```javascript
// Existing App.jsx pattern
<Routes>
  <Route path="/" element={<HomePage onStartQuestionnaire={handleStart} />} />
  <Route path="/questionnaire" element={<Questionnaire />} />
  <Route path="/results" element={<Results />} />
</Routes>
```

---

## ✅ ACCEPTANCE CRITERIA

### Visual Design
- [ ] Professional-modern aesthetic with subtle playful touches
- [ ] Clean, uncluttered layout with clear hierarchy
- [ ] Consistent use of primary/accent colors
- [ ] Free visual assets (CSS gradients, Heroicons, geometric shapes)

### Functionality
- [ ] All CTAs invoke `onStartQuestionnaire` correctly
- [ ] FAQ accordion expands/collapses smoothly
- [ ] Mobile-responsive at 375px, 768px, 1024px, 1440px
- [ ] Fast load time (no heavy images)

### Accessibility
- [ ] WCAG 2.2 AA compliant (contrast, keyboard nav)
- [ ] Semantic HTML structure
- [ ] ARIA labels on interactive elements
- [ ] Skip link functional
- [ ] Focus indicators visible

### Performance
- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices)
- [ ] First Contentful Paint < 1.5s
- [ ] Total page weight < 500KB
- [ ] Smooth 60fps animations

### Content
- [ ] Pure English (no Filipino)
- [ ] Clear, concise, student-friendly copy
- [ ] Accurate time estimate (10 min)
- [ ] Scientifically credible tone

---

## 📊 SUCCESS METRICS (Post-Launch)

### Primary Metric
**Assessment Start Rate:** % of visitors who click "Start Assessment"
- **Target:** > 40%
- **Measurement:** Track CTA clicks vs unique visitors

### Secondary Metrics
- **Time on Homepage:** Target > 45 seconds (reduced from original due to streamlined content)
- **Scroll Depth:** Target > 60% (FAQ section)
- **Bounce Rate:** Target < 50%

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Setup & Structure (Day 1 Morning)
- [ ] Update `src/index.css` with new design tokens
- [ ] Create 4 new component files with basic structure
- [ ] Update `HomePage.jsx` to use new components
- [ ] Remove old component files

### Phase 2: Hero + Why/How (Day 1 Afternoon)
- [ ] Implement `HeroSection.jsx` with gradient, CTA, trust badges
- [ ] Implement `WhyHowSection.jsx` with value cards + timeline
- [ ] Add Heroicons dependencies
- [ ] Test mobile responsiveness

### Phase 3: Features + FAQ (Day 2 Morning)
- [ ] Implement `FeaturesGrid.jsx` with 6 cards
- [ ] Implement `FAQSection.jsx` with accordion logic
- [ ] Add final CTA block
- [ ] Wire up all `onStart` handlers

### Phase 4: Polish & Accessibility (Day 2 Afternoon)
- [ ] Add hover/focus states
- [ ] Implement scroll animations (optional)
- [ ] Accessibility audit (keyboard nav, ARIA, contrast)
- [ ] Cross-browser testing

### Phase 5: Testing & Refinement (Day 3)
- [ ] Mobile device testing (real devices)
- [ ] Performance optimization (Lighthouse)
- [ ] Content review and copy edits
- [ ] Final QA checklist

---

## 🎨 VISUAL ASSETS SOURCES

### Free Resources to Use:

**Backgrounds & Patterns:**
- CSS Gradients: Hand-coded in Tailwind
- Blob Shapes: https://www.blobmaker.app/ (export SVG, optimize with SVGOMR)
- Grid Patterns: CSS repeating-linear-gradient or SVG pattern element

**Icons:**
- Heroicons: https://heroicons.com/ (MIT license)
  - Install: `npm install @heroicons/react`
  - Import: `import { AcademicCapIcon } from '@heroicons/react/24/outline'`

**Geometric Shapes:**
- CSS-only shapes (circles, squares with border-radius, gradients)
- SVG basic shapes (circle, rect, polygon) with inline SVG

**Example Hero Background:**
```css
.hero-background {
  background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 50%, #ecfdf5 100%);
  position: relative;
  overflow: hidden;
}

.hero-background::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  top: -200px;
  right: -200px;
}

.hero-background::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -150px;
  left: -150px;
}
```

---

## 📝 CONTENT COPY REFERENCE

### Headlines
- **Hero:** "Find Your Perfect Career Path"
- **Why:** "Why Take the RIASEC Assessment?"
- **How:** "How It Works"
- **Features:** "Trusted Assessment Platform"
- **FAQ:** "Common Questions"
- **Final CTA:** "Ready to Discover Your Career Path?"

### Tone Guidelines
- **Professional but approachable** (not corporate, not childish)
- **Action-oriented** ("Discover", "Explore", "Start")
- **Benefit-focused** (what users gain, not features)
- **Credible** (mention science, research, validation)
- **Encouraging** ("You can", "We'll help you")

### Voice
- Second person ("you", "your")
- Active voice preferred
- Concise sentences (15-20 words max)
- Avoid jargon or academic terms
- Inclusive language

---

## ⚠️ RISKS & MITIGATIONS

### Risk 1: Too Minimal (Lacks Engagement)
**Mitigation:** Add subtle animations, ensure CTA stands out, use engaging copy

### Risk 2: Low Credibility (No Testimonials)
**Mitigation:** Emphasize scientific backing, Dr. Holland reference, "thousands of students" generic social proof

### Risk 3: High Bounce (Users Don't Scroll)
**Mitigation:** Strong above-fold CTA, clear value prop in hero, FAQ targets objections

### Risk 4: FAQ Too Long (Decision Fatigue)
**Mitigation:** Accordion keeps collapsed by default, 8 questions is manageable, order by importance

---

## 🔗 REFERENCES & INSPIRATION

### Primary Inspiration
- **riasectest.com:** Conversion structure, FAQ approach, professional credibility
- **careerexplorer.hawaii.edu:** Simplicity, educational tone, minimalist design

### Design Resources
- Tailwind CSS v4 Documentation
- Heroicons Library
- WCAG 2.2 Guidelines
- Web Vitals Performance Metrics

---

## 📚 NEXT STEPS (POST-MVP)

### Future Enhancements (Not in v1)
- [ ] Testimonials section (once user data collected)
- [ ] Multilingual support (English/Filipino toggle)
- [ ] RIASEC type explorer page (deep dive into each type)
- [ ] Blog/resources section
- [ ] Account system for saving results
- [ ] Email results feature
- [ ] Social share functionality

---

## 📄 APPENDIX: COMPONENT SPECS SUMMARY

| Component | Props | State | Complexity | Est. Lines |
|-----------|-------|-------|------------|------------|
| HomePage | `onStartQuestionnaire` | None | Low | 40 |
| HeroSection | `onStart` | None | Medium | 80 |
| WhyHowSection | None | None | Medium | 120 |
| FeaturesGrid | None | None | Low | 100 |
| FAQSection | `onStart` | Local (accordion) | Medium | 150 |

**Total Estimated Code:** ~490 lines across 5 files

---

*Plan created: October 17, 2025*
*Version: 2.0 (Conversion-Optimized MVP)*
*Following: `rules/frontend-ui.md` PLAN Mode*
*Inspired by: riasectest.com + hawaii.edu RIASEC platforms*
*Ready for: ACT Mode implementation*

---

**END OF DESIGN PLAN**
