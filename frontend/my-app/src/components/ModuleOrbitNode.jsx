import React from 'react'
import { motion } from 'framer-motion'

/**
 * ModuleOrbitNode represents an individual module type in the orbital ring (Theory, Video, Code, etc.)
 * Styled with circular dashed visual language matching the knowledge graph nodes.
 */
function ModuleOrbitNode({
  moduleType,
  meta,
  isActive,
  onClick,
  style,
  index = 0
}) {
  const { icon = '📌', label = 'Module', color = '#F2B880' } = meta || {}

  return (
    <motion.button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-label={`${label} Module`}
      className={`module-orbit-node-btn ${isActive ? 'is-active' : ''}`}
      style={{
        ...style,
        '--node-accent-color': color
      }}
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Outer Glowing Active Ring */}
      {isActive && (
        <motion.span
          className="orbit-node-active-aura"
          layoutId="active-orbit-aura"
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        />
      )}

      <span className="orbit-node-inner-circle">
        <span className="orbit-node-icon" aria-hidden="true">
          {icon}
        </span>
      </span>

      <span className="orbit-node-pill-label">
        <span className="orbit-node-pill-index">M0{index + 1}</span>
        <span className="orbit-node-pill-name">{label}</span>
      </span>
    </motion.button>
  )
}

export default ModuleOrbitNode
