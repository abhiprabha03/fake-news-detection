import Link from '../components/Link'
import './Home.css'

const STEPS = [
  { title: 'Enter news', text: 'Paste a headline or article, or upload an image that contains text.' },
  {
    title: 'Analyze',
    text: 'A machine-learning model compares the wording with patterns it learned from labeled news.',
  },
  {
    title: 'Review result',
    text: 'You get a prediction, a confidence score and a few ways to check the story yourself.',
  },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Check the credibility of a news story</h1>
          <p>
            Paste a headline or article, or upload a screenshot of a post, and see whether it looks more like real or
            fake news, with a confidence score and a few ways to check it yourself.
          </p>
          <Link to="/analyze" className="btn btn-primary btn-lg">
            Analyze News
          </Link>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <h2>How it works</h2>
          <ol className="steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="step-number">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <h2>Supported inputs</h2>
          <div className="inputs">
            <div>
              <h3>Text</h3>
              <p>A headline, a social media post or a full article.</p>
            </div>
            <div>
              <h3>Image (OCR)</h3>
              <p>
                A screenshot or photo. The text is read from the image in your browser and then analyzed like pasted
                text.
              </p>
            </div>
          </div>
          <p className="home-note">
            A prediction describes what the text looks like. It does not prove whether a claim is true. See{' '}
            <Link to="/about">how it works</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
