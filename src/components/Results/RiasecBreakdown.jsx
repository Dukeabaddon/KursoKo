import { useEffect, useState } from 'react'
import { RIASEC_BAR_COLORS, RIASEC_MAX_POINTS, getBarPercent } from '../../utils/riasecDisplay'
import { resultsMeta, resultsSurface } from './resultsClasses'

const ORDER = ['R', 'I', 'A', 'S', 'E', 'C']

const RiasecBreakdown = ({ allDimensions, combination, primaryName, secondaryName }) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setAnimate(true))
    return () => window.cancelAnimationFrame(id)
  }, [combination])

  const byCode = Object.fromEntries(allDimensions.map((d) => [d.code, d]))

  return (
    <section className={`${resultsSurface} results-riasec-panel h-full`} aria-labelledby="riasec-heading">
      <div className="mb-4">
        <h2 id="riasec-heading" className="text-lg font-bold text-landing-ink">
          RIASEC scores
        </h2>
        <p className="mt-1 text-sm text-landing-muted normal-case">
          How your answers spread across six interest areas
        </p>
      </div>

      <ul className="space-y-3">
        {ORDER.map((code) => {
          const dim = byCode[code]
          if (!dim) return null
          const width = animate ? getBarPercent(dim.score) : 0
          return (
            <li key={code}>
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-landing-ink">
                  <span className="mr-1.5 text-landing-muted">{code}</span>
                  {dim.info?.name}
                </span>
                <span className="shrink-0 text-xs tabular-nums text-landing-muted">
                  {dim.score} / {RIASEC_MAX_POINTS} pts
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-landing-ink/10">
                <div
                  className="results-riasec-bar-fill h-full rounded-full"
                  style={{
                    width: `${width}%`,
                    backgroundColor: RIASEC_BAR_COLORS[code],
                  }}
                  role="progressbar"
                  aria-valuenow={dim.score}
                  aria-valuemin={0}
                  aria-valuemax={RIASEC_MAX_POINTS}
                  aria-label={`${dim.info?.name} score`}
                />
              </div>
            </li>
          )
        })}
      </ul>

      <div className="results-riasec-summary mt-5 rounded-xl border border-landing-accent/15 bg-gradient-to-br from-landing-accent/5 to-white p-4 text-sm leading-relaxed text-landing-ink normal-case">
        <p className={`mb-1 ${resultsMeta} text-landing-accent`}>Your pattern</p>
        <p>
          Top combo: <strong>{combination}</strong> ({primaryName} + {secondaryName}). Schools and scholarships below follow this mix.
        </p>
      </div>
    </section>
  )
}

export default RiasecBreakdown
