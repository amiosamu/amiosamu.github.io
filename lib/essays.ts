import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const essaysDirectory = path.join(process.cwd(), 'essays')

export interface Essay {
  slug: string
  title: string
  date: string
  description?: string
  content: string
}

export function getEssaySlugs() {
  if (!fs.existsSync(essaysDirectory)) {
    return []
  }
  return fs.readdirSync(essaysDirectory).filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
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
    content,
  }
}

export function getAllEssays(): Essay[] {
  const slugs = getEssaySlugs()
  const essays = slugs
    .map((slug) => getEssayBySlug(slug))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
  return essays
}

