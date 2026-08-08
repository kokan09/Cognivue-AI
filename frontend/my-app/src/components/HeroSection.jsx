import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <p className="eyebrow"><span></span> Built for ambitious learners</p>
        <h1>Stop Following Generic Roadmaps. <em>Learn What the Industry Demands.</em></h1>
        <p className="hero-text">Cognivue tracks your skill mastery, analyzes real-time market trends, and builds explainable learning paths tailored for you.</p>
        <div className="hero-actions">
          <Link className="button" to="/sign-in">Get Started <b>→</b></Link>
          <a className="text-button" href="#methodology">Read Paper <span>↗</span></a>
        </div>
        <div className="hero-note"><span className="note-icon">✦</span> Market intelligence meets personal momentum</div>
      </div>
      <div className="hero-art" aria-label="Cognivue learning intelligence illustration">
        <div className="orbit orbit-one"></div>
        <div className="orbit orbit-two"></div>
        <div className="art-label label-one">Live signals <i></i></div>
        <div className="art-label label-two">Skill graph <i></i></div>
        <div className="art-label label-three">Your path <i></i></div>
        <div className="art-card art-card-top"><span>Market pulse</span><strong>+18.4%</strong><small>AI engineer roles</small></div>
        <div className="art-core"><div className="core-ring"><span>CV</span></div><p>Clarity<br />in motion</p></div>
        <div className="art-card art-card-bottom"><span>Mastery</span><div className="mini-chart"><i></i><i></i><i></i><i></i><i></i><i></i></div><small>Personal learning signal</small></div>
      </div>
    </section>
  )
}

export default HeroSection
