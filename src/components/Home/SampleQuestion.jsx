import questionsData from '../../data/questions.json'

const Option = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-lg border transition ${
      selected ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:bg-slate-50'
    }`}
    aria-pressed={selected}
  >
    {label}
  </button>
)

import { useState } from 'react'

const SampleQuestion = ({ onStart }) => {
  const first = questionsData?.questions?.[0]
  const [selected, setSelected] = useState(null)

  if (!first) return null

  return (
    <section aria-labelledby="sample-heading">
      <h2 id="sample-heading" className="text-2xl sm:text-3xl font-bold mb-4">
        Try a sample question:
      </h2>
      <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-sm">
        <p className="mb-4 text-slate-800 font-medium">{first.text}</p>
        <div className="grid gap-3">
          <Option label={`😊 ${first.optionA.text}`} selected={selected === 'A'} onClick={() => setSelected('A')} />
          <Option label={`🤩 ${first.optionB.text}`} selected={selected === 'B'} onClick={() => setSelected('B')} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onStart}
            className="px-5 py-2 rounded-full font-semibold bg-slate-900 text-white hover:bg-slate-800 transition active:scale-95"
            aria-label="Start the full assessment"
          >
            Start the full assessment →
          </button>
          <span className="text-sm text-slate-600">Your answer here is just a demo and won’t be saved.</span>
        </div>
      </div>
    </section>
  )
}

export default SampleQuestion
