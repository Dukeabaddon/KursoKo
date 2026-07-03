import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'
import 'lenis/dist/lenis.css'

const LenisContext = createContext(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function LenisProvider({ children }) {
  const reducedMotion = useReducedMotion()
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    if (reducedMotion) {
      setLenis(null)
      return undefined
    }

    const instance = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.2,
    })

    document.documentElement.classList.add('lenis', 'lenis-smooth')
    setLenis(instance)

    let frame = 0
    const raf = (time) => {
      instance.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
      setLenis(null)
    }
  }, [reducedMotion])

  const value = useMemo(() => lenis, [lenis])

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
}
