import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/main.css'
import '../styles/auth.css'

function TestPage({ theme, setTheme }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <main>
      <div className="page-shell">
        <Header theme={theme} setTheme={setTheme} />

        <section className="hero-section" style={{ paddingTop: '4rem' }}>
          <div className="hero-copy">
            <p className="eyebrow">Local demo page</p>
            <h1>Welcome to your demo workspace</h1>
            <p className="hero-text">This view now uses a simple local demo flow.</p>

            <div style={{ marginTop: '2rem' }}>
              <button
                type="button"
                className="button"
                onClick={handleLogout}
              >
                Back home
              </button>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-core">
              <div className="core-ring"><span>✓</span></div>
              <p>Ready to continue</p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}

export default TestPage