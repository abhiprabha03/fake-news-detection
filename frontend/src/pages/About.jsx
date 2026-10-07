import { CONTACT_EMAIL, TEAM } from '../config'
import './About.css'

export default function About() {
  return (
    <div className="page">
      <div className="container container-narrow about">
        <h1 className="page-title">About</h1>

        <section>
          <h2>What this project does</h2>
          <p>
            Fake News Detection predicts whether a piece of content resembles fake or real news, based on patterns
            learned from labeled data. You can paste text or upload an image, and you get a prediction with a confidence
            score.
          </p>
          <p>
            It does not check facts and cannot determine what is actually true. Treat the result as one signal and
            confirm important claims with trusted sources.
          </p>
        </section>

        <section>
          <h2>How the analysis works</h2>
          <h3>Text analysis</h3>
          <p>
            The text is cleaned (lowercased, links and punctuation removed) and turned into word-frequency features using
            TF-IDF.
          </p>
          <h3>Image analysis</h3>
          <p>
            For images, text is first read from the picture using OCR (Tesseract.js) directly in your browser. That
            text then goes through the same analysis as pasted text, so results depend on how clearly the image can be
            read.
          </p>
          <h3>Machine-learning classification</h3>
          <p>
            A logistic regression model, trained on a labeled dataset of real and fake news articles, estimates the
            probability that the text is real. The confidence shown is how strongly the model leans toward its
            prediction. The reasons listed for fake predictions come from simple rules, such as sensational keywords,
            excessive capital letters or vague sourcing.
          </p>
        </section>

        <section>
          <h2>Built with</h2>
          <p>React and Vite on the frontend, FastAPI and scikit-learn on the backend.</p>
        </section>

        <section>
          <h2>Credits</h2>
          <ul className="credits">
            {TEAM.map((person) => (
              <li key={person.name}>
                {person.name} <span>· {person.role}</span>
              </li>
            ))}
          </ul>
          <p>
            Bug reports and feedback: <a href={`mailto:${CONTACT_EMAIL}?subject=Fake%20News%20Detection%20Feedback`}>{CONTACT_EMAIL}</a>
          </p>
        </section>
      </div>
    </div>
  )
}
