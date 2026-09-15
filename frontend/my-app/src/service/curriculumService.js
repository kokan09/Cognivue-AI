import curriculumData from '../data/learningCurriculumData.json'

/**
 * Curated sub-concepts mapping for rich hierarchical drill-down
 */
const CURATED_SUB_CONCEPTS = {
  'mern-mongodb': [
    {
      id: 'sub-mongo-schema',
      label: 'Mongoose Schemas & Types',
      shortName: 'Schema & Types',
      icon: '📜',
      color: '#10B981',
      tag: 'Schema Design',
      summary: 'Define strict document structures, data types, required constraints, and timestamp auditing.',
      moduleOverride: {
        concepts: {
          title: 'Mongoose Schema Architecture & Type System',
          overview: 'Mongoose schemas define the blueprint for documents within a MongoDB collection. They enforce strict field types, default values, custom getters/setters, and automatic timestamp tracking.',
          keyPoints: [
            'Strict Data Types: String, Number, Boolean, Array, Buffer, Date, ObjectId, and Map.',
            'Field Constraints: `required`, `trim`, `lowercase`, `min/max`, and custom regex matchers.',
            'Timestamps Option: `{ timestamps: true }` automatically generates `createdAt` and `updatedAt`.',
            'Virtual Properties: Compute synthetic fields (e.g. `fullName`) without storing redundant database records.'
          ],
          codeSnippet: `import mongoose from 'mongoose';\n\nconst userSchema = new mongoose.Schema({\n  username: { type: String, required: true, unique: true, trim: true },\n  email: { type: String, required: true, lowercase: true },\n  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },\n  isActive: { type: Boolean, default: true }\n}, { timestamps: true });\n\nexport const User = mongoose.model('User', userSchema);`
        }
      }
    },
    {
      id: 'sub-mongo-crud',
      label: 'CRUD Queries & Filters',
      shortName: 'CRUD Queries',
      icon: '🔍',
      color: '#3B82F6',
      tag: 'Data Queries',
      summary: 'Perform high-performance creates, finds with comparison and logical operators, updates, and deletes.',
      moduleOverride: {
        concepts: {
          title: 'Mongoose CRUD Query Operations & Operators',
          overview: 'Mongoose provides chainable query helpers to filter, project, sort, and paginate through MongoDB collections with low memory overhead.',
          keyPoints: [
            'Filter Operators: `$gt`, `$gte`, `$lt`, `$in`, `$ne`, and regex `$options: "i"`.',
            'Logical Operators: `$and`, `$or`, and `$nor` for compound multi-condition searches.',
            'Atomic Updates: `$set`, `$inc`, `$push`, and `$pull` prevent race conditions during updates.',
            'Lean Queries: `.lean()` strips Mongoose document overhead for 3-5x faster read-only queries.'
          ],
          codeSnippet: `// Find active students enrolled in web development with pagination\nconst students = await User.find({\n  role: 'student',\n  isActive: true,\n  enrolledCourses: { $in: ['react', 'node'] }\n})\n.select('username email createdAt')\n.sort({ createdAt: -1 })\n.skip(20)\n.limit(10)\n.lean();`
        }
      }
    },
    {
      id: 'sub-mongo-agg',
      label: 'Aggregation Pipelines',
      shortName: 'Aggregation',
      icon: '📊',
      color: '#F59E0B',
      tag: 'Analytics & Pipeline',
      summary: 'Transform, group, filter, and calculate metrics across collections with multi-stage pipelines.',
      moduleOverride: {
        concepts: {
          title: 'MongoDB Multi-Stage Aggregation Framework',
          overview: 'The MongoDB Aggregation Framework processes documents through an ordered sequence of stages, performing calculations, group sums, joins, and shape remodeling on the database server.',
          keyPoints: [
            '$match Stage: Filter documents early in the pipeline to utilize indexes efficiently.',
            '$group Stage: Group by key fields to compute `$sum`, `$avg`, `$min`, and `$max`.',
            '$lookup Stage: Perform left outer joins with other collections via local/foreign keys.',
            '$unwind Stage: Deconstruct array fields into individual stream documents.'
          ],
          codeSnippet: `// Calculate average student score per topic\nconst topicStats = await Submission.aggregate([\n  { $match: { status: 'graded' } },\n  { $group: {\n      _id: '$topicId',\n      averageScore: { $avg: '$score' },\n      totalSubmissions: { $sum: 1 }\n    }\n  },\n  { $sort: { averageScore: -1 } }\n]);`
        }
      }
    },
    {
      id: 'sub-mongo-index',
      label: 'Indexing & Performance',
      shortName: 'Indexing & Speed',
      icon: '⚡',
      color: '#EF4444',
      tag: 'Performance',
      summary: 'Create single-field, compound, text, and TTL indexes to eliminate full collection scans.',
      moduleOverride: {
        concepts: {
          title: 'MongoDB Indexing & Query Optimization',
          overview: 'Without indexes, MongoDB must scan every document in a collection (COLLSCAN). Indexes create specialized B-Tree data structures that enable instantaneous lookups (IXSCAN).',
          keyPoints: [
            'Single & Compound Indexes: Indexing frequently combined query keys in ESR order (Equality, Sort, Range).',
            'Unique Indexes: Guarantee zero duplicate records at the database level.',
            'Text Indexes: Full-text keyword search across multiple string fields.',
            'Execution Stats: Use `.explain("executionStats")` to verify totalDocsExamined vs nReturned.'
          ],
          codeSnippet: `// Compound index supporting query on category + sorted by date\nuserSchema.index({ email: 1 }, { unique: true });\ncourseSchema.index({ category: 1, publishDate: -1 });\n\n// Explain query performance\nconst stats = await Course.find({ category: 'Fullstack' })\n  .sort({ publishDate: -1 })\n  .explain('executionStats');`
        }
      }
    },
    {
      id: 'sub-mongo-hooks',
      label: 'Middleware & Validation Hooks',
      shortName: 'Hooks & Validation',
      icon: '🛡️',
      color: '#8B5CF6',
      tag: 'Data Integrity',
      summary: 'Intercept document lifecycles with pre-save password hashing, post-remove cascading, and custom validators.',
      moduleOverride: {
        concepts: {
          title: 'Mongoose Pre/Post Middleware & Custom Validators',
          overview: 'Mongoose middleware hooks intercept document validation, saving, updating, and removal, enabling automated password hashing, auditing, and cascading deletes.',
          keyPoints: [
            'Pre-save Hooks: Automatically hash passwords with bcrypt before saving to disk.',
            'Custom Validators: Write custom regex or asynchronous database lookup checks.',
            'Post Hooks: Trigger side effects like sending welcome emails or cache invalidation.',
            'Schema Virtuals: Expose computed getters and populate virtual relationships.'
          ],
          codeSnippet: `userSchema.pre('save', async function (next) {\n  if (!this.isModified('password')) return next();\n  this.password = await bcrypt.hash(this.password, 12);\n  next();\n});`
        }
      }
    },
    {
      id: 'sub-mongo-atlas',
      label: 'MongoDB Atlas Cloud Connection',
      shortName: 'Atlas Cloud',
      icon: '☁️',
      color: '#06B6D4',
      tag: 'Cloud Infrastructure',
      summary: 'Connect Node.js backends to MongoDB Atlas clusters with connection pools, SSL, and error handling.',
      moduleOverride: {
        concepts: {
          title: 'Connecting to MongoDB Atlas in Production',
          overview: 'MongoDB Atlas provides managed cloud database clusters with automated backups, monitoring, and horizontal sharding. Learn production-grade connection handling.',
          keyPoints: [
            'Connection URI: Format `mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>`.',
            'Connection Pooling: Mongoose manages maxPoolSize (default 100) automatically.',
            'Graceful Shutdown: Close connection pool on `SIGINT` and `SIGTERM` signals.',
            'IP Whitelisting & Environment Secrets: Store URIs strictly in `.env`.'
          ],
          codeSnippet: `export async function connectDB() {\n  try {\n    const conn = await mongoose.connect(process.env.MONGO_URI, {\n      maxPoolSize: 50,\n      serverSelectionTimeoutMS: 5000\n    });\n    console.log(\`MongoDB Connected: \${conn.connection.host}\`);\n  } catch (error) {\n    console.error(\`Connection error: \${error.message}\`);\n    process.exit(1);\n  }\n}`
        }
      }
    }
  ],
  'mern-express': [
    {
      id: 'sub-exp-routes',
      label: 'Router & Route Handlers',
      shortName: 'Routing & Handlers',
      icon: '🛣️',
      color: '#10B981',
      tag: 'API Architecture',
      summary: 'Structure modular router trees, URL params, query string parsing, and clean controllers.',
      moduleOverride: {
        concepts: {
          title: 'Express Router Modular Architecture',
          overview: 'Express Router enables modular, mountable route handlers that separate API endpoints by feature domain (e.g. `/api/v1/users`, `/api/v1/courses`).',
          keyPoints: [
            'Express.Router(): Sub-routing mechanism isolated from the root application.',
            'Route Parameters: Access dynamic segments via `req.params.id`.',
            'Query Strings: Access URL query params via `req.query.search`.',
            'Controller Separation: Keep route definitions clean by delegating logic to controllers.'
          ],
          codeSnippet: `import { Router } from 'express';\nimport { getAllCourses, getCourseById } from '../controllers/courseController.js';\n\nconst router = Router();\nrouter.route('/')\n  .get(getAllCourses)\n  .post(createCourse);\n\nrouter.route('/:id')\n  .get(getCourseById);\n\nexport default router;`
        }
      }
    },
    {
      id: 'sub-exp-middleware',
      label: 'Middleware Pipeline & Lifecycle',
      shortName: 'Middleware Chain',
      icon: '⚙️',
      color: '#3B82F6',
      tag: 'Request Lifecycle',
      summary: 'Master application-level, router-level, and third-party middleware with `next()`.',
      moduleOverride: {
        concepts: {
          title: 'The Express Middleware Execution Pipeline',
          overview: 'Middleware functions have access to the request (`req`), response (`res`), and the next middleware in the cycle (`next()`). They can execute code, modify objects, or end the request-response cycle.',
          keyPoints: [
            'Built-in Middleware: `express.json()`, `express.urlencoded()`, `express.static()`.',
            'The `next()` Function: Passes control to the next middleware in the execution chain.',
            'Order Matters: Middleware executes sequentially in the order registered with `app.use()`.',
            'Third-party Utilities: `cors`, `helmet`, `morgan`, and `cookie-parser`.'
          ],
          codeSnippet: `// Custom request logging and timing middleware\nconst requestTimer = (req, res, next) => {\n  req.requestTime = Date.now();\n  res.on('finish', () => {\n    const duration = Date.now() - req.requestTime;\n    console.log(\`\${req.method} \${req.originalUrl} - \${res.statusCode} [\${duration}ms]\`);\n  });\n  next();\n};\n\napp.use(requestTimer);`
        }
      }
    },
    {
      id: 'sub-exp-auth',
      label: 'JWT Authentication & Security',
      shortName: 'JWT Auth & Security',
      icon: '🔒',
      color: '#F59E0B',
      tag: 'Security',
      summary: 'Protect API routes with JWT token verification, password hashing, and role authorization.',
      moduleOverride: {
        concepts: {
          title: 'JWT Authentication & RBAC Authorization in Express',
          overview: 'Stateless authentication uses JSON Web Tokens signed with a secret key. Protected routes inspect the `Authorization: Bearer <token>` header to authenticate requests.',
          keyPoints: [
            'Token Generation: `jwt.sign({ userId, role }, SECRET, { expiresIn: "7d" })`.',
            'Verification Middleware: Decodes tokens and attaches `req.user` payload.',
            'Role-Based Access Control (RBAC): Gate endpoints for admin or instructor roles.',
            'Security Headers: `helmet()` to secure HTTP response headers against XSS and clickjacking.'
          ],
          codeSnippet: `export const verifyToken = (req, res, next) => {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'Access token required' });\n  \n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch (err) {\n    return res.status(403).json({ error: 'Invalid or expired token' });\n  }\n};`
        }
      }
    },
    {
      id: 'sub-exp-error',
      label: 'Centralized Error Handling',
      shortName: 'Error Handling',
      icon: '🚨',
      color: '#EF4444',
      tag: 'Robustness',
      summary: 'Catch async route errors and format uniform JSON error responses with custom AppError classes.',
      moduleOverride: {
        concepts: {
          title: 'Centralized Error Handling Middleware in Express',
          overview: 'Express error-handling middleware accepts 4 parameters `(err, req, res, next)`. Catch all asynchronous exceptions without crashing the Node.js process.',
          keyPoints: [
            'Custom AppError Class: Encapsulate `statusCode`, `isOperational`, and error messages.',
            'Async Wrapper / express-async-errors: Eliminate manual `try/catch` boilerplate in controllers.',
            '404 Catch-All Handler: Intercept unhandled routes at the end of the middleware pipeline.',
            'Safe Production Output: Hide stack traces in production to prevent data leakage.'
          ],
          codeSnippet: `// Global error handling middleware\napp.use((err, req, res, next) => {\n  const status = err.statusCode || 500;\n  const message = err.message || 'Internal Server Error';\n  res.status(status).json({\n    success: false,\n    status,\n    message,\n    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })\n  });\n});`
        }
      }
    },
    {
      id: 'sub-exp-validation',
      label: 'Request Validation (Zod / Joi)',
      shortName: 'Data Validation',
      icon: '✅',
      color: '#8B5CF6',
      tag: 'Validation',
      summary: 'Validate and sanitize incoming request bodies, params, and queries before reaching controllers.',
      moduleOverride: {
        concepts: {
          title: 'Schema Validation for REST Requests with Zod',
          overview: 'Validating client payloads before passing them to database models protects your server from malformed data and injection vulnerabilities.',
          keyPoints: [
            'Zod Schema Definition: Define expected shape of `body`, `query`, and `params`.',
            'Validation Middleware: Automatically respond with 400 Bad Request if validation fails.',
            'Type Safety: Infer TypeScript types directly from Zod validation schemas.',
            'Data Sanitization: Strip dangerous HTML or script tags from user inputs.'
          ],
          codeSnippet: `import { z } from 'zod';\n\nconst createCourseSchema = z.object({\n  title: z.string().min(3).max(100),\n  price: z.number().nonnegative(),\n  category: z.enum(['Frontend', 'Backend', 'Fullstack'])\n});\n\nexport const validateBody = (schema) => (req, res, next) => {\n  const result = schema.safeParse(req.body);\n  if (!result.success) {\n    return res.status(400).json({ errors: result.error.format() });\n  }\n  req.body = result.data;\n  next();\n};`
        }
      }
    },
    {
      id: 'sub-exp-upload',
      label: 'File Uploads with Multer',
      shortName: 'File Uploads',
      icon: '📁',
      color: '#06B6D4',
      tag: 'Media Handling',
      summary: 'Handle multipart/form-data for user profile images and media uploads with file filter checks.',
      moduleOverride: {
        concepts: {
          title: 'Multipart File Uploads with Multer',
          overview: 'Multer parses incoming `multipart/form-data` streams, saving uploaded files to local storage or piping directly to Cloudinary/AWS S3.',
          keyPoints: [
            'Storage Engines: Disk storage with custom filenames vs Memory storage for cloud buffer uploads.',
            'File Filtering: Restrict allowed MIME types (e.g. image/jpeg, image/png).',
            'Size Limits: Prevent Denial of Service by enforcing maximum file size limits (e.g. 5MB).',
            'Single & Multi Upload: `upload.single("avatar")` vs `upload.array("images", 5)`.'
          ],
          codeSnippet: `import multer from 'multer';\n\nconst storage = multer.memoryStorage();\nexport const upload = multer({\n  storage,\n  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB\n  fileFilter: (req, file, cb) => {\n    if (file.mimetype.startsWith('image/')) cb(null, true);\n    else cb(new Error('Only image files are allowed!'), false);\n  }\n});`
        }
      }
    }
  ]
}

