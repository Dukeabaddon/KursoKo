import { CircleCheck } from 'lucide-react'
import { getCharacterImage } from '../../utils/characterAssets'
import { resultsMeta } from './resultsClasses'

const ResultHero = ({ archetype, primaryCode, shsStrands, heroEnter }) => {
  const characterSrc = getCharacterImage(archetype.id)

  return (
    <section
      className={`flex w-full min-w-0 flex-col items-center text-center lg:items-start lg:text-left ${heroEnter ? 'results-hero-enter' : ''}`}
    >
      <div className="results-hero-item relative mx-auto mb-4 h-[200px] w-[200px] shrink-0 sm:h-[260px] sm:w-[260px]">
        {characterSrc ? (
          <img
            src={characterSrc}
            alt=""
            className="h-full w-full object-contain object-center"
          />
        ) : (
          <div
            className="h-full w-full rounded-2xl border border-neutral-300 bg-neutral-200"
            role="img"
            aria-label={`${archetype.name} portrait placeholder`}
          />
        )}
        <span
          className="absolute bottom-3 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-landing-accent text-sm font-bold text-white shadow-sm"
          aria-label={`Primary type ${primaryCode}`}
        >
          {primaryCode}
        </span>
      </div>

      <h1 className="results-hero-item w-full font-[family-name:var(--font-display)] text-3xl font-extrabold text-landing-accent sm:text-4xl">
        {archetype.name}
      </h1>

      <p className={`results-hero-item mt-2 w-full ${resultsMeta}`}>{archetype.tagline}</p>

      <p className="results-hero-item mt-4 w-full text-sm leading-relaxed text-landing-ink normal-case sm:text-base">
        {archetype.summary}
      </p>

      <div className="results-hero-item mt-5 w-full min-w-0">
        <p className={`mb-2 ${resultsMeta}`}>Your traits</p>
        <ul className="flex flex-wrap justify-center gap-2 lg:justify-start">
          {archetype.strengths.map((trait) => (
            <li key={trait}>
              <span className="results-trait-pill inline-flex items-center rounded-full bg-[rgba(149,117,205,0.14)] px-3 py-1.5 text-xs font-medium text-landing-accent">
                {trait}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="results-hero-item mt-5 w-full min-w-0">
        <div className="results-surface-muted p-4 text-left">
          <p className={`mb-2 ${resultsMeta}`}>Suggested SHS strands</p>
          <ul className="space-y-2">
            {shsStrands.map((strand) => (
              <li key={strand} className="flex items-start gap-2 text-sm text-landing-ink">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>{strand}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default ResultHero
