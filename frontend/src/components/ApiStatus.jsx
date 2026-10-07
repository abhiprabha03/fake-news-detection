import Button from './Button'
import './ApiStatus.css'

const LABELS = {
  checking: 'Connecting to server…',
  online: 'Server online',
  offline: 'Server unreachable',
}

export default function ApiStatus({ status, modelLoaded, onRefresh }) {
  const label = status === 'online' && !modelLoaded ? 'Server online, model loading' : LABELS[status]

  return (
    <div className="api-status">
      <span className={`api-status-dot is-${status}`} aria-hidden="true" />
      <span role="status">{label}</span>
      {status === 'offline' && (
        <Button variant="text" onClick={onRefresh}>
          Retry
        </Button>
      )}
    </div>
  )
}
