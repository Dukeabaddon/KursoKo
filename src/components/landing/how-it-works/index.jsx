/**
 * #how — Three simple steps
 * Exports: HowItWorks
 * Data: STEPS (3-step flow)
 */
import stepQuiz from '../../../assets/landing/placeholders/steps/step-1.webp'
import stepProfile from '../../../assets/landing/placeholders/steps/step-2.webp'
import stepPath from '../../../assets/landing/placeholders/steps/step-3.webp'
import './index.css'

const STEPS = [
  {
    title: 'Answer honestly',
    description:
      'Thirty scenario questions — pick what feels more like you. No right or wrong answers, just your natural interests.',
    src: stepQuiz,
    alt: 'Clipboard with checklist and checkmarks',
  },
  {
    title: 'See your profile',
    description:
      'We score your responses with Holland’s RIASEC model so you can see which interest types are strongest for you.',
    src: stepProfile,
    alt: 'RIASEC profile bars with cursor pointing at results',
  },
  {
    title: 'Explore what fits',
    description:
      'Get course and career ideas matched to your profile — whether you’re in school, college, or reconsidering your path.',
    src: stepPath,
    alt: 'Path with book, graduation cap, and briefcase milestones',
  },
]

export function HowItWorks({ onStart }) {
  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="scroll-mt-24 px-[clamp(1rem,4vw,2rem)] py-[clamp(3rem,8vw,5rem)]"
    >
      <div className="mx-auto max-w-6xl" data-landing-inner>
        <header className="mb-[clamp(2rem,5vw,3rem)] max-w-[40rem]">
          <p className="mb-2 text-[0.8125rem] font-bold uppercase tracking-[0.08em] text-landing-accent">
            How it works
          </p>
          <h2
            id="how-heading"
            className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-[1.15] text-landing-ink text-balance"
          >
            Three simple steps
          </h2>
          <p className="mt-3 max-w-xl text-[clamp(1rem,2vw,1.125rem)] leading-relaxed text-landing-muted">
            Discover which interests are strongest for you, then explore courses and careers that
            align — whether you’re choosing a track, a major, or your next move.
          </p>
        </header>

        <ol className="grid gap-6 md:grid-cols-3 md:items-stretch md:gap-5">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="landing-step-card relative flex h-full flex-col rounded-3xl border-2 border-landing-chapter bg-white shadow-[0_8px_24px_rgba(75,44,127,0.08)]"
            >
              <div className="p-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-landing-chapter bg-landing-paper">
                  <span className="absolute left-2.5 top-2.5 z-[1] rounded-lg border-[1.5px] border-landing-chapter bg-landing-paper px-[0.45rem] py-[0.2rem] font-display text-[0.6875rem] font-extrabold tracking-[0.08em] text-landing-lavender">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <img
                    src={step.src}
                    alt={step.alt}
                    className="block h-full w-full object-contain"
                    width={320}
                    height={240}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col px-5 pb-6">
                <h3 className="m-0 font-display text-lg font-bold text-landing-ink text-balance">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-[1.55] text-landing-muted text-balance">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <button type="button" onClick={onStart} className="landing-btn-primary">
            Start assessment
          </button>
        </div>
      </div>
    </section>
  )
}
