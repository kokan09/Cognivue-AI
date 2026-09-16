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

/**
 * Calculates balanced, harmonic coordinates for concept nodes
 * Ensures perfectly proportioned distribution that fits the page cleanly without bulging or clutter
 */
function calculateConceptCoordinates(totalConcepts, idx, centerX, centerY) {
  if (totalConcepts === 1) {
    return { x: centerX, y: centerY - 230, angle: -Math.PI / 2 }
  }

  if (totalConcepts === 2) {
    // Balanced horizontal layout across the screen
    const isLeft = idx === 0
    const x = isLeft ? centerX - 420 : centerX + 420
    const y = centerY
    const angle = isLeft ? Math.PI : 0
    return { x, y, angle }
  }

  // 3 or more concepts:
  // Smooth, harmonious elliptical ring with uniform spacing
  const rx = 470
  const ry = 285
  const angle = (idx / totalConcepts) * (2 * Math.PI) - Math.PI / 2
  const x = Math.round(centerX + rx * Math.cos(angle))
  const y = Math.round(centerY + ry * Math.sin(angle))
  return { x, y, angle }
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

  // Balanced SVG geometry (1360 x 780)
  const viewWidth = 1360
  const viewHeight = 780
  const centerX = viewWidth / 2
  const centerY = viewHeight / 2

  // Harmonic track geometry
  const orbitRadiusX = 470
  const orbitRadiusY = 285
  const totalConcepts = conceptNodes.length || 1

  // Distance of subnodes from parent concept center:
  // Idle: 58px (crisp, compact, non-bulky), Expanded (Zoomed focus): 145px
  const idleSubnodeDist = 58
  const expandedSubnodeDist = 145

  // Calculate coordinates for all concept nodes
  const conceptPositions = conceptNodes.map((concept, idx) => {
    const { x, y, angle } = calculateConceptCoordinates(
      totalConcepts,
      idx,
      centerX,
      centerY
    )
    const textLines = formatConceptLines(concept.label)
    const subConcepts = concept.subConcepts || []
    const totalSubs = subConcepts.length || 6

    const subnodes = subConcepts.map((sub, sIdx) => {
      const subAngle = (sIdx / totalSubs) * (2 * Math.PI) - Math.PI / 2
      // Idle offset from concept center
      const idleDx = Math.round(idleSubnodeDist * Math.cos(subAngle))
      const idleDy = Math.round(idleSubnodeDist * Math.sin(subAngle))
      // Expanded offset from concept center
      const expDx = Math.round(expandedSubnodeDist * Math.cos(subAngle))
      const expDy = Math.round(expandedSubnodeDist * Math.sin(subAngle))

      return {
        ...sub,
        angle: subAngle,
        idleDx,
        idleDy,
        expDx,
        expDy,
        idleX: x + idleDx,
        idleY: y + idleDy,
        expX: x + expDx,
        expY: y + expDy,
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
  // Scale 1.55x and position the clicked concept directly at screen center (centerX, centerY)
  const cameraScale = isAnyExpanded ? 1.55 : 1
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
      {/* WIDESCREEN SVG GRAPH CANVAS */}
      <div className="svg-canvas-container large-canvas">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="knowledge-graph-svg"
          aria-label={`${tech?.name || 'Technology'} Interactive Roadmap`}
        >
          <defs>
            <radialGradient id="centerRadialGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.08" />
              <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.02" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="rootNodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--surface-alt)" />
              <stop offset="100%" stopColor="var(--surface)" />
            </linearGradient>
          </defs>

          {/* BACKGROUND AMBIENT GLOW */}
          <ellipse cx={centerX} cy={centerY} rx={orbitRadiusX * 1.15} ry={orbitRadiusY * 1.2} fill="url(#centerRadialGlow)" />

          {/* CLICK-AWAY CATCHER: Closes expanded focus when canvas background is clicked (completely transparent) */}
          {isAnyExpanded && (
            <rect
              x="0"
              y="0"
              width={viewWidth}
              height={viewHeight}
              fill="transparent"
              className="graph-canvas-zoom-backdrop"
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
              transition: 'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1)',
              willChange: 'transform'
            }}
          >
            {/* 1. BACKGROUND WIDESCREEN RADAR TRACKS */}
            <g
              style={{
                opacity: isAnyExpanded ? 0.08 : 0.75,
                transition: 'opacity 0.4s ease'
              }}
            >
              <ellipse cx={centerX} cy={centerY} rx={orbitRadiusX * 1.28} ry={orbitRadiusY * 1.26} className="orbit-track-ring outer-faint-track" />
              <ellipse cx={centerX} cy={centerY} rx={orbitRadiusX} ry={orbitRadiusY} className="orbit-track-ring main-track" />
              <ellipse cx={centerX} cy={centerY} rx={orbitRadiusX * 0.6} ry={orbitRadiusY * 0.6} className="orbit-track-ring inner-track" />
              <ellipse cx={centerX} cy={centerY} rx={orbitRadiusX * 0.3} ry={orbitRadiusY * 0.3} className="orbit-track-ring core-faint-track" />

              <line x1={centerX - orbitRadiusX * 1.25} y1={centerY} x2={centerX + orbitRadiusX * 1.25} y2={centerY} className="radar-grid-line" />
              <line x1={centerX} y1={centerY - orbitRadiusY * 1.25} x2={centerX} y2={centerY + orbitRadiusY * 1.25} className="radar-grid-line" />
            </g>

            {/* 2. CENTRAL ROOT TECHNOLOGY NODE ("MERN Stack" / "JavaScript" / "Java") */}
            <g
              className="graph-root-node-group"
              style={{
                opacity: isAnyExpanded ? 0.15 : 1,
                transition: 'opacity 0.4s ease',
                pointerEvents: isAnyExpanded ? 'none' : 'auto'
              }}
              onClick={handleCollapse}
              tabIndex={isAnyExpanded ? -1 : 0}
              role="img"
              aria-label={`${tech?.name || 'Technology'} Core`}
            >
              <circle cx={centerX} cy={centerY} r={52} className="root-node-halo" />
              <circle cx={centerX} cy={centerY} r={42} fill="url(#rootNodeGradient)" className="root-node-circle" />
              <text x={centerX} y={centerY - 6} className="root-node-icon" textAnchor="middle">
                {tech?.icon || '🚀'}
              </text>
              <text x={centerX} y={centerY + 15} className="root-node-label" textAnchor="middle">
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
                    opacity: isDimmed ? 0.05 : isThisExpanded ? 1 : 0.65,
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
                      r={4}
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
                <g
                  key={`concept-cluster-${pos.id}`}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  style={{
                    opacity: isDimmed ? 0.08 : 1,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: isDimmed ? 'none' : 'auto'
                  }}
                >
                  {/* A. CONNECTOR LINES TO SUBNODES */}
                  <g
                    style={{
                      opacity: isThisExpanded ? 1 : 0.4,
                      transition: 'opacity 0.4s ease'
                    }}
                  >
                    {pos.subnodes.map((sub) => {
                      const curDx = isThisExpanded ? sub.expDx : sub.idleDx
                      const curDy = isThisExpanded ? sub.expDy : sub.idleDy

                      return (
                        <line
                          key={`sub-link-${sub.id}`}
                          x1={0}
                          y1={0}
                          x2={curDx}
                          y2={curDy}
                          stroke={sub.color || 'var(--accent-strong)'}
                          strokeWidth={isThisExpanded ? 2.2 : 1.3}
                          className={`satellite-connector-line ${isThisExpanded ? 'active-satellite-link' : ''}`}
                          style={{
                            transition: 'x2 0.48s cubic-bezier(0.16, 1, 0.3, 1), y2 0.48s cubic-bezier(0.16, 1, 0.3, 1), stroke-width 0.3s ease'
                          }}
                        />
                      )
                    })}
                  </g>

                  {/* B. SUBNODES */}
                  <g>
                    {pos.subnodes.map((sub) => {
                      const curDx = isThisExpanded ? sub.expDx : sub.idleDx
                      const curDy = isThisExpanded ? sub.expDy : sub.idleDy
                      const subColor = sub.color || '#F2B880'

                      return (
                        <g
                          key={`subnode-group-${sub.id}`}
                          transform={`translate(${curDx}, ${curDy})`}
                          style={{
                            transition: 'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1)',
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

                          {/* Subnode circle: r=20 on focus, r=13 on idle */}
                          <circle
                              cx={0}
                              cy={0}
                              r={isThisExpanded ? 20 : 13}
                              stroke={subColor}
                              strokeWidth={isThisExpanded ? 2.5 : 1.4}
                              fill={isThisExpanded ? 'var(--surface-alt)' : 'var(--surface)'}
                              className="subnode-svg-circle"
                              style={{
                                transition: 'r 0.3s ease, stroke-width 0.3s ease, fill 0.3s ease'
                              }}
                            />

                          {/* Subnode icon */}
                          <text
                            x={0}
                            y={isThisExpanded ? 5.5 : 4}
                            fontSize={isThisExpanded ? '14px' : '10.5px'}
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
                              transform="translate(-60, 24)"
                              className="subnode-badge-enter"
                            >
                              <rect
                                x="0"
                                y="0"
                                width="120"
                                height="24"
                                rx="6"
                                fill="var(--surface)"
                                stroke={subColor}
                                strokeWidth="1.4"
                                className="zoomed-subnode-badge-rect"
                              />
                              <text
                                x="60"
                                y="12"
                                textAnchor="middle"
                                fill="var(--text-primary)"
                                fontSize="10.5px"
                                className="zoomed-subnode-badge-text-primary"
                              >
                                {sub.shortName || sub.label}
                              </text>
                              <text
                                x="60"
                                y="20"
                                textAnchor="middle"
                                fill={subColor}
                                fontSize="8px"
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
                      cx={0}
                      cy={0}
                      r={isThisExpanded ? 62 : 49}
                      className="concept-svg-aura"
                      style={{
                        opacity: isThisExpanded ? 0.95 : undefined,
                        strokeWidth: isThisExpanded ? 2.5 : 1.5,
                        transition: 'r 0.4s ease, opacity 0.4s ease'
                      }}
                    />

                    {/* Main Concept Circle */}
                    <circle
                      cx={0}
                      cy={0}
                      r={isThisExpanded ? 52 : 41}
                      strokeWidth={isThisExpanded ? 3.4 : 2.4}
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
                      x={0}
                      y={isThisExpanded ? -20 : -16}
                      fontSize={isThisExpanded ? '10.5px' : '9.5px'}
                      className="concept-svg-num"
                      textAnchor="middle"
                    >
                      0{pos.index + 1}
                    </text>

                    {/* Multiline title text */}
                    {line2 ? (
                      <>
                        <text
                          x={0}
                          y={isThisExpanded ? -3 : -2}
                          fontSize={isThisExpanded ? '12px' : '10.5px'}
                          className="concept-svg-title line-1"
                          textAnchor="middle"
                        >
                          {line1}
                        </text>
                        <text
                          x={0}
                          y={isThisExpanded ? 13 : 11}
                          fontSize={isThisExpanded ? '11px' : '9.5px'}
                          className="concept-svg-title line-2"
                          textAnchor="middle"
                        >
                          {line2}
                        </text>
                      </>
                    ) : (
                      <text
                        x={0}
                        y={isThisExpanded ? 6 : 5}
                        fontSize={isThisExpanded ? '13px' : '11.5px'}
                        className="concept-svg-title single-line"
                        textAnchor="middle"
                      >
                        {line1}
                      </text>
                    )}

                    {/* Subtitle tag when expanded */}
                    {isThisExpanded && (
                      <text
                        x={0}
                        y={32}
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
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="concept-expanded-panel-wrapper widescreen-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <ConceptDetailPanel
                concept={activeParentConcept}
                subConcept={activeSubnode}
                techName={tech?.name || 'Technology'}
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
