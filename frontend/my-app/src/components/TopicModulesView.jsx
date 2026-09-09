import React, { useState } from 'react'
import ModuleMcqQuiz from './ModuleMcqQuiz'
import ModuleSyntaxTest from './ModuleSyntaxTest'

function TopicModulesView({ topic }) {
  // Store expanded module IDs (Module 1 expanded by default)
  const [expandedModules, setExpandedModules] = useState(() => {
    return topic && topic.modules && topic.modules.length > 0 ? [topic.modules[0].id] : []
  })
  const [completedModules, setCompletedModules] = useState([])
  const [copiedCodeId, setCopiedCodeId] = useState(null)

  // Reset when topic changes
  React.useEffect(() => {
    if (topic && topic.modules && topic.modules.length > 0) {
      setExpandedModules([topic.modules[0].id])
    }
  }, [topic?.id])

  if (!topic) {
    return (
      <div className="empty-topic-view">
        <span className="empty-topic-icon" aria-hidden="true">💡</span>
        <h3>Select a Topic to Start Learning</h3>
        <p>Use the search bar above or click one of the popular technology chips to load its structured modules.</p>
      </div>
    )
  }

  const toggleModuleExpand = (modId) => {
    setExpandedModules(prev =>
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    )
  }

  const toggleModuleComplete = (modId, e) => {
    e.stopPropagation()
    setCompletedModules(prev =>
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    )
  }

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeId(id)
    setTimeout(() => setCopiedCodeId(null), 2000)
  }

  const totalModules = topic.modules ? topic.modules.length : 0
  const completedCount = completedModules.filter(id =>
    topic.modules?.some(m => m.id === id)
  ).length
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0

  return (
    <div className="topic-modules-view-container">
      {/* TOPIC HEADER BANNER */}
      <div className="topic-header-banner">
        <div className="topic-header-info">
          <div className="topic-header-badges">
            <span className="tech-badge-primary">
              <span className="badge-tech-icon">{topic.techIcon}</span>
              <span>{topic.techName}</span>
            </span>
            <span className="level-badge">{topic.level || 'Beginner Friendly'}</span>
            {topic.estimatedHours && (
              <span className="duration-badge">⏱️ {topic.estimatedHours}</span>
            )}
          </div>
          <h2 className="topic-title">{topic.title}</h2>
          <p className="topic-summary">{topic.summary}</p>
        </div>

        {/* Progress Tracker Card */}
        <div className="topic-progress-card">
          <div className="progress-info-row">
            <span className="progress-label">Curriculum Progress</span>
            <span className="progress-pct">{progressPercent}%</span>
          </div>
          <div className="progress-bar-track" role="progressbar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <span className="progress-subtext">
            {completedCount} of {totalModules} Modules Completed
          </span>
        </div>
      </div>

      {/* MODULES ACCORDION LIST */}
      <div className="modules-accordion-list">
        <div className="modules-list-header">
          <h3>Structured Learning Modules</h3>
          <span className="modules-count-pill">{totalModules} Step Learning Path</span>
        </div>

        {topic.modules && topic.modules.map((mod, index) => {
          const isExpanded = expandedModules.includes(mod.id)
          const isCompleted = completedModules.includes(mod.id)
          const content = mod.content || {}
          
          const explanation = mod.explanation || content.overview || content.explanation || mod.description
          const keyPoints = mod.keyPoints || content.keyPoints
          const codeSnippet = mod.codeSnippet || content.codeSnippet
          const videoUrl = mod.videoUrl || content.videoUrl
          const videoTitle = mod.videoTitle || content.videoTitle || mod.title
          const instructor = mod.instructor || content.instructor
          const duration = mod.duration || content.duration
          const notes = mod.notes || content.notes || (content.keyTakeaways ? content.keyTakeaways.join(' • ') : '')
          const examples = mod.examples || content.examples
          const questions = mod.questions || content.questions
          const testData = mod.testData || content.testData
          const objective = mod.objective || content.objective || mod.description
          const steps = mod.steps || content.steps
          const starterCode = mod.starterCode || content.starterCode

          return (
            <div
              key={mod.id}
              className={`module-accordion-card ${isExpanded ? 'expanded' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              {/* Accordion Trigger Header */}
              <div
                className="module-card-header"
                onClick={() => toggleModuleExpand(mod.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleModuleExpand(mod.id)
                  }
                }}
              >
                <div className="module-header-left">
                  <span className="module-number-badge">
                    Module {index + 1}
                  </span>
                  <div className="module-title-group">
                    <h4 className="module-card-title">{mod.title}</h4>
                    <span className="module-type-tag">{mod.type.toUpperCase()}</span>
                  </div>
                </div>

                <div className="module-header-right">
                  <button
                    type="button"
                    className={`mark-complete-btn ${isCompleted ? 'is-complete' : ''}`}
                    onClick={(e) => toggleModuleComplete(mod.id, e)}
                    title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                  >
                    {isCompleted ? '✓ Completed' : '○ Mark Done'}
                  </button>
                  <span className="module-chevron-icon" aria-hidden="true">
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Accordion Expandable Content Pane */}
              {isExpanded && (
                <div className="module-card-content">
                  {/* MODULE TYPE 1: CONCEPTS & EXPLANATION */}
                  {mod.type === 'concepts' && (
                    <div className="module-concepts-pane">
                      <div className="concept-explanation-card">
                        <h5>📖 Concept Breakdown & Deep Dive</h5>
                        <p className="concept-text">{explanation}</p>
                      </div>

                      {keyPoints && keyPoints.length > 0 && (
                        <div className="concept-keypoints-box">
                          <h6>Key Fundamentals & Rules to Remember:</h6>
                          <ul className="keypoints-list">
                            {keyPoints.map((pt, ptIdx) => (
                              <li key={ptIdx}>
                                <span className="pt-bullet">✦</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {codeSnippet && (
                        <div className="concept-snippet-box">
                          <div className="code-box-header">
                            <span>Syntax Sample</span>
                            <button
                              type="button"
                              className="copy-snippet-btn"
                              onClick={() => handleCopyCode(codeSnippet, mod.id)}
                            >
                              {copiedCodeId === mod.id ? 'Copied!' : 'Copy Code'}
                            </button>
                          </div>
                          <pre><code>{codeSnippet}</code></pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODULE TYPE 2: VIDEO TUTORIAL */}
                  {mod.type === 'video' && (
                    <div className="module-video-pane">
                      <div className="video-player-card">
                        <div className="video-embed-container">
                          {videoUrl ? (
                            <iframe
                              src={videoUrl}
                              title={videoTitle}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="video-iframe"
                            ></iframe>
                          ) : (
                            <div className="mock-video-placeholder">
                              <span className="video-play-icon">▶</span>
                              <p>High Definition Video Walkthrough</p>
                            </div>
                          )}
                        </div>

                        <div className="video-meta-details">
                          <div className="video-meta-top">
                            <h5>{videoTitle}</h5>
                            {duration && <span className="video-duration-tag">⏱️ {duration}</span>}
                          </div>
                          {instructor && (
                            <p className="video-instructor">
                              <strong>Instructor/Source:</strong> {instructor}
                            </p>
                          )}
                          {notes && <p className="video-notes">{notes}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODULE TYPE 3: CODE EXAMPLES & PATTERNS */}
                  {mod.type === 'code-examples' && (
                    <div className="module-examples-pane">
                      <p className="examples-lead">
                        Review the code patterns below carefully to understand syntax execution and standard best practices.
                      </p>

                      <div className="code-examples-grid">
                        {examples && examples.map((ex, exIdx) => (
                          <div key={exIdx} className="code-example-card">
                            <div className="example-card-header">
                              <h6>{ex.name || ex.title}</h6>
                              <button
                                type="button"
                                className="copy-snippet-btn"
                                onClick={() => handleCopyCode(ex.code, `${mod.id}-${exIdx}`)}
                              >
                                {copiedCodeId === `${mod.id}-${exIdx}` ? 'Copied!' : 'Copy Code'}
                              </button>
                            </div>
                            <pre className="example-code-pre">
                              <code>{ex.code}</code>
                            </pre>
                            {(ex.description || ex.notes) && (
                              <p className="example-code-desc">{ex.description || ex.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MODULE TYPE 4: MCQs & KNOWLEDGE CHECK */}
                  {mod.type === 'mcq' && (
                    <div className="module-mcq-pane">
                      <ModuleMcqQuiz questions={questions} />
                    </div>
                  )}

                  {/* MODULE TYPE 5: SYNTAX & DEBUGGING ASSESSMENT */}
                  {mod.type === 'test' && (
                    <div className="module-test-pane">
                      <ModuleSyntaxTest testData={testData} />
                    </div>
                  )}

                  {/* MODULE TYPE 6: PRACTICAL TASK / PROJECT */}
                  {mod.type === 'project' && (
                    <div className="module-project-pane">
                      <div className="project-brief-card">
                        <h5>🛠️ Practical Hands-On Challenge</h5>
                        <p className="project-objective">
                          <strong>Objective:</strong> {objective}
                        </p>

                        {steps && steps.length > 0 && (
                          <div className="project-steps-checklist">
                            <h6>Implementation Checklist:</h6>
                            <ul className="steps-list">
                              {steps.map((st, sIdx) => (
                                <li key={sIdx}>
                                  <span className="step-num">{sIdx + 1}</span>
                                  <span>{st}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {starterCode && (
                          <div className="starter-code-box">
                            <div className="code-box-header">
                              <span>Starter Code / Template</span>
                              <button
                                type="button"
                                className="copy-snippet-btn"
                                onClick={() => handleCopyCode(starterCode, `${mod.id}-starter`)}
                              >
                                {copiedCodeId === `${mod.id}-starter` ? 'Copied!' : 'Copy Code'}
                              </button>
                            </div>
                            <pre><code>{starterCode}</code></pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopicModulesView
