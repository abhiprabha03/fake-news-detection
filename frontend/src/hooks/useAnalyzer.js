import { useEffect, useState } from 'react'
import { ApiError, predictText, sendFeedback } from '../lib/api'
import { emptyResult } from '../lib/insights'
import { extractTextWithBrowserOcr } from '../lib/ocr'
import { createDemoImageFile, pickSampleNews } from '../lib/samples'

const NO_FEEDBACK = { choice: null, status: 'idle' } // status: idle | sending | sent | failed

function errorMessage(error) {
  return error instanceof ApiError ? error.message : 'Request failed. Please try again.'
}

// Everything the Analyze page needs: input, prediction, errors, retry and feedback.
// It lives in App (not in the page) so your text and result survive switching pages.
export function useAnalyzer({ initialMode = 'text', onResult }) {
  const [mode, setModeState] = useState(initialMode)
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [result, setResult] = useState(null)
  const [stage, setStage] = useState('idle') // idle | reading | analyzing
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(null) // null | 'predict' | 'feedback'
  const [feedback, setFeedback] = useState(NO_FEEDBACK)
  const [loadingSample, setLoadingSample] = useState(false)

  const loading = stage !== 'idle'

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const resetOutcome = () => {
    setResult(null)
    setError('')
    setRetry(null)
    setFeedback(NO_FEEDBACK)
  }

  const setMode = (next) => {
    if (next === mode) return
    setModeState(next)
    resetOutcome()
  }

  const predict = async (input, inputMode) => {
    setStage('analyzing')
    try {
      const data = await predictText(input, inputMode === 'image' ? 'predict-image' : 'predict-text')
      setResult(data)
      onResult?.(data, inputMode, input)
    } catch (requestError) {
      setError(errorMessage(requestError))
      setRetry('predict')
    }
  }

  const analyzeText = async () => {
    const input = text.trim()
    if (!input) {
      setResult(emptyResult('Please enter news text.'))
      return
    }

    try {
      await predict(input, 'text')
    } finally {
      setStage('idle')
    }
  }

  const analyzeImage = async () => {
    if (!imageFile) {
      setResult(emptyResult('Please upload an image first.'))
      return
    }

    setStage('reading')
    try {
      const extracted = await extractTextWithBrowserOcr(imageFile)
      setText(extracted)

      if (extracted.length < 20) {
        setResult(emptyResult('Could not extract enough readable text from this image.'))
        return
      }

      await predict(extracted, 'image')
    } catch {
      setError('Could not read this image. Try a clearer PNG, JPG, or WEBP file.')
      setRetry('predict')
    } finally {
      setStage('idle')
    }
  }

  const analyze = async () => {
    if (loading) return
    resetOutcome()
    await (mode === 'image' ? analyzeImage() : analyzeText())
  }

  const selectImage = (file) => {
    if (!file) return
    if (!file.type?.startsWith('image/')) {
      setError('Please upload a valid image file.')
      setRetry(null)
      return
    }

    resetOutcome()
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    resetOutcome()
  }

  const clearAll = () => {
    setText('')
    setImageFile(null)
    setImagePreview('')
    resetOutcome()
  }

  const fillSampleText = () => {
    resetOutcome()
    setText((current) => pickSampleNews(current))
  }

  const fillSampleImage = async () => {
    resetOutcome()
    setText('')
    setLoadingSample(true)
    try {
      selectImage(await createDemoImageFile())
    } catch {
      setError('Unable to load demo image.')
    } finally {
      setLoadingSample(false)
    }
  }

  // The UI asks "Was this prediction correct?". The API stores which label the
  // user believes is right, so "No" sends the opposite of the prediction.
  const submitFeedback = async (isCorrect) => {
    if (feedback.status === 'sending' || loading || !result?.result) return

    const feedbackText = result.input_text || text
    if (!feedbackText.trim()) {
      setError('No prediction available for feedback.')
      setRetry(null)
      return
    }

    const predicted = result.result === 'FAKE' ? 'fake' : 'real'
    const label = isCorrect ? predicted : predicted === 'fake' ? 'real' : 'fake'
    const choice = isCorrect ? 'yes' : 'no'

    setFeedback({ choice, status: 'sending' })
    setError('')
    setRetry(null)

    try {
      await sendFeedback(label, feedbackText)
      setFeedback({ choice, status: 'sent' })
    } catch (requestError) {
      setFeedback({ choice, status: 'failed' })
      setError(errorMessage(requestError))
      setRetry('feedback')
    }
  }

  const retryLast = () => {
    if (loading || feedback.status === 'sending') return
    if (retry === 'predict') void analyze()
    if (retry === 'feedback') void submitFeedback(feedback.choice === 'yes')
  }

  return {
    mode,
    setMode,
    text,
    setText,
    imageFile,
    imagePreview,
    result,
    stage,
    loading,
    loadingSample,
    error,
    canRetry: retry !== null && !loading && feedback.status !== 'sending',
    feedback,
    analyze,
    selectImage,
    removeImage,
    clearAll,
    fillSampleText,
    fillSampleImage,
    submitFeedback,
    retryLast,
  }
}
