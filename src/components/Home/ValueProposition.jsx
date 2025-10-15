const Feature = ({ number, title, description }) => (
  <div className="flex gap-4 items-start">
    <div className="shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
      {number}
    </div>
    <div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
)

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl font-extrabold text-slate-900">{value}</div>
    <div className="text-xs text-slate-600 mt-1">{label}</div>
  </div>
)

const ValueProposition = () => {
  return (
    <section aria-labelledby="value-prop-heading" className="relative">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Features */}
        <div>
          <h2 id="value-prop-heading" className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
            Why try KursoKo?
          </h2>
          <p className="text-slate-600 mb-8">
            A thoughtful, research-backed assessment designed to help you understand your unique strengths and interests.
          </p>
          <div className="space-y-6">
            <Feature
              number="1"
              title="Discover your authentic self"
              description="Identify your core interests, natural strengths, and what truly motivates you—beyond test scores and stereotypes."
            />
            <Feature
              number="2"
              title="Explore aligned career paths"
              description="See curated career suggestions based on proven personality frameworks used by career counselors worldwide."
            />
            <Feature
              number="3"
              title="Make confident decisions"
              description="Get clear, actionable insights in minutes—no guesswork, no sales pitch, just honest guidance."
            />
          </div>
        </div>

        {/* Right: Stats & Visual */}
        <div className="relative">
          <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <Stat value="60" label="Questions" />
              <Stat value="~15" label="Minutes" />
              <Stat value="6" label="Types" />
            </div>
            <div className="h-px bg-slate-200 mb-6"></div>
            <blockquote className="text-sm text-slate-700 italic">
              "Understanding my RIASEC type helped me choose a major I'm actually excited about—not just what my parents expected."
            </blockquote>
            <p className="text-xs text-slate-500 mt-2">— High school student, Manila</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ValueProposition
