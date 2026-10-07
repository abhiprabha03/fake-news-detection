import { useCallback, useEffect, useState } from 'react'
import { checkHealth } from '../lib/api'

const POLL_INTERVAL_MS = 120000

function probe(setHealth) {
  return checkHealth().then(
    ({ modelLoaded }) => setHealth({ status: 'online', modelLoaded }),
    () => setHealth({ status: 'offline', modelLoaded: false }),
  )
}

// status: 'checking' | 'online' | 'offline'
export function useApiHealth() {
  const [health, setHealth] = useState({ status: 'checking', modelLoaded: false })

  useEffect(() => {
    probe(setHealth)
    const timer = window.setInterval(() => probe(setHealth), POLL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [])

  const refresh = useCallback(() => {
    setHealth((current) => ({ ...current, status: 'checking' }))
    return probe(setHealth)
  }, [])

  return { ...health, refresh }
}
