// OCR runs in the browser. tesseract.js is loaded on demand so it doesn't weigh down the first page load.
export async function extractTextWithBrowserOcr(image) {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng')

  try {
    const result = await worker.recognize(image)
    return String(result?.data?.text || '').trim()
  } finally {
    await worker.terminate()
  }
}
