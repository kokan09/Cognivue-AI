import React from 'react'

const MODULE_TYPE_META = {
  concepts: { icon: '📖', label: 'Theory', color: '#10b981' },
  video: { icon: '▶️', label: 'Video', color: '#38bdf8' },
  'code-examples': { icon: '💻', label: 'Code', color: '#a855f7' },
  mcq: { icon: '🎯', label: 'MCQs', color: '#f59e0b' },
  test: { icon: '⚡', label: 'Syntax', color: '#ef4444' },
  project: { icon: '🚀', label: 'Project', color: '#6366f1' }
}

function formatConceptLines(label) {
  if (!label) return { line1: 'Concept', line2: '' }
  // Clean up and split title into 1 or 2 balanced lines
  const words = label.split(' ')
  if (words.length <= 2) {
    return { line1: words.join(' '), line2: '' }
  }
  const mid = Math.ceil(words.length / 2)
  return {
    line1: words.slice(0, mid).join(' '),
    line2: words.slice(mid).join(' ')
  }
}

function KnowledgeGraphView({
  graphData,
  selectedConceptId,
  selectedModuleId,
  onSelectConcept,
  onSelectModule
}) {
  const { tech, conceptNodes = [] } = graphData || {}

  // Active concept node
  const activeConcept = conceptNodes.find(c => c.id === selectedConceptId) || conceptNodes[0] || null
  const activeModules = activeConcept?.modules || []

  // Expansive, high-resolution SVG dimensions
  const viewWidth = 1120
  const viewHeight = 780
  const centerX = viewWidth / 2
  const centerY = viewHeight / 2

  // Spacious orbital geometry for large nodes
  const conceptOrbitRadius = 265
  const totalConcepts = conceptNodes.length || 1
  const moduleOrbitRadius = 106

  // Calculate coordinates for all concept nodes
  const conceptPositions = conceptNodes.map((concept, idx) => {
    const angle = (idx / totalConcepts) * (2 * Math.PI) - Math.PI / 2
    const x = Math.round(centerX + conceptOrbitRadius * Math.cos(angle))
    const y = Math.round(centerY + conceptOrbitRadius * Math.sin(angle))
    const textLines = formatConceptLines(concept.label)
    return { ...concept, x, y, angle, textLines }
  })

  // Coordinates for the 6 satellite module nodes around active concept
  const activeConceptPos = conceptPositions.find(c => c.id === activeConcept?.id) || { x: centerX, y: centerY }
  const totalModules = activeModules.length || 1

  const modulePositions = activeModules.map((mod, idx) => {
    const angle = (idx / totalModules) * (2 * Math.PI) - Math.PI / 2
    const x = Math.round(activeConceptPos.x + moduleOrbitRadius * Math.cos(angle))
    const y = Math.round(activeConceptPos.y + moduleOrbitRadius * Math.sin(angle))
    return { ...mod, x, y, angle }
  })

  return (
    <div className="knowledge-graph-panel large-graph-view">
      {/* GRAPH HEADER */}
      <div className="graph-panel-header">
        <div className="graph-title-group">
          <div className="tech-avatar-orb">
            <span className="graph-tech-icon">{tech?.icon || '⚡'}</span>
          </div>
          <div>
            <div className="graph-title-eyebrow">
              <span className="live-graph-dot"></span>
              <span>INTERACTIVE TECHNICAL NETWORK</span>
            </div>
            <h3 className="graph-tech-name">{tech?.name || 'Technical'} Knowledge Graph</h3>
            <span className="graph-subtitle">
              Click a concept node to view its orbiting modules &bull; Click any module node to open learning content
            </span>
          </div>
        </div>

        <div className="graph-metrics-pill">
          <span className="metrics-badge-item">
            <strong>{totalConcepts}</strong> Concepts
          </span>
          <span className="dot-sep">&bull;</span>
          <span className="metrics-badge-item">
            <strong>{totalConcepts * 6}</strong> Modules
          </span>
        </div>
      </div>

      {/* EXPANSIVE VISUAL SVG KNOWLEDGE GRAPH */}
      <div className="svg-canvas-container large-canvas">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="knowledge-graph-svg"
          aria-label="Interactive Technical Knowledge Graph"
        >
          {/* SVG GRADIENTS */}
          <defs>
            <radialGradient id="centerRadialGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent-strong)" stopOpacity="0.14" />
              <stop offset="65%" stopColor="var(--accent-strong)" stopOpacity="0.03" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="rootNodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>
          </defs>

          {/* BACKGROUND AMBIENT GLOW */}
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 1.35} fill="url(#centerRadialGlow)" />

          {/* BACKGROUND CONCENTRIC RADAR RINGS */}
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 1.18} className="orbit-track-ring outer-faint-track" />
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius} className="orbit-track-ring main-track" />
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 0.56} className="orbit-track-ring inner-track" />
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 0.28} className="orbit-track-ring core-faint-track" />

          {/* RADAR CROSSHAIR AXES */}
          <line x1={centerX - conceptOrbitRadius * 1.15} y1={centerY} x2={centerX + conceptOrbitRadius * 1.15} y2={centerY} className="radar-grid-line" />
          <line x1={centerX} y1={centerY - conceptOrbitRadius * 1.15} x2={centerX} y2={centerY + conceptOrbitRadius * 1.15} className="radar-grid-line" />

          {/* CONNECTOR LINKS: ROOT TO ALL CONCEPT NODES */}
          {conceptPositions.map((pos) => {
            const isSelected = pos.id === activeConcept?.id
            return (
              <g key={`link-group-${pos.id}`}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  className={`graph-connector-line ${isSelected ? 'active-link' : ''}`}
                />
                {isSelected && (
                  <circle
                    cx={Math.round(centerX + (pos.x - centerX) * 0.5)}
                    cy={Math.round(centerY + (pos.y - centerY) * 0.5)}
                    r={4}
                    className="synapse-pulse-dot"
                  />
                )}
              </g>
            )
          })}

          {/* SATELLITE CONNECTOR LINKS: ACTIVE CONCEPT TO SATELLITE MODULES */}
          {activeConcept &&
            modulePositions.map((mPos) => {
              const isModSelected = mPos.id === selectedModuleId
              const meta = MODULE_TYPE_META[mPos.type] || { color: '#10b981' }
              return (
                <line
                  key={`mod-link-${mPos.id}`}
                  x1={activeConceptPos.x}
                  y1={activeConceptPos.y}
                  x2={mPos.x}
                  y2={mPos.y}
                  stroke={isModSelected ? meta.color : 'var(--border)'}
                  className={`satellite-connector-line ${isModSelected ? 'active-satellite-link' : ''}`}
                />
              )
            })}

          {/* SATELLITE MODULE NODES (CLICK DIRECTLY TO OPEN OVERLAY CONTENT) */}
          {activeConcept &&
            modulePositions.map((mPos, idx) => {
              const isModSelected = mPos.id === selectedModuleId
              const meta = MODULE_TYPE_META[mPos.type] || { icon: '📌', label: 'Module', color: '#10b981' }

              return (
                <g
                  key={`sat-node-${mPos.id}`}
                  className={`satellite-node-group ${isModSelected ? 'selected-module-node' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectModule(mPos, activeConcept)
                  }}
                  tabIndex="0"
                  role="button"
                  aria-label={`Module ${mPos.number || idx + 1}: ${mPos.title}`}
                >
                  {/* Outer active highlight ring */}
                  {isModSelected && (
                    <circle
                      cx={mPos.x}
                      cy={mPos.y}
                      r={28}
                      stroke={meta.color}
                      className="satellite-active-ring"
                    />
                  )}

                  {/* Satellite Base Circle */}
                  <circle
                    cx={mPos.x}
                    cy={mPos.y}
                    r={21}
                    fill="var(--surface)"
                    stroke={isModSelected ? meta.color : 'var(--border)'}
                    strokeWidth={isModSelected ? 2.5 : 1.5}
                    className="satellite-node-circle"
                  />

                  {/* Icon */}
                  <text x={mPos.x} y={mPos.y + 5} className="satellite-node-icon" textAnchor="middle">
                    {meta.icon}
                  </text>

                  {/* High-Contrast SVG Module Badge */}
                  <g transform={`translate(${mPos.x - 44}, ${mPos.y + 25})`}>
                    <rect
                      x="0"
                      y="0"
                      width="88"
                      height="21"
                      rx="5"
                      fill="#090d16"
                      stroke={isModSelected ? meta.color : 'rgba(255,255,255,0.2)'}
                      strokeWidth={isModSelected ? 1.8 : 1}
                      className={`svg-module-badge-rect ${isModSelected ? 'active' : ''}`}
                    />
                    <text
                      x="44"
                      y="14.5"
                      textAnchor="middle"
                      fill={isModSelected ? meta.color : '#f1f5f9'}
                      className={`svg-module-badge-text ${isModSelected ? 'active' : ''}`}
                    >
                      M{mPos.number || idx + 1}: {meta.label}
                    </text>
                  </g>
                </g>
              )
            })}

          {/* CENTRAL ROOT TECHNOLOGY NODE */}
          <g
            className="graph-root-node-group"
            onClick={() => {
              const firstConcept = conceptNodes[0]
              if (firstConcept) {
                onSelectConcept(firstConcept.id)
              }
            }}
          >
            <circle cx={centerX} cy={centerY} r={58} className="root-node-halo" />
            <circle cx={centerX} cy={centerY} r={48} fill="url(#rootNodeGradient)" className="root-node-circle" />

            <text x={centerX} y={centerY - 8} className="root-node-icon" textAnchor="middle">
              {tech?.icon || '⚡'}
            </text>

            <text x={centerX} y={centerY + 20} className="root-node-label" textAnchor="middle">
              {tech?.name || 'CORE'}
            </text>
          </g>

          {/* LARGE CONCEPT NODES (DISPLAY ACTUAL CONCEPT NAME INSIDE CIRCLE) */}
          {conceptPositions.map((pos) => {
            const isSelected = pos.id === activeConcept?.id
            const { line1, line2 } = pos.textLines

            return (
              <g
                key={`concept-node-${pos.id}`}
                className={`concept-node-group ${isSelected ? 'active-concept-node' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectConcept(pos.id)
                }}
                tabIndex="0"
                role="button"
                aria-label={`Concept: ${pos.label}`}
              >
                {/* Active Glowing Halo Ring */}
                {isSelected && (
                  <circle cx={pos.x} cy={pos.y} r={55} className="concept-active-aura-ring" />
                )}

                {/* Large Concept Main Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={46}
                  className="concept-node-circle"
                />

                {/* Concept Name Displayed Directly Inside Circle */}
                {line2 ? (
                  <>
                    <text
                      x={pos.x}
                      y={pos.y - 4}
                      className="concept-inner-title line-1"
                      textAnchor="middle"
                    >
                      {line1}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 12}
                      className="concept-inner-title line-2"
                      textAnchor="middle"
                    >
                      {line2}
                    </text>
                  </>
                ) : (
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    className="concept-inner-title single-line"
                    textAnchor="middle"
                  >
                    {line1}
                  </text>
                )}

                {/* Bottom Module Count Pill */}
                <g transform={`translate(${pos.x - 38}, ${pos.y + 50})`}>
                  <rect
                    x="0"
                    y="0"
                    width="76"
                    height="18"
                    rx="9"
                    fill="#090d16"
                    stroke={isSelected ? 'var(--accent-strong)' : 'rgba(255,255,255,0.2)'}
                    strokeWidth="1"
                    className="concept-bottom-pill-rect"
                  />
                  <text
                    x="38"
                    y="12.5"
                    textAnchor="middle"
                    fill={isSelected ? 'var(--accent-strong)' : 'var(--text-muted)'}
                    className="concept-bottom-pill-text"
                  >
                    6 Modules
                  </text>
                </g>
              </g>
            )
          })}
        </svg>
      </div>

      {/* QUICK CONCEPT NAVIGATION BAR */}
      <div className="graph-concept-quick-nav">
        <span className="quick-nav-label">CONCEPTS:</span>
        <div className="quick-nav-pills">
          {conceptNodes.map((concept) => {
            const isSelected = concept.id === activeConcept?.id
            return (
              <button
                key={concept.id}
                type="button"
                className={`graph-nav-pill ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectConcept(concept.id)}
              >
                <span className="nav-pill-name">{concept.label}</span>
                <span className="nav-pill-badge">6 Modules</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default KnowledgeGraphView


