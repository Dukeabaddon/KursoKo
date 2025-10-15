const types = [
  { code: 'R', name: 'THE DOER', color: '#B8E6D5', desc: 'Hands-on, practical, builder' },
  { code: 'I', name: 'THE THINKER', color: '#A8D8EA', desc: 'Curious, analytical, explorer' },
  { code: 'A', name: 'THE CREATOR', color: '#D4A5F3', desc: 'Imaginative, artistic, designer' },
  { code: 'S', name: 'THE HELPER', color: '#FFD3E1', desc: 'Supportive, caring, teacher' },
  { code: 'E', name: 'THE LEADER', color: '#FFCBA4', desc: 'Persuasive, ambitious, driver' },
  { code: 'C', name: 'THE ORGANIZER', color: '#FFF4A3', desc: 'Detail-oriented, reliable, planner' },
]

const TypeCard = ({ t }) => (
  <div
    role="button"
    tabIndex={0}
    className="relative rounded-xl p-4 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
    aria-label={`${t.name}, ${t.desc}`}
  >
    <div className="h-2 w-full rounded-full mb-3" style={{ backgroundColor: t.color }} />
    <div className="flex items-center gap-3">
      <img
        src={`https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop`}
        alt=""
        className="w-10 h-10 rounded-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div>
        <div className="text-xs text-slate-500">{t.code}</div>
        <h3 className="font-semibold leading-tight">{t.name}</h3>
      </div>
    </div>
    <p className="text-sm text-slate-600 mt-2">{t.desc}</p>
    <div className="text-xs text-slate-500 mt-3">Hover to see careers →</div>
  </div>
)

const RIASECIntro = () => {
  return (
    <section aria-labelledby="riasec-heading">
  <h2 id="riasec-heading" className="text-2xl sm:text-3xl font-bold mb-6">What is your personality type?</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {types.map((t) => (
          <TypeCard key={t.code} t={t} />
        ))}
      </div>
    </section>
  )
}

export default RIASECIntro
