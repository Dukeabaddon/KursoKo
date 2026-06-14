import { useEffect, useState } from 'react'
import {
  landingBtnPrimary,
  landingNavLink,
  landingNavShell,
  landingWordmark,
  landingWordmarkAccent
} from '../landing/landingClasses'

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#how', label: 'How it works' },
  { href: '#faq', label: 'FAQ' }
]

const NavLink = ({ href, children, onClick }) => (
  <a href={href} onClick={onClick} className={landingNavLink}>
    {children}
  </a>
)

const Navbar = ({ onStart }) => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={landingNavShell(scrolled)}>
      <nav
        id="navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:px-8"
        aria-label="Primary"
      >
        <a href="#hero" className={landingWordmark} aria-label="KursoKo Home">
          Kurso<span className={landingWordmarkAccent}>Ko</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <NavLink key={href} href={href}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            type="button"
            onClick={onStart}
            className={`${landingBtnPrimary} px-4 py-2 text-sm`}
            aria-label="Start Assessment"
          >
            Start Assessment
          </button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-landing-ink hover:bg-black/5 md:hidden"
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
        <div className="border-t border-stone-200/80 bg-landing-paper md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map(({ href, label }) => (
              <NavLink key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onStart?.()
              }}
              className={`${landingBtnPrimary} mt-2 w-full px-4 py-2.5 text-sm`}
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
