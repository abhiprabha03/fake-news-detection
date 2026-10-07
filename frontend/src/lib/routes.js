// Tiny client-side router helpers. The app only has a handful of pages,
// so a router library isn't needed. BASE_URL keeps GitHub Pages deploys working.

const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '')

export function withBase(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${BASE_PATH}${normalized}`
}

function stripBase(pathname) {
  if (!BASE_PATH) return pathname
  if (pathname === BASE_PATH) return '/'
  return pathname.startsWith(`${BASE_PATH}/`) ? pathname.slice(BASE_PATH.length) : pathname
}

export function normalizePath(pathname) {
  return stripBase(pathname || '/').toLowerCase().replace(/\/+$/, '') || '/'
}

// Old URLs (/text-check, /image-check, /feedback, /home) still resolve.
const ROUTES = {
  '/': { page: 'home' },
  '/home': { page: 'home' },
  '/analyze': { page: 'analyze' },
  '/text-check': { page: 'analyze', mode: 'text' },
  '/image-check': { page: 'analyze', mode: 'image' },
  '/feedback': { page: 'analyze' },
  '/history': { page: 'history' },
  '/about': { page: 'about' },
}

export function resolveRoute(path) {
  return ROUTES[path] ?? ROUTES['/']
}

export function navigateTo(to) {
  const target = withBase(to)
  if (window.location.pathname !== target) {
    window.history.pushState(null, '', target)
  }
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}
