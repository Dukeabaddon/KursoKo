function Navbar({ onHomeClick, currentQuestion, totalQuestions, showProgress = false }) {
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Discover', href: '#discover' },
    { name: 'FAQ', href: '#faq' }
  ]

  return (
    <nav className="kursoKo-navbar">
      <div className="kursoKo-navbar-container">
        {/* Logo with Concert One font */}
        <div 
          className="kursoKo-logo-container"
          onClick={onHomeClick}
        >
          <h1 className="kursoKo-logo">
            <span className="kursoKo-logo-part1">Kurso</span>
            <span className="kursoKo-logo-part2">Ko</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="kursoKo-nav-links">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href}
              className="kursoKo-nav-link"
              onClick={(e) => {
                e.preventDefault()
                if (link.name === 'Home') onHomeClick()
              }}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Progress indicator for questionnaire */}
        {showProgress && totalQuestions > 0 && (
          <div className="kursoKo-progress-container">
            <div className="kursoKo-progress-bar">
              <div
                className="kursoKo-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="kursoKo-progress-text">
              {currentQuestion + 1}/{totalQuestions}
            </span>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
