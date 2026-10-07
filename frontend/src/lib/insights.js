// Turns an API prediction into the text shown in the result card.

const BASE_FACT_CHECK_TIPS = [
  'Check source domain credibility and verify the original publisher.',
  'Verify publish date, location, and whether old content is being reposted as new.',
  'Cross-check the same claim on at least two trusted outlets.',
]

const FALLBACK_REASONS = {
  REAL: [
    'Language patterns are closer to factual reporting.',
    'No strong manipulation markers were detected.',
    'Overall signal supports a likely authentic claim.',
  ],
  FAKE: [
    'Claim style appears sensational or weakly sourced.',
    'Credibility signals are lower than expected for verified reporting.',
    'Pattern looks similar to misinformation-style content.',
  ],
}

export function emptyResult(note = null) {
  return {
    result: null,
    prob: null,
    input_text: '',
    fake_reasons: null,
    fake_reasons_list: [],
    verification_tips: [],
    note,
  }
}

// The API's `prob` is the probability that the text is REAL (class 1).
// For a FAKE prediction the model's confidence is the opposite side: 1 - prob.
export function confidenceFromProb(label, prob) {
  if (typeof prob !== 'number') return null
  const share = label === 'FAKE' ? 1 - prob : prob
  return Math.round(share * 100)
}

// History entries saved by older versions stored `confidence` (prob * 100) instead of `prob`.
export function historyConfidence(item) {
  const prob = typeof item.prob === 'number' ? item.prob : typeof item.confidence === 'number' ? item.confidence / 100 : null
  return confidenceFromProb(item.result, prob)
}

function uniqueItems(items) {
  const seen = new Set()
  const cleaned = []

  for (const item of items) {
    const text = String(item || '').replace(/\s+/g, ' ').trim()
    if (!text) continue
    // Ignore trailing punctuation so "Reason." and "Reason" count as the same item.
    const key = text.toLowerCase().replace(/[.!\s]+$/, '')
    if (seen.has(key)) continue
    seen.add(key)
    cleaned.push(text)
  }

  return cleaned
}

function parseReasonText(reasonText) {
  if (!reasonText) return []
  return String(reasonText)
    .split(/[.\n;]+/g)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function buildTopReasons(payload, mode, confidence) {
  if (!payload?.result) return []

  const label = payload.result === 'FAKE' ? 'FAKE' : 'REAL'
  const reasons = []

  // `fake_reasons` is just the list joined into one string, so only parse it if the list is empty.
  const reasonList = Array.isArray(payload.fake_reasons_list) ? payload.fake_reasons_list : []
  reasons.push(...(reasonList.length ? reasonList : parseReasonText(payload.fake_reasons)))

  if (confidence !== null) {
    reasons.unshift(`The model rates this ${confidence}% likely to be ${label === 'FAKE' ? 'fake' : 'real'}.`)
  }

  if (mode === 'image' && label === 'FAKE') {
    reasons.push('Image-extracted text appears inconsistent with reliable reporting style.')
  }

  reasons.push(...FALLBACK_REASONS[label])

  return uniqueItems(reasons).slice(0, 3)
}

export function buildFactCheckTips(payload, mode) {
  const apiTips = Array.isArray(payload?.verification_tips) ? payload.verification_tips : []
  const modeTip =
    mode === 'image'
      ? 'Run a reverse image search to detect reused, edited, or out-of-context visuals.'
      : 'Search the exact headline text on trusted sources to validate context.'

  return uniqueItems([modeTip, ...apiTips, ...BASE_FACT_CHECK_TIPS]).slice(0, 5)
}
