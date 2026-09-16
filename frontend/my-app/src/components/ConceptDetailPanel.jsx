import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ModuleOrbitRing, { MODULE_TYPE_META } from './ModuleOrbitRing'
import ModuleMcqQuiz from './ModuleMcqQuiz'
import ModuleSyntaxTest from './ModuleSyntaxTest'

/**
 * ConceptDetailPanel (Widescreen Optimized)
 * Utilizes the full width and height of the window with a 2-column split layout:
 * - Left Column: Module Orbit Selector + Quick Stats
 * - Right Column: Full-width Interactive Content Card (Theory, Video, Code, MCQs, Syntax, Project)
 */
function ConceptDetailPanel({
  concept,
  subConcept,
  techName = 'Technology',
  activeModuleType = 'concepts',
  onSelectModuleType,
  onClose
}) {
  const [copiedKey, setCopiedKey] = useState(null)
  const [completedSteps, setCompletedSteps] = useState({})
  const panelRef = useRef(null)
  const closeBtnRef = useRef(null)

  // Focus management on open
  useEffect(() => {
    if (closeBtnRef.current) {
      closeBtnRef.current.focus()
    }
  }, [])

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const targetNode = subConcept || concept
  if (!targetNode) return null

  // Find module object from targetNode.modules corresponding to activeModuleType
  const targetModules = targetNode.modules || concept?.modules || []
  const activeModule = targetModules.find(m => m.type === activeModuleType) || targetModules[0] || {
    id: `mod-${activeModuleType}`,
    number: 1,
    type: activeModuleType,
    title: `${targetNode.label} Fundamentals`,
    description: `Core learning materials for ${targetNode.label}.`,
    content: {}
  }

  const content = activeModule.content || {}
  const typeMeta = MODULE_TYPE_META[activeModule.type] || {
    icon: '📌',
    label: 'Module',
    color: '#F2B880',
    fullTitle: 'Learning Module'
  }

  const handleCopyCode = (code, key = 'default') => {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopiedKey(key)
    setTimeout(() => {
      setCopiedKey(null)
    }, 2000)
  }

  const handleToggleStep = (stepIdx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepIdx]: !prev[stepIdx]
    }))
  }

  return (
    <div
      ref={panelRef}
      className="concept-detail-panel-root widescreen-layout"
      role="dialog"
      aria-modal="true"
      aria-label={`${targetNode.label} Details`}
    >
      {/* 1. TOP HEADER BAR: BREADCRUMBS + TITLE + CLOSE BUTTON */}
      <div className="concept-panel-header">
        <div className="concept-header-left">
          {/* Breadcrumbs */}
          <div className="concept-breadcrumb-lite">
            <span className="crumb-root-tech">{techName}</span>
            <span className="crumb-divider">/</span>
            {concept && concept.id !== targetNode.id && (
              <>
                <span className="crumb-parent-concept">{concept.label}</span>
                <span className="crumb-divider">/</span>
              </>
            )}
            <span className="crumb-concept-tag">
              {targetNode.shortName || targetNode.label}
            </span>
          </div>

          {/* Sub-Concept Name as Heading */}
          <div className="concept-title-icon-row">
            {targetNode.icon && (
              <span className="concept-header-icon">{targetNode.icon}</span>
            )}
            <h2 className="concept-main-heading">{targetNode.label || targetNode.title}</h2>
          </div>

          {(targetNode.summary || targetNode.description) && (
            <p className="concept-summary-subtext">{targetNode.summary || targetNode.description}</p>
          )}
        </div>

        <div className="concept-header-right">
          <button
            ref={closeBtnRef}
            type="button"
            className="concept-panel-close-btn"
            onClick={onClose}
            aria-label="Close details (Esc)"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. WIDESCREEN 2-COLUMN DASHBOARD GRID */}
      <div className="concept-detail-widescreen-grid">
        {/* LEFT COLUMN: MODULE ORBIT SELECTOR & META CARD */}
        <aside className="detail-sidebar-column">
          <div className="concept-orbit-selector-section sidebar-orbit-box">
            <div className="orbit-section-header">
              <span className="orbit-section-tag">MODULE SELECTOR</span>
              <span className="orbit-section-hint">6 Interactive Modules</span>
            </div>

            <ModuleOrbitRing
              modules={targetModules}
              activeModuleType={activeModuleType}
              onSelectModuleType={onSelectModuleType}
              conceptTitle={targetNode.label}
            />
          </div>

          {/* QUICK TOPIC INFO CARD */}
          <div className="topic-meta-sidebar-card">
            <div className="meta-card-header">
              <span className="meta-card-tag">{targetNode.tag || 'SUB-TYPE'}</span>
              <span className="meta-card-level">{concept?.level || 'Core Concept'}</span>
            </div>
            <p className="meta-card-text">
              Select a module above to test your skills with quizzes, coding challenges, or masterclass videos.
            </p>
          </div>
        </aside>

        {/* RIGHT COLUMN: EXPANSIVE MODULE CONTENT CARD */}
        <main className="detail-main-content-column">
          <div className="concept-module-content-card widescreen-content-card">
            {/* Module Sub-Header */}
            <div className="module-card-header">
              <div className="module-card-badge" style={{ borderColor: typeMeta.color }}>
                <span className="badge-icon">{typeMeta.icon}</span>
                <span className="badge-label">{typeMeta.fullTitle || typeMeta.label}</span>
              </div>

              <h3 className="module-card-title">{activeModule.title || `${typeMeta.label} Overview`}</h3>

              {activeModule.description && (
                <p className="module-card-description">{activeModule.description}</p>
              )}
            </div>

            {/* Content Body based on Module Type */}
            <div className="module-card-body">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule.type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="module-card-inner-view"
                >
                  {/* TYPE 1: CONCEPTS / THEORY */}
                  {activeModule.type === 'concepts' && (
                    <div className="module-content-block concepts-view">
                      {content.overview && (
                        <div className="concept-overview-box">
                          <h4>Theoretical Breakdown</h4>
                          <p>{content.overview}</p>
                        </div>
                      )}

                      {content.keyPoints && content.keyPoints.length > 0 && (
                        <div className="concept-keypoints-box">
                          <h4>Core Principles &amp; Key Takeaways</h4>
                          <ul className="keypoints-list">
                            {content.keyPoints.map((pt, i) => (
                              <li key={i}>
                                <span className="checkmark-icon">✓</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {content.codeSnippet && (
                        <div className="concept-code-box">
                          <div className="code-header-bar">
                            <span className="code-lang-tag">CODE REFERENCE</span>
                            <button
                              type="button"
                              className="copy-code-btn"
                              onClick={() => handleCopyCode(content.codeSnippet, 'theory-code')}
                            >
                              {copiedKey === 'theory-code' ? 'Copied ✓' : 'Copy Code'}
                            </button>
                          </div>
                          <pre className="code-pre-block">
                            <code>{content.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TYPE 2: VIDEO MASTERCLASS */}
                  {activeModule.type === 'video' && (
                    <div className="module-content-block video-view">
                      <div className="video-player-frame-wrapper">
                        <iframe
                          src={content.videoUrl || 'https://www.youtube.com/embed/W-b9KGwVUCE'}
                          title={content.videoTitle || activeModule.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="embedded-video-iframe"
                        />
                      </div>

                      <div className="video-meta-details">
                        <div className="video-meta-row">
                          <span className="video-instructor">
                            Instructor: <strong>{content.instructor || 'Cognivue Lead Architect'}</strong>
                          </span>
                          <span className="video-duration">
                            Duration: <strong>{content.duration || '16 mins'}</strong>
                          </span>
                        </div>

                        {content.keyTakeaways && content.keyTakeaways.length > 0 && (
                          <div className="video-timestamps-box">
                            <h5>Key Timestamps &amp; Topics</h5>
                            <ul className="timestamps-list">
                              {content.keyTakeaways.map((takeaway, i) => (
                                <li key={i}>
                                  <span className="time-marker-bullet">⏱</span>
                                  <span>{takeaway}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TYPE 3: CODE EXAMPLES & PATTERNS */}
                  {activeModule.type === 'code-examples' && (
                    <div className="module-content-block code-examples-view">
                      {content.examples && content.examples.length > 0 ? (
                        content.examples.map((ex, exIdx) => (
                          <div key={exIdx} className="code-example-card">
                            <div className="example-header">
                              <h4>{ex.title}</h4>
                              <button
                                type="button"
                                className="copy-code-btn"
                                onClick={() => handleCopyCode(ex.code, `ex-${exIdx}`)}
                              >
                                {copiedKey === `ex-${exIdx}` ? 'Copied ✓' : 'Copy Snippet'}
                              </button>
                            </div>
                            <pre className="code-pre-block">
                              <code>{ex.code}</code>
                            </pre>
                          </div>
                        ))
                      ) : content.codeSnippet ? (
                        <div className="code-example-card">
                          <div className="example-header">
                            <h4>Practical Implementation</h4>
                            <button
                              type="button"
                              className="copy-code-btn"
                              onClick={() => handleCopyCode(content.codeSnippet, 'ex-single')}
                            >
                              {copiedKey === 'ex-single' ? 'Copied ✓' : 'Copy Snippet'}
                            </button>
                          </div>
                          <pre className="code-pre-block">
                            <code>{content.codeSnippet}</code>
                          </pre>
                        </div>
                      ) : (
                        <p className="no-content-msg">No code examples available for this module.</p>
                      )}
                    </div>
                  )}

                  {/* TYPE 4: MCQs ASSESSMENT */}
                  {activeModule.type === 'mcq' && (
                    <div className="module-content-block mcq-view">
                      <ModuleMcqQuiz questions={content.questions || []} />
                    </div>
                  )}

                  {/* TYPE 5: SYNTAX & DEBUGGING CHALLENGE */}
                  {activeModule.type === 'test' && (
                    <div className="module-content-block test-view">
                      <ModuleSyntaxTest challenge={content} />
                    </div>
                  )}

                  {/* TYPE 6: PRACTICAL PROJECT */}
                  {activeModule.type === 'project' && (
                    <div className="module-content-block project-view">
                      <div className="project-brief-card">
                        <h5>Project Objective</h5>
                        <p className="project-objective">
                          {content.taskGoal || 'Construct an end-to-end practical project applying the core concepts learned.'}
                        </p>

                        {content.requirements && content.requirements.length > 0 && (
                          <div className="project-steps-checklist">
                            <h6>Milestone Requirements Checklist:</h6>
                            <ul className="steps-list">
                              {content.requirements.map((req, rIdx) => {
                                const isChecked = !!completedSteps[rIdx]
                                return (
                                  <li
                                    key={rIdx}
                                    className={`checklist-item ${isChecked ? 'completed-item' : ''}`}
                                    onClick={() => handleToggleStep(rIdx)}
                                    role="checkbox"
                                    aria-checked={isChecked}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === ' ' || e.key === 'Enter') {
                                        e.preventDefault()
                                        handleToggleStep(rIdx)
                                      }
                                    }}
                                  >
                                    <span className={`step-check-box ${isChecked ? 'checked' : ''}`}>
                                      {isChecked ? '✓' : ''}
                                    </span>
                                    <span className="step-text">{req}</span>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ConceptDetailPanel
