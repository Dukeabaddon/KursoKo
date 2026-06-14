import heroCharacterCutout from '../../assets/landing/kursoko-hero-pt-v3-cutout.png'
import { LandingCtaButton } from '../ui'
import {
  landingDisplay,
  landingHeroBody,
  landingHeroTitle,
  landingRise,
  landingRiseDelay
} from './landingClasses'

const HeroSection = ({ onStart }) => {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="landing-hero-accent" aria-hidden="true" />
      <div className="landing-hero-grain" aria-hidden="true" />

      <div className="relative mx-auto flex h-full min-h-0 w-full max-w-6xl flex-1 px-4 sm:px-6 md:px-8">
        <div className="flex h-full min-h-0 w-full items-center gap-6 lg:gap-10">
          <div className="flex min-w-0 flex-[0.95] flex-col justify-center py-3 md:py-4">
            <p
              className={`${landingRise} ${landingDisplay} text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-landing-accent sm:text-xs`}
            >
              Free RIASEC assessment
            </p>

            <h1
              id="hero-heading"
              className={`${landingRiseDelay(80)} ${landingDisplay} ${landingHeroTitle} mt-2 max-w-none font-bold tracking-tight text-landing-ink sm:mt-3`}
            >
              Find clarity before you choose your path
            </h1>

            <p
              className={`${landingRiseDelay(160)} ${landingHeroBody} mt-3 max-w-none text-landing-muted sm:mt-4`}
            >
              Take our ten-minute assessment. Get a personalized RIASEC profile, career matches, and
              scholarship ideas built for students in the Philippines.
            </p>

            <div className={`${landingRiseDelay(240)} mt-4 sm:mt-5`}>
              <LandingCtaButton onClick={onStart}>Start Assessment</LandingCtaButton>
            </div>

            <p
              className={`${landingRiseDelay(320)} mt-3 text-xs leading-relaxed text-landing-muted sm:mt-4 sm:text-sm`}
            >
              Your responses stay private.{' '}
              <a
                href="documentation/SECURITY.md"
                className="font-semibold text-landing-accent underline-offset-4 hover:underline"
              >
                Privacy &amp; data use
              </a>
            </p>
          </div>

          <div className="relative hidden h-full min-h-0 min-w-0 flex-[1.05] md:block">
            <div className="relative flex h-full w-full items-end justify-center">
              <div
                className="absolute bottom-[7%] left-1/2 z-0 h-[5%] w-[42%] -translate-x-1/2 rounded-full bg-landing-ink/15 blur-[10px]"
                aria-hidden="true"
              />
              <img
                src={heroCharacterCutout}
                alt="KursoKo student guide character thinking about career choices"
                className="relative z-10 max-h-full w-auto max-w-full object-contain object-bottom"
                width={1024}
                height={1365}
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="landing-chapter-rule mx-auto w-full max-w-6xl shrink-0 px-4 sm:px-6 md:px-8"
        aria-hidden="true"
      />
    </section>
  )
}

export default HeroSection
