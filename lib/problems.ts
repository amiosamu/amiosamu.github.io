import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import catalog from '@/content/problems.json'

const solutionsDirectory = path.join(process.cwd(), 'solutions')

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

/** A raw entry as it appears in content/problems.json. */
interface CatalogEntry {
  name: string
  difficulty: string
  category: string
  neetcode_url: string
  leetcode_url: string
  slug: string
}

/** Catalog data joined with the frontmatter of solutions/<slug>.md, if it exists. */
export interface Problem {
  slug: string
  name: string
  difficulty: Difficulty
  category: string
  categorySlug: string
  neetcodeUrl: string
  /** A file exists in solutions/, draft or not. */
  hasFile: boolean
  /** Published: a file exists and it isn't a draft. Drives progress counts. */
  solved: boolean
  /** A page will exist for this problem in *this* build — drafts included in dev. */
  linkable: boolean
  pattern?: string
  time?: string
  space?: string
}

export interface Solution extends Problem {
  content: string
}

export interface Category {
  name: string
  slug: string
  count: number
  solved: number
}

// The scraped category names are HTML-escaped ("Arrays &amp; Hashing").
function unescapeHtml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export function slugifyCategory(category: string): string {
  return unescapeHtml(category)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// neetcode_url is stored as a relative path.
function absoluteNeetcodeUrl(url: string): string {
  return url.startsWith('http') ? url : `https://neetcode.io${url}`
}

let problemsCache: Problem[] | null = null

function readSolutionFrontmatter(slug: string): Record<string, any> | null {
  const fullPath = path.join(solutionsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) {
    return null
  }
  const { data } = matter(fs.readFileSync(fullPath, 'utf8'))
  return data
}

/**
 * Every problem in the catalog, in catalog order, each annotated with whether a
 * writeup exists in solutions/. The catalog is the source of truth for the list
 * itself; markdown files only ever contribute your own notes on top.
 */
export function getAllProblems(): Problem[] {
  if (problemsCache) {
    return problemsCache
  }

  const entries = (catalog.problems as CatalogEntry[]) ?? []

  // Under `output: 'export'` Next refuses to render a param that isn't in
  // generateStaticParams — even in dev. So dev builds pages for drafts too,
  // otherwise there'd be no way to preview a writeup before publishing it.
  const includeDrafts = process.env.NODE_ENV === 'development'

  problemsCache = entries.map((entry) => {
    const data = readSolutionFrontmatter(entry.slug)
    const category = unescapeHtml(entry.category)
    const hasFile = data !== null
    // A scaffolded stub carries `draft: true` until it's actually written.
    const solved = hasFile && data.draft !== true

    return {
      slug: entry.slug,
      name: unescapeHtml(entry.name),
      difficulty: entry.difficulty as Difficulty,
      category,
      categorySlug: slugifyCategory(entry.category),
      neetcodeUrl: absoluteNeetcodeUrl(entry.neetcode_url),
      hasFile,
      solved,
      linkable: solved || (includeDrafts && hasFile),
      pattern: data?.pattern || undefined,
      time: data?.time || undefined,
      space: data?.space || undefined,
    }
  })

  return problemsCache
}

/**
 * Slugs worth generating a page for: a file exists and it isn't a draft.
 * Drafts still render under `npm run dev` (getProblemBySlug ignores the flag),
 * they just don't get exported or linked to.
 */
export function getPageSlugs(): string[] {
  const problems = getAllProblems()
  warnAboutOrphanedFiles(problems)
  return problems.filter((problem) => problem.linkable).map((problem) => problem.slug)
}

// A file whose name isn't a catalog slug is invisible everywhere else, so say so
// loudly at build time rather than letting a typo silently swallow a writeup.
function warnAboutOrphanedFiles(problems: Problem[]) {
  if (!fs.existsSync(solutionsDirectory)) {
    return
  }
  const known = new Set(problems.map((problem) => problem.slug))
  const orphans = fs
    .readdirSync(solutionsDirectory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
    .filter((slug) => !known.has(slug))

  if (orphans.length > 0) {
    console.warn(
      `\n[dsa] ${orphans.length} file(s) in solutions/ do not match any catalog slug and will be ignored:\n` +
        orphans.map((slug) => `  - solutions/${slug}.md`).join('\n') +
        `\n`
    )
  }
}

export function getProblemBySlug(slug: string): Solution | null {
  const problem = getAllProblems().find((entry) => entry.slug === slug)
  if (!problem) {
    return null
  }

  const fullPath = path.join(solutionsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const { content } = matter(fs.readFileSync(fullPath, 'utf8'))
  return { ...problem, content }
}

/** The 18 categories in catalog order, with solved counts. */
export function getCategories(): Category[] {
  const problems = getAllProblems()
  const order: string[] = []
  const byCategory = new Map<string, Problem[]>()

  problems.forEach((problem) => {
    if (!byCategory.has(problem.category)) {
      byCategory.set(problem.category, [])
      order.push(problem.category)
    }
    byCategory.get(problem.category)!.push(problem)
  })

  return order.map((name) => {
    const group = byCategory.get(name)!
    return {
      name,
      slug: group[0].categorySlug,
      count: group.length,
      solved: group.filter((problem) => problem.solved).length,
    }
  })
}

/** Siblings within the same category — powers the rail on a problem page. */
export function getCategorySiblings(slug: string): Problem[] {
  const problems = getAllProblems()
  const current = problems.find((problem) => problem.slug === slug)
  if (!current) {
    return []
  }
  return problems.filter((problem) => problem.category === current.category)
}

/**
 * Previous/next within the category, restricted to problems that actually have
 * a page. Walking to a 404 would be worse than skipping.
 */
export function getAdjacentProblems(slug: string): { previous?: Problem; next?: Problem } {
  const siblings = getCategorySiblings(slug).filter(
    (problem) => problem.linkable || problem.slug === slug
  )
  const currentIndex = siblings.findIndex((problem) => problem.slug === slug)

  if (currentIndex === -1) {
    return {}
  }

  return {
    previous: currentIndex > 0 ? siblings[currentIndex - 1] : undefined,
    next: currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : undefined,
  }
}

export function getStats(): { total: number; solved: number } {
  const problems = getAllProblems()
  return {
    total: problems.length,
    solved: problems.filter((problem) => problem.solved).length,
  }
}
