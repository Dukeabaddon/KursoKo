import { useState } from 'react'

const PrivacyModal = ({ open, onClose }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true" aria-label="Privacy and data use">
      <div className="bg-white rounded-xl max-w-lg w-[90%] p-6 shadow-xl">
        <h3 className="text-lg font-bold">Privacy & data use</h3>
        <p className="mt-2 text-sm text-slate-700">
          Your responses are processed locally in this session to calculate your results. We don’t sell data or use external analytics here. For details, see the project SECURITY.md in the repository.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="px-4 py-2 rounded-md bg-slate-900 text-white" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

const HeroSection = ({ onStart }) => {
  const [open, setOpen] = useState(false)
  return (
  <section id="hero" aria-labelledby="hero-heading" className="pt-16 sm:pt-20 md:pt-28">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            What career fits you best?
          </h1>
          <p className="mt-4 text-slate-600 text-lg">
            Discover your personality type and explore matching career paths with a friendly, student-focused assessment.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={onStart}
              className="px-6 py-3 rounded-full font-semibold bg-slate-900 text-white hover:bg-slate-800 transition active:scale-95"
              aria-label="Start Assessment"
            >
              Start Assessment
            </button>
            <div className="text-sm text-slate-600">
              <div>⏱️ ~15 minutes</div>
              <div>⚡ Instant results</div>
            </div>
          </div>
          <div className="mt-3">
            <button onClick={() => setOpen(true)} className="text-sm underline text-slate-500 hover:text-slate-700">Privacy & data use</button>
          </div>
        </div>
        <div aria-hidden="true" className="relative">
          <img
            src="https://images.unsplash.com/photo-1552960562-daf630e9278b?q=80&w=1600&auto=format&fit=crop"
            alt="Students collaborating with laptops and notebooks"
            className="aspect-[4/3] object-cover rounded-2xl shadow-lg"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
      <PrivacyModal open={open} onClose={() => setOpen(false)} />
    </section>
  )
}

export default HeroSection
