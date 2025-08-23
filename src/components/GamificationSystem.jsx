import { useState, useEffect } from 'react'
import { useFeedback } from '../utils/feedbackUtils'

/**
 * GamificationSystem Component
 * 
 * Provides achievement badges, progress rewards, and engagement mechanics
 * Designed specifically for Filipino youth with cultural elements
 */

// Achievement definitions - Filipino Cultural Context
const ACHIEVEMENTS = {
  firstStep: {
    id: 'first-step',
    title: 'Simula na! 🚀',
    description: 'Started your career journey',
    icon: '🌅',
    points: 10,
    requirement: 'Start the assessment',
    rarity: 'common',
    filipinoMessage: 'Ang galing! You took the first step towards your dream career!'
  },
  quickLearner: {
    id: 'quick-learner',
    title: 'Mabilis! ⚡',
    description: 'Completed assessment in under 10 minutes',
    icon: '⚡',
    points: 25,
    requirement: 'Complete in under 10 minutes',
    rarity: 'uncommon',
    filipinoMessage: 'Wow! You\'re as fast as a jeepney in EDSA! 🚌'
  },
  thoughtful: {
    id: 'thoughtful',
    title: 'Malalim mag-isip! 🤔',
    description: 'Took time to consider each answer',
    icon: '🧠',
    points: 20,
    requirement: 'Average 30+ seconds per question',
    rarity: 'common',
    filipinoMessage: 'Thoughtful ka talaga! Taking time shows wisdom. 💭'
  },
  consistent: {
    id: 'consistent',
    title: 'Consistent! 📊',
    description: 'Showed clear personality patterns',
    icon: '📈',
    points: 30,
    requirement: 'High consistency score',
    rarity: 'uncommon',
    filipinoMessage: 'Solid ang personality mo! Very consistent! 💪'
  },
  explorer: {
    id: 'explorer',
    title: 'Adventurer! 🗺️',
    description: 'Showed interest in multiple career areas',
    icon: '🌟',
    points: 35,
    requirement: 'Balanced RIASEC scores',
    rarity: 'rare',
    filipinoMessage: 'Parang Magellan! You love exploring different paths! 🧭'
  },
  perfectionist: {
    id: 'perfectionist',
    title: 'Perpekto! ✨',
    description: 'Answered all questions with high ratings',
    icon: '💎',
    points: 50,
    requirement: 'All ratings 2 or 3',
    rarity: 'epic',
    filipinoMessage: 'Grabe! You\'re aiming for excellence! Proud of you! 🌟'
  },
  champion: {
    id: 'champion',
    title: 'Kampeon! 🏆',
    description: 'Completed the full assessment',
    icon: '👑',
    points: 100,
    requirement: 'Complete all questions',
    rarity: 'legendary',
    filipinoMessage: 'Congratulations, Kampeon! You\'re ready to conquer your dreams! 🇵🇭'
  },
  scholar: {
    id: 'scholar',
    title: 'Iskolar! 📚',
    description: 'Discovered scholarship opportunities',
    icon: '🎓',
    points: 40,
    requirement: 'View scholarship recommendations',
    rarity: 'rare',
    filipinoMessage: 'Education is the key to success! Iskolar ng bayan! 📖'
  },
  dreamer: {
    id: 'dreamer',
    title: 'Pangarap! 💫',
    description: 'Set high career aspirations',
    icon: '⭐',
    points: 30,
    requirement: 'Select ambitious career goals',
    rarity: 'uncommon',
    filipinoMessage: 'Dream big, anak! Your pangarap will come true! ✨'
  }
}

// Rarity configurations
const RARITY_CONFIG = {
  common: {
    color: 'from-neutral-400 to-neutral-500',
    glow: 'shadow-neutral-500/30',
    border: 'border-neutral-400'
  },
  uncommon: {
    color: 'from-accent-green-400 to-accent-green-500',
    glow: 'shadow-accent-green-500/30',
    border: 'border-accent-green-400'
  },
  rare: {
    color: 'from-primary-400 to-primary-500',
    glow: 'shadow-primary-500/30',
    border: 'border-primary-400'
  },
  epic: {
    color: 'from-secondary-400 to-secondary-500',
    glow: 'shadow-secondary-500/30',
    border: 'border-secondary-400'
  },
  legendary: {
    color: 'from-accent-orange-400 via-accent-pink-400 to-accent-yellow-400',
    glow: 'shadow-accent-orange-500/50',
    border: 'border-accent-orange-400'
  }
}

