import Button from './Button'
import './Notice.css'

// A short message box. variant: 'error' | 'info'
export default function Notice({ variant = 'info', actionLabel, onAction, children }) {
  return (
    <div className={`notice notice-${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <p>{children}</p>
      {onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
