import Spinner from './Spinner'
import './Button.css'

export default function Button({ variant = 'secondary', loading = false, type = 'button', children, ...props }) {
  return (
    <button type={type} className={`btn btn-${variant}`} {...props}>
      {loading && <Spinner />}
      {children}
    </button>
  )
}
