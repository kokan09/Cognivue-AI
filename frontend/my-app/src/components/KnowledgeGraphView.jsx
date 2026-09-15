import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ConceptDetailPanel from './ConceptDetailPanel'

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
  onSelectConcept,
  onSelectModule
}) {
  const { tech, conceptNodes = [] } = graphData || {}

  // 1. Focused Concept Node state (camera focus & subnodes expansion)
  const [expandedConceptId, setExpandedConceptId] = useState(null)

  // 2. Active Sub-node state (opens full Theory / Test / Module page)
  const [activeSubnode, setActiveSubnode] = useState(null)
  const [activeParentConcept, setActiveParentConcept] = useState(null)
  const [activeModuleType, setActiveModuleType] = useState('concepts')

  // High-resolution SVG geometry
  const viewWidth = 1380
  const viewHeight = 900
  const centerX = viewWidth / 2
  const centerY = viewHeight / 2

  // Orbital geometry
  const conceptOrbitRadius = 310
  const totalConcepts = conceptNodes.length || 1

  // Distance of subnodes from parent concept center:
  // Idle: 60px, Expanded (Zoomed focus): 132px
  const idleSubnodeDist = 60
  const expandedSubnodeDist = 132

  // Calculate coordinates for all concept nodes
  const conceptPositions = conceptNodes.map((concept, idx) => {
    const angle = (idx / totalConcepts) * (2 * Math.PI) - Math.PI / 2
    const x = Math.round(centerX + conceptOrbitRadius * Math.cos(angle))
    const y = Math.round(centerY + conceptOrbitRadius * Math.sin(angle))
    const textLines = formatConceptLines(concept.label)
    const subConcepts = concept.subConcepts || []
    const totalSubs = subConcepts.length || 6

    const subnodes = subConcepts.map((sub, sIdx) => {
      const subAngle = (sIdx / totalSubs) * (2 * Math.PI) - Math.PI / 2
      // Idle coordinates
      const idleX = Math.round(x + idleSubnodeDist * Math.cos(subAngle))
      const idleY = Math.round(y + idleSubnodeDist * Math.sin(subAngle))
      // Expanded coordinates
      const expX = Math.round(x + expandedSubnodeDist * Math.cos(subAngle))
      const expY = Math.round(y + expandedSubnodeDist * Math.sin(subAngle))

      return {
        ...sub,
        angle: subAngle,
        idleX,
        idleY,
        expX,
        expY,
        parentConcept: concept
      }
    })

    return {
      ...concept,
      x,
      y,
      angle,
      textLines,
      index: idx,
      subnodes
    }
  })

  // Currently expanded concept object
  const expandedConcept = conceptPositions.find(c => c.id === expandedConceptId) || null
  const isAnyExpanded = Boolean(expandedConceptId)

  // Camera Zoom & Pan Calculations:
  // Scales up by 1.6x and translates the clicked node to the exact center (centerX, centerY)
  const cameraScale = isAnyExpanded ? 1.6 : 1
  const cameraTranslateX = isAnyExpanded && expandedConcept
    ? Math.round(centerX - expandedConcept.x * cameraScale)
    : 0
  const cameraTranslateY = isAnyExpanded && expandedConcept
    ? Math.round(centerY - expandedConcept.y * cameraScale)
    : 0

  // Handle clicking a main concept node -> Smooth camera pan/zoom to center it & expand its subnodes
  const handleConceptClick = (conceptId) => {
    if (expandedConceptId === conceptId) {
      setExpandedConceptId(null)
    } else {
      setExpandedConceptId(conceptId)
      onSelectConcept?.(conceptId)
    }
  }

  // Handle clicking a subnode -> Open its interactive learning module page
  const handleSubnodeClick = (sub, parent) => {
    setActiveSubnode(sub)
    setActiveParentConcept(parent || expandedConcept)
    setActiveModuleType('concepts')
    onSelectModule?.(sub, parent)
  }

  // Handle collapsing zoom focus
  const handleCollapse = () => {
    setExpandedConceptId(null)
  }

  // Handle closing detail panel
  const handleCloseDetail = () => {
    setActiveSubnode(null)
  }

  // Escape key handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeSubnode) {
          handleCloseDetail()
        } else if (expandedConceptId) {
          handleCollapse()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSubnode, expandedConceptId])

  return (
    <div className={`knowledge-graph-panel large-graph-view relative-container ${isAnyExpanded ? 'is-camera-zoomed' : ''}`}>
      {/* STATUS / HINT BANNER WHEN A NODE IS FOCUSED */}
      {isAnyExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="roadmap-zoom-hud-bar"
        >
          <button
            type="button"
            className="zoom-back-btn"
            onClick={handleCollapse}
            title="Reset zoom & return to full roadmap (Esc)"
          >
            <span className="btn-arrow">←</span>
            <span>Reset View</span>
          </button>

          <div className="zoomed-concept-title-pill">
            <span className="pill-eyebrow">FOCUSED CONCEPT:</span>
            <span className="pill-title">{expandedConcept?.label}</span>
            <span className="pill-count">{expandedConcept?.subnodes?.length || 6} Sub-Types</span>
          </div>

          <span className="zoom-hint">Click any glowing sub-node below to open Theory, Videos, Code &amp; Quizzes</span>
        </motion.div>
      )}

      {/* SVG GRAPH CANVAS */}
      <div className="svg-canvas-container large-canvas">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="knowledge-graph-svg"
          aria-label={`${tech?.name || 'Technology'} Interactive Roadmap`}
        >
          <defs>
            <radialGradient id="centerRadialGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent-strong)" stopOpacity="0.22" />
              <stop offset="65%" stopColor="var(--accent-strong)" stopOpacity="0.04" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="rootNodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#241b15" />
              <stop offset="100%" stopColor="#120e0b" />
            </linearGradient>
          </defs>

          {/* BACKGROUND AMBIENT GLOW */}
          <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 1.35} fill="url(#centerRadialGlow)" />

          {/* CLICK-AWAY CATCHER: Closes expanded focus when dimmed canvas background is clicked */}
          {isAnyExpanded && (
            <rect
              x="0"
              y="0"
              width={viewWidth}
              height={viewHeight}
              fill="rgba(0, 0, 0, 0.42)"
              onClick={handleCollapse}
              style={{ cursor: 'pointer' }}
            />
          )}

          {/*
            HARDWARE-ACCELERATED CAMERA STAGE:
            Smoothly pans and scales the graph directly on the GPU compositor thread for 60fps silky motion!
          */}
          <g
            className="knowledge-graph-camera-stage"
            style={{
              transform: isAnyExpanded
                ? `translate3d(${cameraTranslateX}px, ${cameraTranslateY}px, 0) scale(${cameraScale})`
                : 'translate3d(0px, 0px, 0) scale(1)',
              transformOrigin: '0 0',
              transition: 'transform 0.52s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform'
            }}
          >
            {/* 1. BACKGROUND RADAR TRACKS */}
            <g
              style={{
                opacity: isAnyExpanded ? 0.1 : 0.8,
                transition: 'opacity 0.4s ease'
              }}
            >
              <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 1.26} className="orbit-track-ring outer-faint-track" />
              <circle cx={centerX} cy={centerY} r={conceptOrbitRadius} className="orbit-track-ring main-track" />
              <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 0.58} className="orbit-track-ring inner-track" />
              <circle cx={centerX} cy={centerY} r={conceptOrbitRadius * 0.28} className="orbit-track-ring core-faint-track" />

              <line x1={centerX - conceptOrbitRadius * 1.2} y1={centerY} x2={centerX + conceptOrbitRadius * 1.2} y2={centerY} className="radar-grid-line" />
              <line x1={centerX} y1={centerY - conceptOrbitRadius * 1.2} x2={centerX} y2={centerY + conceptOrbitRadius * 1.2} className="radar-grid-line" />
            </g>

            {/* 2. CENTRAL ROOT TECHNOLOGY NODE ("MERN Stack") */}
            <g
              className="graph-root-node-group"
              style={{
                opacity: isAnyExpanded ? 0.18 : 1,
                transition: 'opacity 0.4s ease',
                pointerEvents: isAnyExpanded ? 'none' : 'auto'
              }}
              onClick={handleCollapse}
              tabIndex={isAnyExpanded ? -1 : 0}
              role="img"
              aria-label={`${tech?.name || 'Technology'} Core`}
            >
              <circle cx={centerX} cy={centerY} r={58} className="root-node-halo" />
              <circle cx={centerX} cy={centerY} r={48} fill="url(#rootNodeGradient)" className="root-node-circle" />
              <text x={centerX} y={centerY - 9} className="root-node-icon" textAnchor="middle">
                {tech?.icon || '🚀'}
              </text>
              <text x={centerX} y={centerY + 16} className="root-node-label" textAnchor="middle">
                {tech?.name || 'CORE'}
              </text>
            </g>

            {/* 3. CONNECTOR LINES: ROOT TO CONCEPT NODES */}
            {conceptPositions.map((pos) => {
              const isThisExpanded = pos.id === expandedConceptId
              const isDimmed = isAnyExpanded && !isThisExpanded

              return (
                <g
                  key={`root-link-${pos.id}`}
                  style={{
                    opacity: isDimmed ? 0.06 : isThisExpanded ? 1 : 0.65,
                    transition: 'opacity 0.4s ease'
                  }}
                >
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={pos.x}
                    y2={pos.y}
                    className={`graph-connector-line ${isThisExpanded ? 'active-link' : ''}`}
                  />
                  {isThisExpanded && (
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

            {/* 4. MAIN CONCEPT NODES & THEIR SUBNODES */}
            {conceptPositions.map((pos) => {
              const isThisExpanded = pos.id === expandedConceptId
              const isDimmed = isAnyExpanded && !isThisExpanded
              const isSelected = pos.id === selectedConceptId
              const { line1, line2 } = pos.textLines

              return (
                <g key={`concept-cluster-${pos.id}`}>
                  {/* A. CONNECTOR LINES TO SUBNODES */}
                  <g
                    style={{
                      opacity: isDimmed ? 0.05 : isThisExpanded ? 1 : 0.45,
                      transition: 'opacity 0.4s ease'
                    }}
                  >
                    {pos.subnodes.map((sub) => {
                      const curX = isThisExpanded ? sub.expX : sub.idleX
                      const curY = isThisExpanded ? sub.expY : sub.idleY

                      return (
                        <line
                          key={`sub-link-${sub.id}`}
                          x1={pos.x}
                          y1={pos.y}
                          x2={curX}
                          y2={curY}
                          stroke={sub.color || 'var(--accent-strong)'}
                          strokeWidth={isThisExpanded ? 2.2 : 1.4}
                          className={`satellite-connector-line ${isThisExpanded ? 'active-satellite-link' : ''}`}
                          style={{
                            transition: 'x2 0.52s cubic-bezier(0.16, 1, 0.3, 1), y2 0.52s cubic-bezier(0.16, 1, 0.3, 1), stroke-width 0.3s ease'
                          }}
                        />
                      )
                    })}
                  </g>

                  {/* B. SUBNODES */}
                  <g
                    style={{
                      opacity: isDimmed ? 0.06 : 1,
                      pointerEvents: isDimmed ? 'none' : 'auto',
                      transition: 'opacity 0.4s ease'
                    }}
                  >
                    {pos.subnodes.map((sub) => {
                      const curX = isThisExpanded ? sub.expX : sub.idleX
                      const curY = isThisExpanded ? sub.expY : sub.idleY
                      const subColor = sub.color || '#F2B880'

                      return (
                        <g
                          key={`subnode-group-${sub.id}`}
                          transform={`translate(${curX}, ${curY})`}
                          style={{
                            transition: 'transform 0.52s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                          }}
                          className={`subnode-svg-group ${isThisExpanded ? 'is-subnode-expanded' : 'is-subnode-idle'}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSubnodeClick(sub, pos)
                          }}
                          tabIndex={isDimmed ? -1 : 0}
                          role="button"
                          aria-label={`Sub-concept: ${sub.label}. Click to open Theory & Tests.`}
                        >
                          {/* Outer glowing aura ring when expanded */}
                          {isThisExpanded && (
                            <circle
                              cx={0}
                              cy={0}
                              r={28}
                              stroke={subColor}
                              className="zoomed-subnode-aura-ring"
                            />
                          )}

                          {/* Subnode circle: r=20 on focus, r=14 on idle */}
                          <circle
                            cx={0}
                            cy={0}
                            r={isThisExpanded ? 20 : 14}
                            stroke={subColor}
                            strokeWidth={isThisExpanded ? 2.6 : 1.5}
                            fill={isThisExpanded ? '#150f0c' : 'var(--surface)'}
                            className="subnode-svg-circle"
                            style={{
                              transition: 'r 0.3s ease, stroke-width 0.3s ease, fill 0.3s ease'
                            }}
                          />

                          {/* Subnode icon */}
                          <text
                            x={0}
                            y={isThisExpanded ? 5 : 4.5}
                            fontSize={isThisExpanded ? '14px' : '11px'}
                            className="subnode-svg-icon"
                            textAnchor="middle"
                            style={{
                              transition: 'font-size 0.3s ease, y 0.3s ease'
                            }}
                          >
                            {sub.icon || '📌'}
                          </text>

                          {/* High-contrast subnode label badge under the node when expanded */}
                          {isThisExpanded && (
                            <g
                              transform="translate(-55, 24)"
                              className="subnode-badge-enter"
                            >
                              <rect
                                x="0"
                                y="0"
                                width="110"
                                height="22"
                                rx="5"
                                fill="#120e0b"
                                stroke={subColor}
                                strokeWidth="1.3"
                                className="zoomed-subnode-badge-rect"
                              />
                              <text
                                x="55"
                                y="11"
                                textAnchor="middle"
                                fill="#ffffff"
                                fontSize="10px"
                                className="zoomed-subnode-badge-text-primary"
                              >
                                {sub.shortName || sub.label}
                              </text>
                              <text
                                x="55"
                                y="18.5"
                                textAnchor="middle"
                                fill={subColor}
                                fontSize="7.5px"
                                className="zoomed-subnode-badge-text-tag"
                              >
                                {sub.tag || 'SUB-TYPE'}
                              </text>
                            </g>
                          )}
                        </g>
                      )
                    })}
                  </g>

                  {/* C. MAIN CONCEPT NODE */}
                  <g
                    className={`concept-node-svg-group ${isThisExpanded ? 'is-active-expanded-node' : ''} ${isSelected ? 'active-concept-node' : ''}`}
                    style={{
                      opacity: isDimmed ? 0.12 : 1,
                      pointerEvents: isDimmed ? 'none' : 'auto',
                      transition: 'opacity 0.4s ease'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleConceptClick(pos.id)
                    }}
                    tabIndex={isDimmed ? -1 : 0}
                    role="button"
                    aria-label={`Concept: ${pos.label}. Click to ${isThisExpanded ? 'collapse' : 'focus and inspect subnodes'}.`}
                    aria-expanded={isThisExpanded}
                  >
                    {/* Glowing Animated Outer Aura */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isThisExpanded ? 60 : 52}
                      className="concept-svg-aura"
                      style={{
                        opacity: isThisExpanded ? 0.95 : undefined,
                        strokeWidth: isThisExpanded ? 2.5 : 1.5,
                        transition: 'r 0.4s ease, opacity 0.4s ease'
                      }}
                    />

                    {/* Main Concept Circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isThisExpanded ? 50 : 44}
                      strokeWidth={isThisExpanded ? 3.5 : 2.5}
                      fill={
                        isThisExpanded
                          ? 'color-mix(in srgb, var(--accent-strong) 25%, var(--surface))'
                          : isSelected
                          ? 'color-mix(in srgb, var(--accent-strong) 18%, var(--surface))'
                          : 'var(--surface)'
                      }
                      className="concept-svg-circle"
                      style={{
                        transition: 'r 0.4s ease, stroke-width 0.4s ease, fill 0.4s ease'
                      }}
                    />

                    {/* Number Badge */}
                    <text
                      x={pos.x}
                      y={isThisExpanded ? pos.y - 20 : pos.y - 18}
                      fontSize={isThisExpanded ? '10px' : '10px'}
                      className="concept-svg-num"
                      textAnchor="middle"
                    >
                      0{pos.index + 1}
                    </text>

                    {/* Multiline title text */}
                    {line2 ? (
                      <>
                        <text
                          x={pos.x}
                          y={isThisExpanded ? pos.y - 3 : pos.y - 1}
                          fontSize={isThisExpanded ? '12px' : '11.5px'}
                          className="concept-svg-title line-1"
                          textAnchor="middle"
                        >
                          {line1}
                        </text>
                        <text
                          x={pos.x}
                          y={isThisExpanded ? pos.y + 12 : pos.y + 13}
                          fontSize={isThisExpanded ? '11px' : '10.5px'}
                          className="concept-svg-title line-2"
                          textAnchor="middle"
                        >
                          {line2}
                        </text>
                      </>
                    ) : (
                      <text
                        x={pos.x}
                        y={pos.y + 6}
                        fontSize={isThisExpanded ? '13px' : '12.5px'}
                        className="concept-svg-title single-line"
                        textAnchor="middle"
                      >
                        {line1}
                      </text>
                    )}

                    {/* Subtitle tag when expanded */}
                    {isThisExpanded && (
                      <text
                        x={pos.x}
                        y={pos.y + 28}
                        className="concept-svg-subhint-text"
                        textAnchor="middle"
                      >
                        6 Subtypes • Click to reset
                      </text>
                    )}
                  </g>
                </g>
              )
            })}
          </g>
        </svg>
      </div>

      {/* QUICK CONCEPT NAVIGATION BAR AT BOTTOM */}
      <div className="graph-concept-quick-nav">
        <span className="quick-nav-label">CONCEPTS:</span>
        <div className="quick-nav-pills">
          {conceptPositions.map((concept) => {
            const isSelected = concept.id === (expandedConceptId || selectedConceptId)
            return (
              <button
                key={concept.id}
                type="button"
                className={`graph-nav-pill ${isSelected ? 'active' : ''}`}
                onClick={() => handleConceptClick(concept.id)}
              >
                <span className="nav-pill-num">0{concept.index + 1}</span>
                <span className="nav-pill-name">{concept.label}</span>
                <span className="nav-pill-badge">{concept.subnodes?.length || 6} Sub-Types</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* DETAIL PANEL MODAL: OPENS WHEN ANY SUBNODE IS CLICKED */}
      <AnimatePresence>
        {activeSubnode && (
          <div className="graph-expansion-modal-host">
            <motion.div
              className="graph-expansion-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseDetail}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="concept-expanded-panel-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <ConceptDetailPanel
                concept={activeParentConcept}
                subConcept={activeSubnode}
                techName={tech?.name || 'MERN Stack'}
                activeModuleType={activeModuleType}
                onSelectModuleType={setActiveModuleType}
                onClose={handleCloseDetail}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default KnowledgeGraphView
