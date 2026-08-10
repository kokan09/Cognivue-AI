import { Link, useNavigate } from 'react-router-dom'
import useAuthContext from '../Features/auth/hook/auth.hook';

function SignInPage() {
  const {sign_in_user} = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    const payload = {
      email: form.elements.email.value,
      password: form.elements.password.value
    };

    const resp = await sign_in_user(payload);
      
    alert(resp.message);

    navigate("/home");
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
          <label htmlFor="sign-in-email">Email address</label>
          <input id="sign-in-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          <div className="field-label-row">
            <label htmlFor="sign-in-password">Password</label>
            <button className="auth-text-action" type="button">Forgot password?</button>
          </div>
          <input id="sign-in-password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" />
          <label className="remember-me"><input type="checkbox" name="remember" /><span>Keep me signed in</span></label>
          <button className="button auth-submit" type="submit">Sign in <span aria-hidden="true">→</span></button>
        </form>
        <p className="auth-switch">New to Cognivue? <Link to="/sign-up">Create an account</Link></p>
      </section>
    </main>
  )
}

export default SignInPage
