import React, { useState, useEffect } from 'react'
import { Lightbulb } from '@theme-toggles/react'
import '@theme-toggles/react/styles/lightbulb.css'
import DashboardHeader from '../components/DashboardHeader'
import Footer from '../components/Footer'
import TechSearchDropdown from '../components/TechSearchDropdown'
import KnowledgeGraphView from '../components/KnowledgeGraphView'
import ModuleDetailPanel from '../components/ModuleDetailPanel'
import CurriculumLoader from '../components/CurriculumLoader'
import { getKnowledgeGraph, getAllTechnologies } from '../service/curriculumService'
import '../styles/main.css'
import '../styles/components.css'

function HomePage({ theme, setTheme }) {
  const [graphData, setGraphData] = useState(null)
  const [selectedConceptId, setSelectedConceptId] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingTitle, setLoadingTitle] = useState('')
  const [pendingGraph, setPendingGraph] = useState(null)

  const availableTechs = getAllTechnologies()

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false)
      }
    }
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  const handleSelectQuery = (queryOrId) => {
    if (!queryOrId) {
      setGraphData(null)
      setSelectedConceptId(null)
      setSelectedModule(null)
      setIsModalOpen(false)
      return
    }

    const graph = getKnowledgeGraph(queryOrId)
    if (!graph) return

    setLoadingTitle(graph.tech?.name || queryOrId)
    setPendingGraph(graph)
    setIsLoading(true)
    setIsModalOpen(false)
  }

  const handleLoadingComplete = () => {
    if (pendingGraph) {
      setGraphData(pendingGraph)
      const initialConcept = pendingGraph.initialSelectedTopic || pendingGraph.conceptNodes[0] || null
      setSelectedConceptId(initialConcept?.id || null)
      setSelectedModule(initialConcept?.modules?.[0] || null)
    }
    setIsLoading(false)
  }

  const handleBackToSearch = () => {
    setGraphData(null)
    setSelectedConceptId(null)
    setSelectedModule(null)
    setIsModalOpen(false)
  }

  const handleSelectConcept = (conceptId) => {
    setSelectedConceptId(conceptId)
    const concept = graphData?.conceptNodes?.find(c => c.id === conceptId)
    if (concept && concept.modules && concept.modules.length > 0) {
      setSelectedModule(concept.modules[0])
    }
    // Clicking main concept nodes should NEVER open the modal box
    setIsModalOpen(false)
  }

  const handleSelectModule = (mod, concept) => {
    if (concept && concept.id !== selectedConceptId) {
      setSelectedConceptId(concept.id)
    }
    setSelectedModule(mod)
    setIsModalOpen(true)
  }

  const activeConcept = graphData?.conceptNodes?.find(c => c.id === selectedConceptId) || graphData?.conceptNodes?.[0] || null

  return (
    <main className="home-dashboard-page curriculum-home-view">
      <div className={`page-shell ${graphData ? 'roadmap-fullscreen-shell' : ''}`}>
        {/* TOP HEADER FOR INPUT / SEARCH PAGE (WITH LOG OUT & THEME BULB) */}
        {!graphData && <DashboardHeader theme={theme} setTheme={setTheme} />}

        {/* VIEW 1: SEARCH / INPUT PAGE (WHEN NO GRAPH IS ACTIVE) */}
        {!graphData && !isLoading && (
          <div className="curriculum-container search-landing-view fade-in-modules">
            <section className="curriculum-hero-section">
              <div className="curriculum-hero-intro">
                <p className="eyebrow">
                  <span></span> Interactive Learning Roadmaps
                </p>
                <h1>
                  What do you want to <em>learn</em>?
                </h1>
                <p className="hero-text">
                  Search any programming language or technology to explore a complete visual learning roadmap with theory, videos, quizzes, and code challenges.
                </p>
              </div>

              {/* Live Search Bar with Simple 'Search' Button */}
              <TechSearchDropdown
                onSelectTopic={handleSelectQuery}
                selectedTopicId={selectedConceptId}
              />

              {/* Quick-Pick Popular Skills */}
              <div className="popular-skills-wrapper">
                <span className="popular-skills-label">Popular Skills:</span>
                <div className="popular-skills-chips">
                  {availableTechs.map((tech) => (
                    <button
                      key={tech.id}
                      type="button"
                      className="popular-skill-chip-btn"
                      onClick={() => handleSelectQuery(tech.id)}
                    >
                      <span className="chip-icon">{tech.icon}</span>
                      <span className="chip-name">{tech.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: LOADING SYNTHESIS */}
        {isLoading && (
          <div className="curriculum-container loading-container-view fade-in-modules">
            <CurriculumLoader
              topicName={`${loadingTitle} Roadmap`}
              techName={loadingTitle}
              techIcon={pendingGraph?.tech?.icon || '⚡'}
              conceptNodes={pendingGraph?.conceptNodes || []}
              onComplete={handleLoadingComplete}
            />
          </div>
        )}

        {/* VIEW 3: DEDICATED GRAPH / ROADMAP PAGE */}
        {graphData && !isLoading && (
          <div className="roadmap-page-view fade-in-modules">
            {/* UNIFIED TOP NAVIGATION BAR */}
            <div className="roadmap-unified-top-bar">
              {/* Left: Cognivue Branding */}
              <div className="roadmap-brand-container">
                <button
                  type="button"
                  className="roadmap-brand-logo-btn"
                  onClick={handleBackToSearch}
                  title="Return to Cognivue Course Hub"
                >
                  <span className="brand-logo-text">Cognivue<span>.</span></span>
                </button>
              </div>

              {/* Center: Topic Name + Metrics */}
              <div className="roadmap-header-title-group">
                <div className="tech-avatar-orb">
                  <span className="graph-tech-icon">{graphData?.tech?.icon || '⚡'}</span>
                </div>
                <div className="roadmap-title-text-col">
                  <div className="graph-title-eyebrow">
                    <span className="live-graph-dot"></span>
                    <span>INTERACTIVE CURRICULUM</span>
                  </div>
                  <div className="roadmap-heading-metrics-row">
                    <h2 className="roadmap-main-heading">
                      {graphData?.tech?.name || 'Technology'} Learning Roadmap
                    </h2>
                    <div className="graph-metrics-pill header-metrics-pill">
                      <span className="metrics-badge-item">
                        <strong>{graphData?.conceptNodes?.length || 0}</strong> Concepts
                      </span>
                      <span className="dot-sep">&bull;</span>
                      <span className="metrics-badge-item">
                        <strong>{(graphData?.conceptNodes?.length || 0) * 6}</strong> Modules
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Skill Badge + Theme Toggle Bulb */}
              <div className="roadmap-top-right-group">
                <div className="roadmap-current-skill-badge">
                  <span className="badge-icon">{graphData?.tech?.icon}</span>
                  <span className="badge-name">{graphData?.tech?.name}</span>
                </div>

                <div
                  className={`theme-bulb-wrapper ${theme}`}
                  onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
                  style={{ cursor: 'pointer' }}
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  <Lightbulb aria-pressed={theme === 'light'} />
                </div>
              </div>
            </div>

            {/* EXPANSIVE ROADMAP GRAPH VIEW WRAPPER WITH INDEPENDENT BACK BUTTON */}
            <div className="knowledge-graph-fullscreen-wrapper">
              <button
                type="button"
                className="roadmap-independent-back-btn"
                onClick={handleBackToSearch}
                aria-label="Back to search page"
              >
                <span className="back-arrow-icon">←</span>
                <span>Back to Search</span>
              </button>

              <KnowledgeGraphView
                graphData={graphData}
                selectedConceptId={selectedConceptId}
                selectedModuleId={selectedModule?.id}
                onSelectConcept={handleSelectConcept}
                onSelectModule={handleSelectModule}
              />
            </div>
          </div>
        )}

        {/* OVERLAY MODAL BOX OVER SCREEN WHEN A NODE/MODULE IS CLICKED */}
        {isModalOpen && selectedModule && (
          <div
            className="module-modal-overlay-backdrop fade-in-modules"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="module-modal-dialog-box"
              onClick={(e) => e.stopPropagation()}
            >
              <ModuleDetailPanel
                module={selectedModule}
                concept={activeConcept}
                techName={graphData?.tech?.name}
                onClose={() => setIsModalOpen(false)}
                onSelectModule={handleSelectModule}
              />
            </div>
          </div>
        )}

        {!graphData && <Footer />}
      </div>
    </main>
  )
}

export default HomePage

