import {
  AcademicCapIcon,
  DocumentTextIcon,
  ClockIcon,
  GiftIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import LandingBlobs from '../LandingBlobs'

const features = [
  {
    title: 'Scientifically grounded',
    description:
      "Built on Dr. John Holland's RIASEC theory — the same interest model used in career counseling worldwide.",
    Icon: AcademicCapIcon
  },
  {
    title: 'Clear results',
    description:
      'See your dominant interest types, strengths, and focused areas — not vague personality labels.',
    Icon: DocumentTextIcon
  },
  {
    title: 'Quick & focused',
    description: 'About ten minutes. Scenario-based questions that feel relevant, not like a long survey.',
    Icon: ClockIcon
  },
  {
    title: 'Free to use',
    description: 'No credit card, no upsell, no paywall on your personalized results.',
    Icon: GiftIcon
  },
  {
    title: 'Privacy first',
    description: 'Your answers are not saved on our servers — you stay in control of your data.',
    Icon: ShieldCheckIcon
  },
  {
    title: 'Instant access',
    description: 'Finish the assessment and view your RIASEC profile immediately.',
    Icon: BoltIcon
  }
]

const FeaturesGrid = () => (
  <section
    id="features"
    aria-labelledby="features-heading"
    className="landing-section landing-section--features landing-section--blobs scroll-mt-20"
  >
    <LandingBlobs variant="teal-yellow" />
    <div className="landing-section__inner">
      <div className="landing-section__header">
        <p className="landing-eyebrow">Why KursoKo</p>
        <h2 id="features-heading" className="landing-heading">
          Clarity for any career crossroads
        </h2>
        <p className="landing-lead">
          For students picking a track, graduates choosing a major, or anyone who wants to know
          which interests run strongest — not another generic personality quiz.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        {features.map((item) => {
          const { title, description, Icon } = item
          return (
            <article key={title} className="landing-feature-card flex h-full flex-col gap-3">
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: 'rgba(149, 117, 205, 0.2)', color: 'var(--color-landing-accent)' }}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-landing-ink)]">{title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-landing-muted)]">{description}</p>
            </article>
          )
        })}
      </div>
    </div>
  </section>
)

export { FeaturesGrid }
