import React, { useState, useEffect, useRef } from 'react'

function CurriculumLoader({ topic, topicName, techName, modules = [] }) {
  const currentModules = modules && modules.length > 0
    ? modules
    : (topic?.modules || [
        { id: 'm1', number: 1, title: 'Concept Fundamentals', type: 'concepts' },
        { id: 'm2', number: 2, title: 'Interactive Practice', type: 'practice' }
      ])

  const totalModules = currentModules.length
  const [activeNodeIndex, setActiveNodeIndex] = useState(0)
  const [progress, setProgress] = useState(12)
  const [terminalLines, setTerminalLines] = useState([])
  const terminalRef = useRef(null)

  const techTitle = topicName || topic?.title || 'Selected Technology'
  const techLabel = techName || topic?.techName || 'ENGINEERING_CORE'

  // Generate dynamic terminal stream steps specific to the searched topic and its modules
  useEffect(() => {
    const rawLogs = [
      `[INIT] Bootstrapping AST Compiler for "${techTitle}"...`,
      `[CONFIG] Target: ${techLabel.toUpperCase()} | Modules Count: ${totalModules}`,
      `[IMPORT] Loading syntax rules & schema definitions...`,
      `// --- CODE GENERATION PIPELINE ---`,
      `const roadmap = new CognivuePipeline({ topic: "${techTitle}", depth: ${totalModules} });`,
      ...currentModules.map((m, i) => `[MODULE ${m.number || i + 1}] Synthesizing "${m.title}" -> [LOADED]`),
      `[VERIFY] Building interactive quizzes and test sandboxes...`,
      `[STATUS] 0 errors, 0 warnings. Compilation 100% complete.`,
      `[RENDER] Mounting ${totalModules} interactive modules to viewport...`
    ]

    let currentLineIdx = 0
    const logInterval = setInterval(() => {
      if (currentLineIdx < rawLogs.length) {
        const nextLog = rawLogs[currentLineIdx]
        setTerminalLines((prev) => [...prev, nextLog])
        currentLineIdx++
      } else {
        clearInterval(logInterval)
      }
    }, 220)

    // Module node activator (activating 1 through totalModules)
    const nodeInterval = setInterval(() => {
      setActiveNodeIndex((prev) => (prev < totalModules ? prev + 1 : prev))
    }, Math.max(260, 1700 / totalModules))

    // Progress counter
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98
        return prev + Math.floor(Math.random() * 14 + 10)
      })
    }, 160)

    return () => {
      clearInterval(logInterval)
      clearInterval(nodeInterval)
      clearInterval(progressInterval)
    }
  }, [techTitle, techLabel, totalModules, currentModules])

  // Auto scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLines])

  // Radar container dimensions for placing module cards around the circle
  const stageSize = 420
  const centerCoord = stageSize / 2
  const orbitRadius = 150

  return (
    <div className="dynamic-loader-split-view" role="status" aria-live="polite">
      {/* TOP STATUS HEADER */}
      <div className="loader-top-bar">
        <div className="loader-tech-badge">
          <span className="live-status-dot"></span>
          <span>COMPILING ROADMAP: <strong>{techTitle}</strong></span>
        </div>
        <span className="loader-module-count-badge">
          {totalModules} {totalModules === 1 ? 'MODULE' : 'MODULES'} DETECTED
        </span>
      </div>

      {/* 2-COLUMN LAYOUT: RADAR WITH PERIMETER MODULE RECTANGLES ON LEFT | CODING TERMINAL ON RIGHT */}
      <div className="loader-split-grid">
        {/* LEFT COLUMN: CIRCULAR RADAR WITH RECTANGLE MODULES POSITIONED AROUND CIRCLE */}
        <div className="radar-orbit-stage-wrapper">
          <div
            className="radar-orbit-stage"
            style={{ width: `${stageSize}px`, height: `${stageSize}px` }}
          >
            {/* INNER CENTRAL RADAR SCANNER */}
            <div className="radar-core-disc">
              <div className="radar-ring-bg ring-1"></div>
              <div className="radar-ring-bg ring-2"></div>
              <div className="radar-ring-bg ring-3"></div>

              <div className="radar-axis-horizontal"></div>
              <div className="radar-axis-vertical"></div>
              <div className="radar-scan-beam"></div>

              <div className="radar-center-hub">
                <span className="center-hub-pulse"></span>
                <span className="center-hub-text">{totalModules}M</span>
              </div>
            </div>

            {/* DYNAMIC RECTANGLE MODULE CARDS ORBITING AROUND CIRCLE */}
            {currentModules.map((mod, idx) => {
              const angle = (idx / totalModules) * (2 * Math.PI) - Math.PI / 2
              const x = centerCoord + orbitRadius * Math.cos(angle)
              const y = centerCoord + orbitRadius * Math.sin(angle)
              const isDone = idx < activeNodeIndex
              const isCurrent = idx === activeNodeIndex
              const isRightSide = Math.cos(angle) >= 0

              return (
                <div
                  key={mod.id || idx}
                  className={`orbit-module-card ${isDone ? 'done' : isCurrent ? 'building' : 'waiting'} ${
                    isRightSide ? 'align-right' : 'align-left'
                  }`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`
                  }}
                >
                  <div className="orbit-card-inner">
                    <span className="orbit-mod-badge">M{mod.number || idx + 1}</span>
                    <span className="orbit-mod-title">{mod.title}</span>
                    <span className="orbit-mod-status">
                      {isDone ? 'READY ✓' : isCurrent ? 'BUILDING...' : 'QUEUED'}
                    </span>
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
              <span className="terminal-ready-badge">RUNNING</span>
            </div>

            {/* STREAMING CODE & LOG BODY */}
            <div className="terminal-code-body" ref={terminalRef}>
              {terminalLines.map((line, lIdx) => {
                const isComment = line.startsWith('//')
                const isStatus = line.startsWith('[STATUS]') || line.startsWith('[SUCCESS]')
                const isModule = line.startsWith('[MODULE')
                const isCode = line.startsWith('const ')

                let lineClass = 'log-line'
                if (isComment) lineClass += ' comment-line'
                else if (isStatus) lineClass += ' status-success-line'
                else if (isModule) lineClass += ' module-load-line'
                else if (isCode) lineClass += ' code-eval-line'

                return (
                  <div key={lIdx} className={lineClass}>
                    <span className="line-prefix">{`>`}</span>
                    <span className="line-text">{line}</span>
                  </div>
                )
              })}
              <div className="terminal-active-cursor-line">
                <span className="line-prefix">{`>`}</span>
                <span className="blinking-terminal-cursor">█</span>
              </div>
            </div>

            {/* SOLID PROGRESS BOTTOM BAR */}
            <div className="terminal-footer-progress">
              <div className="footer-progress-label-row">
                <span>COMPILATION &amp; AST PARSING</span>
                <span className="footer-pct">{Math.min(progress, 100)}%</span>
              </div>
              <div className="footer-progress-track">
                <div
                  className="footer-progress-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
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
