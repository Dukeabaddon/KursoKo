/**
 * Accessibility Utilities
 * 
 * Comprehensive accessibility features for inclusive design
 * Ensures KursoKo is usable by all Filipino youth regardless of abilities
 */

// Accessibility controller
export class AccessibilityController {
  constructor() {
    this.settings = {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true
    }
    
    this.loadSettings()
    this.setupKeyboardNavigation()
    this.detectScreenReader()
  }

  // Load accessibility settings from localStorage
  loadSettings() {
    const saved = localStorage.getItem('kursoko-accessibility')
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) }
      this.applySettings()
    }
  }

  // Save accessibility settings
  saveSettings() {
    localStorage.setItem('kursoko-accessibility', JSON.stringify(this.settings))
  }

  // Apply accessibility settings to DOM
  applySettings() {
    const root = document.documentElement

    // High contrast mode
    if (this.settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Large text mode
    if (this.settings.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    // Reduced motion
    if (this.settings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // Screen reader optimizations
    if (this.settings.screenReader) {
      root.classList.add('screen-reader-mode')
    } else {
      root.classList.remove('screen-reader-mode')
    }
  }

  // Toggle accessibility features
  toggleHighContrast() {
    this.settings.highContrast = !this.settings.highContrast
    this.applySettings()
    this.saveSettings()
    return this.settings.highContrast
  }

  toggleLargeText() {
    this.settings.largeText = !this.settings.largeText
    this.applySettings()
    this.saveSettings()
    return this.settings.largeText
  }

  toggleReducedMotion() {
    this.settings.reducedMotion = !this.settings.reducedMotion
    this.applySettings()
    this.saveSettings()
    return this.settings.reducedMotion
  }

  // Detect screen reader usage
  detectScreenReader() {
    // Check for common screen reader indicators
    const indicators = [
      navigator.userAgent.includes('NVDA'),
      navigator.userAgent.includes('JAWS'),
      navigator.userAgent.includes('VoiceOver'),
      window.speechSynthesis && window.speechSynthesis.getVoices().length > 0
    ]

    this.settings.screenReader = indicators.some(Boolean)
    this.applySettings()
  }

  // Setup keyboard navigation
  setupKeyboardNavigation() {
    let focusedElement = null

    // Track focus for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation')
      }
    })

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation')
    })
  }

  // Announce content to screen readers
  announce(message, priority = 'polite') {
    const announcer = document.getElementById('accessibility-announcer') || this.createAnnouncer()
    announcer.setAttribute('aria-live', priority)
    announcer.textContent = message
    
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = ''
    }, 1000)
  }

  // Create screen reader announcer
  createAnnouncer() {
    const announcer = document.createElement('div')
    announcer.id = 'accessibility-announcer'
    announcer.className = 'sr-only'
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    document.body.appendChild(announcer)
    return announcer
  }

  // Focus management
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    
    // Return cleanup function
    return () => container.removeEventListener('keydown', handleTabKey)
  }

  // Color contrast checker
  checkColorContrast(foreground, background) {
    const getLuminance = (color) => {
      const rgb = color.match(/\d+/g).map(Number)
      const [r, g, b] = rgb.map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

    return {
      ratio: ratio.toFixed(2),
      aa: ratio >= 4.5,
      aaa: ratio >= 7,
      aaLarge: ratio >= 3
    }
  }
}

// Performance optimization utilities
export class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      interactionTime: 0
    }
    
    this.startTime = performance.now()
    this.setupPerformanceObserver()
  }

  // Setup performance observer
  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Observe navigation timing
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            this.metrics.loadTime = entry.loadEventEnd - entry.loadEventStart
          }
        })
      })
      navObserver.observe({ entryTypes: ['navigation'] })

      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.renderTime = entry.startTime
          }
        })
      })
      paintObserver.observe({ entryTypes: ['paint'] })
    }
  }

  // Lazy load images
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src
            img.classList.remove('lazy')
            imageObserver.unobserve(img)
          }
        })
      })

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }
  }

  // Debounce function for performance
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Throttle function for performance
  throttle(func, limit) {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // Measure component render time
  measureRenderTime(componentName, renderFn) {
    const start = performance.now()
    const result = renderFn()
    const end = performance.now()
    
    if (import.meta.env.DEV) {
      console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`)
    }
    return result
  }

  // Get performance metrics
  getMetrics() {
    return {
      ...this.metrics,
      totalTime: performance.now() - this.startTime
    }
  }
}

// React hooks for accessibility
export const useAccessibility = () => {
  const controller = new AccessibilityController()

  const announce = (message, priority) => {
    controller.announce(message, priority)
  }

  const trapFocus = (ref) => {
    if (ref.current) {
      return controller.trapFocus(ref.current)
    }
  }

  return {
    settings: controller.settings,
    toggleHighContrast: () => controller.toggleHighContrast(),
    toggleLargeText: () => controller.toggleLargeText(),
    toggleReducedMotion: () => controller.toggleReducedMotion(),
    announce,
    trapFocus
  }
}

// Global instances
export const accessibilityController = new AccessibilityController()
export const performanceOptimizer = new PerformanceOptimizer()

export default {
  AccessibilityController,
  PerformanceOptimizer,
  useAccessibility,
  accessibilityController,
  performanceOptimizer
}
