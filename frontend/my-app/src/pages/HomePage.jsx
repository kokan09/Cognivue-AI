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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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

        {/* VIEW 3: DEDICATED GRAPH / ROADMAP PAGE WITH COLLAPSIBLE SIDEBAR */}
        {graphData && !isLoading && (
          <div className={`roadmap-layout-shell fade-in-modules ${isSidebarOpen ? 'sidebar-open-mode' : 'sidebar-closed-mode'}`}>
            
            {/* FLOATING OPEN TAB (WHEN SIDEBAR IS HIDDEN/COLLAPSED - CENTERED VERTICALLY) */}
            {!isSidebarOpen && (
              <button
                type="button"
                className="roadmap-sidebar-edge-toggle is-floating-open"
                onClick={() => setIsSidebarOpen(true)}
                title="Open Sidebar (→)"
                aria-label="Open Sidebar"
              >
                <span className="edge-arrow-icon">›</span>
              </button>
            )}

            {/* DARK COLLAPSIBLE ROADMAP SIDEBAR */}
            <aside className={`roadmap-left-sidebar ${isSidebarOpen ? 'is-open' : 'is-closed'}`}>
              {/* VERTICALLY CENTERED TOGGLE BUTTON ON THE SIDEBAR BORDER LINE */}
              {isSidebarOpen && (
                <button
                  type="button"
                  className="roadmap-sidebar-edge-toggle is-sidebar-attached"
                  onClick={() => setIsSidebarOpen(false)}
                  title="Collapse Sidebar (←)"
                  aria-label="Collapse Sidebar"
                >
                  <span className="edge-arrow-icon">‹</span>
                </button>
              )}

              <div className="sidebar-inner-container">
                {/* 1. TOP BRAND + TOPIC COMPOSITE PILL (AS PER USER SKETCH) */}
                <div className="sidebar-brand-topic-composite-pill">
                  <button
                    type="button"
                    className="composite-brand-box"
                    onClick={handleBackToSearch}
                    title="Return to Cognivue Home"
                  >
                    <span className="composite-brand-text">Cognivue<span>.Ai</span></span>
                  </button>
                  <div className="composite-topic-box" title={`${graphData?.tech?.name} Curriculum`}>
                    <span className="composite-topic-icon">{graphData?.tech?.icon || '⚡'}</span>
                    <span className="composite-topic-text">{graphData?.tech?.name || 'Track'}</span>
                  </div>
                </div>

                {/* 2. BACK TO SEARCH BUTTON */}
                <div className="sidebar-back-row">
                  <button
                    type="button"
                    className="sidebar-back-btn"
                    onClick={handleBackToSearch}
                    aria-label="Back to search page"
                  >
                    <span className="back-arrow-icon">←</span>
                    <span>Back to Search</span>
                  </button>
                </div>

                {/* 4. HEADING & METRICS SECTION */}
                <div className="sidebar-heading-section">
                  <div className="sidebar-eyebrow">
                    <span className="live-graph-dot"></span>
                    <span>INTERACTIVE CURRICULUM</span>
                  </div>
                  <h2 className="sidebar-roadmap-heading">
                    {graphData?.tech?.name || 'Technology'} Learning Roadmap
                  </h2>
                  <div className="sidebar-metrics-pill">
                    <span className="metrics-badge-item">
                      <strong>{graphData?.conceptNodes?.length || 0}</strong> Concepts
                    </span>
                    <span className="dot-sep">&bull;</span>
                    <span className="metrics-badge-item">
                      <strong>{(graphData?.conceptNodes?.length || 0) * 6}</strong> Modules
                    </span>
                  </div>
                </div>

                {/* 5. CONCEPT TRACK LIST (INTERACTIVE QUICK NAV) */}
                <div className="sidebar-concept-nav-section">
                  <span className="sidebar-section-label">CURRICULUM CONCEPTS</span>
                  <div className="sidebar-concept-pills-list custom-scrollbar">
                    {graphData?.conceptNodes?.map((concept, idx) => {
                      const isActive = concept.id === selectedConceptId
                      return (
                        <button
                          key={`sidebar-concept-${concept.id}`}
                          type="button"
                          className={`sidebar-concept-item ${isActive ? 'is-active' : ''}`}
                          onClick={() => handleSelectConcept(concept.id)}
                          title={`Focus on ${concept.label}`}
                        >
                          <span className="concept-item-num">0{idx + 1}</span>
                          <span className="concept-item-label">{concept.label}</span>
                          {isActive && <span className="concept-item-active-dot"></span>}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 6. BOTTOM FOOTER WITH THEME BULB AT BOTTOM RIGHT */}
                <div className="sidebar-bottom-footer">
                  <span className="sidebar-footer-text">Cognivue AI</span>
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
            </aside>

            {/* MAIN GRAPH CANVAS AREA */}
            <main className="roadmap-graph-main-area">
              <KnowledgeGraphView
                graphData={graphData}
                selectedConceptId={selectedConceptId}
                selectedModuleId={selectedModule?.id}
                onSelectConcept={handleSelectConcept}
                onSelectModule={handleSelectModule}
              />
            </main>
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
