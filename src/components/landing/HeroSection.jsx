import { useId } from 'react'
import heroCharacterCutout from '../../assets/landing/kursoko-hero-pt-v3-cutout.png'
import { landingHeroBody, landingHeroCta, landingHeroTitle } from './landingClasses'

/** Rounded trapezoid — viewBox 0 0 100 100, scales with preserveAspectRatio="none" */
const HERO_BANNER_PATH =
  'M 0,7 Q 0,0 7,0 L 93,0 Q 100,0 100,7 L 96,85 Q 95.5,88.5 92.5,89 L 6,100 Q 3,100.5 3,93 Z'

const HeroSection = ({ onStart }) => {
  const gradientId = useId().replace(/:/g, '')

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-0 w-full flex-1 flex-col"
    >
      <div className="landing-hero-stage w-full">
        <div className="landing-hero-banner relative mx-auto block w-[90%] md:w-[calc(100%-4rem)] md:max-w-7xl">
          <div className="landing-hero-banner-bg-mobile md:hidden" aria-hidden="true" />
          <div className="landing-hero-banner-bg hidden md:block" aria-hidden="true">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              focusable="false"
            >
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-landing-accent)" />
                  <stop offset="100%" stopColor="var(--color-landing-accent-hover)" />
                </linearGradient>
              </defs>
              <path
                d={HERO_BANNER_PATH}
                fill={`url(#${gradientId})`}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="landing-hero-content relative z-10 flex h-full min-h-0 w-full flex-col px-5 pb-5 pt-6 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-stretch md:gap-8 md:px-12 md:py-12 lg:grid-cols-12 lg:px-16">
            <div className="landing-hero-copy relative z-10 flex w-full min-w-0 max-w-full flex-col items-start justify-center gap-4 text-left md:col-span-1 md:h-full md:!min-h-[500px] md:gap-0 lg:col-span-7 lg:!min-h-[550px]">
              <h1
                id="hero-heading"
                className={`mb-0 w-full max-w-full break-words text-pretty font-extrabold text-white md:mb-4 lg:mb-5 ${landingHeroTitle}`}
              >
                Find the perfect path <br className="hidden md:block" /> for your future.
              </h1>

              <p
                className={`mb-0 max-w-lg font-normal text-purple-100/90 md:mb-8 md:max-w-xl lg:mb-8 ${landingHeroBody}`}
              >
                Take a free 10-minute personality assessment to discover the college courses and
                scholarships in the Philippines that match your true strengths.
              </p>

              <button
                type="button"
                onClick={onStart}
                className={`landing-hero-cta mt-1 flex items-center gap-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:mt-0 ${landingHeroCta}`}
              >
                Start Assessment
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-[1.125rem] md:w-[1.125rem]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="landing-hero-character-col relative mt-auto flex w-full min-h-[11rem] flex-1 items-end justify-center md:col-span-1 md:mt-0 md:h-full md:min-h-0 lg:col-span-5">
              <div className="landing-hero-character-anchor" aria-hidden="true">
                <div className="landing-hero-character-scale">
                  <img
                    src={heroCharacterCutout}
                    alt="Student thinking about career choices"
                    className="landing-hero-character-img"
                    width={1024}
                    height={1365}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
