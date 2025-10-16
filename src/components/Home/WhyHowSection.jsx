import {
  MagnifyingGlassIcon,
  SparklesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CpuChipIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

const valueProps = [
  {
    title: 'Know Your Strengths',
    description: 'Understand your natural interests with research-backed insights into how you learn and work best.',
    Icon: MagnifyingGlassIcon
  },
  {
    title: 'Discover Ideal Careers',
    description: 'See which careers align with your personality and goals so you can explore paths that fit.',
    Icon: SparklesIcon
  },
  {
    title: 'Make Informed Choices',
    description: 'Use data to make confident decisions about subjects to take, courses to pursue, and jobs to consider.',
    Icon: ChartBarIcon
  }
]

const steps = [
  {
    title: 'Answer Questions',
    description: 'Respond to thirty scenario-based prompts that compare real-world interests.',
    Icon: CheckCircleIcon
  },
  {
    title: 'Assess Your Profile',
    description: 'We score your answers using Holland’s RIASEC framework to highlight dominant traits.',
    Icon: CpuChipIcon
  },
  {
    title: 'Discover Your Type',
    description: 'Get a personalized RIASEC code with guidance on what it means for your strengths.',
    Icon: LightBulbIcon
  },
  {
    title: 'Explore Career Paths',
    description: 'Review tailored career and education suggestions you can act on today.',
    Icon: RocketLaunchIcon
  }
]

const WhyHowSection = () => {
  return (
    <section id="why-how" aria-labelledby="why-how-heading" className="scroll-mt-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6 md:px-8">
        <div>
          <h2 id="why-how-heading" className="text-balance text-3xl font-bold text-neutral-900 sm:text-4xl">
            Why Take the RIASEC Assessment?
          </h2>
          <p className="mt-3 max-w-2xl text-base text-neutral-600 sm:text-lg">
            KursoKo helps you understand where your interests naturally lead, so you can plan the next steps in your education and career.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {valueProps.map((item) => {
              const { title, description, Icon } = item
              return (
                <article
                  key={title}
                  className="value-card group rounded-2xl border border-neutral-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-neutral-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
                </article>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">How It Works</h3>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600 sm:text-base">
            A streamlined four-step journey that moves you from curiosity to clarity without extra sign-ups or distractions.
          </p>

          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {steps.map((item, index) => {
              const { title, description, Icon } = item
              return (
                <li
                  key={title}
                  className="group relative flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white/90 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-primary-600">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-primary-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      Step {index + 1}
                    </div>
                    <h4 className="mt-2 text-lg font-semibold text-neutral-900">{title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <span
                      className="pointer-events-none absolute inset-y-6 -right-3 hidden w-px bg-gradient-to-b from-primary-200 via-transparent to-primary-200 md:block"
                      aria-hidden="true"
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default WhyHowSection
