import { useState, useEffect } from 'react'

function PageTransition({ children, isVisible = true, duration = 300 }) {
  const [shouldRender, setShouldRender] = useState(isVisible)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      setTimeout(() => setShouldRender(false), duration)
    }
  }, [isVisible, duration])

  if (!shouldRender) return null

  return (
    <div 
      className={`transition-all duration-${duration} ${
        isAnimating 
          ? 'opacity-100 transform translate-y-0 scale-100' 
          : 'opacity-0 transform translate-y-4 scale-95'
      }`}
    >
      {children}
    </div>
  )
}

export default PageTransition
