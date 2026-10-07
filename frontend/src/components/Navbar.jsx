import { useEffect, useState } from 'react'
import { GITHUB_URL, PROJECT_NAME } from '../config'
import { withBase } from '../lib/routes'
import Link from './Link'
import './Navbar.css'

const LINKS = [
  { page: 'home', to: '/', label: 'Home' },
  { page: 'analyze', to: '/analyze', label: 'Analyze' },
  { page: 'history', to: '/history', label: 'History' },
  { page: 'about', to: '/about', label: 'About' },
]

function GithubMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

export default function Navbar({ currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={withBase('/assets/logo.png')} alt="" width="24" height="24" />
          <span>{PROJECT_NAME}</span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {menuOpen ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
          </svg>
        </button>

        <nav id="site-menu" className={`navbar-menu ${menuOpen ? 'is-open' : ''}`} aria-label="Main">
          <ul className="navbar-links">
            {LINKS.map((link) => (
              <li key={link.page}>
                <Link
                  to={link.to}
                  onClick={closeMenu}
                  className="navbar-link"
                  aria-current={currentPage === link.page ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <a className="navbar-github" href={GITHUB_URL} target="_blank" rel="noreferrer">
            <GithubMark />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
