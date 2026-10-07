// Example inputs for the "Use an example" button.

const REAL_SAMPLES = [
  'District administration released an official flood advisory and opened relief camps in low-lying areas.',
  'Election office published updated voter turnout data on the state portal after phase two polling.',
  'Meteorological department forecast heavy rainfall for coastal districts and issued orange alert for 48 hours.',
  'Health department started a free vaccination drive at government hospitals from Monday to Friday.',
  'University examination cell postponed semester exams by one week through a signed circular.',
  'Central bank kept policy rates unchanged and shared the decision in its scheduled monetary briefing.',
  'Space agency completed a successful payload test and published mission details in a press note.',
  'Railway division announced revised train timings due to platform maintenance during the weekend.',
  'City police confirmed recovery of a missing child and thanked citizens for verified leads.',
  'Supreme Court uploaded the next hearing schedule in the official cause list for public access.',
  'Municipal corporation inaugurated a new water treatment unit to improve local drinking water supply.',
  'Transport department launched a road safety campaign and increased highway patrolling this month.',
  'Parliament passed the amendment bill after debate and voting in both houses.',
  'State board declared class 12 results on its official website at the announced time.',
  'Agriculture ministry released updated crop support prices for the upcoming procurement season.',
  'Power utility announced a planned maintenance outage for selected areas between 1 AM and 4 AM.',
  'Public works department opened a repaired bridge after structural safety clearance.',
  'Airport authority issued fog-related advisory and asked passengers to check live flight status.',
  'National highway agency opened an additional service lane to reduce peak-hour congestion.',
  'Census office enabled a correction window for submitted forms with identity proof verification.',
  'Telecom regulator extended digital KYC submission deadline and notified operators formally.',
  'Bank notified customers about branch relocation effective next month through SMS and website notice.',
  'Fire department conducted a mock evacuation drill in a multi-storey market complex.',
  'University published annual placement statistics with recruiter list and salary ranges.',
  'Election commission clarified circulating booth-change rumors and shared the official booth lookup link.',
]

const FAKE_SAMPLES = [
  'Viral post claims the moon will turn green tonight and anyone who watches it will become lucky forever.',
  'Forwarded message says all ATM notes will stop working after midnight unless people register immediately.',
  'Social post promises instant government cash reward through an unknown short link without any official source.',
  'Message says eating one herbal leaf can permanently cure diabetes in two days with zero medical evidence.',
  'Screenshot claims all board exams are canceled permanently, but no education notice is attached.',
  'Audio clip alleges vaccines contain secret tracking chips controlled by satellites.',
  'Post says a famous actor was jailed last night, but provides no police report or news source.',
  'Forward says nationwide internet shutdown starts tomorrow, yet no telecom or ministry advisory exists.',
  'Old bridge-collapse photo is reshared as today’s disaster without date or location verification.',
  'Post claims river water turned red due to poison dumping, but no lab or authority report is shown.',
  'Message says courts banned social media use after 10 PM, with no legal order reference.',
  'Viral text claims train tickets are free for everyone this week if they share the post 10 times.',
  'Forward warns a solar eclipse causes instant blindness in minutes, presented without scientific evidence.',
  'Post says drinking hot water every hour can kill every virus regardless of infection.',
  'Fake graphic claims a cash bonus is available only to people who reshare a random message.',
  'Screenshot says petrol is available at extremely low price today only, without any official notification.',
  'Message claims private schools must admit all students automatically without documents this year.',
  'Post alleges city tap water has sleeping medicine mixed by unknown groups.',
  'Forward claims exam papers leaked everywhere but shows no verified proof or authority statement.',
  'Viral post says all SIM cards will be blocked unless users enter OTP on an unknown page.',
  'Message promises old coins can be sold for huge guaranteed profit through unofficial agents.',
  'Conspiracy post claims satellites discovered a hidden city and government is suppressing the evidence.',
  'Message predicts an earthquake at exact minute and asks residents to leave homes immediately.',
  'Post claims tax department waived all penalties this week though no official circular exists.',
  'Screenshot promotes an app that claims to generate legal identity cards instantly without verification.',
]

const SAMPLE_TEXTS = [...REAL_SAMPLES, ...FAKE_SAMPLES]

// Pick a random example, avoiding the one that is already in the textarea.
export function pickSampleNews(currentText = '') {
  const current = String(currentText || '').trim()
  const options = SAMPLE_TEXTS.filter((item) => item !== current)
  return options[Math.floor(Math.random() * options.length)]
}

// Draws a small PNG in the browser so the image/OCR flow can be tried without a file.
export function createDemoImageFile() {
  const canvas = document.createElement('canvas')
  canvas.width = 1280
  canvas.height = 720

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return Promise.reject(new Error('Canvas not supported'))
  }

  const font = 'Inter, system-ui, sans-serif'

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#1f2328'
  ctx.font = `700 56px ${font}`
  ctx.fillText('Breaking Claim Screenshot', 72, 110)

  ctx.fillStyle = '#475569'
  ctx.font = `500 36px ${font}`
  ctx.fillText('Post says "Miracle cure found in 24 hours"', 72, 190)
  ctx.fillText('No doctor names, no study links, asks to forward now.', 72, 245)

  ctx.fillStyle = '#a23b36'
  ctx.font = `700 42px ${font}`
  ctx.fillText('VERIFY BEFORE SHARING', 72, 330)

  ctx.strokeStyle = '#d4d4cf'
  ctx.lineWidth = 4
  ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104)

  ctx.fillStyle = '#1f2328'
  ctx.font = `500 30px ${font}`
  ctx.fillText('Sample demo image generated by Fake News Detection app', 72, 645)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create demo image'))
          return
        }
        resolve(new File([blob], 'demo-news-image.png', { type: 'image/png' }))
      },
      'image/png',
      0.9,
    )
  })
}
