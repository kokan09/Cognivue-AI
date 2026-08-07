function Header() {
  return (
    <header className="header">
      <a className="logo" href="#top" aria-label="Cognivue home">Cognivue<span>.</span></a>
      <nav className="nav" aria-label="Main navigation">
        <a href="#features">Features</a>
        <a href="#methodology">Methodology</a>
        <a href="#tech">Tech Stack</a>
      </nav>
      <a className="button button-small" href="#dashboard">Explore Demo</a>
    </header>
  )
}

export default Header
