import Spinner from './Spinner'
import './LoadingState.css'

export default function LoadingState({ children }) {
  return (
    <div className="loading-state" role="status">
      <Spinner />
      <p>{children}</p>
    </div>
  )
}
