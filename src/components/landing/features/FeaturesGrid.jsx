import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  GiftIcon,
  ShieldCheckIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'
import LandingBlobs from '../LandingBlobs'

/** RIASEC accent per feature — flat outline icons, no icon container box */
const features = [
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

const FeaturesGrid = () => (
  <section
    id="features"
    aria-labelledby="features-heading"
    className="landing-section landing-section--features landing-section--blobs scroll-mt-24"
  >
    <LandingBlobs variant="teal-yellow" />
    <div className="landing-section__inner landing-features-panel">
      <div className="landing-section__header landing-features-panel__header">
        <p className="landing-eyebrow landing-features-panel__eyebrow">Why KursoKo</p>
        <h2 id="features-heading" className="landing-heading landing-features-panel__heading">
          Clarity for any career crossroads
        </h2>
        <p className="landing-lead landing-features-panel__lead">
          For students picking a track, graduates choosing a major, or anyone who wants to know
          which interests run strongest — not another generic personality quiz.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        {features.map(({ title, description, Icon, iconColor }) => (
          <article key={title} className="landing-feature-card flex h-full flex-col gap-3">
            <Icon
              className="landing-feature-icon"
              style={{ color: iconColor }}
              aria-hidden="true"
            />
            <h3 className="text-lg font-bold text-[var(--color-landing-ink)]">{title}</h3>
            <p className="text-sm leading-relaxed text-[var(--color-landing-muted)]">{description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
)

export { FeaturesGrid }
