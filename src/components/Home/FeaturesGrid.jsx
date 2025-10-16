import {
  AcademicCapIcon,
  DocumentTextIcon,
  ClockIcon,
  GiftIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    title: 'Scientifically Validated',
    description: "Built on Dr. John Holland's proven RIASEC theory trusted by counselors around the world.",
    Icon: AcademicCapIcon
  },
  {
    title: 'Comprehensive Results',
    description: 'Receive a detailed report with your dominant interest types, strengths, and focus areas.',
    Icon: DocumentTextIcon
  },
  {
    title: 'Quick & Easy',
    description: 'Finish the full experience in about ten minutes with clear, scenario-based questions.',
    Icon: ClockIcon
  },
  {
    title: 'Free Forever',
    description: 'No hidden fees, no credit card required, and no paywall for your personalized results.',
    Icon: GiftIcon
  },
  {
    title: 'Privacy Focused',
    description: 'Your answers stay private—there is no tracking, selling, or saving of personal data.',
    Icon: ShieldCheckIcon
  },
  {
    title: 'Instant Access',
    description: 'See your RIASEC profile immediately after finishing and start exploring careers right away.',
    Icon: BoltIcon
  }
]

const FeaturesGrid = () => {
  return (
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl">
          <h2 id="features-heading" className="text-balance text-3xl font-bold text-neutral-900 sm:text-4xl">
            Trusted Assessment Platform
          </h2>
          <p className="mt-3 text-base text-neutral-600 sm:text-lg">
            KursoKo gives you the clarity and confidence to make smart decisions about your future with a modern, student-friendly experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => {
            const { title, description, Icon } = item
            const useAlternate = index % 2 === 1
            const surfaceStyle = useAlternate
              ? { background: 'rgba(245, 243, 255, 0.8)', borderColor: 'rgba(139, 92, 246, 0.2)' }
              : { background: 'rgba(239, 246, 255, 0.8)', borderColor: 'rgba(37, 99, 235, 0.2)' }

            return (
              <article
                key={title}
                className="feature-card flex h-full flex-col gap-4 rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                style={surfaceStyle}
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white"
                  style={{ color: useAlternate ? 'var(--color-accent-500)' : 'var(--color-primary-600)' }}
                >
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600">{description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesGrid
