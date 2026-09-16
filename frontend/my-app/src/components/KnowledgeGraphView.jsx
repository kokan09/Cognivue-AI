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
 * Calculates balanced, harmonic circular coordinates for concept nodes
 * Ensures a perfectly round, spread-out circular planetary orbit
 */
function calculateConceptCoordinates(totalConcepts, idx, centerX, centerY) {
  if (totalConcepts === 1) {
    return { x: centerX, y: centerY - 300, angle: -Math.PI / 2 }
  }

  if (totalConcepts === 2) {
    // Balanced horizontal layout across the circular canvas
    const isLeft = idx === 0
    const x = isLeft ? centerX - 320 : centerX + 320
    const y = centerY
    const angle = isLeft ? Math.PI : 0
    return { x, y, angle }
  }

  // 3 or more concepts:
  // Grand, spread-out circular orbit that fully occupies the screen
  const orbitRadius = 320
  const angle = (idx / totalConcepts) * (2 * Math.PI) - Math.PI / 2
  const x = Math.round(centerX + orbitRadius * Math.cos(angle))
  const y = Math.round(centerY + orbitRadius * Math.sin(angle))
  return { x, y, angle }
}

function KnowledgeGraphView({
  graphData,
  selectedConceptId,
  onSelectConcept,
  onSelectModule
}) {
  const { tech, conceptNodes = [] } = graphData || {}

  // 1. Root Core expansion state:
  // Level 0 (false): Only the central MERN Stack / Tech node is displayed with invitation badge
  // Level 1 (true, expandedConceptId=null): Concepts revealed along orbit WITHOUT subnodes
  // Level 2 (true, expandedConceptId=ID): Focused concept zoomed in and its 6 subnodes blossom outward
  const [isRootExpanded, setIsRootExpanded] = useState(false)
  const [expandedConceptId, setExpandedConceptId] = useState(null)

  // 2. Active Sub-node state (opens full Theory / Test / Module page)
  const [activeSubnode, setActiveSubnode] = useState(null)
  const [activeParentConcept, setActiveParentConcept] = useState(null)
  const [activeModuleType, setActiveModuleType] = useState('concepts')

  // Balanced Circular SVG geometry (1000 x 800) - Expansive and fills the screen with zero vertical scrolling
  const viewWidth = 1000
  const viewHeight = 800
  const centerX = viewWidth / 2
  const centerY = viewHeight / 2

  // Pure Grand Circular Track Geometry (Equal X and Y radius)
  const orbitRadius = 320
  const totalConcepts = conceptNodes.length || 1

  // Distance of subnodes when focused in Level 2: 160px
  const expandedSubnodeDist = 160

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
      const expDx = Math.round(expandedSubnodeDist * Math.cos(subAngle))
      const expDy = Math.round(expandedSubnodeDist * Math.sin(subAngle))

      return {
        ...sub,
        angle: subAngle,
        expDx,
        expDy,
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

  // Sync when selectedConceptId is passed from parent (e.g. sidebar navigation)
  useEffect(() => {
    if (selectedConceptId) {
      setIsRootExpanded(true)
      setExpandedConceptId(selectedConceptId)
    }
  }, [selectedConceptId])

  // Reset to Level 0 whenever tech changes
  useEffect(() => {
    setIsRootExpanded(false)
    setExpandedConceptId(null)
    setActiveSubnode(null)
  }, [graphData?.tech?.name])

  // Currently expanded concept object
  const expandedConcept = conceptPositions.find(c => c.id === expandedConceptId) || null
  const isAnyExpanded = Boolean(expandedConceptId)

  // Camera Zoom & Pan Calculations:
  // In Level 2: Scale 1.48x and center the clicked concept directly at (centerX, centerY)
  const cameraScale = isAnyExpanded ? 1.48 : 1
  const cameraTranslateX = isAnyExpanded && expandedConcept
    ? Math.round(centerX - expandedConcept.x * cameraScale)
    : 0
  const cameraTranslateY = isAnyExpanded && expandedConcept
    ? Math.round(centerY - expandedConcept.y * cameraScale)
    : 0

  // Handle clicking the central root tech node
  const handleRootNodeClick = () => {
    if (!isRootExpanded) {
      // Level 0 -> Level 1: Reveal all concept nodes
      setIsRootExpanded(true)
    } else if (expandedConceptId) {
      // Level 2 -> Level 1: Zoom out back to all concepts
      setExpandedConceptId(null)
    } else {
      // Level 1 -> Level 0: Collapse back to root
      setIsRootExpanded(false)
    }
  }

  // Handle clicking a main concept node
  const handleConceptClick = (conceptId) => {
    if (expandedConceptId === conceptId) {
      // Return to Level 1
      setExpandedConceptId(null)
    } else {
      // Level 1 -> Level 2: Zoom into this concept and blossom its subnodes
      setIsRootExpanded(true)
      setExpandedConceptId(conceptId)
      onSelectConcept?.(conceptId)
    }
  }

  // Handle clicking a subnode -> Open its interactive learning module modal
  const handleSubnodeClick = (sub, parent) => {
    setActiveSubnode(sub)
    setActiveParentConcept(parent || expandedConcept)
    setActiveModuleType('concepts')
    onSelectModule?.(sub, parent)
  }

  // Handle collapsing focus
  const handleCollapse = () => {
    if (expandedConceptId) {
      setExpandedConceptId(null)
    } else if (isRootExpanded) {
      setIsRootExpanded(false)
    }
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
          setExpandedConceptId(null)
        } else if (isRootExpanded) {
          setIsRootExpanded(false)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSubnode, expandedConceptId, isRootExpanded])

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
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.09" />
              <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.02" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="rootNodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--surface-alt)" />
              <stop offset="100%" stopColor="var(--surface)" />
            </linearGradient>
          </defs>

          {/* BACKGROUND AMBIENT GLOW */}
          <circle cx={centerX} cy={centerY} r={orbitRadius * 1.35} fill="url(#centerRadialGlow)" />

          {/* CLICK-AWAY CATCHER: Closes expanded focus when canvas background is clicked */}
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
            {/* 1. BACKGROUND WIDESCREEN RADAR TRACKS (PURE CIRCLES) */}
            <g
              style={{
                opacity: isAnyExpanded ? 0.08 : isRootExpanded ? 0.75 : 0.55,
                transition: 'opacity 0.4s ease'
              }}
            >
              <circle cx={centerX} cy={centerY} r={orbitRadius * 1.28} className="orbit-track-ring outer-faint-track" />
              <circle cx={centerX} cy={centerY} r={orbitRadius} className="orbit-track-ring main-track" />
              <circle cx={centerX} cy={centerY} r={orbitRadius * 0.62} className="orbit-track-ring inner-track" />
              <circle cx={centerX} cy={centerY} r={orbitRadius * 0.32} className="orbit-track-ring core-faint-track" />

              <line x1={centerX - orbitRadius * 1.25} y1={centerY} x2={centerX + orbitRadius * 1.25} y2={centerY} className="radar-grid-line" />
              <line x1={centerX} y1={centerY - orbitRadius * 1.25} x2={centerX} y2={centerY + orbitRadius * 1.25} className="radar-grid-line" />
            </g>

            {/* 2. CENTRAL ROOT TECHNOLOGY NODE ("MERN Stack" / "JavaScript" / "Java") */}
            <g
              className={`graph-root-node-group ${!isRootExpanded ? 'is-level-0-root' : ''}`}
              style={{
                opacity: isAnyExpanded ? 0.12 : 1,
                transition: 'opacity 0.4s ease, transform 0.25s ease',
                pointerEvents: isAnyExpanded ? 'none' : 'auto',
                cursor: 'pointer'
              }}
              onClick={handleRootNodeClick}
              tabIndex={isAnyExpanded ? -1 : 0}
              role="button"
              aria-label={`${tech?.name || 'Technology'} Core Node. Click to ${isRootExpanded ? 'collapse' : 'expand curriculum'}.`}
            >
              {/* Outer Pulsing Halo */}
              <circle
                cx={centerX}
                cy={centerY}
                r={!isRootExpanded ? 72 : 64}
                className={`root-node-halo ${!isRootExpanded ? 'is-pulsing-halo' : ''}`}
                style={{
                  transition: 'r 0.35s ease'
                }}
              />

              {/* Main Core Circle */}
              <circle cx={centerX} cy={centerY} r={54} fill="url(#rootNodeGradient)" className="root-node-circle" />

              {/* Technology Icon */}
              <text x={centerX} y={centerY - 8} className="root-node-icon" textAnchor="middle" style={{ fontSize: '34px' }}>
                {tech?.icon || '🚀'}
              </text>

              {/* Technology Label */}
              <text x={centerX} y={centerY + 18} className="root-node-label" textAnchor="middle" style={{ fontSize: '15px' }}>
                {tech?.name || 'CORE'}
              </text>
            </g>

            {/* 3. CONNECTOR LINES: ROOT TO CONCEPT NODES (SPRING ANIMATED RADIAL EXTENSION) */}
            <AnimatePresence>
              {isRootExpanded && (
                <g className="graph-spoke-lines-layer">
                  {conceptPositions.map((pos, idx) => {
                    const isThisExpanded = pos.id === expandedConceptId
                    const isDimmed = isAnyExpanded && !isThisExpanded

                    return (
                      <motion.g
                        key={`root-link-${pos.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isDimmed ? 0.04 : isThisExpanded ? 1 : 0.65 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <motion.line
                          x1={centerX}
                          y1={centerY}
                          initial={{ x2: centerX, y2: centerY }}
                          animate={{ x2: pos.x, y2: pos.y }}
                          exit={{ x2: centerX, y2: centerY }}
                          transition={{
                            type: 'spring',
                            stiffness: 180,
                            damping: 22,
                            delay: idx * 0.03
                          }}
                          className={`graph-connector-line ${isThisExpanded ? 'active-link' : ''}`}
                        />
                        {isThisExpanded && (
                          <circle
                            cx={Math.round(centerX + (pos.x - centerX) * 0.5)}
                            cy={Math.round(centerY + (pos.y - centerY) * 0.5)}
                            r={5}
                            className="synapse-pulse-dot"
                          />
                        )}
                      </motion.g>
                    )
                  })}
                </g>
              )}
            </AnimatePresence>

            {/* 4. MAIN CONCEPT NODES & SUBNODES (SPRING ANIMATED RADIAL BLOSSOM) */}
            <AnimatePresence>
              {isRootExpanded && conceptPositions.map((pos, idx) => {
                const isThisExpanded = pos.id === expandedConceptId
                const isDimmed = isAnyExpanded && !isThisExpanded
                const isSelected = pos.id === selectedConceptId
                const { line1, line2 } = pos.textLines

                return (
                  <motion.g
                    key={`concept-cluster-${pos.id}`}
                    initial={{
                      opacity: 0,
                      scale: 0.2,
                      x: centerX,
                      y: centerY
                    }}
                    animate={{
                      opacity: isDimmed ? 0.08 : 1,
                      scale: 1,
                      x: pos.x,
                      y: pos.y
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.2,
                      x: centerX,
                      y: centerY
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 22,
                      delay: idx * 0.035
                    }}
                    style={{
                      pointerEvents: isDimmed ? 'none' : 'auto'
                    }}
                  >
                    {/* A. SUBNODES (ANIMATED ORBITAL BURST IN LEVEL 2) */}
                    <AnimatePresence>
                      {isThisExpanded && (
                        <motion.g
                          key={`subnodes-container-${pos.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="concept-expanded-subnodes-layer"
                        >
                          {/* Satellite connector lines */}
                          {pos.subnodes.map((sub, sIdx) => (
                            <motion.line
                              key={`sub-link-${sub.id}`}
                              x1={0}
                              y1={0}
                              initial={{ x2: 0, y2: 0, opacity: 0 }}
                              animate={{ x2: sub.expDx, y2: sub.expDy, opacity: 1 }}
                              exit={{ x2: 0, y2: 0, opacity: 0 }}
                              transition={{
                                type: 'spring',
                                stiffness: 280,
                                damping: 24,
                                delay: sIdx * 0.035
                              }}
                              stroke={sub.color || 'var(--accent-strong)'}
                              strokeWidth={2.4}
                              className="satellite-connector-line active-satellite-link"
                            />
                          ))}

                          {/* Satellite subnodes */}
                          {pos.subnodes.map((sub, sIdx) => {
                            const subColor = sub.color || '#F2B880'

                            return (
                              <motion.g
                                key={`subnode-group-${sub.id}`}
                                initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                                animate={{ opacity: 1, scale: 1, x: sub.expDx, y: sub.expDy }}
                                exit={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 300,
                                  damping: 23,
                                  delay: sIdx * 0.035
                                }}
                                style={{ cursor: 'pointer' }}
                                className="subnode-svg-group is-subnode-expanded"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSubnodeClick(sub, pos)
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={`Sub-concept: ${sub.label}. Click to open Theory & Tests.`}
                              >
                                {/* Outer glowing aura ring */}
                                <circle
                                  cx={0}
                                  cy={0}
                                  r={34}
                                  stroke={subColor}
                                  className="zoomed-subnode-aura-ring"
                                />

                                {/* Subnode circle */}
                                <circle
                                  cx={0}
                                  cy={0}
                                  r={26}
                                  stroke={subColor}
                                  strokeWidth={3}
                                  fill="var(--surface-alt)"
                                  className="subnode-svg-circle"
                                />

                                {/* Subnode icon */}
                                <text
                                  x={0}
                                  y={7.5}
                                  fontSize="18px"
                                  className="subnode-svg-icon"
                                  textAnchor="middle"
                                >
                                  {sub.icon || '📌'}
                                </text>

                                {/* High-contrast subnode label badge */}
                                <g
                                  transform="translate(-65, 32)"
                                  className="subnode-badge-enter"
                                >
                                  <rect
                                    x="0"
                                    y="0"
                                    width="130"
                                    height="26"
                                    rx="7"
                                    fill="var(--surface)"
                                    stroke={subColor}
                                    strokeWidth="1.5"
                                    className="zoomed-subnode-badge-rect"
                                  />
                                  <text
                                    x="65"
                                    y="13"
                                    textAnchor="middle"
                                    fill="var(--text-primary)"
                                    fontSize="11px"
                                    className="zoomed-subnode-badge-text-primary"
                                  >
                                    {sub.shortName || sub.label}
                                  </text>
                                  <text
                                    x="65"
                                    y="22"
                                    textAnchor="middle"
                                    fill={subColor}
                                    fontSize="8.5px"
                                    className="zoomed-subnode-badge-text-tag"
                                  >
                                    {sub.tag || 'SUB-TYPE'}
                                  </text>
                                </g>
                              </motion.g>
                            )
                          })}
                        </motion.g>
                      )}
                    </AnimatePresence>

                    {/* B. MAIN CONCEPT NODE (CLICKABLE TO ZOOM AND REVEAL SUBNODES) */}
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
                        r={isThisExpanded ? 78 : 62}
                        className="concept-svg-aura"
                        style={{
                          opacity: isThisExpanded ? 0.95 : undefined,
                          strokeWidth: isThisExpanded ? 2.8 : 1.8,
                          transition: 'r 0.4s ease, opacity 0.4s ease'
                        }}
                      />

                      {/* Main Concept Circle */}
                      <circle
                        cx={0}
                        cy={0}
                        r={isThisExpanded ? 66 : 52}
                        strokeWidth={isThisExpanded ? 3.6 : 2.6}
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
                        y={isThisExpanded ? -24 : -20}
                        fontSize={isThisExpanded ? '12px' : '11px'}
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
                            y={isThisExpanded ? -4 : -3}
                            fontSize={isThisExpanded ? '13.5px' : '12px'}
                            className="concept-svg-title line-1"
                            textAnchor="middle"
                          >
                            {line1}
                          </text>
                          <text
                            x={0}
                            y={isThisExpanded ? 15 : 13}
                            fontSize={isThisExpanded ? '12.5px' : '11px'}
                            className="concept-svg-title line-2"
                            textAnchor="middle"
                          >
                            {line2}
                          </text>
                        </>
                      ) : (
                        <text
                          x={0}
                          y={isThisExpanded ? 7 : 6}
                          fontSize={isThisExpanded ? '15px' : '13.5px'}
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
                          y={38}
                          className="concept-svg-subhint-text"
                          textAnchor="middle"
                        >
                          6 Subtypes • Click to reset
                        </text>
                      )}
                    </g>
                  </motion.g>
                )
              })}
            </AnimatePresence>
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
