import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignIn } from '@clerk/react'
import '../styles/auth.css'

function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isLoaded) return

    setError('')
    setLoading(true)

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        await setActive({
          session: result.createdSessionId,
        })

        navigate('/')
      } else {
        console.log('Additional verification required:', result)
      }
    } catch (err) {
      setError(
        err?.errors?.[0]?.longMessage ||
        'Unable to sign in. Please check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (strategy, providerName) => {
    if (loading || oauthLoading) return

    if (!isLoaded || !signIn) {
      setError('Authentication is still loading. Please try again in a moment.')
      return
    }

    setError('')
    setOauthLoading(strategy)

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sign-in/sso-callback',
        redirectUrlComplete: '/',
      })
    } catch (err) {
      setError(
        err?.errors?.[0]?.longMessage ||
        `Unable to sign in with ${providerName}.`
      )
    } finally {
      setOauthLoading('')
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to Cognivue</h1>
          <p>
            Access your personalized career insights and resume-ready skill planning.
          </p>
        </div>

        <div className="divider">
          <span>use email to sign in</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <div className="auth-help">
            <Link to="/sign-up">Create account</Link>
            <a href="#forgot">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="button auth-submit"
            disabled={loading || !isLoaded}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-grid">
            <button
              type="button"
              className="social-button social-google"
              onClick={() => handleOAuthSignIn('oauth_google', 'Google')}
              disabled={loading || oauthLoading !== ''}
            >
              <span>G</span>
              {oauthLoading === 'oauth_google' ? 'Redirecting...' : 'Continue with Google'}
            </button>

            <button
              type="button"
              className="social-button social-github"
              onClick={() => handleOAuthSignIn('oauth_github', 'GitHub')}
              disabled={loading || oauthLoading !== ''}
            >
              <span>GH</span>
              {oauthLoading === 'oauth_github' ? 'Redirecting...' : 'Continue with GitHub'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default SignInPage
