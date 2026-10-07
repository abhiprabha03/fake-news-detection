import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import HistoryList from '../components/HistoryList'
import Link from '../components/Link'
import './History.css'

export default function History({ history }) {
  const { items, clear } = history

  const handleClear = () => {
    if (window.confirm('Remove all saved analyses from this browser?')) clear()
  }

  return (
    <div className="page">
      <div className="container stack">
        <div className="history-header">
          <div>
            <h1 className="page-title">History</h1>
            <p className="page-lead">Your recent analyses. They are saved in this browser only.</p>
          </div>
          {items.length > 0 && <Button onClick={handleClear}>Clear history</Button>}
        </div>

        {items.length > 0 ? (
          <HistoryList items={items} />
        ) : (
          <EmptyState title="No analyses yet" description="Your recent predictions will appear here.">
            <Link to="/analyze" className="btn btn-primary">
              Analyze news
            </Link>
          </EmptyState>
        )}
      </div>
    </div>
  )
}
