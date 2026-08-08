function FeatureCard({ number, title, text, icon }) {
  return (
    <article className="feature-card">
      <div className="feature-top">
        <span className="feature-icon">{icon}</span>
        <span className="feature-number">{number}</span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <a href="#demo" aria-label={`Explore ${title}`}>
        Explore Feature <span>→</span>
      </a>
    </article>
  )
}

export default FeatureCard