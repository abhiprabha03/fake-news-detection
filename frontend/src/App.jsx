import { useEffect } from 'react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { useAnalyzer } from './hooks/useAnalyzer'
import { useApiHealth } from './hooks/useApiHealth'
import { useHistory } from './hooks/useHistory'
import { useRoute } from './hooks/useRoute'
import { resolveRoute } from './lib/routes'
import About from './pages/About'
import Analyze from './pages/Analyze'
import History from './pages/History'
import Home from './pages/Home'
import { PROJECT_NAME } from './config'

const PAGE_TITLES = {
  home: PROJECT_NAME,
  analyze: `Analyze · ${PROJECT_NAME}`,
  history: `History · ${PROJECT_NAME}`,
  about: `About · ${PROJECT_NAME}`,
}

export default function App() {
  const path = useRoute()
  const { page, mode: routeMode } = resolveRoute(path)

  const history = useHistory()
  const health = useApiHealth()
  // routeMode is only used on first load, so /image-check still opens the Image tab.
  const analyzer = useAnalyzer({ initialMode: routeMode, onResult: history.add })

  useEffect(() => {
    document.title = PAGE_TITLES[page]
  }, [page])

  return (
    <div className="app">
      <Navbar currentPage={page} />
      <main className="app-main">
        {page === 'home' && <Home />}
        {page === 'analyze' && <Analyze analyzer={analyzer} health={health} />}
        {page === 'history' && <History history={history} />}
        {page === 'about' && <About />}
      </main>
      <Footer />
    </div>
  )
}
