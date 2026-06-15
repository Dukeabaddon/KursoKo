/**
 * Landing Tailwind presets — edit shared UI strings here.
 * Colors: src/styles/landing/tokens.css
 */

export const landingPage = 'min-h-screen w-full bg-landing-paper text-landing-ink font-sans'

export const landingFold = 'flex h-dvh max-h-dvh flex-col overflow-hidden bg-landing-paper'

export const landingDisplay = 'font-[family-name:var(--font-display)]'

export const landingBtnPrimary =
  'inline-flex items-center justify-center rounded-2xl bg-landing-accent font-semibold text-white shadow-sm transition-all duration-300 ease-landing hover:bg-landing-accent-hover hover:shadow-[0_4px_14px_rgba(75,44,127,0.28)] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent'

export const landingNavShell = (scrolled) =>
  [
    'sticky top-0 z-50 border-b transition-all duration-300 ease-landing',
    scrolled
      ? 'border-landing-ink/10 bg-landing-paper/90 shadow-sm backdrop-blur-md'
      : 'border-transparent bg-transparent'
  ].join(' ')

export const landingNavLink =
  'rounded-xl px-3 py-2 text-sm font-medium text-landing-muted transition-colors duration-300 ease-landing hover:bg-landing-ink/5 hover:text-landing-ink'

export const landingHeroEyebrow =
  'inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-landing-teal sm:text-xs'

export const landingHeroEyebrowOnPanel =
  'inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-landing-teal sm:text-xs'

export const landingHeroOnPanelMuted = 'text-[rgba(253,252,248,0.78)]'

export const landingHeroOnPanelLink =
  'font-semibold text-[rgba(253,252,248,0.9)] underline-offset-4 hover:underline'

export const landingHeroTitle =
  'text-[clamp(1.875rem,2.8vw+1rem,3rem)] leading-[1.08] max-[760px]:text-[clamp(1.625rem,2.2vw+0.75rem,2.25rem)]'

export const landingHeroBody =
  'text-[clamp(0.9375rem,0.45vw+0.75rem,1.125rem)] leading-[1.55] max-[760px]:text-sm'

export const landingRise = 'animate-landing-rise'

export const landingRiseDelay = (ms) => `animate-landing-rise [animation-delay:${ms}ms]`

export const landingHeroCta =
  'inline-flex items-center justify-center rounded-full bg-landing-accent px-7 py-3 text-base font-bold text-white transition-transform duration-300 ease-landing hover:scale-105 hover:bg-landing-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-paper active:scale-100'

export const landingCtaFancy =
  'landing-cta-fancy group inline-flex items-center justify-center rounded-2xl border-0 bg-landing-accent px-7 py-3 text-base font-semibold text-white shadow-[0_1px_2px_rgba(45,45,45,0.08),0_8px_24px_rgba(75,44,127,0.22)] hover:-translate-y-px hover:bg-landing-accent-hover hover:shadow-[0_2px_4px_rgba(45,45,45,0.1),0_12px_32px_rgba(75,44,127,0.32)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-landing-ink'

export const landingCtaYellow =
  'landing-cta-fancy group inline-flex items-center justify-center rounded-2xl border-0 bg-landing-yellow px-7 py-3 text-base font-semibold text-landing-accent shadow-[0_1px_2px_rgba(45,45,45,0.1),0_8px_24px_rgba(255,213,79,0.35)] hover:-translate-y-px hover:bg-[#ffc107] hover:shadow-[0_2px_4px_rgba(45,45,45,0.12),0_12px_32px_rgba(255,213,79,0.45)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-landing-yellow'
