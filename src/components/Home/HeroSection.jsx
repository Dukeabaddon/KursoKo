import { CheckCircleIcon } from '@heroicons/react/24/solid'

const trustPoints = [
  '10 minutes',
  '30 questions',
  'Instant results',
  'Scientifically validated'
]

const HeroSection = ({ onStart }) => {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-primary-200/50 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-accent-100/60 blur-3xl" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_60%)]" aria-hidden="true" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-20 sm:px-6 sm:py-24 md:flex-row md:items-center md:justify-between md:gap-16 md:px-8 md:py-28">
        <div className="max-w-2xl text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-primary-700 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary-600" />
            Discover your ideal career path
          </span>
          <h1 id="hero-heading" className="mt-6 text-balance text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
            Find Your Perfect Career Path
          </h1>
          <p className="mt-4 text-lg text-neutral-700 sm:text-xl">
            Discover your strengths and ideal careers with our free RIASEC assessment. Get personalized insights in just ten minutes.
          </p>
          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-start">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-semibold text-white shadow-xl transition will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 hover:shadow-2xl active:translate-y-[1px]"
              style={{ background: 'var(--gradient-cta)' }}
              aria-label="Start the KursoKo RIASEC assessment"
            >
              Start Assessment
            </button>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-neutral-700 sm:justify-start">
              {trustPoints.map((item) => (
                <div key={item} className="inline-flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-success-500" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-sm text-neutral-600">
            Your responses stay private. Learn more in{' '}
            <a
              href="documentation/SECURITY.md"
              className="font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline"
            >
              Privacy &amp; data use
            </a>
            .
          </p>
        </div>

        <div className="relative mx-auto max-w-lg rounded-3xl border border-white/40 bg-white/80 p-8 shadow-xl backdrop-blur-md md:mx-0">
          <div className="absolute -top-6 -right-4 h-16 w-16 rounded-full bg-success-50" aria-hidden="true" />
          <div className="absolute -bottom-8 -left-6 h-24 w-24 rounded-full bg-primary-100/70" aria-hidden="true" />
          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-600">
              RIASEC Snapshot
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900">Career clarity in minutes</h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              Answer scenario-based questions, receive a personalized RIASEC profile, and explore careers that match your strengths. No accounts, no fees—just insights.
            </p>
            <ul className="grid grid-cols-1 gap-3 text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-success-500" aria-hidden="true" />
                Personalized Holland Code profile
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-success-500" aria-hidden="true" />
                Career pathways aligned with your interests
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-success-500" aria-hidden="true" />
                Guidance for education planning
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
