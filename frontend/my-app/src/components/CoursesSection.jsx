import React, { useState, useEffect } from 'react'
import CourseCard from './CourseCard'
import { getDiverseRandomCourses, searchAllCourses } from '../service/coursesService'

function CoursesSection() {
  const [courses, setCourses] = useState([])
  const [availableSites, setAvailableSites] = useState([])
  const [activeSite, setActiveSite] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchTerm, setActiveSearchTerm] = useState('')
  const [totalMatches, setTotalMatches] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load 20 random diverse courses
  const loadRandomCourses = async () => {
    setIsLoading(true)
    setSearchQuery('')
    setActiveSearchTerm('')
    try {
      const { courses: items, sites } = await getDiverseRandomCourses(20)
      setCourses(items)
      setTotalMatches(20)
      if (sites && sites.length > 0) {
        setAvailableSites(sites)
      }
    } catch (err) {
      console.error('Failed to load courses from dataset:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle course search
  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) {
      loadRandomCourses()
      return
    }

    setIsLoading(true)
    setActiveSearchTerm(trimmed)
    try {
      const { courses: items, sites, totalMatches: matches } = await searchAllCourses(trimmed, 60)
      setCourses(items)
      setTotalMatches(matches || items.length)
      if (sites && sites.length > 0) {
        setAvailableSites(sites)
      }
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearSearch = () => {
    loadRandomCourses()
  }

  useEffect(() => {
    loadRandomCourses()
  }, [])

  const siteFilters = ['ALL', ...availableSites]

  const filteredCourses = activeSite === 'ALL'
    ? courses
    : courses.filter(c => c.site.toLowerCase() === activeSite.toLowerCase())

  return (
    <section className="courses-section" id="courses">
      <div className="section-head courses-head">
        <div>
          <p className="section-kicker">Live Recommendations</p>
          <h2>
            Curated Courses from <em>Top Platforms.</em>
          </h2>
          <p className="section-subtitle">
            {activeSearchTerm ? (
              <>Showing search results for <strong>"{activeSearchTerm}"</strong> ({totalMatches} courses found)</>
            ) : (
              <>Exploring 20 diverse courses synchronized across Coursera, Simplilearn, Udacity, and FutureLearn to level up your skillset.</>
            )}
          </p>
        </div>

        <div className="courses-actions">
          <button
            type="button"
            className="button button-secondary shuffle-btn"
            onClick={loadRandomCourses}
            disabled={isLoading}
            title="Randomize and fetch 20 new diverse courses"
          >
            <span className="shuffle-icon" aria-hidden="true">🔀</span>
            {isLoading ? 'Fetching...' : 'Shuffle 20 Courses'}
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="courses-search-container">
        <form className="courses-search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="courses-search-input"
              placeholder="Search courses (e.g., Security Analyst, Machine Learning, Python, Full Stack)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear input text"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="button courses-search-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          {activeSearchTerm && (
            <button
              type="button"
              className="button button-secondary clear-filter-btn"
              onClick={handleClearSearch}
            >
              Reset Search
            </button>
          )}
        </form>
      </div>

      {/* Platform Filter Tabs */}
      {availableSites.length > 0 && (
        <div className="courses-filter-bar">
          <span className="filter-label">Filter by Platform:</span>
          <div className="filter-pills">
            {siteFilters.map(site => (
              <button
                key={site}
                type="button"
                className={`filter-pill ${activeSite === site ? 'active' : ''}`}
                onClick={() => setActiveSite(site)}
              >
                {site === 'ALL' ? 'All Platforms' : site}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Course Grid */}
      {isLoading ? (
        <div className="courses-loading-state">
          <div className="courses-loader-spinner"></div>
          <p>Loading curated courses from dataset...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="courses-empty-state">
          <p>
            {activeSearchTerm
              ? `No courses found matching "${activeSearchTerm}" on ${activeSite === 'ALL' ? 'any platform' : activeSite}.`
              : 'No courses found for the selected platform in this batch.'}
          </p>
          <button
            type="button"
            className="button button-small"
            onClick={loadRandomCourses}
          >
            Fetch New 20 Courses
          </button>
        </div>
      )}
    </section>
  )
}

export default CoursesSection
