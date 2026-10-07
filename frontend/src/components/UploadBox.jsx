import { useState } from 'react'
import Button from './Button'
import './UploadBox.css'

export default function UploadBox({ file, previewUrl, onSelect, onRemove, disabled }) {
  const [dragging, setDragging] = useState(false)

  const handleChange = (event) => {
    onSelect(event.target.files?.[0])
    event.target.value = '' // lets the same file be picked again after removing it
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    if (!disabled) onSelect(event.dataTransfer?.files?.[0])
  }

  if (file) {
    return (
      <div className="upload-preview">
        <img src={previewUrl} alt="Selected upload preview" />
        <div className="upload-preview-footer">
          <span className="upload-file-name">{file.name}</span>
          <Button variant="text" onClick={onRemove} disabled={disabled}>
            Remove
          </Button>
        </div>
      </div>
    )
  }

  return (
    <label
      className={`upload-box ${dragging ? 'is-dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input type="file" accept="image/*" onChange={handleChange} disabled={disabled} />
      <span className="upload-title">Upload an image</span>
      <span className="upload-hint">Drag a file here or click to browse. PNG, JPG or WEBP.</span>
    </label>
  )
}
