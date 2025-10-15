import { useEffect, useRef, useState } from 'react'
import { RIASEC_TYPES } from './riasecMedia'
import RIASECSlide from './RIASECSlide'

const Dot = ({ active, onClick }) => (
  <button
    aria-label="Go to slide"
    className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-slate-900' : 'bg-slate-300'}`}
    onClick={onClick}
  />
)

const RIASECCarousel = () => {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)

  // Observe scroll to update index
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onScroll = () => {
      const children = Array.from(el.children)
      let closest = 0
      let min = Infinity
      const center = el.scrollLeft + el.clientWidth / 2
      children.forEach((c, i) => {
        const rectLeft = c.offsetLeft + c.clientWidth / 2
        const dist = Math.abs(rectLeft - center)
        if (dist < min) { min = dist; closest = i }
      })
      setIndex(closest)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Keyboard nav
  const handleKey = (e) => {
    if (!trackRef.current) return
    if (e.key === 'ArrowRight') trackRef.current.scrollBy({ left: trackRef.current.clientWidth * 0.6, behavior: 'smooth' })
    if (e.key === 'ArrowLeft') trackRef.current.scrollBy({ left: -trackRef.current.clientWidth * 0.6, behavior: 'smooth' })
  }

  const snapTo = (i) => {
    const el = trackRef.current
    if (!el) return
    const child = el.children[i]
    if (!child) return
    el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.clientWidth) / 2, behavior: 'smooth' })
  }

  return (
    <section id="riasec" aria-labelledby="riasec-carousel-heading">
      <h2 id="riasec-carousel-heading" className="text-2xl sm:text-3xl font-bold mb-6">Explore your personality types</h2>
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="RIASEC types"
        tabIndex={0}
        onKeyDown={handleKey}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scroll-p-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        {RIASEC_TYPES.map((t) => (
          <RIASECSlide key={t.code} type={t} />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {RIASEC_TYPES.map((_, i) => (
          <Dot key={i} active={i === index} onClick={() => snapTo(i)} />
        ))}
      </div>
    </section>
  )
}

export default RIASECCarousel
