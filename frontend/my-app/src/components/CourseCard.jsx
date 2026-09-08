import React from 'react'

function getSiteBadgeClass(site) {
  const s = (site || '').toLowerCase()
  if (s.includes('coursera')) return 'badge-coursera'
  if (s.includes('simplilearn')) return 'badge-simplilearn'
  if (s.includes('udacity')) return 'badge-udacity'
  if (s.includes('futurelearn') || s.includes('future learn')) return 'badge-futurelearn'
  return 'badge-default'
}

function CourseCard({ course }) {
  const {
    title,
    site,
    url,
    duration,
    viewers,
    rating,
    category,
    description,
    level
  } = course

  return (
    <article className="course-card">
      <div className="course-card-header">
        <span className={`course-site-badge ${getSiteBadgeClass(site)}`}>
          {site}
        </span>
        {category && (
          <span className="course-category-tag" title={category}>
            {category}
          </span>
        )}
      </div>

      <h3 className="course-title" title={title}>
        {title}
      </h3>

      {description && (
        <p className="course-description" title={description}>
          {description}
        </p>
      )}

      <div className="course-metadata">
        {duration && (
          <div className="meta-item" title={`Duration: ${duration}`}>
            <span className="meta-icon" aria-hidden="true">⏱️</span>
            <span>{duration}</span>
          </div>
        )}

        {(rating || viewers) && (
          <div className="meta-item" title="Rating & Viewers">
            {rating && (
              <span className="course-rating">
                <span className="star-icon">★</span> {rating}
              </span>
            )}
            {viewers && (
              <span className="course-viewers">
                👥 {viewers}
              </span>
            )}
          </div>
        )}

        {level && !rating && !viewers && (
          <div className="meta-item">
            <span className="meta-icon" aria-hidden="true">🏷️</span>
            <span>{level}</span>
          </div>
        )}
      </div>

      <div className="course-card-footer">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-small course-link-btn"
          aria-label={`View ${title} on ${site}`}
        >
          View Course <span>↗</span>
        </a>
      </div>
    </article>
  )
}

export default CourseCard
