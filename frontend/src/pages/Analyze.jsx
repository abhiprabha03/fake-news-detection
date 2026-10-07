import ApiStatus from '../components/ApiStatus'
import LoadingState from '../components/LoadingState'
import Notice from '../components/Notice'
import PredictionForm from '../components/PredictionForm'
import ResultCard from '../components/ResultCard'
import './Analyze.css'

export default function Analyze({ analyzer, health }) {
  const { result, error, loading, stage, mode } = analyzer

  return (
    <div className="page">
      <div className="container container-narrow stack">
        <div className="analyze-header">
          <div>
            <h1 className="page-title">Analyze news</h1>
            <p className="page-lead">Check whether a news story is likely to be fake or real.</p>
          </div>
          <ApiStatus status={health.status} modelLoaded={health.modelLoaded} onRefresh={health.refresh} />
        </div>

        <PredictionForm analyzer={analyzer} />

        {error && (
          <Notice variant="error" actionLabel="Try again" onAction={analyzer.canRetry ? analyzer.retryLast : undefined}>
            {error}
          </Notice>
        )}

        {loading && (
          <LoadingState>
            {stage === 'reading'
              ? 'Reading text from the image. The first time can take a little longer.'
              : 'Analyzing the text…'}
          </LoadingState>
        )}

        {!loading && result?.note && !result.result && <Notice>{result.note}</Notice>}

        {!loading && result?.result && (
          <ResultCard
            result={result}
            mode={mode}
            feedback={analyzer.feedback}
            feedbackDisabled={loading}
            onFeedback={analyzer.submitFeedback}
          />
        )}
      </div>
    </div>
  )
}
