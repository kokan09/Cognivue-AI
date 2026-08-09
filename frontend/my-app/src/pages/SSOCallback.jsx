import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'

function SSOCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/sign-in')
  }, [navigate])

  return (
    <main className="auth-page">
      <div className="auth-card auth-status-card">
        <div className="auth-header">
          <p className="eyebrow">Redirecting</p>
          <h1>Returning to sign in</h1>
          <p>The OAuth flow for this app has been simplified.</p>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/sign-in" className="button">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default SSOCallback