import { PROJECT_NAME } from '../config'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          {PROJECT_NAME} · Results are predictions based on patterns in data, not a fact-check. Always verify with
          trusted sources.
        </p>
      </div>
    </footer>
  )
}
