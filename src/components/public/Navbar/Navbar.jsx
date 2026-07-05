import { useCallback, useState } from 'react'
import { KursoKoLogo } from '../brand'
import {
  landingBtnPrimary,
  landingBtnPrimaryMobile,
  landingGlowBlockProps,
  landingNavLink,
} from '../../landing/landingClasses'
import { useLenis, useScrollNavbar, NAV_MODES } from '../../landing/motion'
import { smoothScrollToHash } from '../../../utils/smoothScroll'

const navLinks = [
  { href: '#riasec', label: 'Types' },
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Why KursoKo' },
  { href: '#faq', label: 'FAQ' },
]

/** Logo = Home on desktop. Mobile menu adds Home for clarity. */
const mobileNavLinks = [{ href: '#hero', label: 'Home' }, ...navLinks]

const Navbar = ({ onStart }) => {
  const [open, setOpen] = useState(false)
  const lenis = useLenis()
  const { mode } = useScrollNavbar(lenis)

  const handleAnchorClick = useCallback(
    (event, href) => {
      event.preventDefault()
      smoothScrollToHash(href, { lenis })
      setOpen(false)
    },
    [lenis],
  )

  const navModeClass = [
    'landing-nav',
    mode === NAV_MODES.REST ? 'landing-nav--rest' : 'landing-nav--pill',
    mode === NAV_MODES.HIDDEN ? 'landing-nav--hidden' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="landing-nav-host" {...landingGlowBlockProps}>
      <header className={`landing-nav ${navModeClass}`}>
        <nav id="navigation" className="landing-nav__inner" aria-label="Primary">
          <a
            href="#hero"
            onClick={(e) => handleAnchorClick(e, '#hero')}
            className="flex shrink-0 items-center rounded-lg py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent"
            aria-label="KursoKo Home"
          >
            <KursoKoLogo iconSize={mode === NAV_MODES.PILL ? 24 : 26} />
          </a>

          <div className="landing-nav__links">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleAnchorClick(e, href)}
                className={`${landingNavLink} landing-nav__link`}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="landing-nav__actions">
            <button
              type="button"
              onClick={onStart}
              className={`${landingBtnPrimary} landing-nav__cta`}
              aria-label="Start Assessment"
            >
              Start Assessment
            </button>

            <button
              type="button"
              className="landing-nav__menu-btn"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="landing-nav-mobile-menu md:hidden">
          <div className="landing-nav-mobile-menu__inner">
            {mobileNavLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleAnchorClick(e, href)}
                className={landingNavLink}
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onStart?.()
              }}
              className={`${landingBtnPrimary} ${landingBtnPrimaryMobile}`}
            >
              Start Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
