import React from 'react'

const MODULE_TYPE_META = {
  concepts: { icon: '📖', label: 'Theory' },
  video: { icon: '▶️', label: 'Video' },
  'code-examples': { icon: '💻', label: 'Code' },
  mcq: { icon: '🎯', label: 'MCQs' },
  test: { icon: '⚡', label: 'Syntax' },
  project: { icon: '🚀', label: 'Project' }
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
  const viewWidth = 960
  const viewHeight = 640
  const centerX = viewWidth / 2
  const centerY = viewHeight / 2

  // Spacious orbital geometry
  const conceptOrbitRadius = 225
  const totalConcepts = conceptNodes.length || 1
  const moduleOrbitRadius = 82

  // Calculate coordinates for all concept nodes
  const conceptPositions = conceptNodes.map((concept, idx) => {
    const angle = (idx / totalConcepts) * (2 * Math.PI) - Math.PI / 2
    const x = Math.round(centerX + conceptOrbitRadius * Math.cos(angle))
    const y = Math.round(centerY + conceptOrbitRadius * Math.sin(angle))
    return { ...concept, x, y, angle }
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
          <span className="graph-tech-icon">{tech?.icon || '⚡'}</span>
          <div>
            <h3 className="graph-tech-name">{tech?.name || 'Technical'} Knowledge Graph</h3>
            <span className="graph-subtitle">
              Click any concept or module node to open its full learning content overlay
            </span>
          </div>
        </div>

        <div className="graph-metrics-pill">
          <span className="live-graph-dot"></span>
          <span>{totalConcepts} Core Concepts</span>
          <span className="dot-sep">&bull;</span>
          <span>{totalConcepts * 6} Interactive Modules</span>
        </div>
      </div>

      {/* LARGE EXPANSIVE SVG KNOWLEDGE GRAPH CANVAS */}
      <div className="svg-canvas-container large-canvas">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="knowledge-graph-svg"
          aria-label="Large Interactive Knowledge Graph"
        >
          {/* BACKGROUND CONCENTRIC ORBIT RINGS */}
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius} className="orbit-track-ring main-track" />
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 0.55} className="orbit-track-ring inner-track" />
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 0.28} className="orbit-track-ring core-faint-track" />

          {/* CONNECTOR LINKS: ROOT TO CONCEPT NODES */}
          {conceptPositions.map((pos) => {
            const isSelected = pos.id === activeConcept?.id
            return (
              <line
                key={`link-${pos.id}`}
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                className={`graph-connector-line ${isSelected ? 'active-link' : ''}`}
              />
            )
          })}

          {/* SATELLITE CONNECTOR LINKS: ACTIVE CONCEPT TO SATELLITE MODULES */}
          {activeConcept &&
            modulePositions.map((mPos) => {
              const isModSelected = mPos.id === selectedModuleId
              return (
                <line
                  key={`mod-link-${mPos.id}`}
                  x1={activeConceptPos.x}
                  y1={activeConceptPos.y}
                  x2={mPos.x}
                  y2={mPos.y}
                  className={`satellite-connector-line ${isModSelected ? 'active-satellite-link' : ''}`}
                />
              )
            })}

          {/* SATELLITE MODULE NODES (CLICK TO OPEN MODULE OVERLAY) */}
          {activeConcept &&
            modulePositions.map((mPos, idx) => {
              const isModSelected = mPos.id === selectedModuleId
              const meta = MODULE_TYPE_META[mPos.type] || { icon: '📌', label: 'Module' }

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
                    <circle cx={mPos.x} cy={mPos.y} r={26} className="satellite-active-ring" />
                  )}

                  {/* Satellite Base Circle */}
                  <circle cx={mPos.x} cy={mPos.y} r={19} className="satellite-node-circle" />

                  {/* Icon */}
                  <text x={mPos.x} y={mPos.y + 5} className="satellite-node-icon" textAnchor="middle">
                    {meta.icon}
                  </text>

                  {/* Native SVG Module Badge */}
                  <g transform={`translate(${mPos.x - 40}, ${mPos.y + 22})`}>
                    <rect
                      x="0"
                      y="0"
                      width="80"
                      height="19"
                      rx="4"
                      className={`svg-module-badge-rect ${isModSelected ? 'active' : ''}`}
                    />
                    <text
                      x="40"
                      y="13"
                      textAnchor="middle"
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
                if (firstConcept.modules && firstConcept.modules.length > 0) {
                  onSelectModule(firstConcept.modules[0], firstConcept)
                }
              }
            }}
          >
            <circle cx={centerX} cy={centerY} r={44} className="root-node-circle" />
            <text x={centerX} y={centerY - 6} className="root-node-icon" textAnchor="middle">
              {tech?.icon || '⚡'}
            </text>
            <text x={centerX} y={centerY + 20} className="root-node-label" textAnchor="middle">
              {tech?.name || 'CORE'}
            </text>
          </g>

          {/* CONCEPT NODES (CLICK DIRECTLY TO SELECT & OPEN OVERLAY) */}
          {conceptPositions.map((pos) => {
            const isSelected = pos.id === activeConcept?.id

            return (
              <g
                key={`concept-node-${pos.id}`}
                className={`concept-node-group ${isSelected ? 'active-concept-node' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectConcept(pos.id)
                  if (pos.modules && pos.modules.length > 0) {
                    onSelectModule(pos.modules[0], pos)
                  }
                }}
                tabIndex="0"
                role="button"
                aria-label={`Concept: ${pos.label}`}
              >
                {/* Active Indicator Ring */}
                {isSelected && (
                  <circle cx={pos.x} cy={pos.y} r={36} className="concept-active-aura-ring" />
                )}

                {/* Concept Main Circle */}
                <circle cx={pos.x} cy={pos.y} r={28} className="concept-node-circle" />

                {/* Concept Number */}
                <text x={pos.x} y={pos.y + 5} className="concept-node-number" textAnchor="middle">
                  0{pos.number}
                </text>

                {/* Native SVG Concept Label Card */}
                <g transform={`translate(${pos.x - 72}, ${pos.y + 32})`}>
                  <rect
                    x="0"
                    y="0"
                    width="144"
                    height="24"
                    rx="6"
                    className={`svg-concept-badge-rect ${isSelected ? 'active' : ''}`}
                  />
                  <text
                    x="72"
                    y="16"
                    textAnchor="middle"
                    className={`svg-concept-badge-text ${isSelected ? 'active' : ''}`}
                  >
                    {pos.label.length > 18 ? pos.label.slice(0, 17) + '…' : pos.label}
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
                onClick={() => {
                  onSelectConcept(concept.id)
                  if (concept.modules && concept.modules.length > 0) {
                    onSelectModule(concept.modules[0], concept)
                  }
                }}
              >
                <span className="nav-pill-num">0{concept.number}</span>
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

