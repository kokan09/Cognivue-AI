import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/main.css'
import '../styles/auth.css'

function TestPage({ theme, setTheme }) {
  const { isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()

  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  // Right after an OAuth redirect completes, isLoaded can flip to true a
  // beat before isSignedIn catches up with the newly created session.
  // Give it a brief grace period before treating the user as signed out,
  // instead of bouncing away on the very first render.
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn) {
      setSettled(true)
      return
    }

    const timer = setTimeout(() => setSettled(true), 500)
    return () => clearTimeout(timer)
  }, [isLoaded, isSignedIn])

  const handleLogout = async () => {
    setError('')
    setLoggingOut(true)

    try {
      await signOut({ redirectUrl: '/' })
    } catch (err) {
      setError(
        err?.errors?.[0]?.longMessage ||
        'Unable to log out. Please try again.'
      )
      setLoggingOut(false)
    }
  }

  if (!isLoaded || (!isSignedIn && !settled)) {
    return (
      <main>
        <div className="page-shell">
          <Header theme={theme} setTheme={setTheme} />
          <section style={{ padding: '4rem', textAlign: 'center' }}>
            <h1>Loading session…</h1>
            <p>Please wait while we check your authentication status.</p>
          </section>
          <Footer />
        </div>
      </main>
    )
  }

  if (!isSignedIn) {
    return <Navigate replace to="/sign-in" />
  }

  const displayName = 'YASH'

  return (
    <main>
      <div className="page-shell">
        <Header theme={theme} setTheme={setTheme} />

        <section className="hero-section" style={{ paddingTop: '4rem' }}>
          <div className="hero-copy">
            <p className="eyebrow">Signed in</p>
            <h1>Welcome, {displayName}</h1>
            <p className="hero-text">You are signed in with the following account.</p>

            <div style={{ marginTop: '2rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Name:</strong> {displayName}
              </div>

              {error && (
                <p className="auth-error" style={{ marginBottom: '1rem' }}>{error}</p>
              )}

              <button
                type="button"
                className="button"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="art-core">
              <div className="core-ring"><span>✓</span></div>
              <p>Session Active</p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}

export default TestPage