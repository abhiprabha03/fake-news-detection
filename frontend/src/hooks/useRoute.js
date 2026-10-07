import { useEffect, useState } from 'react'
import { normalizePath } from '../lib/routes'

// Returns the current path. Link clicks and the back button both fire `popstate`.
export function useRoute() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  return path
}
