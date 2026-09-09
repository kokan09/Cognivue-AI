import React, { useState } from 'react'
import ModuleMcqQuiz from './ModuleMcqQuiz'
import ModuleSyntaxTest from './ModuleSyntaxTest'

const TYPE_LABELS = {
  concepts: { name: 'Concept & Fundamentals', icon: '📖', color: '#10b981' },
  video: { name: 'Video Masterclass', icon: '▶️', color: '#38bdf8' },
  'code-examples': { name: 'Code Patterns & Examples', icon: '💻', color: '#a855f7' },
  mcq: { name: 'Knowledge Check (MCQs)', icon: '🎯', color: '#f59e0b' },
  test: { name: 'Syntax & Debugging Challenge', icon: '⚡', color: '#ef4444' },
  project: { name: 'Practical Task & Capstone', icon: '🚀', color: '#6366f1' }
}

function ModuleDetailPanel({ module, concept, techName, onClose, onSelectModule }) {
  const [copiedMap, setCopiedMap] = useState({})
  const [completedSteps, setCompletedSteps] = useState({})

  if (!module) {
    return (
      <div className="module-detail-empty-panel">
        <div className="empty-panel-icon">🗺️</div>
        <h4>Select a Node to View Module</h4>
        <p>Click on any concept or satellite module in the Knowledge Graph to inspect theory, videos, code patterns, and quizzes.</p>
      </div>
    )
  }

  const content = module.content || {}
  const typeMeta = TYPE_LABELS[module.type] || { name: 'Learning Module', icon: '📌', color: '#10b981' }
  const conceptModules = concept?.modules || []

  const handleCopyCode = (code, key = 'default') => {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopiedMap(prev => ({ ...prev, [key]: true }))
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [key]: false }))
    }, 2000)
  }

  const handleToggleStep = (stepIdx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepIdx]: !prev[stepIdx]
    }))
  }

  return (
    <div className="module-detail-panel modal-inner-panel">
      {/* PANEL TOP BAR / BREADCRUMB & CLOSE BUTTON */}
      <div className="detail-top-bar">
        <div className="detail-breadcrumb">
          <span className="crumb-tech">{techName || 'Technology'}</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-concept">{concept?.label || 'Concept'}</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-module">Module {module.number || 1}</span>
        </div>

        <div className="detail-top-actions">
          <div className="detail-type-badge" style={{ borderColor: typeMeta.color }}>
            <span className="type-badge-icon">{typeMeta.icon}</span>
            <span className="type-badge-text">{typeMeta.name}</span>
          </div>
          {onClose && (
            <button
              type="button"
              className="panel-close-btn modal-cross-btn"
              onClick={onClose}
              title="Close module overlay (Esc)"
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* MODULE HEADER TITLE */}
      <div className="detail-header-section">
        <div className="detail-title-row">
          <span className="module-number-pill">M0{module.number || 1}</span>
          <h2 className="module-main-title">{module.title}</h2>
        </div>
        {module.description && (
          <p className="module-main-desc">{module.description}</p>
        )}
      </div>

      {/* DYNAMIC CONTENT BODY BY MODULE TYPE */}
      <div className="detail-body-content">
        {/* TYPE 1: CONCEPTS & THEORY */}
        {module.type === 'concepts' && (
          <div className="module-content-block concepts-view">
            {content.overview && (
              <div className="concept-overview-box">
                <h4>Concept Breakdown</h4>
                <p>{content.overview}</p>
              </div>
            )}

            {content.keyPoints && content.keyPoints.length > 0 && (
              <div className="concept-keypoints-box">
                <h4>Key Takeaways &amp; Core Principles</h4>
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
                    onClick={() => handleCopyCode(content.codeSnippet, 'concept-main')}
                  >
                    {copiedMap['concept-main'] ? 'Copied ✓' : 'Copy Code'}
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
        {module.type === 'video' && (
          <div className="module-content-block video-view">
            <div className="video-player-frame-wrapper">
              <iframe
                src={content.videoUrl || 'https://www.youtube.com/embed/W6NZfCO5SIk'}
                title={content.videoTitle || module.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="embedded-video-iframe"
              ></iframe>
            </div>

            <div className="video-meta-details">
              <div className="video-meta-row">
                <span className="video-instructor">Instructor: <strong>{content.instructor || 'Cognivue Lead'}</strong></span>
                <span className="video-duration">Duration: <strong>{content.duration || '15 mins'}</strong></span>
              </div>

              {content.keyTakeaways && (
                <div className="video-timestamps-box">
                  <h5>High-Yield Timeline &amp; Key Moments</h5>
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
        {module.type === 'code-examples' && (
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
                      {copiedMap[`ex-${exIdx}`] ? 'Copied ✓' : 'Copy Snippet'}
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
                    {copiedMap['ex-single'] ? 'Copied ✓' : 'Copy Snippet'}
                  </button>
                </div>
                <pre className="code-pre-block">
                  <code>{content.codeSnippet}</code>
                </pre>
              </div>
            ) : (
              <p>No code examples available for this module.</p>
            )}
          </div>
        )}

        {/* TYPE 4: MCQs ASSESSMENT */}
        {module.type === 'mcq' && (
          <div className="module-content-block mcq-view">
            <ModuleMcqQuiz questions={content.questions || []} />
          </div>
        )}

        {/* TYPE 5: SYNTAX & DEBUGGING CHALLENGE */}
        {module.type === 'test' && (
          <div className="module-content-block test-view">
            <ModuleSyntaxTest challenge={content} />
          </div>
        )}

        {/* TYPE 6: PRACTICAL PROJECT */}
        {module.type === 'project' && (
          <div className="module-content-block project-view">
            <div className="project-brief-card">
              <h5>Project Objective</h5>
              <p className="project-objective">{content.taskGoal || 'Construct an end-to-end practical project applying the core concepts learned.'}</p>

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
      </div>
    </div>
  )
}

export default ModuleDetailPanel
