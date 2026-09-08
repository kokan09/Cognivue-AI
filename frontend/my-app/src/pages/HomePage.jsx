import React from 'react'
import DashboardHeader from '../components/DashboardHeader'
import Footer from '../components/Footer'
import CoursesSection from '../components/CoursesSection'
import '../styles/main.css'
import '../styles/components.css'

function HomePage({ theme, setTheme }) {
  return (
    <main className="home-dashboard-page">
      <div className="page-shell">
        <DashboardHeader theme={theme} setTheme={setTheme} />

        {/* Dashboard Welcome Banner */}
        <section className="dashboard-welcome-hero">
          <div className="welcome-content">
            <p className="eyebrow">
              <span></span> Workspace Dashboard
            </p>
            <h1>
              Discover Top Courses Across <em>Global Platforms.</em>
            </h1>
            <p className="hero-text">
              Real-time course suggestions extracted directly from leading learning platforms. Filter by provider, view duration & ratings, and level up your engineering skills.
            </p>
          </div>

          <div className="stats-highlight-cards">
            <div className="highlight-stat-card">
              <span className="stat-icon">🎓</span>
              <div className="stat-info">
                <strong>8,800+</strong>
                <span>Courses Indexed</span>
              </div>
            </div>
            <div className="highlight-stat-card">
              <span className="stat-icon">🌐</span>
              <div className="stat-info">
                <strong>4 Platforms</strong>
                <span>Coursera, Simplilearn, Udacity, FutureLearn</span>
              </div>
            </div>
            <div className="highlight-stat-card">
              <span className="stat-icon">⚡</span>
              <div className="stat-info">
                <strong>Market Synced</strong>
                <span>Career-Aligned Topics</span>
              </div>
            </div>
          </div>
        </section>

        {/* 20 Diverse Courses Grid */}
        <CoursesSection />

        <Footer />
      </div>
    </main>
  )
}

export default HomePage
