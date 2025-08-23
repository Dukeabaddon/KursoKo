import { useState, useEffect } from 'react'

/**
 * ProgressIndicator Component
 * 
 * A youth-friendly progress indicator with celebrations, milestones, and visual feedback
 * Designed specifically for Filipino youth with engaging animations and cultural elements
 */

const ProgressIndicator = ({ 
  current = 0, 
  total = 100, 
  showPercentage = true,
  showMilestones = true,
  showCelebrations = true,
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const [previousProgress, setPreviousProgress] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState('')
  
  const progress = total > 0 ? Math.min((current / total) * 100, 100) : 0
  const roundedProgress = Math.round(progress)

  // Milestone thresholds
  const milestones = [
    { threshold: 25, emoji: '✨', message: 'Great start!', color: 'accent-yellow' },
    { threshold: 50, emoji: '🎉', message: 'Halfway there!', color: 'accent-orange' },
    { threshold: 75, emoji: '🚀', message: 'Almost done!', color: 'accent-green' },
    { threshold: 100, emoji: '🎊', message: 'Congratulations!', color: 'accent-pink' }
  ]

  // Size configurations
  const sizeConfig = {
    sm: {
      height: 'h-2',
      text: 'text-xs',
      milestone: 'text-lg',
      container: 'py-2'
    },
    md: {
      height: 'h-3',
      text: 'text-sm',
      milestone: 'text-xl',
      container: 'py-3'
    },
    lg: {
      height: 'h-4',
      text: 'text-base',
      milestone: 'text-2xl',
      container: 'py-4'
    }
  }

  // Variant configurations
  const variantConfig = {
    primary: {
      background: 'from-primary-500 via-secondary-500 to-accent-pink-400',
      glow: 'shadow-primary-500/30'
    },
    success: {
      background: 'from-accent-green-400 to-accent-green-600',
      glow: 'shadow-accent-green-500/30'
    },
    warm: {
      background: 'from-accent-orange-400 to-accent-pink-400',
      glow: 'shadow-accent-orange-500/30'
    }
  }

  const config = sizeConfig[size]
  const colors = variantConfig[variant]

  // Handle milestone celebrations
  useEffect(() => {
    if (showCelebrations && progress > previousProgress) {
      const crossedMilestone = milestones.find(
        milestone => 
          progress >= milestone.threshold && 
          previousProgress < milestone.threshold
      )

      if (crossedMilestone) {
        setCelebrationType(crossedMilestone.emoji)
        setShowCelebration(true)
        
        // Auto-hide celebration after 3 seconds
        setTimeout(() => {
          setShowCelebration(false)
        }, 3000)
      }
    }
    setPreviousProgress(progress)
  }, [progress, previousProgress, showCelebrations])

  // Get current milestone
  const getCurrentMilestone = () => {
    return milestones.find(milestone => progress >= milestone.threshold && progress < milestone.threshold + 25) ||
           milestones[milestones.length - 1]
  }

  const currentMilestone = getCurrentMilestone()

  return (
    <div className={`relative ${config.container} ${className}`}>
      {/* Progress Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className={`font-heading font-medium text-neutral-600 ${config.text}`}>
            Progress
          </span>
          {showMilestones && currentMilestone && (
            <span className={`${config.milestone} animate-bounce`}>
              {currentMilestone.emoji}
            </span>
          )}
        </div>
        
        {showPercentage && (
          <div className={`font-heading font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full ${config.text}`}>
            {roundedProgress}%
          </div>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className={`w-full bg-neutral-200 rounded-full ${config.height} overflow-hidden shadow-inner relative`}>
        {/* Progress Fill */}
        <div
          className={`${config.height} rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${colors.background} relative overflow-hidden`}
          style={{ width: `${progress}%` }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
          
          {/* Diagonal stripes pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.4) 6px, rgba(255,255,255,0.4) 12px)'
            }}
          ></div>

          {/* Glow effect */}
          {progress > 0 && (
            <div className={`absolute inset-0 rounded-full shadow-lg ${colors.glow}`}></div>
          )}
        </div>

        {/* Milestone markers */}
        {showMilestones && milestones.map((milestone, index) => (
          <div
            key={index}
            className="absolute top-0 bottom-0 w-0.5 bg-white opacity-60"
            style={{ left: `${milestone.threshold}%` }}
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full border-2 border-neutral-300 shadow-sm"></div>
          </div>
        ))}
      </div>

      {/* Progress Details */}
      <div className="flex justify-between items-center mt-2">
        <span className={`text-neutral-500 font-primary ${config.text}`}>
          {current} of {total}
        </span>
        
        {showMilestones && currentMilestone && (
          <span className={`text-${currentMilestone.color}-600 font-medium font-primary ${config.text}`}>
            {currentMilestone.message}
          </span>
        )}
      </div>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-full p-4 shadow-youth animate-tada">
            <span className="text-4xl">{celebrationType}</span>
          </div>
        </div>
      )}

      {/* Confetti Effect for 100% */}
      {progress >= 100 && showCelebrations && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-accent-yellow-400 to-accent-pink-400 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProgressIndicator
