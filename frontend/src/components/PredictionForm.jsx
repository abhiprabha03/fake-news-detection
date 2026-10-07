import Button from './Button'
import Tabs from './Tabs'
import UploadBox from './UploadBox'
import './PredictionForm.css'

const MODES = [
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Image' },
]

export default function PredictionForm({ analyzer }) {
  const { mode, text, imageFile, imagePreview, loading, stage, loadingSample } = analyzer

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const hasInput = mode === 'image' ? Boolean(imageFile) : text.trim().length > 0

  const handleSubmit = (event) => {
    event.preventDefault()
    void analyzer.analyze()
  }

  // Ctrl/Cmd + Enter submits from the textarea
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && hasInput) {
      event.preventDefault()
      void analyzer.analyze()
    }
  }

  const buttonLabel = loading ? (stage === 'reading' ? 'Reading image…' : 'Analyzing…') : 'Analyze'

  return (
    <form className="prediction-form" onSubmit={handleSubmit}>
      <Tabs options={MODES} value={mode} onChange={analyzer.setMode} label="Input type" />

      {mode === 'text' ? (
        <div className="field">
          <label htmlFor="news-text">News headline or article</label>
          <textarea
            id="news-text"
            rows={7}
            value={text}
            onChange={(event) => analyzer.setText(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste a headline or article here..."
            disabled={loading}
          />
          <div className="field-meta">
            <span>
              {text.length} characters · {words} words
            </span>
            <Button variant="text" onClick={analyzer.fillSampleText} disabled={loading}>
              Use an example
            </Button>
          </div>
        </div>
      ) : (
        <div className="field">
          <span className="field-label">News image</span>
          <UploadBox
            file={imageFile}
            previewUrl={imagePreview}
            onSelect={analyzer.selectImage}
            onRemove={analyzer.removeImage}
            disabled={loading}
          />
          <div className="field-meta">
            <span>Text in the image is read in your browser, then analyzed.</span>
            {!imageFile && (
              <Button variant="text" onClick={analyzer.fillSampleImage} disabled={loading || loadingSample}>
                {loadingSample ? 'Preparing…' : 'Use a sample image'}
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="form-actions">
        <Button type="submit" variant="primary" loading={loading} disabled={!hasInput || loading}>
          {buttonLabel}
        </Button>
        <Button onClick={analyzer.clearAll} disabled={loading || (!text && !imageFile)}>
          Clear
        </Button>
      </div>
    </form>
  )
}
