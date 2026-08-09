import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk } from '@clerk/react'
import '../styles/auth.css'

function SSOCallback() {
  const { handleRedirectCallback } = useClerk()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const hasRun = useRef(false)

  useEffect(() => {
    // Guard against React StrictMode / re-render double invocation —
    // the OAuth code Clerk exchanges here is single-use.
    if (hasRun.current) return
    hasRun.current = true

    handleRedirectCallback(
      {
        signInUrl: '/sign-in',
        signUpUrl: '/sign-up',
        signInFallbackRedirectUrl: '/test-page',
        signUpFallbackRedirectUrl: '/test-page',
        continueSignInUrl: '/test-page',
        continueSignUpUrl: '/test-page',
      },
      // Route the post-callback redirect through React Router instead of
      // a full page reload.
      (to) => {
        navigate(to)
        return Promise.resolve()
      }
    ).catch((err) => {
      setError(
        err?.errors?.[0]?.longMessage ||
        'We could not complete Google sign in. Please try again.'
      )
    })
  }, [handleRedirectCallback, navigate])

  return (
    <main className="auth-page">
      <div id="clerk-captcha" />

      <div className="auth-card auth-status-card">
        {error ? (
          <div className="auth-header">
            <p className="eyebrow">Sign in failed</p>
            <h1>We couldn't sign you in</h1>
            <p className="auth-error">{error}</p>
            <p style={{ marginTop: '1rem' }}>
              <Link to="/sign-in" className="button">
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <>
            <div className="auth-spinner" aria-hidden="true" />
            <div className="auth-header">
              <p className="eyebrow">Almost there</p>
              <h1>Finishing secure sign in</h1>
              <p>Keep this tab open while we complete your authentication.</p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default SSOCallback