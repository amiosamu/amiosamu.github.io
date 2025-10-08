import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const essaysDirectory = path.join(process.cwd(), 'essays')

export interface Essay {
  slug: string
  title: string
  date: string
  description?: string
  tags?: string[]
  content: string
}

export interface EssayMetadata {
  slug: string
  title: string
  date: string
  description?: string
  tags?: string[]
}

// Cache for essay metadata to avoid repeated file reads
let metadataCache: EssayMetadata[] | null = null

export function getEssaySlugs() {
  if (!fs.existsSync(essaysDirectory)) {
    return []
  }
  return fs.readdirSync(essaysDirectory).filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
}

// Optimized: Only load metadata without content
export function getEssayMetadata(slug: string): EssayMetadata {
  const realSlug = slug.replace(/\.(md|mdx)$/, '')
  const fullPath = path.join(essaysDirectory, `${realSlug}.md`)
  
  let fileContents
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8')
  } catch {
    const mdxPath = path.join(essaysDirectory, `${realSlug}.mdx`)
    fileContents = fs.readFileSync(mdxPath, 'utf8')
  }
  
  const { data } = matter(fileContents)

  return {
    slug: realSlug,
    title: data.title || realSlug,
    date: data.date || '',
    description: data.description || '',
    tags: data.tags || [],
  }
}

export function getEssayBySlug(slug: string): Essay {
  const realSlug = slug.replace(/\.(md|mdx)$/, '')
  const fullPath = path.join(essaysDirectory, `${realSlug}.md`)
  
  let fileContents
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8')
  } catch {
    const mdxPath = path.join(essaysDirectory, `${realSlug}.mdx`)
    fileContents = fs.readFileSync(mdxPath, 'utf8')
  }
  
  const { data, content } = matter(fileContents)

  return {
    slug: realSlug,
    title: data.title || realSlug,
    date: data.date || '',
    description: data.description || '',
    tags: data.tags || [],
    content,
  }
}

// Optimized: Return metadata only for listing
export function getAllEssaysMetadata(): EssayMetadata[] {
  // Return cached metadata if available
  if (metadataCache) {
    return metadataCache
  }

  const slugs = getEssaySlugs()
  const essays = slugs
    .map((slug) => getEssayMetadata(slug))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
  
  // Cache the result
  metadataCache = essays
  return essays
}

export function getAllEssays(): Essay[] {
  const slugs = getEssaySlugs()
  const essays = slugs
    .map((slug) => getEssayBySlug(slug))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
  return essays
}

// Optimized: Only load metadata for adjacent essays
export function getAdjacentEssays(currentSlug: string): { previous?: EssayMetadata; next?: EssayMetadata } {
  const essays = getAllEssaysMetadata() // Use metadata only
  const currentIndex = essays.findIndex((essay) => essay.slug === currentSlug)
  
  if (currentIndex === -1) {
    return {}
  }

  return {
    previous: currentIndex > 0 ? essays[currentIndex - 1] : undefined,
    next: currentIndex < essays.length - 1 ? essays[currentIndex + 1] : undefined,
  }
}

// Get all unique tags
export function getAllTags(): { tag: string; count: number }[] {
  const essays = getAllEssaysMetadata()
  const tagCount = new Map<string, number>()

  essays.forEach((essay) => {
    essay.tags?.forEach((tag) => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagCount.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

// Get essays by tag
export function getEssaysByTag(tag: string): EssayMetadata[] {
  const essays = getAllEssaysMetadata()
  return essays.filter((essay) => essay.tags?.includes(tag))
}

