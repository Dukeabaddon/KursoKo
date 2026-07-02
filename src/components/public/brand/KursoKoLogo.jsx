/**
 * KursoKo mark — rounded stroke "K" (teal / yellow / purple).
 * Layer order: teal stem → yellow arm → purple arm (front).
 */
const OUTLINE = '#262626'
const TEAL = '#2CB1B1'
const YELLOW = '#FBC64D'
const PURPLE = '#9461BE'
const STROKE_OUTER = 106
const STROKE_INNER = 90

/** Yellow peels up from stem — start near purple junction so less shows underneath */
const YELLOW_ARM = 'M 120 298 C 158 242, 228 172, 310 140'

/** Padded so round stroke caps are not clipped at nav size */
const VIEW_BOX = '25 15 380 545'
const VIEW_ASPECT = 545 / 380

const KursoKoLogo = ({ className = '', iconSize = 26, showWordmark = true }) => {
  /** iconSize = rendered height of the K mark (px) */
  const iconHeight = iconSize
  const iconWidth = Math.round(iconSize / VIEW_ASPECT)

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      aria-label={showWordmark ? 'KursoKo' : undefined}
    >
      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox={VIEW_BOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block shrink-0 overflow-visible"
        aria-hidden={showWordmark ? true : undefined}
        role={showWordmark ? undefined : 'img'}
        aria-label={showWordmark ? undefined : 'KursoKo'}
      >
        {!showWordmark && <title>KursoKo</title>}

        {/* 1. Teal stem (back) */}
        <path
          d="M 120 110 L 120 490"
          stroke={OUTLINE}
          strokeWidth={STROKE_OUTER}
          strokeLinecap="round"
        />
        <path
          d="M 120 110 L 120 490"
          stroke={TEAL}
          strokeWidth={STROKE_INNER}
          strokeLinecap="round"
        />

        {/* 2. Yellow arm (middle) */}
        <path
          d={YELLOW_ARM}
          stroke={OUTLINE}
          strokeWidth={STROKE_OUTER}
          strokeLinecap="round"
        />
        <path
          d={YELLOW_ARM}
          stroke={YELLOW}
          strokeWidth={STROKE_INNER}
          strokeLinecap="round"
        />

        {/* 3. Purple arm (front) */}
        <path
          d="M 120 295 C 195 295, 265 360, 310 470"
          stroke={OUTLINE}
          strokeWidth={STROKE_OUTER}
          strokeLinecap="round"
        />
        <path
          d="M 120 295 C 195 295, 265 360, 310 470"
          stroke={PURPLE}
          strokeWidth={STROKE_INNER}
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <span
          className="font-[family-name:var(--font-display)] text-lg font-extrabold leading-none tracking-tight text-[#262626]"
          aria-hidden="true"
        >
          urso<span className="text-[#9461BE]">Ko</span>
        </span>
      )}
    </span>
  )
}

export default KursoKoLogo
