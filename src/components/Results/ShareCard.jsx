import { getCharacterImage } from '../../utils/characterAssets'
import { getFitTierLabel } from '../../utils/matchScoring'
import { SITE_URL } from '../../config/site.js'
import CharacterCardFrame from './CharacterCardFrame'

const CARD = {
  paper: '#FDFCF8',
  ink: '#262626',
  accent: '#4B2C7F',
  muted: '#64748B',
  gold: '#FBC64D',
  border: 'rgba(75, 44, 127, 0.2)',
}

function ShareCard({ archetype, topCareer, combination, className = '' }) {
  const characterSrc = getCharacterImage(archetype.id)
  const shareHost = new URL(SITE_URL).host.replace(/^www\./, '')

  return (
    <div
      className={`share-card-export mx-auto rounded-2xl border ${className}`.trim()}
      style={{
        width: 360,
        boxSizing: 'border-box',
        backgroundColor: CARD.paper,
        color: CARD.ink,
        borderColor: CARD.border,
      }}
      aria-hidden={className.includes('share-card-export--preview') ? undefined : 'true'}
    >
      <div
        className="share-card-export__hero px-6 pb-5 pt-6"
        style={{ borderBottom: `1px solid ${CARD.border}` }}
      >
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

      {topCareer ? (
        <div className="share-card-export__match px-6 py-4" style={{ backgroundColor: CARD.accent }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Top career fit
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            {topCareer.title}
          </p>
          <p className="mt-1 text-2xl font-bold" style={{ color: CARD.gold }}>
            {getFitTierLabel(0)}
          </p>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-white/20"
            role="progressbar"
            aria-valuenow={topCareer.matchPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${topCareer.title} alignment`}
          >
            <div
              className="h-full rounded-full bg-[#FBC64D]"
              style={{ width: `${topCareer.matchPercent}%` }}
            />
          </div>
        </div>
      ) : null}

      <p
        className="share-card-export__summary line-clamp-3 px-6 py-4 text-xs leading-relaxed"
        style={{ color: CARD.muted }}
      >
        {archetype.summary}
      </p>

      <div
        className="share-card-export__footer px-6 py-3 text-center text-[10px] font-bold"
        style={{ backgroundColor: CARD.accent, color: 'rgba(255,255,255,0.92)' }}
      >
        {shareHost} · career guidance for Filipino students
      </div>
    </div>
  )
}

export default ShareCard
