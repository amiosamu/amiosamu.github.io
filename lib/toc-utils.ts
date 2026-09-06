import GithubSlugger from 'github-slugger'
import type { Nodes } from 'mdast'
import { toString } from 'mdast-util-to-string'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export function extractHeadings(content: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(content)
  const slugger = new GithubSlugger()
  const items: TocItem[] = []

  function visit(node: Nodes) {
    if (node.type === 'heading') {
      const text = toString(node).trim()
      const id = slugger.slug(text)

      // Slug every heading so IDs stay aligned with rehype-slug, but only
      // expose the levels used by the essay navigation.
      if ((node.depth === 2 || node.depth === 3) && text) {
        items.push({ id, text, level: node.depth })
      }
    }

    if ('children' in node) {
      node.children.forEach(visit)
    }
  }

  visit(tree)
  return items
}
