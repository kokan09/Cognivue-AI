import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lightbulb } from '@theme-toggles/react'
import '@theme-toggles/react/styles/lightbulb.css'

function DashboardHeader({ theme, setTheme }) {
  const navigate = useNavigate()

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <header className="header dashboard-header">
      <div className="header-left">
        <Link className="logo" to="/home-page" aria-label="Cognivue home">
          Cognivue<span>.</span>
        </Link>
        <span className="workspace-badge">Course Hub</span>
      </div>

      <div className="header-actions">
        <div className="auth-links">
          <button
            type="button"
            className="button button-small button-secondary logout-btn"
            onClick={handleLogout}
            title="Log out and return to landing page"
          >
            Log Out
          </button>
        </div>

        <div
          className={`theme-bulb-wrapper ${theme}`}
          onClick={handleThemeToggle}
          style={{ cursor: 'pointer' }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <Lightbulb aria-pressed={theme === 'light'} />
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
