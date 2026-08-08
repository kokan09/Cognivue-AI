function Header({ theme, setTheme }) {
  return (
    <header className="header">
      <a className="logo" href="#top" aria-label="Cognivue home">Cognivue<span>.</span></a>
      <nav className="nav" aria-label="Main navigation">
        <a href="#features">Features</a>
        <a href="#methodology">Methodology</a>
        <a href="#tech">Tech Stack</a>
      </nav>
      <div className="header-actions">
        <a className="button button-small" href="#dashboard">Explore Demo</a>
        <button
          type="button"
          className={`theme-toggle ${theme === 'dark' ? 'dark' : 'light'}`}
          aria-label={theme === 'dark' ? 'Switch to bright mode' : 'Switch to dark mode'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <span className="toggle-knob" />
        </button>
      </div>
    </header>
  )
}

export default Header
