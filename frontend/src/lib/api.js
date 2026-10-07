// All backend calls live here. Endpoints and request formats are unchanged:
//   GET  /api/health
//   POST /api/predict   { text }
//   POST /api/feedback  { feedback: 'real' | 'fake', text }

const FALLBACK_API_BASE = 'https://fake-news-detection-api-8zp1.onrender.com'
const REQUEST_TIMEOUT_MS = 75000
const HEALTH_CHECK_TIMEOUT_MS = 60000

function isPrivateIpv4Host(hostname) {
  if (/^10\./.test(hostname)) return true
  if (/^192\.168\./.test(hostname)) return true
  return /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
}

// On localhost / LAN the Vite dev proxy forwards /api to the backend.
// Anywhere else, fall back to the hosted API unless VITE_API_BASE_URL is set.
function resolveDefaultApiBase() {
  const hostname = (window.location.hostname || '').toLowerCase()
  const isLocalHost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '[::1]' ||
    isPrivateIpv4Host(hostname)

  return isLocalHost ? window.location.origin : FALLBACK_API_BASE
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || resolveDefaultApiBase()).replace(/\/$/, '')

const endpoint = (path) => `${API_BASE}${path}`

export class ApiError extends Error {}

function firstText(candidates) {
  const found = candidates.find((item) => typeof item === 'string' && item.trim().length > 0)
  return found ? found.trim() : ''
}

function extractServerMessage(payload) {
  if (!payload || typeof payload !== 'object') return ''

  const direct = firstText([payload.message, payload.note, payload.error, payload.detail])
  if (direct) return direct

  // FastAPI validation errors arrive as an array (or object) under `detail`.
  const details = Array.isArray(payload.detail) ? payload.detail : [payload.detail]
  for (const item of details) {
    if (typeof item === 'string' && item.trim()) return item.trim()
    if (item && typeof item === 'object') {
      const text = firstText([item.msg, item.message, item.error])
      if (text) return text
    }
  }

  return ''
}

function resolveApiErrorMessage(status, context, serverMessage) {
  if (serverMessage) return serverMessage

  if (status === 400) {
    return context === 'predict-image'
      ? 'Invalid image input. Please upload a clear PNG/JPG/WEBP file and try again.'
      : 'Invalid request. Please review your input and try again.'
  }
  if (status === 413) return 'Input is too large. Please reduce text/image size and retry.'
  if (status === 415) return 'Unsupported file type. Please upload PNG, JPG, or WEBP.'
  if (status === 422) return 'Input format is not valid. Please check required fields and submit again.'
  if (status === 429) return 'Too many requests right now. Please wait a few seconds and try again.'
  if (status >= 500) return 'Server error occurred. Please retry in a moment.'
  if (context === 'feedback') return 'Feedback could not be submitted. Please try again.'
  return 'Request failed. Please try again.'
}

function resolveNetworkErrorMessage(error, context) {
  if (error?.name === 'AbortError') return 'Request timed out. Please retry.'
  if (context === 'feedback') return 'Unable to submit feedback right now. Check connection and retry.'
  if (context === 'health') return 'Health check failed. API may be unreachable.'
  return 'Unable to connect to backend. Check connection and retry.'
}

async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    window.clearTimeout(timer)
  }
}

async function safeJson(response) {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

async function request(path, options, context, timeoutMs) {
  let response
  try {
    response = await fetchWithTimeout(endpoint(path), options, timeoutMs)
  } catch (error) {
    throw new ApiError(resolveNetworkErrorMessage(error, context))
  }

  const data = await safeJson(response)
  if (!response.ok) {
    throw new ApiError(resolveApiErrorMessage(response.status, context, extractServerMessage(data)))
  }
  return data
}

function postJson(body) {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export async function checkHealth() {
  const data = await request('/api/health', {}, 'health', HEALTH_CHECK_TIMEOUT_MS)
  return { modelLoaded: Boolean(data.model_loaded) }
}

// `context` is 'predict-text' or 'predict-image'; it only changes the wording of error messages.
export function predictText(text, context = 'predict-text') {
  return request('/api/predict', postJson({ text }), context)
}

export function sendFeedback(feedback, text) {
  return request('/api/feedback', postJson({ feedback, text }), 'feedback')
}