/**
 * Generate 6 default sub-concepts if not custom defined
 */
function generateDefaultSubConcepts(topic) {
  const baseTitle = topic.title || 'Concept'
  const modules = topic.modules || []

  return [
    {
      id: `sub-${topic.id}-core`,
      label: `${baseTitle} Core Architecture`,
      shortName: 'Core Architecture',
      icon: '📖',
      color: '#F2B880',
      tag: 'Fundamentals',
      summary: `Master the fundamental architecture and principles of ${baseTitle}.`,
      modules: modules
    },
    {
      id: `sub-${topic.id}-patterns`,
      label: `${baseTitle} Implementation Patterns`,
      shortName: 'Patterns & Best Practices',
      icon: '💻',
      color: '#E58A4F',
      tag: 'Code Patterns',
      summary: `Production-ready design patterns, snippets, and clean code conventions for ${baseTitle}.`,
      modules: modules
    },
    {
      id: `sub-${topic.id}-deepdive`,
      label: `${baseTitle} Video Masterclass`,
      shortName: 'Video Deep Dive',
      icon: '▶️',
      color: '#D9A77E',
      tag: 'Masterclass',
      summary: `Comprehensive visual breakdown and live walkthrough of ${baseTitle}.`,
      modules: modules
    },
    {
      id: `sub-${topic.id}-quiz`,
      label: `${baseTitle} Knowledge Assessment`,
      shortName: 'Quiz & MCQs',
      icon: '🎯',
      color: '#F2B880',
      tag: 'Interactive Quiz',
      summary: `Challenge yourself with interactive multiple-choice questions on ${baseTitle}.`,
      modules: modules
    },
    {
      id: `sub-${topic.id}-challenge`,
      label: `${baseTitle} Debugging & Syntax Challenge`,
      shortName: 'Syntax Challenge',
      icon: '⚡',
      color: '#A85F3B',
      tag: 'Coding Test',
      summary: `Fix real-world syntax bugs and edge-case errors in ${baseTitle}.`,
      modules: modules
    },
    {
      id: `sub-${topic.id}-capstone`,
      label: `${baseTitle} Practical Capstone Project`,
      shortName: 'Capstone Project',
      icon: '🚀',
      color: '#D9A77E',
      tag: 'Hands-on Build',
      summary: `Build an end-to-end practical project applying ${baseTitle} concepts.`,
      modules: modules
    }
  ]
}

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

  // Construct Knowledge Graph representation with enriched Sub-Concepts
  const rootNode = {
    id: `root-${matchedTech.id}`,
    techId: matchedTech.id,
    label: matchedTech.name,
    icon: matchedTech.icon,
    category: matchedTech.category,
    description: matchedTech.description,
    type: 'root'
  }

  const conceptNodes = topics.map((tp, idx) => {
    // Check if custom sub-concepts are defined, or generate rich defaults
    const customSubs = CURATED_SUB_CONCEPTS[tp.id]
    const subConcepts = (customSubs || generateDefaultSubConcepts(tp)).map((sub, sIdx) => {
      // Build 6 complete module objects for this sub-concept
      const baseModules = tp.modules || []
      const enrichedModules = baseModules.map((m) => {
        const override = sub.moduleOverride?.[m.type]
        if (override) {
          return {
            ...m,
            title: override.title || m.title,
            description: override.overview || m.description,
            content: {
              ...m.content,
              overview: override.overview || m.content?.overview,
              keyPoints: override.keyPoints || m.content?.keyPoints,
              codeSnippet: override.codeSnippet || m.content?.codeSnippet
            }
          }
        }
        return m
      })

      return {
        ...sub,
        number: sIdx + 1,
        parentConceptId: tp.id,
        modules: enrichedModules.length > 0 ? enrichedModules : baseModules
      }
    })

    return {
      id: tp.id,
      techId: matchedTech.id,
      techName: matchedTech.name,
      label: tp.title,
      summary: tp.summary,
      level: tp.level,
      type: 'concept',
      number: idx + 1,
      modules: tp.modules || [],
      subConcepts: subConcepts,
      isSelected: matchedTopic ? matchedTopic.id === tp.id : idx === 0
    }
  })

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
