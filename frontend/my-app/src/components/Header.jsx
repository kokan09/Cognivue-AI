import { Lightbulb } from "@theme-toggles/react";
import "@theme-toggles/react/styles/lightbulb.css";
import { Link } from 'react-router-dom'

function Header({ theme, setTheme }) {
  // Use a functional state update to prevent the toggle from ever getting stuck
  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="header">
      <a className="logo" href="#top" aria-label="Cognivue home">
        Cognivue<span>.</span>
      </a>

      <nav className="nav" aria-label="Main navigation">
        <a href="#problem">The Problem</a>
        <a href="#solution">Solution</a>
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#faq">FAQ</a>
      </nav>

      <div className="header-actions">
        <div className="auth-links">
          <Link className="button button-small" to="/sign-in">Login</Link>
          <Link className="button button-small button-secondary" to="/sign-up">Create Account</Link>
        </div>
        {/* The onClick handler must be on this wrapper div */}
        <div 
          className={`theme-bulb-wrapper ${theme}`} 
          onClick={handleThemeToggle}
          style={{ cursor: 'pointer' }}
        >
          <Lightbulb 
            toggled={theme === 'light'} 
          />
        </div>
      </div>
    </header>
  )
}

export default Header