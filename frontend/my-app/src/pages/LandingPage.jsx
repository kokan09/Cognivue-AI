import { useEffect, useState } from 'react'
import Header from '../components/Header'
import FeatureCard from '../components/FeatureCard'
import FaqItem from '../components/FaqItem'
import Footer from '../components/Footer'

const featureList = [
  {
    number: '01',
    icon: '↻',
    title: 'Live Job Market Sync',
    text: 'Continuously analyzes job postings, engineering roles, and tech blogs to highlight high-value skills in real time.'
  },
  {
    number: '02',
    icon: '🎯',
    title: 'Adaptive Skill Tracker',
    text: 'Evaluates your true concept mastery through interactive challenges and tracks progress beyond simple course completions.'
  },
  {
    number: '03',
    icon: '🗺️',
    title: 'Smart Prerequisite Mapping',
    text: 'Prevents burnout by showing clear dependency chains so you always build foundational skills before advanced topics.'
  },
  {
    number: '04',
    icon: '💡',
    title: 'Evidence-Backed AI Mentor',
    text: 'Provides detailed explanations on why every skill is recommended, citing active job trends and industry requirements.'
  },
  {
    number: '05',
    icon: '📊',
    title: 'Skill-Gap Analytics',
    text: 'Visualizes the exact gap between your current profile and target job roles with actionable steps to close it.'
  },
  {
    number: '06',
    icon: '⚡',
    title: 'Dynamic Learning Path',
    text: 'Your personalized roadmap automatically updates as you master new skills and as tech market demand evolves.'
  }
]

const faqList = [
  {
    question: 'How is Cognivue different from platforms like Coursera or YouTube?',
    answer: 'Traditional platforms offer isolated video courses without knowing what you have already mastered or what skills companies are hiring for today. Cognivue connects your current skill level with live market data to recommend your exact next best step.'
  },
  {
    question: 'Is Cognivue free to use for students?',
    answer: 'Yes! Cognivue is designed for students and self-taught developers to plan, track, and accelerate their tech careers.'
  },
  {
    question: 'How does Cognivue know what skills are in demand?',
    answer: 'Our background engine continuously scans public job listings, technology repositories, and research papers to identify skills gaining momentum in the industry.'
  },
  {
    question: 'Can I track skills I learned outside of Cognivue?',
    answer: 'Yes. You can take short diagnostic assessments or import completed projects to update your skill mastery scores instantly.'
  }
]

