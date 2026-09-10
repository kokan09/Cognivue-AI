import React, { useState, useEffect, useRef } from 'react'

function CurriculumLoader({ topicName, techName, techIcon = '⚡', conceptNodes = [], onComplete }) {
  const nodes = conceptNodes && conceptNodes.length > 0
    ? conceptNodes
    : [
        { id: 'c1', label: 'Core Syntax & Fundamentals' },
        { id: 'c2', label: 'Architecture & Patterns' },
        { id: 'c3', label: 'Data Structures & Logic' },
        { id: 'c4', label: 'Production Workflows' }
      ]

  const totalNodes = nodes.length
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1)
  const [progress, setProgress] = useState(10)
  const [terminalLines, setTerminalLines] = useState([])
  const terminalRef = useRef(null)

  const techTitle = topicName || 'Learning Roadmap'
  const techLabel = techName || 'Technology'

  const SCAN_DURATION = 2400 // ms per full rotation

  // Dynamic live terminal code streaming & synchronized node scan reveal
  useEffect(() => {
    const rawLogs = [
      `[INIT] Initializing AST neural compiler for "${techLabel}"...`,
      `[CONFIG] Target: ${techLabel.toUpperCase()} | ${totalNodes} Knowledge Nodes detected`,
      `[IMPORT] Scanning syntax grammar & verified curriculum rules...`,
      `// --- ROADMAP SYNTHESIS PIPELINE ---`,
      `const roadmap = new CognivuePipeline({ target: "${techLabel}", nodes: ${totalNodes} });`,
      ...nodes.map((node, i) => `[NODE ${i + 1}] Verified "${node.label}" -> [OK]`),
      `[SANDBOX] Linking interactive code challenges & quiz engine...`,
      `[STATUS] 0 errors, 0 warnings. Compilation 100% complete.`,
      `[SUCCESS] Visual learning roadmap ready. Mounting to viewport...`
    ]

    let lineIdx = 0
    const logInterval = setInterval(() => {
      if (lineIdx < rawLogs.length) {
        const line = rawLogs[lineIdx]
        setTerminalLines((prev) => [...prev, line])
        lineIdx++
      } else {
        clearInterval(logInterval)
      }
    }, 160)

    // Node reveal: triggers exactly when the rotating radar line sweeps across each node angle
    const nodeTimeouts = nodes.map((_, idx) => {
      const revealDelay = Math.round((idx / totalNodes) * SCAN_DURATION)
      return setTimeout(() => {
        setActiveNodeIndex((prev) => Math.max(prev, idx))
      }, revealDelay)
    })

    // Progress bar counter smoothly ascending to 100%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        const next = prev + Math.floor(Math.random() * 8 + 8)
        return next > 100 ? 100 : next
      })
    }, 120)

    // When compilation completes, smoothly transition to roadmap
    const completeTimeout = setTimeout(() => {
      if (onComplete) {
        onComplete()
      }
    }, SCAN_DURATION + 400)

    return () => {
      clearInterval(logInterval)
      clearInterval(progressInterval)
      nodeTimeouts.forEach(clearTimeout)
      clearTimeout(completeTimeout)
    }
  }, [techTitle, techLabel, totalNodes, nodes, onComplete, SCAN_DURATION])

  // Auto scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines])

  // Radar stage dimensions
  const stageSize = 380
  const centerCoord = stageSize / 2
  const orbitRadius = 130
  const beamLength = orbitRadius + 24

  return (
    <div className="dynamic-loader-split-view" role="status" aria-live="polite">
      {/* TOP STATUS HEADER */}
      <div className="loader-top-bar">
        <div className="loader-tech-badge">
          <span className="live-status-dot"></span>
          <span>SYNTHESIZING ROADMAP: <strong>{techLabel}</strong></span>
        </div>
        <span className="loader-module-count-badge">
          {totalNodes} {totalNodes === 1 ? 'CONCEPT NODE' : 'CONCEPT NODES'} DETECTED
        </span>
      </div>

      {/* 2-COLUMN LAYOUT: RADAR SCANNER ON LEFT | CODING TERMINAL ON RIGHT */}
      <div className="loader-split-grid">
        {/* LEFT COLUMN: RADAR ORBIT STAGE */}
        <div className="radar-orbit-stage-wrapper">
          <div
            className="radar-orbit-stage"
            style={{ width: `${stageSize}px`, height: `${stageSize}px` }}
          >
            {/* SVG BACKGROUND RINGS, AXES, & SYNAPSE LINES */}
            <svg
              className="radar-orbit-svg"
              viewBox={`0 0 ${stageSize} ${stageSize}`}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              {/* Concentric Guide Circles */}
              <circle
                cx={centerCoord}
                cy={centerCoord}
                r={orbitRadius}
                className="radar-orbit-circle outer"
              />
              <circle
                cx={centerCoord}
                cy={centerCoord}
                r={orbitRadius * 0.58}
                className="radar-orbit-circle inner"
              />

              {/* Grid Crosshairs */}
              <line
                x1={centerCoord - orbitRadius - 15}
                y1={centerCoord}
                x2={centerCoord + orbitRadius + 15}
                y2={centerCoord}
                className="radar-axis-line"
              />
              <line
                x1={centerCoord}
                y1={centerCoord - orbitRadius - 15}
                x2={centerCoord}
                y2={centerCoord + orbitRadius + 15}
                className="radar-axis-line"
              />

              {/* Connector Lines from Center Hub to Nodes */}
              {nodes.map((node, idx) => {
                const isVisible = idx <= activeNodeIndex
                const angle = (idx / totalNodes) * (2 * Math.PI) - Math.PI / 2
                const x = Math.round(centerCoord + orbitRadius * Math.cos(angle))
                const y = Math.round(centerCoord + orbitRadius * Math.sin(angle))
                return (
                  <line
                    key={`conn-${idx}`}
                    x1={centerCoord}
                    y1={centerCoord}
                    x2={x}
                    y2={y}
                    className={`loader-synapse-line ${isVisible ? 'visible' : 'hidden'}`}
                  />
                )
              })}
            </svg>

            {/* FULL-STAGE RADAR SWEEP LINE (Sweeps across the node coordinates) */}
            <div className="radar-full-sweep-container">
              <div
                className="radar-sweep-arm"
                style={{
                  width: `${beamLength}px`,
                  animationDuration: `${SCAN_DURATION}ms`
                }}
              >
                <div className="radar-sweep-lead-line"></div>
                <div className="radar-sweep-cone"></div>
              </div>
            </div>

            {/* CENTER TECH HUB */}
            <div className="radar-center-hub">
              <span className="center-hub-text">{techIcon}</span>
            </div>

            {/* CONDENSED CIRCULAR CONCEPT NODES (APPEARS AS LINE PASSES THROUGH) */}
            {nodes.map((node, idx) => {
              const isVisible = idx <= activeNodeIndex
              const isLatest = idx === activeNodeIndex
              const angle = (idx / totalNodes) * (2 * Math.PI) - Math.PI / 2
              const x = Math.round(centerCoord + orbitRadius * Math.cos(angle))
              const y = Math.round(centerCoord + orbitRadius * Math.sin(angle))

              return (
                <div
                  key={node.id || idx}
                  className={`condensed-loader-node ${isVisible ? 'visible' : 'hidden'} ${
                    isLatest ? 'just-scanned' : ''
                  }`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`
                  }}
                >
                  {/* Compact Circular Node */}
                  <div className="loader-node-circle">
                    <span className="node-num-tag">C{idx + 1}</span>
                  </div>

                  {/* Condensed Title Badge */}
                  <div className="loader-node-label-pill" title={node.label}>
                    <span>{node.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: RICH CODING & COMPILATION TERMINAL */}
        <div className="terminal-column">
          <div className="coding-terminal-window">
            {/* TERMINAL HEADER */}
            <div className="terminal-mac-header">
              <div className="terminal-traffic-lights">
                <span className="traffic-dot red"></span>
                <span className="traffic-dot yellow"></span>
                <span className="traffic-dot green"></span>
              </div>
              <span className="terminal-shell-title">
                cognivue-cli // build --target={techLabel.toLowerCase()} --topic="{techTitle}"
              </span>
              <span className="terminal-ready-badge">
                {progress >= 100 ? 'SUCCESS' : 'COMPILING'}
              </span>
            </div>

            {/* STREAMING CODE & LOG BODY */}
            <div className="terminal-code-body" ref={terminalRef}>
              {terminalLines.map((line, lIdx) => {
                const isComment = line.startsWith('//')
                const isStatus = line.startsWith('[STATUS]') || line.startsWith('[SUCCESS]')
                const isNode = line.startsWith('[NODE')
                const isCode = line.startsWith('const ')

                let lineClass = 'log-line'
                if (isComment) lineClass += ' comment-line'
                else if (isStatus) lineClass += ' status-success-line'
                else if (isNode) lineClass += ' module-load-line'
                else if (isCode) lineClass += ' code-eval-line'

                return (
                  <div key={lIdx} className={lineClass}>
                    <span className="line-prefix">{`>`}</span>
                    <span className="line-text">{line}</span>
                  </div>
                )
              })}
              {progress < 100 && (
                <div className="terminal-active-cursor-line">
                  <span className="line-prefix">{`>`}</span>
                  <span className="blinking-terminal-cursor">█</span>
                </div>
              )}
            </div>

            {/* SOLID PROGRESS BOTTOM BAR */}
            <div className="terminal-footer-progress">
              <div className="footer-progress-label-row">
                <span>AST PARSING &amp; GRAPH SYNTHESIS</span>
                <span className="footer-pct">{progress}%</span>
              </div>
              <div className="footer-progress-track">
                <div
                  className="footer-progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurriculumLoader
