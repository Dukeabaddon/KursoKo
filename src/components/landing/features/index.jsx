/**
 * #features — Why KursoKo
 * Exports: FeaturesSection
 * Data: FEATURES (6 trust cards)
 */
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  GiftIcon,
  ShieldCheckIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'

const FEATURES = [
  {
    title: 'Scientifically grounded',
    description:
      "Built on Dr. John Holland's RIASEC theory — the same interest model used in career counseling worldwide.",
    Icon: AcademicCapIcon,
    iconColor: '#6E4FB8',
  },
  {
    title: 'Clear results',
    description:
      'See your dominant interest types, strengths, and focused areas — not vague personality labels.',
    Icon: ChartBarIcon,
    iconColor: '#81D4FA',
  },
  {
    title: 'Quick & focused',
    description: 'About ten minutes. Scenario-based questions that feel relevant, not like a long survey.',
    Icon: ClockIcon,
    iconColor: '#4DB6AC',
  },
  {
    title: 'Free to use',
    description: 'No credit card, no upsell, no paywall on your personalized results.',
    Icon: GiftIcon,
    iconColor: '#9575CD',
  },
  {
    title: 'Privacy first',
    description: 'Your answers are not saved on our servers — you stay in control of your data.',
    Icon: ShieldCheckIcon,
    iconColor: '#4DB6AC',
  },
  {
    title: 'Instant access',
    description: 'Finish the assessment and view your RIASEC profile immediately.',
    Icon: BoltIcon,
    iconColor: '#FF8A65',
  },
]

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="scroll-mt-24 px-4 py-12 sm:px-6 md:py-20"
    >
      <div className="overflow-hidden rounded-features bg-landing-accent-deep py-10 md:py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:gap-10 sm:px-6 md:gap-12">
          <header className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Why KursoKo</p>
            <h2
              id="features-heading"
              className="mt-2 font-display text-3xl font-extrabold leading-tight text-white text-balance md:text-4xl"
            >
              Clarity for any career crossroads
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white">
              For students picking a track, graduates choosing a major, or anyone who wants to know
              which interests run strongest — not another generic personality quiz.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {FEATURES.map(({ title, description, Icon, iconColor }) => (
              <article
                key={title}
                className="flex h-full flex-col gap-3 rounded-[1.25rem] border-2 border-landing-chapter bg-white/90 p-6 transition-colors duration-200 ease-landing"
              >
                <Icon
                  className="h-7 w-7 shrink-0 stroke-[2.5]"
                  style={{ color: iconColor }}
                  aria-hidden="true"
                />
                <h3 className="text-lg font-bold text-landing-ink">{title}</h3>
                <p className="text-sm leading-relaxed text-landing-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
