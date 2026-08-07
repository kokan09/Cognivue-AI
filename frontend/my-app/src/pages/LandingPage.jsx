import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import FeatureCard from '../components/FeatureCard'
import Footer from '../components/Footer'

const featureList = [
  { number: '01', icon: '↻', title: 'Automated Industry ETL', text: 'Fresh job-market signals, collected and structured to keep every recommendation relevant.' },
  { number: '02', icon: '◌', title: 'Predictive Mastery Engine', text: 'Random Forest models turn your learning activity into a clear mastery signal.' },
  { number: '03', icon: '⌘', title: 'Neo4j Knowledge Graph', text: 'See prerequisite relationships so every skill is learned at the right moment.' },
  { number: '04', icon: '✦', title: 'Explainable RAG + LLM', text: 'Grounded guidance that shows the evidence behind every career decision.' },
  { number: '05', icon: '⌁', title: 'Skill-Gap Analytics', text: 'A focused view of the capabilities between you and your target role.' },
  { number: '06', icon: '↗', title: 'Dynamic Learning Roadmaps', text: 'An adaptive path that evolves as your mastery and the market change.' },
]

const techList = ['React', 'Node.js', 'FastAPI', 'spaCy', 'LangChain', 'Random Forest', 'Neo4j', 'ChromaDB', 'Web Scraping']

function LandingPage() {
  return (
    <main>
      <div className="page-shell">
        <Header />
        <HeroSection />
      </div>

      <section className="compare-section" id="methodology">
        <div className="section-intro"><p className="section-kicker">The difference</p><h2>Learning direction should be <em>personal, not popular.</em></h2></div>
        <div className="compare-grid">
          <article className="compare-card old-way"><div className="compare-title"><span>01</span><h3>Traditional Platforms</h3></div><ul><li>One-size-fits-all course sequences</li><li>Static content, isolated from the market</li><li>No clear signal of true mastery</li></ul><p>Follow a curriculum. Hope it translates.</p></article>
          <article className="compare-card new-way"><div className="compare-title"><span>02</span><h3>Cognivue</h3></div><ul><li>Live market-synced learning decisions</li><li>RAG-grounded career intelligence</li><li>Prerequisites and mastery, connected</li></ul><p>Build skills with context and confidence.</p></article>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-head"><div><p className="section-kicker">A better learning system</p><h2>The intelligence behind <em>every next step.</em></h2></div><p>One connected system turns complex signals into a learning path you can understand and act on.</p></div>
        <div className="features-grid">{featureList.map((item) => <FeatureCard key={item.number} {...item} />)}</div>
      </section>

      <section className="dashboard-section" id="dashboard">
        <div className="dashboard-copy"><p className="section-kicker">Your learning command center</p><h2>Always know <em>what comes next.</em></h2><p>Cognivue translates your progress and the job market into a focused, explainable plan of action.</p><a className="text-button" href="#tech">See the technology <span>→</span></a></div>
        <div className="dashboard-card"><div className="dashboard-top"><div><p>Learning path</p><h3>AI Engineering Path</h3></div><span className="live-dot">Live</span></div><div className="mastery-row"><div><span>Python</span><strong>92%</strong></div><div className="progress"><i className="python-progress"></i></div></div><div className="mastery-row"><div><span>Machine Learning</span><strong>54%</strong></div><div className="progress"><i className="ml-progress"></i></div></div><div className="next-skill"><span className="small-label">Your recommended next skill</span><div><span className="torch-icon">⌁</span><div><strong>PyTorch</strong><p>High-impact skill for your target role</p></div><span className="arrow">→</span></div></div><div className="explanation"><span>✦</span><p><b>Why this, now?</b> Recommended because you have 92% mastery in Python and 74% of AI jobs require PyTorch.</p></div></div>
      </section>

      <section className="tech-section" id="tech"><p className="section-kicker">Purpose-built technology</p><h2>Serious intelligence,<br /><em>made simple.</em></h2><div className="tech-list">{techList.map((item) => <span key={item}>{item}</span>)}</div></section>
      <Footer />
    </main>
  )
}

export default LandingPage
