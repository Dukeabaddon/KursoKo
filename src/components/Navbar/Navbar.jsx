import { useState } from 'react'

const NavLink = ({ href, children, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
  >
    {children}
  </a>
)

const Navbar = ({ onStart }) => {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between" aria-label="Primary">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2" aria-label="KursoKo Home">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-pastel-blue,#A8D8EA)] to-[var(--color-pastel-purple,#D4A5F3)]" />
          <span className="text-lg font-extrabold tracking-tight">KursoKo</span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="#hero">Home</NavLink>
          <NavLink href="#how">How it works</NavLink>
          <NavLink href="#riasec">RIASEC</NavLink>
          <NavLink href="#sample">Sample</NavLink>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <button
            type="button"
            onClick={onStart}
            className="px-4 py-2 rounded-full text-slate-900 font-semibold bg-gradient-to-r from-[var(--color-accent-orange-300)] to-[var(--color-accent-pink-200)] shadow-md hover:shadow-lg transition active:scale-95"
            aria-label="Start Assessment"
          >
            Start Assessment
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white/90">
          <div className="px-4 py-3 flex flex-col gap-1">
            <NavLink href="#hero" onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink href="#how" onClick={() => setOpen(false)}>How it works</NavLink>
            <NavLink href="#riasec" onClick={() => setOpen(false)}>RIASEC</NavLink>
            <NavLink href="#sample" onClick={() => setOpen(false)}>Sample</NavLink>
            <button
              type="button"
              onClick={() => { setOpen(false); onStart?.(); }}
              className="mt-2 w-full px-4 py-2 rounded-full text-slate-900 font-semibold bg-gradient-to-r from-[var(--color-accent-orange-300)] to-[var(--color-accent-pink-200)] shadow-md hover:shadow-lg transition active:scale-95"
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
