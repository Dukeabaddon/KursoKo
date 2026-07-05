import { getCharacterImage } from '../../utils/characterAssets'
import CharacterCardFrame from './CharacterCardFrame'

const CARD = {
  paper: '#FDFCF8',
  ink: '#262626',
  accent: '#4B2C7F',
  muted: '#64748B',
  gold: '#FBC64D',
  border: 'rgba(75, 44, 127, 0.2)',
}

function ShareCard({ archetype, topCareer, combination, cardRef, className = '' }) {
  const characterSrc = getCharacterImage(archetype.id)

  return (
    <div
      ref={cardRef}
      className={`share-card-export mx-auto overflow-hidden rounded-2xl border shadow-2xl ${className}`.trim()}
      style={{
        width: 360,
        backgroundColor: CARD.paper,
        color: CARD.ink,
        borderColor: CARD.border,
      }}
      aria-hidden={className.includes('share-card-export--preview') ? undefined : 'true'}
    >
      <div className="px-6 py-5" style={{ borderBottom: `1px solid ${CARD.border}` }}>
        {characterSrc ? (
          <CharacterCardFrame src={characterSrc} className="mx-auto h-48 w-48" />
        ) : null}

        <h3
          className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold"
          style={{ color: CARD.accent }}
        >
          {archetype.name}
        </h3>

        {combination ? (
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: CARD.muted }}>
            RIASEC {combination}
          </p>
        ) : null}

        <p className="mt-1 text-sm" style={{ color: CARD.muted }}>
          {archetype.tagline}
        </p>
      </div>

      <div className="space-y-3 px-6 py-5">
        {topCareer ? (
          <div className="rounded-xl p-4" style={{ backgroundColor: CARD.accent }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Top career match
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-white">
              {topCareer.title}
            </p>
            <p className="mt-1 text-2xl font-bold" style={{ color: CARD.gold }}>
              {topCareer.matchPercent}%
            </p>
          </div>
        ) : null}

        <p className="line-clamp-3 text-xs leading-relaxed" style={{ color: CARD.muted }}>
          {archetype.summary}
        </p>
      </div>

      <div
        className="px-6 py-3 text-center text-[10px] font-bold"
        style={{ backgroundColor: CARD.accent, color: 'rgba(255,255,255,0.92)' }}
      >
        kursoko.me · career guidance for Filipino students
      </div>
    </div>
  )
}

export default ShareCard
