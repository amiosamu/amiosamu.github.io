"use client"

import { useEffect, useState, useMemo } from 'react'
import { extractHeadings, type TocItem } from '@/lib/toc-utils'

export function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>('')

  // Memoize heading extraction to avoid re-computation
  const headings = useMemo(() => extractHeadings(content), [content])

  useEffect(() => {
    // Track active heading on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="mb-8 p-4 bg-muted/50 rounded-lg">
      <h2 className="text-sm font-semibold mb-3 text-foreground">Table of Contents</h2>
      <ul className="space-y-2 text-sm">
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            className={`${level === 3 ? 'ml-4' : ''}`}
          >
            <a
              href={`#${id}`}
              className={`hover:text-foreground transition-colors ${
                activeId === id ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

