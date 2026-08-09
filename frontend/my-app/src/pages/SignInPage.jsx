import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'

function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setError('')
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      navigate('/test-page')
    }, 300)
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="sign-in-title">
        <Link className="auth-brand" to="/" aria-label="Back to Cognivue home">Cognivue<span>.</span></Link>
        <div className="auth-intro">
          <p className="auth-kicker">Welcome back</p>
          <h1 id="sign-in-title">Sign in to your workspace</h1>
          <p>Continue building a learning path that moves with the market.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="auth-error">{error}</p>}
          <label htmlFor="sign-in-email">Email address</label>
          <input
            id="sign-in-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <div className="field-label-row">
            <label htmlFor="sign-in-password">Password</label>
            <button className="auth-text-action" type="button">Forgot password?</button>
          </div>
          <input
            id="sign-in-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label className="remember-me"><input type="checkbox" name="remember" /><span>Keep me signed in</span></label>
          <button className="button auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'} <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="auth-switch">New to Cognivue? <Link to="/sign-up">Create an account</Link></p>
      </section>
    </main>
  )
}

export default SignInPage
