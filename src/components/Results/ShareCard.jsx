import { getCharacterImage } from '../../utils/characterAssets'

function ShareCard({ archetype, topCareer, cardRef }) {
  const characterSrc = getCharacterImage(archetype.id)

  return (
    <div
      ref={cardRef}
      className="share-card-export w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 text-white shadow-2xl"
      aria-hidden="true"
    >
      <div className="px-6 py-5 border-b border-neutral-800">
        <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold">KursoKo</p>
        {characterSrc ? (
          <img
            src={characterSrc}
            alt=""
            className="mx-auto mt-3 h-48 w-48 object-contain"
          />
        ) : null}
        <h3 className="font-display text-2xl font-bold mt-3">{archetype.name}</h3>
        <p className="text-sm text-neutral-300 mt-1">{archetype.tagline}</p>
      </div>
      <div className="px-6 py-5 space-y-3">
        {topCareer && (
          <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4">
            <p className="text-xs uppercase tracking-wider text-neutral-400">Top career match</p>
            <p className="font-display text-lg font-semibold mt-1">{topCareer.title}</p>
            <p className="text-amber-400 text-2xl font-bold mt-1">{topCareer.matchPercent}%</p>
          </div>
        )}
        <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">{archetype.summary}</p>
      </div>
      <div className="px-6 py-3 bg-neutral-900 text-[10px] text-neutral-500 text-center">
        kursoko · career guidance for Filipino students
      </div>
    </div>
  )
}

export default ShareCard
