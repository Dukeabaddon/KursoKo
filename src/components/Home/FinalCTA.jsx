const FinalCTA = ({ onStart }) => {
  return (
    <section aria-labelledby="final-cta-heading" className="mb-20">
      <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-br from-[var(--color-pastel-blue,#A8D8EA)] via-[var(--color-pastel-purple,#D4A5F3)] to-[var(--color-pastel-pink,#FFD3E1)]">
        <h2 id="final-cta-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to explore your career path?
        </h2>
        <p className="mt-2 text-slate-800">
          Get clear, easy-to-read results right after the assessment.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onStart}
            className="px-6 py-3 rounded-full text-slate-900 font-semibold bg-white/90 hover:bg-white shadow-lg transition active:scale-95"
            aria-label="Start Assessment"
          >
            Start Assessment →
          </button>
          <ul className="text-sm text-slate-800 grid sm:grid-cols-3 gap-x-6 gap-y-1">
            <li>✓ ~15 minutes</li>
            <li>✓ Instant results</li>
            <li>✓ Clear, easy-to-read results</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
