import { useCallback, useEffect, useState } from 'react'
import { KursoKoLogo } from '../brand'
import {
  landingBtnPrimary,
  landingBtnPrimaryMobile,
  landingNavLink,
  landingNavShell
} from '../landing/landingClasses'
import { smoothScrollToHash } from '../../utils/smoothScroll'

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#how', label: 'How it works' },
  { href: '#faq', label: 'FAQ' }
]

const Navbar = ({ onStart }) => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnchorClick = useCallback((event, href) => {
    event.preventDefault()
    smoothScrollToHash(href)
    setOpen(false)
  }, [])

  return (
    <header className={landingNavShell(scrolled)}>
      <nav
        id="navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:px-8"
        aria-label="Primary"
      >
        <a
          href="#hero"
          onClick={(e) => handleAnchorClick(e, '#hero')}
          className="flex shrink-0 items-center rounded-lg py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-accent"
          aria-label="KursoKo Home"
        >
          <KursoKoLogo iconSize={26} />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleAnchorClick(e, href)}
              className={landingNavLink}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            type="button"
            onClick={onStart}
            className={landingBtnPrimary}
            aria-label="Start Assessment"
          >
            Start Assessment
          </button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-landing-ink hover:bg-landing-ink/5 md:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-landing-ink/10 bg-landing-paper md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map(({ href, label }) => (
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
    </header>
  )
}

export default Navbar
