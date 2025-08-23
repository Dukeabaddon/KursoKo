/**
 * Feedback Utils
 * 
 * Utility functions for haptic feedback, sound effects, and interactive feedback
 * Optimized for mobile devices and youth engagement
 */

// Haptic Feedback Patterns
export const HapticPatterns = {
  // Basic interactions
  tap: [10],
  click: [25],
  select: [50],
  
  // Success patterns
  success: [100],
  achievement: [100, 50, 100],
  celebration: [100, 50, 100, 50, 200],
  
  // Error patterns
  error: [100, 50, 100],
  warning: [50, 50, 50],
  
  // Progress patterns
  progress: [30],
  milestone: [80, 40, 80],
  completion: [150, 100, 150],
  
  // Attention patterns
  notification: [200],
  urgent: [100, 100, 100],
  gentle: [30, 30, 30]
}

// Haptic Feedback Controller
export class HapticController {
  constructor() {
    this.isSupported = 'vibrate' in navigator
    this.isEnabled = true
    this.intensity = 1.0 // 0.0 to 1.0
  }

  // Check if haptic feedback is available
  isAvailable() {
    return this.isSupported && this.isEnabled
  }

  // Enable/disable haptic feedback
  setEnabled(enabled) {
    this.isEnabled = enabled
    localStorage.setItem('haptic-enabled', enabled.toString())
  }

  // Set intensity level
  setIntensity(intensity) {
    this.intensity = Math.max(0, Math.min(1, intensity))
    localStorage.setItem('haptic-intensity', this.intensity.toString())
  }

  // Load settings from localStorage
  loadSettings() {
    const enabled = localStorage.getItem('haptic-enabled')
    const intensity = localStorage.getItem('haptic-intensity')
    
    if (enabled !== null) {
      this.isEnabled = enabled === 'true'
    }
    
    if (intensity !== null) {
      this.intensity = parseFloat(intensity)
    }
  }

  // Trigger haptic feedback
  vibrate(pattern = 'tap') {
    if (!this.isAvailable()) return false

    let vibrationPattern
    
    if (typeof pattern === 'string') {
      vibrationPattern = HapticPatterns[pattern] || HapticPatterns.tap
    } else if (Array.isArray(pattern)) {
      vibrationPattern = pattern
    } else {
      vibrationPattern = [pattern]
    }

    // Apply intensity scaling
    const scaledPattern = vibrationPattern.map(duration => 
      Math.round(duration * this.intensity)
    )

    try {
      navigator.vibrate(scaledPattern)
      return true
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
      return false
    }
  }

  // Convenience methods for common interactions
  tap() { return this.vibrate('tap') }
  click() { return this.vibrate('click') }
  select() { return this.vibrate('select') }
  success() { return this.vibrate('success') }
  error() { return this.vibrate('error') }
  warning() { return this.vibrate('warning') }
  achievement() { return this.vibrate('achievement') }
  celebration() { return this.vibrate('celebration') }
  progress() { return this.vibrate('progress') }
  milestone() { return this.vibrate('milestone') }
  completion() { return this.vibrate('completion') }
  notification() { return this.vibrate('notification') }
}

// Sound Effect Controller (Web Audio API)
export class SoundController {
  constructor() {
    this.audioContext = null
    this.isEnabled = true
    this.volume = 0.5 // 0.0 to 1.0
    this.sounds = new Map()
    this.initAudioContext()
  }

  // Initialize Web Audio API
  async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Resume context on user interaction (required by browsers)
      if (this.audioContext.state === 'suspended') {
        document.addEventListener('click', () => {
          this.audioContext.resume()
        }, { once: true })
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  // Check if sound is available
  isAvailable() {
    return this.audioContext && this.isEnabled
  }

  // Enable/disable sound
  setEnabled(enabled) {
    this.isEnabled = enabled
    localStorage.setItem('sound-enabled', enabled.toString())
  }

  // Set volume level
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    localStorage.setItem('sound-volume', this.volume.toString())
  }

  // Load settings from localStorage
  loadSettings() {
    const enabled = localStorage.getItem('sound-enabled')
    const volume = localStorage.getItem('sound-volume')
    
    if (enabled !== null) {
      this.isEnabled = enabled === 'true'
    }
    
    if (volume !== null) {
      this.volume = parseFloat(volume)
    }
  }

  // Generate tone using Web Audio API
  playTone(frequency = 440, duration = 200, type = 'sine') {
    if (!this.isAvailable()) return false

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.type = type

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration / 1000)

      return true
    } catch (error) {
      console.warn('Sound playback failed:', error)
      return false
    }
  }

  // Predefined sound effects
  playSuccess() {
    return this.playTone(523.25, 150) && // C5
           setTimeout(() => this.playTone(659.25, 150), 100) && // E5
           setTimeout(() => this.playTone(783.99, 300), 200) // G5
  }

  playError() {
    return this.playTone(220, 200, 'sawtooth') &&
           setTimeout(() => this.playTone(196, 300, 'sawtooth'), 150)
  }

  playClick() {
    return this.playTone(800, 50, 'square')
  }

  playNotification() {
    return this.playTone(440, 100) &&
           setTimeout(() => this.playTone(554.37, 200), 100)
  }

  playCelebration() {
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    notes.forEach((note, index) => {
      setTimeout(() => this.playTone(note, 200), index * 100)
    })
    return true
  }
}

// Combined Feedback Manager
export class FeedbackManager {
  constructor() {
    this.haptic = new HapticController()
    this.sound = new SoundController()
    
    // Load saved settings
    this.haptic.loadSettings()
    this.sound.loadSettings()
  }

  // Unified feedback methods
  success() {
    this.haptic.success()
    this.sound.playSuccess()
  }

  error() {
    this.haptic.error()
    this.sound.playError()
  }

  click() {
    this.haptic.click()
    this.sound.playClick()
  }

  notification() {
    this.haptic.notification()
    this.sound.playNotification()
  }

  celebration() {
    this.haptic.celebration()
    this.sound.playCelebration()
  }

  milestone() {
    this.haptic.milestone()
    this.sound.playNotification()
  }

  // Settings management
  getSettings() {
    return {
      haptic: {
        enabled: this.haptic.isEnabled,
        intensity: this.haptic.intensity,
        supported: this.haptic.isSupported
      },
      sound: {
        enabled: this.sound.isEnabled,
        volume: this.sound.volume,
        supported: !!this.sound.audioContext
      }
    }
  }

  updateSettings(settings) {
    if (settings.haptic) {
      if (settings.haptic.enabled !== undefined) {
        this.haptic.setEnabled(settings.haptic.enabled)
      }
      if (settings.haptic.intensity !== undefined) {
        this.haptic.setIntensity(settings.haptic.intensity)
      }
    }

    if (settings.sound) {
      if (settings.sound.enabled !== undefined) {
        this.sound.setEnabled(settings.sound.enabled)
      }
      if (settings.sound.volume !== undefined) {
        this.sound.setVolume(settings.sound.volume)
      }
    }
  }
}

// Global feedback manager instance
export const feedbackManager = new FeedbackManager()

// React hook for feedback
export const useFeedback = () => {
  return {
    success: () => feedbackManager.success(),
    error: () => feedbackManager.error(),
    click: () => feedbackManager.click(),
    notification: () => feedbackManager.notification(),
    celebration: () => feedbackManager.celebration(),
    milestone: () => feedbackManager.milestone(),
    settings: feedbackManager.getSettings(),
    updateSettings: (settings) => feedbackManager.updateSettings(settings)
  }
}
