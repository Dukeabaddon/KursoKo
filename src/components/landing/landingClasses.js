/**
 * Landing Tailwind presets — edit shared UI strings here.
 * Colors: src/components/landing/tokens.css
 */

export const landingPage =
  'relative isolate min-h-screen w-full bg-landing-paper text-landing-ink font-sans'

/** Marks UI blocks where the landing hover glow must not appear */
export const landingGlowBlockProps = { 'data-landing-glow-block': true }

/** Spotlight scope root on HomePage */
export const landingSpotlightScopeProps = { 'data-spotlight-scope': true }

/** Granular blocks — cards, text headers, links, buttons (not whole sections) */
export const landingSpotlightBlockSelector = [
  '[data-landing-glow-block]',
  '.landing-section__header',
  '.landing-stats__pill',
  '.landing-riasec-tile',
  '.landing-step-card',
  '.landing-feature-card',
  '.landing-faq-item',
  '.landing-faq-cta',
  'a',
  'button',
].join(', ')

export const landingFold = 'flex h-dvh max-h-dvh flex-col overflow-hidden bg-landing-paper'

export const landingBtnPrimary =
  'landing-nav-cta inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent'

export const landingBtnPrimaryMobile =
  'landing-nav-cta mt-2 w-full px-4 py-2.5 text-sm font-semibold'

export const landingNavShell = (scrolled) =>
  [
    'sticky top-0 z-50 border-b transition-all duration-300 ease-landing',
    scrolled
      ? 'border-landing-ink/10 bg-landing-paper/90 shadow-sm backdrop-blur-md'
      : 'border-transparent bg-transparent'
  ].join(' ')

export const landingNavLink =
  'rounded-xl px-3 py-2 text-sm font-medium text-landing-muted transition-colors duration-300 ease-landing hover:bg-landing-ink/5 hover:text-landing-ink'

export const landingHeroTitle =
  'text-[clamp(1.875rem,2.8vw+1rem,3rem)] leading-[1.08] max-[767px]:text-[clamp(2rem,5.5vw+0.75rem,2.5rem)] max-[767px]:leading-[1.12] md:text-[clamp(2.25rem,2.2vw+1.25rem,3rem)] md:leading-[1.06] lg:text-[clamp(2.5rem,1.6vw+1.5rem,3.25rem)]'

export const landingHeroBody =
  'text-[clamp(0.9375rem,0.45vw+0.75rem,1.125rem)] leading-[1.55] max-[767px]:text-[clamp(1rem,2.5vw+0.65rem,1.125rem)] max-[767px]:leading-[1.6] md:text-lg md:leading-[1.65] lg:text-[1.1875rem] lg:leading-[1.7]'

export const landingHeroCta =
  'landing-hero-cta inline-flex items-center justify-center gap-2 rounded-full border-2 px-6 py-2.5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:px-7 md:py-3 md:text-base'

/**
 * Hero character column — relative canvas. Decor sizes: hero/heroDecor.js
 */
export const landingHeroCharacterCol =
  'pointer-events-none relative mt-auto flex w-full min-h-[9rem] max-h-[52%] flex-1 md:col-span-1 md:mt-0 md:h-full md:max-h-full md:min-h-0 lg:col-span-5'

export const landingHeroGlow =
  'landing-hero-glow pointer-events-none absolute bottom-[24%] left-1/2 z-[1] hidden h-[42%] w-[min(68%,18rem)] -translate-x-1/2 rounded-full md:block'
