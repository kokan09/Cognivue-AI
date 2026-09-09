import React, { useState, useEffect, useRef } from 'react'
import { searchTechAndTopics, getAllTechnologies } from '../service/curriculumService'

function TechSearchDropdown({ onSelectTopic, selectedTopicId }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [matchedTechnologies, setMatchedTechnologies] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const trimmed = query.trim().toLowerCase()
    if (trimmed.length > 0) {
      // Find matching technologies for Knowledge Graph direct jump
      const allTechs = getAllTechnologies()
      const matchingTechs = allTechs.filter(
        t => t.name.toLowerCase().includes(trimmed) || t.id.toLowerCase().includes(trimmed)
      )
      setMatchedTechnologies(matchingTechs)

      // Find matching individual topics
      const topicResults = searchTechAndTopics(query)
      setSuggestions(topicResults)
      setIsOpen(true)
    } else {
      setMatchedTechnologies([])
      setSuggestions([])
      setIsOpen(false)
    }
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleSelect = (techOrTopicId) => {
    if (!techOrTopicId) return
    onSelectTopic(techOrTopicId)
    setIsOpen(false)
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    // If exact or matched technology exists, pass it, otherwise pass user query
    if (matchedTechnologies.length > 0) {
      handleSelect(matchedTechnologies[0].id)
    } else if (suggestions.length > 0) {
      handleSelect(suggestions[0].topicId)
    } else {
      handleSelect(trimmed)
    }
  }

  return (
    <form className="tech-search-section" ref={containerRef} onSubmit={handleSubmit}>
      {/* Search Input Bar */}
      <div className="tech-search-bar-wrapper">
        <span className="tech-search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          className="tech-search-input"
          placeholder="Search any skill (e.g. Java, Python, MERN, React, Java Syntax) & press Enter..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true)
          }}
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />

        {query && (
          <button
            type="button"
            className="tech-search-clear-btn"
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            aria-label="Clear search query"
          >
            ✕
          </button>
        )}

        <button
          type="submit"
          className="tech-search-submit-btn"
          title="Generate Knowledge Graph"
        >
          <span>Generate Graph</span>
          <span className="enter-key-badge">⏎</span>
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (matchedTechnologies.length > 0 || suggestions.length > 0) && (
        <div className="tech-dropdown-menu" role="listbox">
          {/* 1. MATCHING KNOWLEDGE GRAPHS */}
          {matchedTechnologies.length > 0 && (
            <div className="dropdown-section tech-graph-section">
              <div className="dropdown-header">
                <span>Knowledge Graph Roadmaps</span>
                <small>Explore full concept network</small>
              </div>
              <div className="dropdown-list">
                {matchedTechnologies.map((tech) => (
                  <button
                    key={tech.id}
                    type="button"
                    className="dropdown-item tech-graph-item"
                    onClick={() => handleSelect(tech.id)}
                  >
                    <div className="dropdown-item-main">
                      <div className="dropdown-tech-header-row">
                        <span className="tech-emoji-icon">{tech.icon}</span>
                        <strong className="dropdown-topic-title">{tech.name} Knowledge Graph</strong>
                        <span className="graph-tag-badge">EXPLORE GRAPH</span>
                      </div>
                      <p className="dropdown-topic-summary">{tech.description}</p>
                    </div>
                    <div className="dropdown-item-meta">
                      <span className="topic-module-count">{tech.topicCount} Concepts →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. MATCHING SUB-CONCEPTS & TOPICS */}
          {suggestions.length > 0 && (
            <div className="dropdown-section topics-section">
              <div className="dropdown-header">
                <span>Direct Concept Modules ({suggestions.length})</span>
                <small>Jump directly to specific subtopic</small>
              </div>
              <div className="dropdown-list">
                {suggestions.map((item) => (
                  <button
                    key={item.topicId}
                    type="button"
                    className={`dropdown-item ${selectedTopicId === item.topicId ? 'active' : ''}`}
                    onClick={() => handleSelect(item.topicId)}
                  >
                    <div className="dropdown-item-main">
                      <span className="dropdown-tech-badge">
                        {item.techIcon} {item.techName}
                      </span>
                      <strong className="dropdown-topic-title">{item.title}</strong>
                      <p className="dropdown-topic-summary">{item.summary}</p>
                    </div>
                    <div className="dropdown-item-meta">
                      <span className="topic-level-tag">{item.level}</span>
                      <span className="topic-module-count">{item.moduleCount} Modules →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isOpen && query.trim().length > 0 && matchedTechnologies.length === 0 && suggestions.length === 0 && (
        <div className="tech-dropdown-menu no-results-dropdown">
          <div className="dropdown-no-results">
            <span>🔎 No exact technical topic matched "{query}"</span>
            <small>Press Enter to generate a knowledge roadmap for "{query}".</small>
          </div>
        </div>
      )}
    </form>
  )
}

export default TechSearchDropdown
