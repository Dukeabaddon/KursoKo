export const assessmentNavBtn =
  'inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-landing-muted transition-colors hover:bg-landing-ink/5 hover:text-landing-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent sm:text-sm sm:px-2.5'

export const assessmentGhostBtn =
  'inline-flex items-center gap-1.5 rounded-xl border border-landing-ink/15 bg-white px-3 py-2 text-xs font-semibold text-landing-ink transition-colors hover:bg-landing-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent sm:text-sm'

export const assessmentPrimaryBtn =
  'inline-flex items-center gap-1.5 rounded-xl bg-landing-accent px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-landing-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-ink sm:text-sm'

/** ClickSpark presets — brand K colors */
export const SPARK_TEAL = { sparkColor: '#2CB1B1', sparkSize: 8, sparkRadius: 12, sparkCount: 8, duration: 400 }
export const SPARK_YELLOW = { sparkColor: '#FBC64D', sparkSize: 9, sparkRadius: 14, sparkCount: 8, duration: 400 }
export const SPARK_PURPLE = { sparkColor: '#9461BE', sparkSize: 10, sparkRadius: 15, sparkCount: 8, duration: 400 }
export const SPARK_ACCENT = { sparkColor: '#4B2C7F', sparkSize: 10, sparkRadius: 14, sparkCount: 8, duration: 400 }

export const SPARK_BY_RATING = {
  1: SPARK_TEAL,
  2: SPARK_YELLOW,
  3: SPARK_PURPLE
}

/** Cinematic easing — matches DESIGN.md assessment motion tokens */
export const ASSESSMENT_EXIT_MS = 420
