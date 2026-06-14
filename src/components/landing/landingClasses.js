/**
 * Landing Tailwind presets — shared class strings for quick manual edits.
 * Tokens live in src/styles/landing/tokens.css
 */

export const landingPage = 'min-h-screen w-full bg-landing-paper text-landing-ink font-sans'

export const landingFold = 'flex h-dvh max-h-dvh flex-col overflow-hidden bg-landing-paper'

export const landingDisplay = 'font-[family-name:var(--font-display)]'

export const landingBtnPrimary =
  'inline-flex items-center justify-center rounded-xl bg-landing-accent font-semibold text-white shadow-sm transition-all duration-300 ease-landing hover:bg-landing-accent-hover hover:shadow-[0_4px_14px_rgba(194,65,12,0.25)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent'

export const landingNavShell = (scrolled) =>
  [
    'sticky top-0 z-50 border-b transition-all duration-300 ease-landing',
    scrolled
      ? 'border-stone-900/10 bg-landing-paper/90 shadow-sm backdrop-blur-md'
      : 'border-transparent bg-transparent'
  ].join(' ')

export const landingNavLink =
  'rounded-md px-3 py-2 text-sm font-medium text-landing-muted transition-colors duration-300 ease-landing hover:bg-stone-900/5 hover:text-landing-ink'

export const landingWordmark =
  'font-[family-name:var(--font-display)] text-[1.375rem] font-extrabold leading-none tracking-[-0.04em] text-landing-ink'

export const landingWordmarkAccent = 'text-landing-accent'

export const landingHeroTitle =
  'text-[clamp(1.875rem,2.8vw+1rem,3rem)] leading-[1.08] max-[760px]:text-[clamp(1.625rem,2.2vw+0.75rem,2.25rem)]'

export const landingHeroBody =
  'text-[clamp(0.9375rem,0.45vw+0.75rem,1.125rem)] leading-[1.55] max-[760px]:text-sm'

export const landingRise = 'animate-landing-rise'

export const landingRiseDelay = (ms) => `animate-landing-rise [animation-delay:${ms}ms]`

export const landingCtaFancy =
  'landing-cta-fancy group inline-flex items-center justify-center rounded-xl border-0 bg-landing-accent px-7 py-3 text-base font-semibold text-white shadow-[0_1px_2px_rgba(28,25,23,0.08),0_8px_24px_rgba(194,65,12,0.22)] hover:-translate-y-px hover:bg-landing-accent-hover hover:shadow-[0_2px_4px_rgba(28,25,23,0.1),0_12px_32px_rgba(194,65,12,0.32)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-landing-ink'
