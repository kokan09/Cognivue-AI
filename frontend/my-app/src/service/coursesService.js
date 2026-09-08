/**
 * Fast RFC-compliant CSV parser
 */
function parseCSV(text) {
  const lines = []
  let row = []
  let inQuotes = false
  let curr = ''

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    const next = text[i + 1]

    if (c === '"') {
      if (inQuotes && next === '"') {
        curr += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (c === ',' && !inQuotes) {
      row.push(curr.trim())
      curr = ''
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++
      row.push(curr.trim())
      if (row.some(x => x.length > 0)) {
        lines.push(row)
      }
      row = []
      curr = ''
    } else {
      curr += c
    }
  }

  if (curr || row.length) {
    row.push(curr.trim())
    if (row.some(x => x.length > 0)) {
      lines.push(row)
    }
  }

  return lines
}

let cachedGroupedCourses = null
let cachedAllCoursesList = null
let cachedAllSites = []

/**
 * Parses and indexes all courses grouped by Site asynchronously
 */
async function loadAndGroupCourses() {
  if (cachedGroupedCourses && cachedAllCoursesList) return cachedGroupedCourses

  // Lazy load CSV chunk so main app bundle stays light
  const csvModule = await import('../data/Online_Courses.csv?raw')
  const csvRawData = csvModule.default

  const rows = parseCSV(csvRawData)
  if (!rows || rows.length < 2) {
    cachedGroupedCourses = {}
    cachedAllCoursesList = []
    return cachedGroupedCourses
  }

  const [headerRow, ...dataRows] = rows
  const headers = headerRow.map(h => h.trim())

  const getCol = (row, colName) => {
    const idx = headers.indexOf(colName)
    return idx !== -1 && row[idx] ? row[idx].trim() : ''
  }

  const grouped = {}
  const allList = []

  dataRows.forEach((row, index) => {
    const title = getCol(row, 'Title') || getCol(row, 'Course Title')
    if (!title) return

    let site = getCol(row, 'Site')
    if (!site) site = 'Online Platform'

    // Normalize site name display
    if (site.toLowerCase().includes('coursera')) site = 'Coursera'
    else if (site.toLowerCase().includes('simplilearn')) site = 'Simplilearn'
    else if (site.toLowerCase().includes('udacity')) site = 'Udacity'
    else if (site.toLowerCase().includes('future learn') || site.toLowerCase().includes('futurelearn')) site = 'FutureLearn'

    if (!grouped[site]) {
      grouped[site] = []
    }

    const rawRating = getCol(row, 'Rating') || getCol(row, 'Rank') || ''
    const cleanRating = rawRating.replace(/stars?/i, '').trim()

    let duration = getCol(row, 'Duration') || getCol(row, 'Weekly study')
    if (duration) {
      duration = duration.replace(/Estimated time/i, '').replace(/Approximately/i, 'Approx.').trim()
    } else {
      duration = 'Self-paced'
    }

    const viewers = getCol(row, 'Number of viewers') || getCol(row, 'Number of Reviews') || getCol(row, 'Number of ratings')

    let category = getCol(row, 'Category') || getCol(row, 'Sub-Category') || getCol(row, 'COURSE CATEGORIES') || getCol(row, 'School') || 'Tech & Professional'
    category = category.replace(/^[,\s]+|[,\s]+$/g, '')

    let description = getCol(row, 'Short Intro') || getCol(row, 'Course Short Intro') || getCol(row, 'What you learn') || ''
    if (description.startsWith('#')) {
      description = description.replace(/^#\w+\s*/, '')
    }

    const url = getCol(row, 'URL') || getCol(row, 'Course URL') || '#'
    const level = getCol(row, 'Level') || getCol(row, 'Course Type') || getCol(row, 'Program Type') || ''

    const courseObj = {
      id: `${site.toLowerCase()}-${index}`,
      title,
      site,
      url,
      duration,
      viewers: viewers || null,
      rating: cleanRating && !isNaN(parseFloat(cleanRating)) ? parseFloat(cleanRating).toFixed(1) : null,
      category: category || 'General',
      description,
      level
    }

    grouped[site].push(courseObj)
    allList.push(courseObj)
  })

  cachedGroupedCourses = grouped
  cachedAllCoursesList = allList
  cachedAllSites = Object.keys(grouped)
  return grouped
}

/**
 * Fisher-Yates shuffle array
 */
function shuffleArray(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Fetches 20 courses randomly, interleaving unique sites as much as possible.
 * E.g., among the 20: 1 is Coursera, 2nd is Simplilearn, 3rd is Udacity, 4th is FutureLearn, etc.
 */
export async function getDiverseRandomCourses(totalCount = 20) {
  const grouped = await loadAndGroupCourses()
  const siteKeys = Object.keys(grouped)

  if (siteKeys.length === 0) return { courses: [], sites: [] }

  // Create shuffled copies of course lists per site
  const sitePools = {}
  siteKeys.forEach(s => {
    sitePools[s] = shuffleArray(grouped[s])
  })

  const selected = []
  let siteIndex = 0
  const sitePointers = {}
  siteKeys.forEach(s => { sitePointers[s] = 0 })

  while (selected.length < totalCount) {
    let addedInThisRound = false

    // Interleave across sites to guarantee maximum platform diversity
    for (let i = 0; i < siteKeys.length && selected.length < totalCount; i++) {
      const currentSite = siteKeys[(siteIndex + i) % siteKeys.length]
      const pool = sitePools[currentSite]
      const ptr = sitePointers[currentSite]

      if (ptr < pool.length) {
        selected.push(pool[ptr])
        sitePointers[currentSite]++
        addedInThisRound = true
      }
    }

    siteIndex = (siteIndex + 1) % siteKeys.length

    if (!addedInThisRound) break
  }

  return { courses: selected, sites: cachedAllSites }
}

/**
 * Searches across all 8,800+ courses by keyword/query with relevance scoring
 */
export async function searchAllCourses(query, maxResults = 100) {
  await loadAndGroupCourses()
  if (!cachedAllCoursesList || cachedAllCoursesList.length === 0) {
    return { courses: [], sites: cachedAllSites, totalMatches: 0 }
  }

  const trimmed = (query || '').trim().toLowerCase()
  if (!trimmed) {
    return getDiverseRandomCourses(20)
  }

  const terms = trimmed.split(/\s+/).filter(t => t.length > 0)

  const scored = []

  for (const course of cachedAllCoursesList) {
    const titleLower = course.title.toLowerCase()
    const descLower = course.description.toLowerCase()
    const catLower = course.category.toLowerCase()
    const siteLower = course.site.toLowerCase()

    let score = 0

    // Exact full query match in title
    if (titleLower.includes(trimmed)) {
      score += 100
      if (titleLower === trimmed || titleLower.startsWith(trimmed)) score += 50
    }

    // Exact query in category
    if (catLower.includes(trimmed)) {
      score += 40
    }

    // Exact query in description
    if (descLower.includes(trimmed)) {
      score += 20
    }

    // Individual term matching
    let allTermsFound = true
    for (const term of terms) {
      const inTitle = titleLower.includes(term)
      const inDesc = descLower.includes(term)
      const inCat = catLower.includes(term)
      const inSite = siteLower.includes(term)

      if (inTitle) score += 25
      else if (inCat) score += 15
      else if (inDesc) score += 8
      else if (inSite) score += 5
      else {
        allTermsFound = false
      }
    }

    if (allTermsFound || score > 0) {
      scored.push({ course, score })
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score)

  const results = scored.slice(0, maxResults).map(item => item.course)

  return {
    courses: results,
    sites: cachedAllSites,
    totalMatches: scored.length
  }
}
