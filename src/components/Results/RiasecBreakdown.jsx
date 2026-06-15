import { useEffect, useState } from 'react'
import { ChartLine, Info } from 'lucide-react'
import { RIASEC_BAR_COLORS, RIASEC_MAX_POINTS, getBarPercent } from '../../utils/riasecDisplay'
import { resultsMeta, resultsSectionTitle, resultsSurface } from './resultsClasses'

const ORDER = ['R', 'I', 'A', 'S', 'E', 'C']

const RiasecBreakdown = ({ allDimensions, combination, primaryName, secondaryName }) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setAnimate(true))
    return () => window.cancelAnimationFrame(id)
  }, [combination])

  const byCode = Object.fromEntries(allDimensions.map((d) => [d.code, d]))

  return (
    <section className={`${resultsSurface} h-full`} aria-labelledby="riasec-heading">
      <div className="mb-4 flex items-start gap-2">
        <ChartLine className="mt-0.5 h-5 w-5 shrink-0 text-landing-accent" aria-hidden="true" />
        <div>
          <h2 id="riasec-heading" className={resultsSectionTitle}>
            RIASEC scores
          </h2>
          <p className="mt-1 text-sm text-landing-muted normal-case">
            How your answers spread across six interest areas
          </p>
        </div>
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

      <div className="results-surface-muted mt-5 flex gap-2 p-3 text-sm leading-relaxed text-landing-muted normal-case">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-landing-accent" aria-hidden="true" />
        <p>
          Your top combo is <strong className="text-landing-ink">{combination}</strong> ({primaryName} +{' '}
          {secondaryName}). Course and university picks below use this pattern.
        </p>
      </div>
    </section>
  )
}

export default RiasecBreakdown
