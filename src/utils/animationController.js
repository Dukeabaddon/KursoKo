/**
 * Advanced Animation Controller
 * 
 * Performance-optimized animation system with accessibility considerations
 * Provides smooth, purposeful animations for youth engagement
 */

// Animation performance utilities
export class AnimationController {
  constructor() {
    this.isReducedMotion = this.checkReducedMotion()
    this.animationQueue = []
    this.isProcessing = false
    this.observers = new Map()
    
    // Listen for reduced motion preference changes
    this.setupReducedMotionListener()
    
    // Setup intersection observer for performance
    this.setupIntersectionObserver()
  }

  // Check user's reduced motion preference
  checkReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  // Setup listener for reduced motion changes
  setupReducedMotionListener() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', (e) => {
      this.isReducedMotion = e.matches
      this.handleReducedMotionChange()
    })
  }

  // Handle reduced motion preference changes
  handleReducedMotionChange() {
    if (this.isReducedMotion) {
      // Disable or simplify animations
      document.documentElement.style.setProperty('--animation-duration', '0.01s')
      document.documentElement.style.setProperty('--transition-duration', '0.01s')
    } else {
      // Restore normal animations
      document.documentElement.style.removeProperty('--animation-duration')
      document.documentElement.style.removeProperty('--transition-duration')
    }
  }

  // Setup intersection observer for performance optimization
  setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const element = entry.target
          const animationData = this.observers.get(element)
          
          if (entry.isIntersecting && animationData) {
            this.triggerAnimation(element, animationData)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )
  }

  // Register element for viewport-based animation
  observeElement(element, animationConfig) {
    this.observers.set(element, animationConfig)
    this.intersectionObserver.observe(element)
  }

  // Unregister element
  unobserveElement(element) {
    this.observers.delete(element)
    this.intersectionObserver.unobserve(element)
  }

  // Queue animation for performance
  queueAnimation(animationFn, priority = 'normal') {
    this.animationQueue.push({ fn: animationFn, priority })
    this.processQueue()
  }

  // Process animation queue
  async processQueue() {
    if (this.isProcessing) return
    
    this.isProcessing = true
    
    // Sort by priority
    this.animationQueue.sort((a, b) => {
      const priorities = { high: 3, normal: 2, low: 1 }
      return priorities[b.priority] - priorities[a.priority]
    })

    while (this.animationQueue.length > 0) {
      const { fn } = this.animationQueue.shift()
      
      // Use requestAnimationFrame for smooth animations
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          fn()
          resolve()
        })
      })
      
      // Small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 16))
    }
    
    this.isProcessing = false
  }

  // Trigger animation with performance considerations
  triggerAnimation(element, config) {
    if (this.isReducedMotion && !config.essential) {
      // Skip non-essential animations
      if (config.onComplete) config.onComplete()
      return
    }

    const { animation, duration = 300, delay = 0, easing = 'ease-out' } = config

    // Apply animation
    element.style.animation = `${animation} ${duration}ms ${easing} ${delay}ms forwards`
    
    // Cleanup after animation
    setTimeout(() => {
      element.style.animation = ''
      if (config.onComplete) config.onComplete()
    }, duration + delay)
  }

  // Staggered animations for lists
  staggerAnimation(elements, config) {
    const { animation, staggerDelay = 100, ...restConfig } = config
    
    elements.forEach((element, index) => {
      const delay = index * staggerDelay
      this.queueAnimation(() => {
        this.triggerAnimation(element, {
          ...restConfig,
          animation,
          delay
        })
      })
    })
  }

  // Smooth scroll with animation
  smoothScrollTo(target, options = {}) {
    const {
      duration = 800,
      easing = 'easeInOutCubic',
      offset = 0,
      onComplete
    } = options

    const targetElement = typeof target === 'string' 
      ? document.querySelector(target) 
      : target

    if (!targetElement) return

    const startPosition = window.pageYOffset
    const targetPosition = targetElement.offsetTop - offset
    const distance = targetPosition - startPosition
    let startTime = null

    const easingFunctions = {
      easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
      easeOutQuart: t => 1 - (--t) * t * t * t,
      easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    }

    const easingFn = easingFunctions[easing] || easingFunctions.easeInOutCubic

    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const ease = easingFn(progress)

      window.scrollTo(0, startPosition + distance * ease)

      if (progress < 1) {
        requestAnimationFrame(animation)
      } else if (onComplete) {
        onComplete()
      }
    }

    requestAnimationFrame(animation)
  }

  // Parallax effect with performance optimization
  setupParallax(elements) {
    let ticking = false

    const updateParallax = () => {
      const scrollTop = window.pageYOffset

      elements.forEach(({ element, speed = 0.5, direction = 'up' }) => {
        const rect = element.getBoundingClientRect()
        const isVisible = rect.bottom >= 0 && rect.top <= window.innerHeight

        if (isVisible) {
          const yPos = scrollTop * speed
          const transform = direction === 'up' 
            ? `translateY(-${yPos}px)` 
            : `translateY(${yPos}px)`
          
          element.style.transform = transform
        }
      })

      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', onScroll)
  }

  // Cleanup method
  destroy() {
    this.intersectionObserver.disconnect()
    this.observers.clear()
    this.animationQueue = []
  }
}

// React hook for animations
export const useAnimations = () => {
  const controller = new AnimationController()

  const animateOnScroll = (ref, config) => {
    if (ref.current) {
      controller.observeElement(ref.current, config)
    }
  }

  const staggerChildren = (parentRef, config) => {
    if (parentRef.current) {
      const children = Array.from(parentRef.current.children)
      controller.staggerAnimation(children, config)
    }
  }

  const smoothScroll = (target, options) => {
    controller.smoothScrollTo(target, options)
  }

  return {
    animateOnScroll,
    staggerChildren,
    smoothScroll,
    isReducedMotion: controller.isReducedMotion
  }
}

// Performance monitoring
export class AnimationPerformanceMonitor {
  constructor() {
    this.metrics = {
      frameDrops: 0,
      averageFPS: 60,
      animationCount: 0
    }
    this.isMonitoring = false
  }

  startMonitoring() {
    if (this.isMonitoring) return

    this.isMonitoring = true
    let lastTime = performance.now()
    let frameCount = 0
    let totalTime = 0

    const monitor = (currentTime) => {
      const deltaTime = currentTime - lastTime
      frameCount++
      totalTime += deltaTime

      // Calculate FPS
      if (frameCount % 60 === 0) {
        this.metrics.averageFPS = Math.round(1000 / (totalTime / 60))
        totalTime = 0
      }

      // Detect frame drops (> 16.67ms for 60fps)
      if (deltaTime > 16.67) {
        this.metrics.frameDrops++
      }

      lastTime = currentTime

      if (this.isMonitoring) {
        requestAnimationFrame(monitor)
      }
    }

    requestAnimationFrame(monitor)
  }

  stopMonitoring() {
    this.isMonitoring = false
  }

  getMetrics() {
    return { ...this.metrics }
  }

  reset() {
    this.metrics = {
      frameDrops: 0,
      averageFPS: 60,
      animationCount: 0
    }
  }
}

// Global animation controller instance
export const animationController = new AnimationController()

export default {
  AnimationController,
  useAnimations,
  AnimationPerformanceMonitor,
  animationController
}
