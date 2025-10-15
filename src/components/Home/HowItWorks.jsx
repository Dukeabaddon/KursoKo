const Step = ({ num, title, desc }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--color-accent-yellow-300)] to-[var(--color-accent-pink-200)] font-bold">
      {num}
    </div>
    <h3 className="mt-3 font-semibold">{title}</h3>
    <p className="text-sm text-slate-600 mt-1">{desc}</p>
  </div>
)

const HowItWorks = () => (
  <section id="how" aria-labelledby="how-heading">
    <h2 id="how-heading" className="text-2xl sm:text-3xl font-bold mb-6">How does KursoKo work?</h2>
    <div className="grid sm:grid-cols-3 gap-6">
      <Step num={1} title="Answer 60 questions" desc="~15 minutes—relax and take your time." />
      <Step num={2} title="We calculate your profile" desc="Automated scoring of your personality." />
      <Step num={3} title="See your results" desc="Instant results and suggested career paths." />
    </div>
  </section>
)

export default HowItWorks
