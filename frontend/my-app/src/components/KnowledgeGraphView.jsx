import React, { useState } from 'react'

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
  const [hiddenConceptIds, setHiddenConceptIds] = useState(new Set())

  // Active concept node (defaults to first concept on load)
  const activeConcept = conceptNodes.find(c => c.id === selectedConceptId) || conceptNodes[0] || null

  // High-resolution SVG dimensions
  const viewWidth = 1380
  const viewHeight = 900
  const centerX = viewWidth / 2
  const centerY = viewHeight / 2

  // Spacious orbital geometry
  const conceptOrbitRadius = 310
  const totalConcepts = conceptNodes.length || 1
  const satelliteOrbitRadius = 96

  // Calculate coordinates for all concept nodes
  const conceptPositions = conceptNodes.map((concept, idx) => {
    const angle = (idx / totalConcepts) * (2 * Math.PI) - Math.PI / 2
    const x = Math.round(centerX + conceptOrbitRadius * Math.cos(angle))
    const y = Math.round(centerY + conceptOrbitRadius * Math.sin(angle))
    const textLines = formatConceptLines(concept.label)
    return { ...concept, x, y, angle, textLines }
  })

  // Calculate satellite module coordinates for ALL concept nodes
  const allConceptModulePositions = conceptPositions.map((cPos) => {
    const modules = cPos.modules || []
    const totalMods = modules.length || 6
    const moduleNodes = modules.map((mod, mIdx) => {
      // 360 degree orbital ring around each concept
      const modAngle = (mIdx / totalMods) * (2 * Math.PI) - Math.PI / 2
      const mx = Math.round(cPos.x + satelliteOrbitRadius * Math.cos(modAngle))
      const my = Math.round(cPos.y + satelliteOrbitRadius * Math.sin(modAngle))
      return { ...mod, x: mx, y: my, conceptId: cPos.id, parentConcept: cPos }
    })
    return { conceptId: cPos.id, moduleNodes }
  })

  const handleConceptClick = (conceptId) => {
    setHiddenConceptIds(prev => {
      const next = new Set(prev)
      if (next.has(conceptId)) {
        next.delete(conceptId)
      } else {
        next.add(conceptId)
      }
      return next
    })
    onSelectConcept(conceptId)
  }

  return (
    <div className="knowledge-graph-panel large-graph-view">
      {/* EXPANSIVE VISUAL SVG ROADMAP */}
      <div className="svg-canvas-container large-canvas">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="knowledge-graph-svg"
          aria-label={`${tech?.name || 'Technology'} Interactive Roadmap`}
        >
          {/* SVG GRADIENTS */}
          <defs>
            <radialGradient id="centerRadialGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent-strong)" stopOpacity="0.16" />
              <stop offset="65%" stopColor="var(--accent-strong)" stopOpacity="0.04" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="rootNodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>
          </defs>

          {/* BACKGROUND AMBIENT GLOW */}
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 1.36} fill="url(#centerRadialGlow)" />

          {/* BACKGROUND CONCENTRIC RADAR RINGS */}
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 1.28} className="orbit-track-ring outer-faint-track" />
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius} className="orbit-track-ring main-track" />
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 0.58} className="orbit-track-ring inner-track" />
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 0.28} className="orbit-track-ring core-faint-track" />

          {/* RADAR CROSSHAIR AXES */}
          <line x1={centerX - conceptOrbitRadius * 1.22} y1={centerY} x2={centerX + conceptOrbitRadius * 1.22} y2={centerY} className="radar-grid-line" />
          <line x1={centerX} y1={centerY - conceptOrbitRadius * 1.22} x2={centerX} y2={centerY + conceptOrbitRadius * 1.22} className="radar-grid-line" />

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
                    r={4.5}
                    className="synapse-pulse-dot"
                  />
                )}
              </g>
            )
          })}

          {/* SATELLITE CONNECTOR LINKS (WHEN NOT HIDDEN FOR THAT CONCEPT) */}
          {allConceptModulePositions.map(({ conceptId, moduleNodes }) => {
            if (hiddenConceptIds.has(conceptId)) return null
            const isConceptSelected = conceptId === activeConcept?.id
            const cPos = conceptPositions.find(c => c.id === conceptId)
            if (!cPos) return null

            return moduleNodes.map((mPos) => {
              const isModSelected = mPos.id === selectedModuleId
              const meta = MODULE_TYPE_META[mPos.type] || { color: '#10b981' }
              return (
                <line
                  key={`mod-link-${mPos.id}`}
                  x1={cPos.x}
                  y1={cPos.y}
                  x2={mPos.x}
                  y2={mPos.y}
                  stroke={isModSelected ? meta.color : isConceptSelected ? 'var(--accent-strong)' : 'var(--border)'}
                  className={`satellite-connector-line ${isModSelected ? 'active-satellite-link' : ''}`}
                  opacity={isConceptSelected ? 0.85 : 0.5}
                />
              )
            })
          })}

          {/* SATELLITE MODULE NODES (WHEN NOT HIDDEN FOR THAT CONCEPT) */}
          {allConceptModulePositions.map(({ conceptId, moduleNodes }) => {
            if (hiddenConceptIds.has(conceptId)) return null
            const isConceptSelected = conceptId === activeConcept?.id
            const parentConcept = conceptPositions.find(c => c.id === conceptId)

            return moduleNodes.map((mPos, idx) => {
              const isModSelected = mPos.id === selectedModuleId
              const meta = MODULE_TYPE_META[mPos.type] || { icon: '📌', label: 'Module', color: '#10b981' }

              return (
                <g
                  key={`sat-node-${mPos.id}`}
                  className={`satellite-node-group ${isModSelected ? 'selected-module-node' : ''} ${isConceptSelected ? 'concept-active-sat' : 'faint-sat'}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectModule(mPos, parentConcept)
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
                      r={24}
                      stroke={meta.color}
                      className="satellite-active-ring"
                    />
                  )}

                  {/* Satellite Base Circle */}
                  <circle
                    cx={mPos.x}
                    cy={mPos.y}
                    r={18}
                    fill="var(--surface)"
                    stroke={isModSelected ? meta.color : isConceptSelected ? 'var(--accent-strong)' : 'var(--border)'}
                    strokeWidth={isModSelected ? 2.5 : 1.5}
                    className="satellite-node-circle"
                  />

                  {/* Icon */}
                  <text x={mPos.x} y={mPos.y + 4.5} className="satellite-node-icon" textAnchor="middle">
                    {meta.icon}
                  </text>

                  {/* High-Contrast SVG Module Badge */}
                  <g transform={`translate(${mPos.x - 36}, ${mPos.y + 20})`}>
                    <rect
                      x="0"
                      y="0"
                      width="72"
                      height="18"
                      rx="4"
                      fill="#090d16"
                      stroke={isModSelected ? meta.color : isConceptSelected ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)'}
                      strokeWidth={isModSelected ? 1.6 : 1}
                      className={`svg-module-badge-rect ${isModSelected ? 'active' : ''}`}
                    />
                    <text
                      x="36"
                      y="12.5"
                      textAnchor="middle"
                      fill={isModSelected ? meta.color : '#f1f5f9'}
                      className={`svg-module-badge-text ${isModSelected ? 'active' : ''}`}
                    >
                      M{mPos.number || idx + 1}: {meta.label}
                    </text>
                  </g>
                </g>
              )
            })
          })}

          {/* CENTRAL ROOT TECHNOLOGY NODE */}
          <g
            className="graph-root-node-group"
            tabIndex="0"
            role="img"
            aria-label={`${tech?.name} Technology Core`}
          >
            <circle cx={centerX} cy={centerY} r={60} className="root-node-halo" />
            <circle cx={centerX} cy={centerY} r={50} fill="url(#rootNodeGradient)" className="root-node-circle" />

            <text x={centerX} y={centerY - 9} className="root-node-icon" textAnchor="middle">
              {tech?.icon || '⚡'}
            </text>

            <text x={centerX} y={centerY + 18} className="root-node-label" textAnchor="middle">
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
                  handleConceptClick(pos.id)
                }}
                tabIndex="0"
                role="button"
                aria-label={`Concept: ${pos.label}`}
              >
                {/* Active Glowing Halo Ring */}
                {isSelected && (
                  <circle cx={pos.x} cy={pos.y} r={54} className="concept-active-aura-ring" />
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
                    y={pos.y + 5}
                    className="concept-inner-title single-line"
                    textAnchor="middle"
                  >
                    {line1}
                  </text>
                )}
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
                onClick={() => handleConceptClick(concept.id)}
              >
                <span className="nav-pill-name">{concept.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default KnowledgeGraphView