// Achievement Badge Component
export const AchievementBadge = ({ 
  achievement, 
  isUnlocked = false, 
  showAnimation = false,
  size = 'md',
  className = '' 
}) => {
  const [isAnimating, setIsAnimating] = useState(showAnimation)
  const rarity = RARITY_CONFIG[achievement.rarity]
  
  const sizeConfig = {
    sm: { container: 'w-16 h-16', icon: 'text-2xl', text: 'text-xs' },
    md: { container: 'w-20 h-20', icon: 'text-3xl', text: 'text-sm' },
    lg: { container: 'w-24 h-24', icon: 'text-4xl', text: 'text-base' }
  }
  
  const config = sizeConfig[size]

  useEffect(() => {
    if (showAnimation) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [showAnimation])

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          ${config.container}
          rounded-full
          border-4 ${rarity.border}
          bg-gradient-to-br ${rarity.color}
          flex items-center justify-center
          transition-all duration-300
          ${isUnlocked ? 'opacity-100 scale-100' : 'opacity-40 scale-90 grayscale'}
          ${isAnimating ? 'animate-tada' : ''}
          ${isUnlocked ? `shadow-lg ${rarity.glow}` : 'shadow-sm'}
        `}
      >
        <span className={`${config.icon} ${isUnlocked ? '' : 'opacity-50'}`}>
          {achievement.icon}
        </span>
        
        {/* Unlock animation */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-yellow-400 to-accent-orange-400 opacity-30 animate-ping"></div>
        )}
      </div>
      
      {/* Badge info */}
      <div className="text-center mt-2">
        <h4 className={`font-heading font-semibold ${config.text} ${isUnlocked ? 'text-neutral-800' : 'text-neutral-500'}`}>
          {achievement.title}
        </h4>
        <p className={`font-primary text-xs text-neutral-600 leading-tight ${isUnlocked ? '' : 'opacity-50'}`}>
          {achievement.description}
        </p>
        <div className={`inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full bg-accent-yellow-100 ${config.text}`}>
          <span className="text-accent-yellow-600">⭐</span>
          <span className="font-semibold text-accent-yellow-700">{achievement.points}</span>
        </div>
      </div>
    </div>
  )
}

// Progress Rewards Component
export const ProgressRewards = ({ 
  currentProgress = 0, 
  totalQuestions = 30,
  className = '' 
}) => {
  const progressPercentage = (currentProgress / totalQuestions) * 100
  
  const rewards = [
    { threshold: 25, reward: '🎁 Bonus tip unlocked!', claimed: progressPercentage >= 25 },
    { threshold: 50, reward: '🌟 Halfway celebration!', claimed: progressPercentage >= 50 },
    { threshold: 75, reward: '🚀 Almost there bonus!', claimed: progressPercentage >= 75 },
    { threshold: 100, reward: '🏆 Champion status!', claimed: progressPercentage >= 100 }
  ]

  return (
    <div className={`bg-gradient-to-r from-accent-yellow-50 to-accent-orange-50 rounded-youth p-4 border-2 border-accent-yellow-200 ${className}`}>
      <h3 className="font-heading font-bold text-accent-orange-700 mb-3 text-center">
        Progress Rewards 🎁
      </h3>
      
      <div className="space-y-2">
        {rewards.map((reward, index) => (
          <div
            key={index}
            className={`
              flex items-center justify-between p-3 rounded-lg transition-all duration-300
              ${reward.claimed 
                ? 'bg-accent-green-100 border-2 border-accent-green-300' 
                : 'bg-white border-2 border-neutral-200'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                reward.claimed ? 'bg-accent-green-500' : 'bg-neutral-300'
              }`}>
                {reward.claimed ? '✅' : '🔒'}
              </div>
              <span className={`font-primary text-sm ${
                reward.claimed ? 'text-accent-green-700' : 'text-neutral-600'
              }`}>
                {reward.threshold}% - {reward.reward}
              </span>
            </div>
            
            {reward.claimed && (
              <span className="text-accent-green-600 animate-bounce">🎉</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Achievement System Hook
export const useAchievements = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [newAchievements, setNewAchievements] = useState([])
  const feedback = useFeedback()

  // Load achievements from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kursoko-achievements')
    if (saved) {
      const data = JSON.parse(saved)
      setUnlockedAchievements(data.unlocked || [])
      setTotalPoints(data.points || 0)
    }
  }, [])

  // Save achievements to localStorage
  const saveAchievements = (unlocked, points) => {
    localStorage.setItem('kursoko-achievements', JSON.stringify({
      unlocked,
      points,
      lastUpdated: Date.now()
    }))
  }

  // Unlock achievement
  const unlockAchievement = (achievementId) => {
    const achievement = ACHIEVEMENTS[achievementId]
    if (!achievement || unlockedAchievements.includes(achievementId)) return false

    const newUnlocked = [...unlockedAchievements, achievementId]
    const newPoints = totalPoints + achievement.points
    
    setUnlockedAchievements(newUnlocked)
    setTotalPoints(newPoints)
    setNewAchievements(prev => [...prev, achievementId])
    
    saveAchievements(newUnlocked, newPoints)
    
    // Trigger celebration feedback
    feedback.celebration()
    
    // Auto-remove from new achievements after 5 seconds
    setTimeout(() => {
      setNewAchievements(prev => prev.filter(id => id !== achievementId))
    }, 5000)

    return true
  }

  // Check multiple achievements
  const checkAchievements = (conditions) => {
    Object.entries(conditions).forEach(([achievementId, condition]) => {
      if (condition && !unlockedAchievements.includes(achievementId)) {
        unlockAchievement(achievementId)
      }
    })
  }

  // Get achievement progress
  const getProgress = () => {
    const totalAchievements = Object.keys(ACHIEVEMENTS).length
    const unlockedCount = unlockedAchievements.length
    return {
      unlocked: unlockedCount,
      total: totalAchievements,
      percentage: (unlockedCount / totalAchievements) * 100
    }
  }

  return {
    achievements: ACHIEVEMENTS,
    unlockedAchievements,
    totalPoints,
    newAchievements,
    unlockAchievement,
    checkAchievements,
    getProgress,
    isUnlocked: (id) => unlockedAchievements.includes(id),
    isNew: (id) => newAchievements.includes(id)
  }
}

export default {
  AchievementBadge,
  ProgressRewards,
  useAchievements,
  ACHIEVEMENTS
}
