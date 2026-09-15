import React from 'react'
import ModuleOrbitNode from './ModuleOrbitNode'

export const MODULE_TYPE_META = {
  concepts: { icon: '📖', label: 'Theory', color: '#F2B880', fullTitle: 'Theory & Fundamentals' },
  video: { icon: '▶️', label: 'Video', color: '#D9A77E', fullTitle: 'Video Masterclass' },
  'code-examples': { icon: '💻', label: 'Code', color: '#E58A4F', fullTitle: 'Production Code & Patterns' },
  mcq: { icon: '🎯', label: 'MCQs', color: '#F2B880', fullTitle: 'Interactive Quiz & MCQs' },
  test: { icon: '⚡', label: 'Syntax', color: '#A85F3B', fullTitle: 'Syntax & Debugging Test' },
  project: { icon: '🚀', label: 'Project', color: '#D9A77E', fullTitle: 'Practical Milestone Project' }
}

const DEFAULT_MODULE_TYPES = ['concepts', 'video', 'code-examples', 'mcq', 'test', 'project']

function ModuleOrbitRing({
  modules = [],
  activeModuleType = 'concepts',
  onSelectModuleType,
  conceptTitle = 'Concept'
}) {
  // If modules array is provided from data, extract types or use standard 6 types
  const availableTypes = modules.length > 0
    ? modules.map(m => m.type)
    : DEFAULT_MODULE_TYPES

  // Ensure unique ordered module types
  const moduleTypes = Array.from(new Set([...availableTypes, ...DEFAULT_MODULE_TYPES])).slice(0, 6)

  return (
    <div className="module-orbit-ring-container" role="tablist" aria-label="Concept Modules Orbit">
      {/* Decorative Dashed Track & Connectors Visual Language */}
      <div className="orbit-track-visual-layer" aria-hidden="true">
        <svg className="orbit-track-svg" viewBox="0 0 700 80" preserveAspectRatio="none">
          {/* Dashed connector line passing through the orbital nodes */}
          <line
            x1="5%"
            y1="40"
            x2="95%"
            y2="40"
            className="orbit-dashed-connector-line"
          />
        </svg>
      </div>

      {/* 6 Module Orbital Nodes */}
      <div className="module-orbit-nodes-row">
        {moduleTypes.map((typeKey, idx) => {
          const meta = MODULE_TYPE_META[typeKey] || {
            icon: '📌',
            label: typeKey,
            color: '#F2B880',
            fullTitle: typeKey
          }
          const isActive = activeModuleType === typeKey

          return (
            <ModuleOrbitNode
              key={typeKey}
              moduleType={typeKey}
              meta={meta}
              isActive={isActive}
              index={idx}
              onClick={() => onSelectModuleType(typeKey)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ModuleOrbitRing
