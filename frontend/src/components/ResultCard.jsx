import { buildFactCheckTips, buildTopReasons, confidenceFromProb } from '../lib/insights'
import FeedbackPrompt from './FeedbackPrompt'
import './ResultCard.css'

const LABELS = { REAL: 'Likely real', FAKE: 'Likely fake' }

export default function ResultCard({ result, mode, feedback, feedbackDisabled, onFeedback }) {
  const kind = result.result === 'FAKE' ? 'fake' : 'real'
  const confidence = confidenceFromProb(result.result, result.prob)
  const reasons = buildTopReasons(result, mode, confidence)
  const tips = buildFactCheckTips(result, mode)

  return (
    <section className={`result result-${kind}`} aria-label="Prediction result">
      <div className="result-summary">
        <p className="result-eyebrow">Prediction</p>
        <h2 className="result-label">{LABELS[result.result] ?? LABELS.REAL}</h2>

        {confidence !== null && (
          <div className="result-confidence">
            <div className="result-confidence-row">
              <span>Confidence</span>
              <strong>{confidence}%</strong>
            </div>
            <div className="result-bar" aria-hidden="true">
              <div className="result-bar-fill" style={{ width: `${confidence}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="result-body">
        <div>
          <h3>Why this result</h3>
          <ul className="result-reasons">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>

        <details>
          <summary>How to verify this yourself</summary>
          <ul className="result-reasons">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </details>

        {mode === 'image' && result.input_text && (
          <details>
            <summary>Text read from the image</summary>
            <p className="result-extracted">{result.input_text}</p>
          </details>
        )}

        <FeedbackPrompt feedback={feedback} disabled={feedbackDisabled} onSubmit={onFeedback} />

        <p className="result-disclaimer">This is an automated prediction and may be wrong.</p>
      </div>
    </section>
  )
}
