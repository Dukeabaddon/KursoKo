import { useEffect, useState } from 'react'

const CHARACTER_LOADERS = {
  R: () => import('../../assets/characters/realistic-female.png'),
  I: () => import('../../assets/characters/investigative-female.png'),
  A: () => import('../../assets/characters/artistic-female.png'),
  S: () => import('../../assets/characters/social-female.png'),
  E: () => import('../../assets/characters/enterprising-female.png'),
  C: () => import('../../assets/characters/conventional-female.png'),
}

const ArchetypePortrait = ({ riasecCode, alt }) => {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    let active = true
    const loader = CHARACTER_LOADERS[riasecCode] ?? CHARACTER_LOADERS.R
    loader()
      .then((mod) => {
        if (active) setSrc(mod.default)
      })
      .catch(() => {
        if (active) setSrc(null)
      })
    return () => {
      active = false
    }
  }, [riasecCode])

  return (
    <div className="relative mx-auto h-[200px] w-[200px] shrink-0 sm:h-[260px] sm:w-[260px]">
      <div className="absolute inset-0 rounded-full border-2 border-landing-accent/15 bg-landing-surface" />
      <div className="absolute inset-2 overflow-hidden rounded-full bg-landing-surface">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover object-top" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-landing-muted">Portrait</div>
        )}
      </div>
      <span
        className="absolute bottom-3 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-landing-accent text-sm font-bold text-white shadow-sm"
        aria-label={`Primary type ${riasecCode}`}
      >
        {riasecCode}
      </span>
    </div>
  )
}

export default ArchetypePortrait
