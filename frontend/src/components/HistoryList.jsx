import { historyConfidence } from '../lib/insights'
import './HistoryList.css'

const LABELS = { REAL: 'Likely real', FAKE: 'Likely fake' }

const dateFormat = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return Number.isNaN(date.getTime()) ? 'Recent' : dateFormat.format(date)
}

export default function HistoryList({ items }) {
  return (
    <table className="history-table">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Input</th>
          <th scope="col">Prediction</th>
          <th scope="col">Confidence</th>
          <th scope="col">Text</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const confidence = historyConfidence(item)
          return (
            <tr key={item.id}>
              <td className="col-date">{formatDate(item.checkedAt)}</td>
              <td className="col-input">{item.mode === 'image' ? 'Image' : 'Text'}</td>
              <td className={`col-result is-${item.result === 'FAKE' ? 'fake' : 'real'}`}>
                {LABELS[item.result] ?? item.result}
              </td>
              <td className="col-confidence">{confidence === null ? '–' : `${confidence}%`}</td>
              <td className="col-text">{item.excerpt}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
