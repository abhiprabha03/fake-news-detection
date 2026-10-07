import Button from './Button'
import './FeedbackPrompt.css'

export default function FeedbackPrompt({ feedback, disabled, onSubmit }) {
  const sending = feedback.status === 'sending'

  if (feedback.status === 'sent') {
    return (
      <div className="feedback">
        <p className="feedback-thanks">Thanks, your feedback was recorded.</p>
      </div>
    )
  }

  return (
    <div className="feedback">
      <p>Was this prediction correct?</p>
      <div className="feedback-buttons">
        <Button onClick={() => onSubmit(true)} disabled={disabled || sending} loading={sending && feedback.choice === 'yes'}>
          Yes
        </Button>
        <Button onClick={() => onSubmit(false)} disabled={disabled || sending} loading={sending && feedback.choice === 'no'}>
          No
        </Button>
      </div>
    </div>
  )
}
