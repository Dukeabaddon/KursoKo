import { useEffect, useState } from 'react'

function HomePage({ onStartQuestionnaire }) {
  const [currentSection, setCurrentSection] = useState(0)

  useEffect(() => {
    // Keyboard navigation
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        scrollToSection(Math.min(currentSection + 1, 3))
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        scrollToSection(Math.max(currentSection - 1, 0))
      }
    }

    // Section navigation dots click
    const handleDotClick = (event) => {
      const sectionIndex = parseInt(event.target.dataset.section)
      if (!isNaN(sectionIndex)) {
        scrollToSection(sectionIndex)
      }
    }

    // Scroll to section function
    const scrollToSection = (index) => {
      const section = document.querySelector(`[data-section="${index}"]`)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
        setCurrentSection(index)
        updateActiveNavDot(index)
      }
    }

    // Update active navigation dot
    const updateActiveNavDot = (index) => {
      document.querySelectorAll('.nav-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index)
      })
    }

    // Intersection Observer for section detection
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = parseInt(entry.target.dataset.section)
          setCurrentSection(sectionIndex)
          updateActiveNavDot(sectionIndex)
        }
      })
    }, observerOptions)

    // Observe all sections
    document.querySelectorAll('[data-section]').forEach((section) => {
      observer.observe(section)
    })

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown)
    document.querySelector('.section-navigation').addEventListener('click', handleDotClick)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      const nav = document.querySelector('.section-navigation')
      if (nav) nav.removeEventListener('click', handleDotClick)
      observer.disconnect()
    }
  }, [currentSection])

  return (
    <div className="kursoKo-homepage-modern">
      {/* Section Navigation Indicator */}
      <div className="section-navigation">
        <div className="nav-dot active" data-section="0"></div>
        <div className="nav-dot" data-section="1"></div>
        <div className="nav-dot" data-section="2"></div>
        <div className="nav-dot" data-section="3"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section" data-section="0">
        {/* Floating Background Elements */}
        <div className="floating-elements-container">
          <div className="floating-asset top-left-clouds">
            <div className="css-cloud-shape"></div>
          </div>
          <div className="floating-asset top-right-shapes">
            <div className="css-geometric-shape"></div>
          </div>
          <div className="floating-asset mid-left-riasec">
            <div className="css-tools-shape">🛠️</div>
          </div>
          <div className="floating-asset mid-right-careers">
            <div className="css-career-shape">💼</div>
          </div>
          <div className="floating-asset bottom-scattered">
            <div className="css-stars-shape">✨⭐✨</div>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="hero-content">
          {/* Main Headline */}
          <h1 className="hero-headline">
            <span className="headline-part1">Find Your Dream Career,</span>
            <span className="headline-part2 gradient-text">Make Your Family Proud</span>
            <span className="headline-part3">🇵🇭</span>
          </h1>
          
          {/* Subtitle */}
          <p className="hero-subtitle">
            Join 50,000+ Filipino students who discovered their perfect career path. 
            Get AI-powered guidance, scholarship opportunities, and the confidence to choose your future in just 15 minutes.
          </p>
          
          {/* CTA Button with Star (from Figma design) */}
          <button 
            onClick={onStartQuestionnaire}
            className="hero-cta-button"
          >
            <span className="cta-text">Start Now</span>
            <div className="cta-star-icon">
              <img src="/assets/star.png" alt="Star" className="star-image" />
            </div>
          </button>
        </div>

        {/* Hero Illustration */}
        <div className="hero-illustration">
          <img src="https://source.unsplash.com/800x600/?student,laptop,isometric" alt="3D Student with Laptop" className="hero-illustration-image" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" data-section="1">
        <div className="features-container">
          <h2 className="features-title">Why Choose <span className="gradient-text">KursoKo</span>?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                🧠
              </div>
              <h3 className="feature-title">AI-Powered Insights</h3>
              <p className="feature-description">
                Advanced algorithms trained on Filipino student data provide accurate career matching that understands our culture and job market.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                ⏱️
              </div>
              <h3 className="feature-title">15-Minute Assessment</h3>
              <p className="feature-description">
                Perfect for busy students! Get comprehensive results faster than your lunch break, with 94% accuracy rate proven by Filipino universities.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                🏫
              </div>
              <h3 className="feature-title">Local University Partners</h3>
              <p className="feature-description">
                Trusted by UP, Ateneo, La Salle, and 50+ Philippine universities. Recommendations tailored for our local job market.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                💰
              </div>
              <h3 className="feature-title">₱2M+ Scholarships Found</h3>
              <p className="feature-description">
                Connect with government and private scholarships matching your chosen career path. Real financial support for your dreams.
              </p>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="features-bg-elements">
          <div className="bg-asset features-bg-grid">
            <div className="css-dots-pattern"></div>
          </div>
          <div className="bg-asset features-bg-shapes">
            <div className="css-floating-shape"></div>
          </div>
        </div>
      </section>

      {/* RIASEC Preview Section */}
      <section className="riasec-section" data-section="2">
        <div className="riasec-container">
          <h2 className="riasec-title">What's Your <span className="gradient-text">Career DNA</span>?</h2>
          <p className="riasec-subtitle">
            Discover which of the 6 personality types matches your natural talents and interests
          </p>
          
          <div className="riasec-types-grid">
            <div className="riasec-type-card realistic">
              <div className="riasec-icon">
                🔧
              </div>
              <h3 className="riasec-type-name">The Builder 🔧</h3>
              <p className="riasec-type-desc">Engineer, Architect, Mechanic</p>
            </div>
            
            <div className="riasec-type-card investigative">
              <div className="riasec-icon">
                🔬
              </div>
              <h3 className="riasec-type-name">The Researcher 🔬</h3>
              <p className="riasec-type-desc">Scientist, Doctor, Data Analyst</p>
            </div>
            
            <div className="riasec-type-card artistic">
              <div className="riasec-icon">
                🎨
              </div>
              <h3 className="riasec-type-name">The Creator 🎨</h3>
              <p className="riasec-type-desc">Designer, Writer, Filmmaker</p>
            </div>
            
            <div className="riasec-type-card social">
              <div className="riasec-icon">
                💙
              </div>
              <h3 className="riasec-type-name">The Helper 💙</h3>
              <p className="riasec-type-desc">Teacher, Nurse, Counselor</p>
            </div>
            
            <div className="riasec-type-card enterprising">
              <div className="riasec-icon">
                📈
              </div>
              <h3 className="riasec-type-name">The Leader 📈</h3>
              <p className="riasec-type-desc">CEO, Lawyer, Entrepreneur</p>
            </div>
            
            <div className="riasec-type-card conventional">
              <div className="riasec-icon">
                📊
              </div>
              <h3 className="riasec-type-name">The Organizer 📊</h3>
              <p className="riasec-type-desc">Accountant, HR, Administrator</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section" data-section="3">
        <div className="final-cta-container">
          <div className="final-cta-content">
            <h2 className="final-cta-title">Your Dream Career is Just <span className="gradient-text">15 Minutes Away</span> ⏱️</h2>
            <p className="final-cta-subtitle">
              Join 50,000+ Filipino students who found their perfect career match. Start your journey to success today - completely FREE!
            </p>
            
            <button 
              onClick={onStartQuestionnaire}
              className="final-cta-button"
            >
              <span className="cta-text">Start Now</span>
              <div className="cta-star-icon">
                <img src="/assets/star.png" alt="Star" className="star-image" />
              </div>
            </button>
          </div>
          
          <div className="final-cta-illustration">
            <div className="css-celebration-graphic">🎓✨🎉</div>
          </div>
        </div>

        {/* Background elements */}
        <div className="final-cta-bg">
          <div className="bg-asset cta-bg-pattern">
            <div className="css-success-pattern">🎓 ⭐ ⬆️ 🎓 ⭐ ⬆️</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
