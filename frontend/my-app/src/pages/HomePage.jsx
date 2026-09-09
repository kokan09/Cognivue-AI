import React, { useState, useEffect } from 'react'
import DashboardHeader from '../components/DashboardHeader'
import Footer from '../components/Footer'
import TechSearchDropdown from '../components/TechSearchDropdown'
import KnowledgeGraphView from '../components/KnowledgeGraphView'
import ModuleDetailPanel from '../components/ModuleDetailPanel'
import CurriculumLoader from '../components/CurriculumLoader'
import { getKnowledgeGraph } from '../service/curriculumService'
import '../styles/main.css'
import '../styles/components.css'

function HomePage({ theme, setTheme }) {
  const [graphData, setGraphData] = useState(null)
  const [selectedConceptId, setSelectedConceptId] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingTitle, setLoadingTitle] = useState('')

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
    setIsLoading(true)
    setIsModalOpen(false)

    // Simulate AI neural graph synthesis (1.4s)
    setTimeout(() => {
      setGraphData(graph)
      const initialConcept = graph.initialSelectedTopic || graph.conceptNodes[0] || null
      setSelectedConceptId(initialConcept?.id || null)
      setSelectedModule(initialConcept?.modules?.[0] || null)
      setIsLoading(false)
    }, 1400)
  }

  const handleSelectConcept = (conceptId) => {
    setSelectedConceptId(conceptId)
    const concept = graphData?.conceptNodes?.find(c => c.id === conceptId)
    if (concept && concept.modules && concept.modules.length > 0) {
      setSelectedModule(concept.modules[0])
    }
    setIsModalOpen(true) // Display modal box over the screen
  }

  const handleSelectModule = (mod, concept) => {
    if (concept && concept.id !== selectedConceptId) {
      setSelectedConceptId(concept.id)
    }
    setSelectedModule(mod)
    setIsModalOpen(true) // Display modal box over the screen
  }

  const activeConcept = graphData?.conceptNodes?.find(c => c.id === selectedConceptId) || graphData?.conceptNodes?.[0] || null

  return (
    <main className="home-dashboard-page curriculum-home-view">
      <div className="page-shell">
        <DashboardHeader theme={theme} setTheme={setTheme} />

        <div className="curriculum-container">
          {/* Hero Greeting & Search Section */}
          <section className="curriculum-hero-section">
            <div className="curriculum-hero-intro">
              <p className="eyebrow">
                <span></span> AI Technical Knowledge Graph
              </p>
              <h1>
                Explore <em>Concept Networks</em> &amp; Master Any Skill
              </h1>
              <p className="hero-text">
                Type any skill (e.g. <strong>Java, Python, MERN, React, Node.js, JavaScript</strong>) and press <strong>Enter</strong> to generate an interactive, expansive Knowledge Graph.
              </p>
            </div>

            {/* Live Search Bar with Generate Graph Button */}
            <TechSearchDropdown
              onSelectTopic={handleSelectQuery}
              selectedTopicId={selectedConceptId}
            />
          </section>

          {/* Active Expansive Knowledge Graph Section */}
          <section className="curriculum-modules-section">
            {isLoading ? (
              <CurriculumLoader
                topicName={`${loadingTitle} Knowledge Graph`}
                techName={loadingTitle}
                modules={graphData?.conceptNodes?.[0]?.modules || []}
              />
            ) : graphData ? (
              <div className="knowledge-graph-fullscreen-wrapper fade-in-modules">
                {/* LARGE EXPANSIVE KNOWLEDGE GRAPH */}
                <KnowledgeGraphView
                  graphData={graphData}
                  selectedConceptId={selectedConceptId}
                  selectedModuleId={selectedModule?.id}
                  onSelectConcept={handleSelectConcept}
                  onSelectModule={handleSelectModule}
                />
              </div>
            ) : null}
          </section>
        </div>

        {/* OVERLAY MODAL BOX OVER THE SCREEN WHEN A NODE IS CLICKED */}
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

        <Footer />
      </div>
    </main>
  )
}

export default HomePage

