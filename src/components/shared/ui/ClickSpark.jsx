import { useRef, useEffect, useCallback } from 'react'

const ClickSpark = ({
  sparkColor = '#9461BE',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
  className = '',
  children
}) => {
  const canvasRef = useRef(null)
  const sparksRef = useRef([])
  const startTimeRef = useRef(null)
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reducedMotion) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined

    const parent = canvas.parentElement
    if (!parent) return undefined

    let resizeTimeout

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect()
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }
    }

    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 100)
    }

    const ro = new ResizeObserver(handleResize)
    ro.observe(parent)
    resizeCanvas()

    return () => {
      ro.disconnect()
      clearTimeout(resizeTimeout)
    }
  }, [reducedMotion])

  const easeFunc = useCallback(
    (t) => {
      switch (easing) {
        case 'linear':
          return t
        case 'ease-in':
          return t * t
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        default:
          return t * (2 - t)
      }
    },
    [easing]
  )

  useEffect(() => {
    if (reducedMotion) return undefined

    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')

    let animationId

    const draw = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= duration) {
          return false
        }

        const progress = elapsed / duration
        const eased = easeFunc(progress)

        const distance = eased * sparkRadius * extraScale
        const lineLength = sparkSize * (1 - eased)

        const x1 = spark.x + distance * Math.cos(spark.angle)
        const y1 = spark.y + distance * Math.sin(spark.angle)
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle)
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle)

        ctx.strokeStyle = sparkColor
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        return true
      })

      animationId = requestAnimationFrame(draw)
    }

    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale, reducedMotion])

  const handleClick = (e) => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const now = performance.now()
    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now
    }))

    sparksRef.current.push(...newSparks)
  }

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={`relative h-full w-full ${className}`.trim()}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 block h-full w-full select-none"
        aria-hidden="true"
      />
      {children}
    </div>
  )
}

export default ClickSpark
