import curriculumData from '../data/learningCurriculumData.json'

/**
 * Get all available technologies
 */
export function getAllTechnologies() {
  return curriculumData.technologies.map(t => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    category: t.category,
    description: t.description,
    topicCount: t.topics ? t.topics.length : 0
  }))
}

/**
 * Searches technologies and specific sub-topics matching query
 */
export function searchTechAndTopics(query) {
  const trimmed = (query || '').trim().toLowerCase()
  if (!trimmed) {
    const all = []
    curriculumData.technologies.forEach(tech => {
      if (tech.topics) {
        tech.topics.forEach(topic => {
          all.push({
            techId: tech.id,
            techName: tech.name,
            techIcon: tech.icon,
            topicId: topic.id,
            title: topic.title,
            summary: topic.summary,
            level: topic.level,
            moduleCount: topic.modules ? topic.modules.length : 0
          })
        })
      }
    })
    return all
  }

  const results = []

  curriculumData.technologies.forEach(tech => {
    const techNameLower = tech.name.toLowerCase()
    const techIdLower = tech.id.toLowerCase()
    const matchesTech = techNameLower.includes(trimmed) || techIdLower.includes(trimmed)

    if (tech.topics) {
      tech.topics.forEach(topic => {
        const titleLower = topic.title.toLowerCase()
        const summaryLower = (topic.summary || '').toLowerCase()

        if (matchesTech || titleLower.includes(trimmed) || summaryLower.includes(trimmed)) {
          results.push({
            techId: tech.id,
            techName: tech.name,
            techIcon: tech.icon,
            topicId: topic.id,
            title: topic.title,
            summary: topic.summary,
            level: topic.level,
            moduleCount: topic.modules ? topic.modules.length : 0,
            isExactMatch: titleLower === trimmed || techNameLower === trimmed
          })
        }
      })
    }
  })

  // Sort exact matches or title matches first
  results.sort((a, b) => (b.isExactMatch ? 1 : 0) - (a.isExactMatch ? 1 : 0))
  return results
}

/**
 * Get a specific topic by its ID across all technologies
 */
export function getTopicById(topicId) {
  for (const tech of curriculumData.technologies) {
    if (tech.topics) {
      const found = tech.topics.find(t => t.id === topicId)
      if (found) {
        return {
          ...found,
          techId: tech.id,
          techName: tech.name,
          techIcon: tech.icon,
          techCategory: tech.category
        }
      }
    }
  }
  return null
}

/**
 * Get technology details and its topics
 */
export function getTechnologyById(techId) {
  return curriculumData.technologies.find(t => t.id === techId) || null
}

/**
 * Generates an interactive Knowledge Graph structure for a search query, technology, or topic
 */
export function getKnowledgeGraph(queryOrId) {
  if (!queryOrId) return null
  const input = String(queryOrId).trim().toLowerCase()

  // 1. Check if input matches a technology ID or name
  let matchedTech = curriculumData.technologies.find(
    t => t.id.toLowerCase() === input || t.name.toLowerCase() === input || t.name.toLowerCase().includes(input)
  )

  // 2. If not a direct tech, check if input matches a topic
  let matchedTopic = null
  if (!matchedTech) {
    matchedTopic = getTopicById(input)
    if (!matchedTopic) {
      // Fuzzy search across topics
      for (const t of curriculumData.technologies) {
        const found = t.topics?.find(tp => tp.title.toLowerCase().includes(input) || tp.id.includes(input))
        if (found) {
          matchedTopic = { ...found, techId: t.id, techName: t.name, techIcon: t.icon }
          matchedTech = t
          break
        }
      }
    } else {
      matchedTech = getTechnologyById(matchedTopic.techId)
    }
  }

  // Fallback to first tech if no match
  if (!matchedTech) {
    matchedTech = curriculumData.technologies[0]
  }

  const topics = matchedTech.topics || []

  // Construct Knowledge Graph representation
  const rootNode = {
    id: `root-${matchedTech.id}`,
    techId: matchedTech.id,
    label: matchedTech.name,
    icon: matchedTech.icon,
    category: matchedTech.category,
    description: matchedTech.description,
    type: 'root'
  }

  const conceptNodes = topics.map((tp, idx) => ({
    id: tp.id,
    techId: matchedTech.id,
    techName: matchedTech.name,
    label: tp.title,
    summary: tp.summary,
    level: tp.level,
    type: 'concept',
    number: idx + 1,
    modules: tp.modules || [],
    isSelected: matchedTopic ? matchedTopic.id === tp.id : idx === 0
  }))

  const links = conceptNodes.map(concept => ({
    source: rootNode.id,
    target: concept.id
  }))

  const initialSelectedTopic = matchedTopic
    ? conceptNodes.find(c => c.id === matchedTopic.id) || conceptNodes[0]
    : conceptNodes[0]

  return {
    tech: matchedTech,
    rootNode,
    conceptNodes,
    links,
    initialSelectedTopic,
    initialSelectedModule: initialSelectedTopic?.modules?.[0] || null
  }
}
