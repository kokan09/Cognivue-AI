import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSignUp } from '@clerk/react/legacy'
import { useUser } from '@clerk/react'
import '../styles/auth.css'

function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const navigate = useNavigate()
  const authReady = isLoaded && Boolean(signUp)

  const { isLoaded: userLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (userLoaded && isSignedIn) {
      navigate('/test-page')
    }
  }, [userLoaded, isSignedIn, navigate])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!authReady) return

    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const nameParts = name.trim().split(/\s+/)
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ')

      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      })

      if (result.status === 'complete') {
        await setActive({
          session: result.createdSessionId,
        })

        navigate('/test-page')
      } else {
        console.log('Additional verification required:', result)
      }
    } catch (err) {
      setError(
        err?.errors?.[0]?.longMessage ||
        'Unable to create your account.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (strategy, providerName) => {
    if (loading || oauthLoading) return

    if (!authReady) {
      setError('Authentication is still loading. Please try again in a moment.')
      return
    }

    setError('')
    setOauthLoading(strategy)

    try {
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: new URL(
          '/sign-up/sso-callback',
          window.location.origin
        ).toString(),
        redirectUrlComplete: new URL(
          '/test-page',
          window.location.origin
        ).toString(),
      })
    } catch (err) {
      setError(
        err?.errors?.[0]?.longMessage ||
        `Unable to sign up with ${providerName}.`
      )
    } finally {
      setOauthLoading('')
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Get started</p>
          <h1>Create your Cognivue account</h1>
          <p>
            Join Cognivue to unlock personalized career pathways and tailored skill guidance.
          </p>
        </div>

        <div className="divider">
          <span>sign up with email</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button auth-submit"
            disabled={loading || !authReady}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-grid">
            <button
              type="button"
              className="social-button social-google"
              onClick={() => handleOAuthSignUp('oauth_google', 'Google')}
              disabled={loading || !authReady || oauthLoading !== ''}
            >
              <span>G</span>
              {!authReady
                ? 'Preparing Google...'
                : oauthLoading === 'oauth_google'
                  ? 'Redirecting...'
                  : 'Continue with Google'}
            </button>

            <button
              type="button"
              className="social-button social-github"
              onClick={() => handleOAuthSignUp('oauth_github', 'GitHub')}
              disabled={loading || !authReady || oauthLoading !== ''}
            >
              <span>GH</span>
              {!authReady
                ? 'Preparing GitHub...'
                : oauthLoading === 'oauth_github'
                  ? 'Redirecting...'
                  : 'Continue with GitHub'}
            </button>
          </div>
        </form>

        <p className="auth-footnote">
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </div>
    </main>
  )
}

export default SignUpPage
