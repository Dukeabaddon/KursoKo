import { useState, useEffect } from 'react'

/**
 * FeedbackSystem Component
 * 
 * Provides visual, audio, and haptic feedback for user interactions
 * Designed for Filipino youth with culturally relevant feedback messages
 */

const FeedbackSystem = ({ 
  type = 'success', // success, error, warning, info, celebration
  message = '',
  duration = 3000,
  position = 'top-right',
  showIcon = true,
  enableSound = false,
  enableHaptic = true,
  onClose,
  isVisible = false
}) => {
  const [show, setShow] = useState(isVisible)
  const [isAnimating, setIsAnimating] = useState(false)

  // Feedback configurations
  const feedbackConfig = {
    success: {
      icon: '✅',
      bgColor: 'from-accent-green-400 to-accent-green-500',
      textColor: 'text-white',
      borderColor: 'border-accent-green-300',
      sound: 'success',
      messages: [
        'Galing! 🎉',
        'Perfect! 👏',
        'Excellent choice! ⭐',
        'Tama yan! 💪',
        'Outstanding! 🌟'
      ]
    },
    error: {
      icon: '❌',
      bgColor: 'from-red-400 to-red-500',
      textColor: 'text-white',
      borderColor: 'border-red-300',
      sound: 'error',
      messages: [
        'Oops! Try again 🤔',
        'Mali yata? 😅',
        'Let\'s try that again! 💪',
        'Almost there! 🎯',
        'No worries, try again! 😊'
      ]
    },
    warning: {
      icon: '⚠️',
      bgColor: 'from-accent-orange-400 to-accent-orange-500',
      textColor: 'text-white',
      borderColor: 'border-accent-orange-300',
      sound: 'warning',
      messages: [
        'Heads up! 👀',
        'Careful lang! ⚡',
        'Just a reminder 📝',
        'Take note! 📌',
        'Important! 🔔'
      ]
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'from-primary-400 to-primary-500',
      textColor: 'text-white',
      borderColor: 'border-primary-300',
      sound: 'info',
      messages: [
        'Good to know! 💡',
        'FYI lang! 📚',
        'Helpful tip! 🎯',
        'Did you know? 🤓',
        'Pro tip! ⚡'
      ]
    },
    celebration: {
      icon: '🎉',
      bgColor: 'from-accent-pink-400 via-accent-orange-400 to-accent-yellow-400',
      textColor: 'text-white',
      borderColor: 'border-accent-pink-300',
      sound: 'celebration',
      messages: [
        'Congratulations! 🎊',
        'You did it! 🏆',
        'Amazing work! ⭐',
        'Proud of you! 💪',
        'Fantastic! 🌟'
      ]
    }
  }

  // Position configurations
  const positionConfig = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  }

  const config = feedbackConfig[type]
  const positionClass = positionConfig[position]

  // Auto-hide functionality
  useEffect(() => {
    if (isVisible) {
      setShow(true)
      setIsAnimating(true)

      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  // Handle close
  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setShow(false)
      if (onClose) onClose()
    }, 300)
  }

  // Haptic feedback
  const triggerHaptic = () => {
    if (enableHaptic && 'vibrate' in navigator) {
      const patterns = {
        success: [100],
        error: [100, 50, 100],
        warning: [50, 50, 50],
        info: [50],
        celebration: [100, 50, 100, 50, 200]
      }
      navigator.vibrate(patterns[type] || [50])
    }
  }

  // Sound feedback (placeholder for future implementation)
  const triggerSound = () => {
    if (enableSound) {
      // Future: Implement Web Audio API or use audio files
      console.log(`Playing ${config.sound} sound`)
    }
  }

  // Trigger feedback effects
  useEffect(() => {
    if (show) {
      triggerHaptic()
      triggerSound()
    }
  }, [show])

  // Get random message if none provided
  const displayMessage = message || config.messages[Math.floor(Math.random() * config.messages.length)]

  if (!show) return null

  return (
    <div className={`fixed ${positionClass} z-50 max-w-sm w-full px-4`}>
      <div
        className={`
          bg-gradient-to-r ${config.bgColor} 
          ${config.textColor} 
          border-2 ${config.borderColor}
          rounded-youth-xl 
          shadow-youth-hover 
          p-4 
          transform transition-all duration-300 ease-out
          ${isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'}
          ${type === 'celebration' ? 'animate-tada' : 'animate-bounce-in'}
        `}
      >
        <div className="flex items-start gap-3">
          {showIcon && (
            <div className="flex-shrink-0">
              <span className="text-2xl animate-bounce">{config.icon}</span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="font-heading font-semibold text-sm leading-relaxed">
              {displayMessage}
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 text-white/80 hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar for auto-close */}
        <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
          <div
            className="h-1 bg-white/60 rounded-full transition-all ease-linear"
            style={{
              width: isAnimating ? '0%' : '100%',
              transitionDuration: `${duration}ms`
            }}
          ></div>
        </div>
      </div>

      {/* Celebration confetti */}
      {type === 'celebration' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-accent-yellow-400 to-accent-pink-400 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
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

// Hook for easy feedback management
export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([])

  const showFeedback = (options) => {
    const id = Date.now() + Math.random()
    const feedback = { id, ...options, isVisible: true }
    
    setFeedbacks(prev => [...prev, feedback])

    // Auto-remove after duration
    setTimeout(() => {
      setFeedbacks(prev => prev.filter(f => f.id !== id))
    }, options.duration || 3000)

    return id
  }

  const hideFeedback = (id) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id))
  }

  const clearAll = () => {
    setFeedbacks([])
  }

  return {
    feedbacks,
    showFeedback,
    hideFeedback,
    clearAll
  }
}

export default FeedbackSystem