function LandingPage() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <main>
      <div className="page-shell">
        <Header theme={theme} setTheme={setTheme} />

        {/* 1. HERO SECTION */}
        <section className="hero-section" id="top">
          <div className="hero-copy">
            <p className="eyebrow">
              <span></span> Next-Gen Career Intelligence
            </p>
            <h1>
              Master the Skills Tech Companies Are <em>Actually Hiring For.</em>
            </h1>
            <p className="hero-text">
              Cognivue analyzes real-time industry demand, evaluates your skill mastery, and builds clear, evidence-backed learning paths.
            </p>
            <div className="hero-actions">
              <a className="button" href="#demo">
                Get Started Free <b>→</b>
              </a>
              <a className="text-button" href="#how-it-works">
                See How It Works <span>↗</span>
              </a>
            </div>
            <div className="hero-note">
              <span className="note-icon">✦</span> Join 5,000+ developers building future-proof skills
            </div>
          </div>

          <div className="hero-art" aria-label="Cognivue product preview">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="art-label label-one">Market Signals <i></i></div>
            <div className="art-label label-two">Skill Dependencies <i></i></div>
            <div className="art-card art-card-top">
              <span>High Demand</span>
              <strong>+24% Growth</strong>
              <small>PyTorch & FastApi</small>
            </div>
            <div className="art-core">
              <div className="core-ring"><span>AI</span></div>
              <p>Active<br />Career Engine</p>
            </div>
            <div className="art-card art-card-bottom">
              <span>Current Readiness</span>
              <div className="mini-chart">
                <i></i><i></i><i></i><i></i><i></i><i></i>
              </div>
              <small>78% Ready for AI Roles</small>
            </div>
          </div>
        </section>

        {/* 2. SOCIAL PROOF / TRUST */}
        {/* <section className="trust-section">
          <p className="trust-title">TRUSTED BY DEVELOPERS & ENGINEERS FROM</p>
          <div className="trust-logos">
            <span>Google</span>
            <span>Microsoft</span>
            <span>Amazon</span>
            <span>Meta</span>
            <span>NVIDIA</span>
          </div>
        </section> */}
      </div>

      {/* 3. PROBLEM SECTION */}
      <section className="compare-section" id="problem">
        <div className="section-intro">
          <p className="section-kicker">The Problem</p>
          <h2>Generic Roadmaps Leave You <em>Stuck & Unprepared.</em></h2>
        </div>
        <div className="compare-grid">
          <article className="compare-card old-way">
            <div className="compare-title">
              <span>✕</span>
              <h3>Traditional Learning</h3>
            </div>
            <ul>
              <li>Outdated video courses disconnected from job markets</li>
              <li>Generic roadmaps that ignore what you already know</li>
              <li>No guidance on prerequisites, leading to confusion</li>
              <li>Wasted time on skills companies no longer require</li>
            </ul>
            <p>Guessing your path leads to fragmented learning.</p>
          </article>

          <article className="compare-card new-way" id="solution">
            <div className="compare-title">
              <span>✓</span>
              <h3>The Cognivue Way</h3>
            </div>
            <ul>
              <li>Real-time market synchronization with live job trends</li>
              <li>Personalized skill tracking based on actual performance</li>
              <li>Clear prerequisite maps so you learn in the right order</li>
              <li>Clear explanations on why every skill matters</li>
            </ul>
            <p>Build job-ready capabilities with total clarity.</p>
          </article>
        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section className="features-section" id="features">
        <div className="section-head">
          <div>
            <p className="section-kicker">Product Features</p>
            <h2>Everything You Need To <em>Accelerate Your Career.</em></h2>
          </div>
          <p>
            A cohesive platform designed to turn fragmented learning into a targeted career progression plan.
          </p>
        </div>
        <div className="features-grid">
          {featureList.map((item) => (
            <FeatureCard key={item.number} {...item} />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="steps-section" id="how-it-works">
        <div className="section-head">
          <div>
            <p className="section-kicker">Simple Workflow</p>
            <h2>How Cognivue <em>Guides Your Growth.</em></h2>
          </div>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <span className="step-num">01</span>
            <h3>Set Your Career Goal</h3>
            <p>Select your target role like AI Engineer, Full-Stack Developer, or Data Scientist.</p>
          </div>
          <div className="step-card">
            <span className="step-num">02</span>
            <h3>Assess Current Skills</h3>
            <p>Complete quick diagnostic quizzes and project checks to establish your baseline.</p>
          </div>
          <div className="step-card">
            <span className="step-num">03</span>
            <h3>Get Market-Synced Plan</h3>
            <p>Cognivue maps your exact gaps against active market listings to generate your roadmap.</p>
          </div>
          <div className="step-card">
            <span className="step-num">04</span>
            <h3>Execute & Adapt</h3>
            <p>Learn step-by-step with clear reasoning behind every recommendation.</p>
          </div>
        </div>
      </section>

      {/* 6. PRODUCT DEMO / COMMAND CENTER */}
      <section className="dashboard-section" id="demo">
        <div className="dashboard-copy">
          <p className="section-kicker">Product Dashboard</p>
          <h2>Your Personal <em>Career Command Center.</em></h2>
          <p>
            Monitor skill mastery, inspect market demand, and see actionable next steps in a clean dashboard built for focused execution.
          </p>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-top">
            <div>
              <p>Target Career Path</p>
              <h3>AI Engineering Track</h3>
            </div>
            <span className="live-dot">Market Synced</span>
          </div>

          <div className="mastery-row">
            <div>
              <span>Python Core</span>
              <strong>92% Mastery</strong>
            </div>
            <div className="progress">
              <i className="python-progress"></i>
            </div>
          </div>

          <div className="mastery-row">
            <div>
              <span>Machine Learning Foundations</span>
              <strong>54% Mastery</strong>
            </div>
            <div className="progress">
              <i className="ml-progress"></i>
            </div>
          </div>

          <div className="next-skill">
            <span className="small-label">Recommended Next Step</span>
            <div>
              <span className="torch-icon">⚡</span>
              <div>
                <strong>PyTorch Framework</strong>
                <p>Required in 74% of target AI job listings</p>
              </div>
              <span className="arrow">→</span>
            </div>
          </div>

          <div className="explanation">
            <span>💡</span>
            <p>
              <b>Why this skill now?</b> You have mastered Python core concepts. PyTorch is currently the most requested skill for your target role.
            </p>
          </div>
        </div>
      </section>

      {/* 7. BENEFITS SECTION */}
      <section className="benefits-section">
        <div className="section-head">
          <div>
            <p className="section-kicker">Value Delivered</p>
            <h2>Built For <em>Real Growth.</em></h2>
          </div>
        </div>
        <div className="benefits-grid">
          <div className="benefit-card">
            <h3>⏱️ Save 100+ Hours</h3>
            <p>Stop jumping between random tutorials and focus strictly on high-impact skills.</p>
          </div>
          <div className="benefit-card">
            <h3>📈 Stay Ahead of Tech Shifts</h3>
            <p>Automatically discover emerging frameworks before traditional courses even update.</p>
          </div>
          <div className="benefit-card">
            <h3>🎓 Build True Confidence</h3>
            <p>Master prerequisite fundamentals so advanced concepts become second nature.</p>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="faq-section" id="faq">
        <div className="section-head">
          <div>
            <p className="section-kicker">Got Questions?</p>
            <h2>Frequently Asked <em>Questions.</em></h2>
          </div>
        </div>
        <div className="faq-list">
          {faqList.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="cta-section">
        <h2>Ready To Build Your <em>Future-Proof Career?</em></h2>
        <p>Start receiving market-aligned skill recommendations in less than two minutes.</p>
        <a className="button button-large" href="#top">
          Launch Cognivue Free <b>→</b>
        </a>
      </section>

      <Footer />
    </main>
  )
}

export default LandingPage