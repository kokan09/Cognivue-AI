import { Link } from 'react-router-dom'

function SignUpPage() {
  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="sign-up-title">
        <Link className="auth-brand" to="/" aria-label="Back to Cognivue home">Cognivue<span>.</span></Link>
        <div className="auth-intro">
          <p className="auth-kicker">Start for free</p>
          <h1 id="sign-up-title">Create your account</h1>
          <p>Set up your profile and get a learning path built around your career goal.</p>
        </div>
        <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="sign-up-name">Full name</label>
          <input id="sign-up-name" name="name" type="text" placeholder="Enter your full name" autoComplete="name" />
          <label htmlFor="sign-up-email">Email address</label>
          <input id="sign-up-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          <label htmlFor="sign-up-password">Password</label>
          <input id="sign-up-password" name="password" type="password" placeholder="Create a password" autoComplete="new-password" />
          <p className="input-hint">Use at least 8 characters.</p>

          <label htmlFor="sign-up-birth-date">Birth date</label>
          <input id="sign-up-birth-date" name="birthDate" type="date" autoComplete="bday" />

          <label htmlFor="sign-up-gender">Gender</label>
          <select id="sign-up-gender" name="gender" defaultValue="">
            <option value="" disabled>Select your gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>

          <button className="button auth-submit" type="submit">Create account <span aria-hidden="true">→</span></button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/sign-in">Sign in</Link></p>
      </section>
    </main>
  )
}

export default SignUpPage
