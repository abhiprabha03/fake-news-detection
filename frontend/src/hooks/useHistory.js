import { useCallback, useEffect, useState } from 'react'

// Same key as before, so existing history carries over.
const STORAGE_KEY = 'fake-news-history-v1'
const MAX_ITEMS = 20

function readHistory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => item && typeof item.result === 'string').slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}

function writeHistory(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // Storage can be blocked (private mode); history just won't persist.
  }
}

function makeExcerpt(text, mode) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return mode === 'image' ? 'Image input analyzed' : 'Text input analyzed'
  return clean.length > 110 ? `${clean.slice(0, 110)}...` : clean
}

export function useHistory() {
  const [items, setItems] = useState(readHistory)

  useEffect(() => {
    writeHistory(items)
  }, [items])

  const add = useCallback((payload, mode, fallbackInput = '') => {
    if (!payload?.result) return

    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      mode,
      result: payload.result,
      prob: typeof payload.prob === 'number' ? payload.prob : null,
      excerpt: makeExcerpt(payload.input_text || fallbackInput, mode),
      checkedAt: new Date().toISOString(),
    }

    setItems((current) => {
      const withoutDuplicate = current.filter(
        (item) => !(item.mode === entry.mode && item.result === entry.result && item.excerpt === entry.excerpt),
      )
      return [entry, ...withoutDuplicate].slice(0, MAX_ITEMS)
    })
  }, [])

  const clear = useCallback(() => setItems([]), [])

  return { items, add, clear }
}
