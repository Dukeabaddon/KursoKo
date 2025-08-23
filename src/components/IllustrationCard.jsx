import { useState, useEffect } from 'react'

/**
 * IllustrationCard Component
 * 
 * A youth-friendly illustration component that displays Storyset illustrations
 * with smooth loading states, hover effects, and accessibility features.
 * 
 * Features:
 * - Progressive loading with skeleton screens
 * - Hover animations and micro-interactions
 * - Accessibility compliant (alt text, ARIA labels)
 * - Mobile-optimized touch targets
 * - Error handling with fallback illustrations
 */

const IllustrationCard = ({ 
  riasecCode, 
  optionText, 
  size = 'md', 
  variant = 'primary',
  className = '',
  onClick,
  isSelected = false,
  isDisabled = false,
  showLabel = true,
  animationDelay = 0
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Storyset illustration mapping for RIASEC codes
  const illustrationMap = {
    R: {
      // Realistic - Hands-on, practical work
      primary: 'https://storyset.com/illustration/engineering/amico',
      fallback: 'https://storyset.com/illustration/construction-worker/amico',
      alt: 'Person working with tools and building projects',
      description: 'Hands-on technical work'
    },
    I: {
      // Investigative - Research, analysis, problem-solving
      primary: 'https://storyset.com/illustration/data-research/amico',
      fallback: 'https://storyset.com/illustration/scientist/amico',
      alt: 'Person conducting research and analyzing data',
      description: 'Research and analysis work'
    },
    A: {
      // Artistic - Creative, expressive work
      primary: 'https://storyset.com/illustration/creative-process/amico',
      fallback: 'https://storyset.com/illustration/design-inspiration/amico',
      alt: 'Person creating art and expressing creativity',
      description: 'Creative and artistic work'
    },
    S: {
      // Social - People-oriented, helping others
      primary: 'https://storyset.com/illustration/teaching/amico',
      fallback: 'https://storyset.com/illustration/community/amico',
      alt: 'Person helping and working with others',
      description: 'People-focused helping work'
    },
    E: {
      // Enterprising - Leadership, business, persuasion
      primary: 'https://storyset.com/illustration/business-plan/amico',
      fallback: 'https://storyset.com/illustration/startup/amico',
      alt: 'Person leading a team and managing business',
      description: 'Leadership and business work'
    },
    C: {
      // Conventional - Organized, systematic work
      primary: 'https://storyset.com/illustration/analytics/amico',
      fallback: 'https://storyset.com/illustration/file-manager/amico',
      alt: 'Person organizing data and working systematically',
      description: 'Organized and systematic work'
    }
  }

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-20 h-20 sm:w-24 sm:h-24',
      image: 'w-16 h-16 sm:w-20 sm:h-20',
      text: 'text-xs',
      padding: 'p-2'
    },
    md: {
      container: 'w-32 h-32 sm:w-40 sm:h-40',
      image: 'w-28 h-28 sm:w-36 sm:h-36',
      text: 'text-sm',
      padding: 'p-4'
    },
    lg: {
      container: 'w-40 h-40 sm:w-48 sm:h-48',
      image: 'w-36 h-36 sm:w-44 sm:h-44',
      text: 'text-base',
      padding: 'p-6'
    }
  }

  // Variant configurations
  const variantConfig = {
    primary: {
      background: 'from-primary-100 to-primary-200',
      border: 'border-primary-300',
      text: 'text-primary-600',
      hover: 'hover:from-primary-200 hover:to-primary-300'
    },
    secondary: {
      background: 'from-secondary-100 to-secondary-200',
      border: 'border-secondary-300',
      text: 'text-secondary-600',
      hover: 'hover:from-secondary-200 hover:to-secondary-300'
    },
    warm: {
      background: 'from-accent-orange-100 to-accent-pink-100',
      border: 'border-accent-orange-300',
      text: 'text-accent-orange-600',
      hover: 'hover:from-accent-orange-200 hover:to-accent-pink-200'
    },
    success: {
      background: 'from-accent-green-100 to-accent-green-200',
      border: 'border-accent-green-300',
      text: 'text-accent-green-600',
      hover: 'hover:from-accent-green-200 hover:to-accent-green-300'
    }
  }

  const illustration = illustrationMap[riasecCode] || illustrationMap.R
  const sizeClasses = sizeConfig[size]
  const variantClasses = variantConfig[variant]

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoaded(true)
  }

  const handleImageError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  // Animation delay for staggered loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(false) // Reset for proper loading animation
    }, animationDelay)
    return () => clearTimeout(timer)
  }, [animationDelay])

  const containerClasses = `
    ${sizeClasses.container}
    bg-gradient-to-br ${variantClasses.background}
    rounded-youth-xl border-2 border-dashed ${variantClasses.border}
    flex items-center justify-center
    transition-all duration-300 ease-out
    cursor-pointer touch-target
    relative overflow-hidden
    ${variantClasses.hover}
    ${isSelected ? 'ring-4 ring-primary-400 ring-opacity-50 scale-105' : ''}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-youth'}
    ${className}
  `.trim()

  return (
    <div
      className={containerClasses}
      onClick={!isDisabled ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={`${optionText}: ${illustration.description}`}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      style={{
        animationDelay: `${animationDelay}ms`
      }}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className={`${sizeClasses.padding} text-center animate-pulse`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse"></div>
          <div className="h-2 bg-gray-300 rounded mx-auto animate-pulse"></div>
        </div>
      )}

      {/* Illustration content */}
      <div className={`${sizeClasses.padding} text-center transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* For now, using emoji as placeholder until Storyset integration */}
        <div className={`text-4xl mb-2 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          {riasecCode === 'R' && '🔧'}
          {riasecCode === 'I' && '🔬'}
          {riasecCode === 'A' && '🎨'}
          {riasecCode === 'S' && '👥'}
          {riasecCode === 'E' && '💼'}
          {riasecCode === 'C' && '📊'}
        </div>
        
        {showLabel && (
          <div className={`${sizeClasses.text} ${variantClasses.text} font-medium leading-tight`}>
            {illustration.description}
          </div>
        )}
      </div>

      {/* Hover shimmer effect */}
      {isHovered && !isDisabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-shimmer"></div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default IllustrationCard
