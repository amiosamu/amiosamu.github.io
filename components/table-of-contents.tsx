"use client"

import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/toc-utils'

interface TableOfContentsProps {
  headings: TocItem[]
  contentId: string
}

interface TocGroup {
  heading: TocItem
  children: TocItem[]
}

function groupHeadings(headings: TocItem[]): TocGroup[] {
  return headings.reduce<TocGroup[]>((groups, heading) => {
    const parent = groups.at(-1)

    if (heading.level === 3 && parent?.heading.level === 2) {
      parent.children.push(heading)
    } else {
      groups.push({ heading, children: [] })
    }

    return groups
  }, [])
}

function TocLink({
  item,
  activeId,
  nested = false,
}: {
  item: TocItem
  activeId: string
  nested?: boolean
}) {
  const isActive = item.id === activeId

  return (
    <a
      href={`#${item.id}`}
      aria-current={isActive ? 'location' : undefined}
      className={`block rounded-sm border-l-2 py-1 pr-2 leading-snug transition-colors [overflow-wrap:anywhere] ${
        nested ? 'pl-4 text-xs' : 'pl-3 text-sm'
      } ${
        isActive
          ? 'border-primary bg-accent font-medium text-accent-foreground'
          : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
      }`}
    >
      {item.text}
    </a>
  )
}

function TocLinks({ headings, activeId }: { headings: TocItem[]; activeId: string }) {
  return (
    <ol className="space-y-1">
      {groupHeadings(headings).map(({ heading, children }) => (
        <li key={heading.id}>
          <TocLink item={heading} activeId={activeId} nested={heading.level === 3} />
          {children.length > 0 && (
            <ol className="ml-3 mt-1 space-y-1 border-l border-border/70">
              {children.map((child) => (
                <li key={child.id} className="-ml-px">
                  <TocLink item={child} activeId={activeId} nested />
                </li>
              ))}
            </ol>
          )}
        </li>
      ))}
    </ol>
  )
}

function ReadingProgress({ progress }: { progress: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
        <span>Reading Progress</span>
        <span aria-hidden="true">{progress}%</span>
      </div>
      <div
        className="h-1 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-valuetext={`${progress}% read`}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export function TableOfContents({ headings, contentId }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (headings.length === 0) return

    const contentElement = document.getElementById(contentId)
    const headingElements = headings.flatMap(({ id }) => {
      const element = document.getElementById(id)
      return element ? [element] : []
    })
    let animationFrame = 0

    const update = () => {
      animationFrame = 0

      if (headingElements.length > 0) {
        let currentId = headingElements[0].id

        for (const heading of headingElements) {
          if (heading.getBoundingClientRect().top > 112) break
          currentId = heading.id
        }

        setActiveId(currentId)
      }

      if (contentElement) {
        const contentTop = contentElement.getBoundingClientRect().top + window.scrollY
        const start = contentTop - 112
        const end = contentTop + contentElement.offsetHeight - window.innerHeight
        const distance = Math.max(end - start, 1)
        const nextProgress = Math.round(
          Math.min(1, Math.max(0, (window.scrollY - start) / distance)) * 100
        )

        setProgress(nextProgress)
      }
    }

    const requestUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(update)
      }
    }

    const resizeObserver = contentElement ? new ResizeObserver(requestUpdate) : null
    if (contentElement) resizeObserver?.observe(contentElement)

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      resizeObserver?.disconnect()
      if (animationFrame !== 0) window.cancelAnimationFrame(animationFrame)
    }
  }, [contentId, headings])

  if (headings.length === 0) return null

  return (
    <>
      <aside className="hidden min-w-0 lg:block" aria-label="Essay navigation">
        <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain rounded-lg border bg-muted/20 p-4">
          <ReadingProgress progress={progress} />
          <div className="my-4 border-t" />
          <nav aria-label="On this page">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
              On This Page
            </p>
            <TocLinks headings={headings} activeId={activeId} />
          </nav>
        </div>
      </aside>

      <div className="mb-8 rounded-lg border bg-muted/20 p-4 lg:hidden">
        <ReadingProgress progress={progress} />
        <details className="mt-4 border-t pt-3">
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            On This Page
          </summary>
          <nav aria-label="On this page" className="mt-3 max-h-64 overflow-y-auto pr-1">
            <TocLinks headings={headings} activeId={activeId} />
          </nav>
        </details>
      </div>
    </>
  )
}
