import { useState, useEffect } from 'react'

/**
 * LoadingStates Component Collection
 * 
 * Provides various loading states and skeleton screens for smooth user experience
 * Designed with youth-friendly animations and Filipino cultural elements
 */

// Main Loading Spinner
export const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary', 
  message = 'Loading...',
  showMessage = true,
  className = '' 
}) => {
  const sizeConfig = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const variantConfig = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    accent: 'border-accent-orange-500'
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`${sizeConfig[size]} border-4 border-neutral-200 border-t-${variantConfig[variant]} rounded-full animate-spin`}></div>
      {showMessage && (
        <p className="text-body-sm text-neutral-600 font-primary animate-pulse">
          {message}
        </p>
      )}
    </div>
  )
}

// Dots Loading Animation
export const LoadingDots = ({ 
  variant = 'primary', 
  size = 'md',
  className = '' 
}) => {
  const sizeConfig = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const colorConfig = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    accent: 'bg-accent-orange-500'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeConfig[size]} ${colorConfig[variant]} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.2}s` }}
        ></div>
      ))}
    </div>
  )
}

// Progress Loading Bar
export const LoadingBar = ({ 
  progress = 0, 
  variant = 'primary',
  showPercentage = false,
  className = '' 
}) => {
  const variantConfig = {
    primary: 'from-primary-500 to-secondary-500',
    secondary: 'from-secondary-500 to-accent-pink-500',
    accent: 'from-accent-orange-500 to-accent-pink-500'
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 bg-gradient-to-r ${variantConfig[variant]} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      </div>
      {showPercentage && (
        <div className="text-center mt-2">
          <span className="text-body-sm font-heading font-semibold text-neutral-600">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}

// Skeleton Components
export const SkeletonText = ({ 
  lines = 1, 
  width = 'full',
  className = '' 
}) => {
  const widthConfig = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/4': 'w-1/4'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-neutral-200 rounded animate-pulse ${
            i === lines - 1 && lines > 1 ? widthConfig['3/4'] : widthConfig[width]
          }`}
        ></div>
      ))}
    </div>
  )
}

export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`card-youth animate-pulse ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-neutral-200 rounded"></div>
        <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
        <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
      </div>
    </div>
  )
}

export const SkeletonButton = ({ 
  width = 'auto',
  height = 'md',
  className = '' 
}) => {
  const heightConfig = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  }

  const widthConfig = {
    auto: 'w-auto',
    full: 'w-full',
    '32': 'w-32',
    '48': 'w-48'
  }

  return (
    <div className={`${heightConfig[height]} ${widthConfig[width]} bg-neutral-200 rounded-youth animate-pulse ${className}`}></div>
  )
}

// Question Loading Skeleton
export const QuestionSkeleton = ({ className = '' }) => {
  return (
    <div className={`container-youth animate-fade-in ${className}`}>
      <div className="card-youth">
        {/* Progress skeleton */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 bg-neutral-200 rounded w-24 animate-pulse"></div>
            <div className="h-6 bg-neutral-200 rounded-full w-16 animate-pulse"></div>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-5 animate-pulse"></div>
        </div>

        {/* Question title skeleton */}
        <div className="text-center mb-6">
          <div className="h-8 bg-neutral-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>

        {/* Options skeleton */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-12 mb-8">
          {/* Option A */}
          <div className="flex-1 max-w-md mx-auto lg:mx-0">
            <div className="text-center mb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 bg-neutral-200 rounded-2xl animate-pulse"></div>
              <div className="h-6 bg-neutral-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded w-full mx-auto animate-pulse"></div>
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-neutral-200 rounded-youth animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center lg:flex-col lg:h-full">
            <div className="w-12 h-12 bg-neutral-200 rounded-full animate-pulse"></div>
          </div>

          {/* Option B */}
          <div className="flex-1 max-w-md mx-auto lg:mx-0">
            <div className="text-center mb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 bg-neutral-200 rounded-2xl animate-pulse"></div>
              <div className="h-6 bg-neutral-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-neutral-200 rounded w-full mx-auto animate-pulse"></div>
            </div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-neutral-200 rounded-youth animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation skeleton */}
        <div className="flex justify-between items-center mt-8 gap-4">
          <div className="h-12 bg-neutral-200 rounded-youth w-24 animate-pulse"></div>
          <div className="h-4 bg-neutral-200 rounded w-48 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

// Loading Screen with Filipino Messages
export const LoadingScreen = ({ 
  message = '',
  showTips = true,
  className = '' 
}) => {
  const [currentTip, setCurrentTip] = useState(0)
  
  const filipinoTips = [
    "💡 Tip: Be honest with your answers for better results!",
    "🎯 Tip: Think about what truly excites you!",
    "⭐ Tip: Consider your natural strengths and interests!",
    "🚀 Tip: Imagine your ideal work environment!",
    "💪 Tip: Trust your instincts - you know yourself best!"
  ]

  useEffect(() => {
    if (showTips) {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % filipinoTips.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [showTips])

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 ${className}`}>
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <LoadingSpinner size="xl" variant="primary" showMessage={false} />
        </div>
        
        <h2 className="text-title font-heading text-gradient-primary mb-4">
          {message || 'Preparing your assessment...'}
        </h2>
        
        {showTips && (
          <div className="bg-white rounded-youth p-4 shadow-youth animate-fade-in">
            <p className="text-body font-primary text-neutral-700 leading-relaxed">
              {filipinoTips[currentTip]}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default {
  LoadingSpinner,
  LoadingDots,
  LoadingBar,
  SkeletonText,
  SkeletonCard,
  SkeletonButton,
  QuestionSkeleton,
  LoadingScreen
}
