"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { Category, Difficulty, Problem } from '@/lib/problems'
import { DifficultyBadge } from '@/components/difficulty-badge'
import { cn } from '@/lib/utils'

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']
type StatusFilter = 'all' | 'solved' | 'unsolved' | 'due'

// Local calendar date, not UTC — "due today" should mean the user's today.
function localToday(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

interface ProblemBrowserProps {
  problems: Problem[]
  categories: Category[]
}

export default function ProblemBrowser({ problems, categories }: ProblemBrowserProps) {
  const [query, setQuery] = useState('')
  const [difficulties, setDifficulties] = useState<Set<Difficulty>>(new Set())
  const [status, setStatus] = useState<StatusFilter>('all')
  const [activeCategory, setActiveCategory] = useState<string>('')
  // Resolved after mount: the page is statically exported, so a build-time
  // "today" would go stale. Empty until then, which keeps hydration consistent.
  const [today, setToday] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setToday(localToday())
  }, [])

  const solvedCount = useMemo(() => problems.filter((p) => p.solved).length, [problems])

  const dueSlugs = useMemo(() => {
    if (!today) return new Set<string>()
    return new Set(
      problems
        .filter(
          (problem) =>
            problem.solved &&
            (problem.revisit || (problem.nextReview !== undefined && problem.nextReview <= today))
        )
        .map((problem) => problem.slug)
    )
  }, [problems, today])

  const difficultyCounts = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 } as Record<Difficulty, number>
    problems.forEach((problem) => {
      counts[problem.difficulty] += 1
    })
    return counts
  }, [problems])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return problems.filter((problem) => {
      if (difficulties.size > 0 && !difficulties.has(problem.difficulty)) return false
      if (status === 'solved' && !problem.solved) return false
      if (status === 'unsolved' && problem.solved) return false
      if (status === 'due' && !dueSlugs.has(problem.slug)) return false
      if (!needle) return true
      return (
        problem.name.toLowerCase().includes(needle) ||
        problem.slug.includes(needle) ||
        problem.category.toLowerCase().includes(needle) ||
        (problem.pattern?.toLowerCase().includes(needle) ?? false)
      )
    })
  }, [problems, query, difficulties, status, dueSlugs])

  // Keep catalog order inside each category, and drop categories with no matches.
  const grouped = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        items: filtered.filter((problem) => problem.categorySlug === category.slug),
      }))
      .filter((group) => group.items.length > 0)
  }, [categories, filtered])

  // "/" focuses search from anywhere on the page.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
      if (event.key === '/' && !typing) {
        event.preventDefault()
        searchRef.current?.focus()
      }
      if (event.key === 'Escape' && typing) {
        setQuery('')
        searchRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Highlight the category the reader is currently scrolled to.
  useEffect(() => {
    const sections = grouped
      .map((group) => document.getElementById(group.category.slug))
      .filter((element): element is HTMLElement => element !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) {
          setActiveCategory(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [grouped])

  function toggleDifficulty(difficulty: Difficulty) {
    setDifficulties((current) => {
      const next = new Set(current)
      if (next.has(difficulty)) {
        next.delete(difficulty)
      } else {
        next.add(difficulty)
      }
      return next
    })
  }

  const percent = problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">DSA</h1>
        <p className="text-muted-foreground">
          My solutions to the NeetCode 250, with the reasoning that got me there.
        </p>
      </header>

      <div className="mb-8 space-y-2">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{solvedCount}</span> of {problems.length} solved
          </span>
          <span className="text-muted-foreground">{percent}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-foreground transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-background/95 backdrop-blur border-b border-border mb-8 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search problems…  (press / to focus)"
            className="w-full rounded-lg border border-input bg-background pl-9 pr-9 py-2 text-sm outline-none focus:border-foreground transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DIFFICULTIES.map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              onClick={() => toggleDifficulty(difficulty)}
              aria-pressed={difficulties.has(difficulty)}
              className={cn(
                'rounded-full px-3 py-1 text-xs border transition-colors',
                difficulties.has(difficulty)
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
              )}
            >
              {difficulty}
              <span className="ml-1.5 opacity-60">{difficultyCounts[difficulty]}</span>
            </button>
          ))}

          <span className="mx-1 h-4 w-px bg-border" aria-hidden="true" />

          {(['all', 'solved', 'unsolved', 'due'] as StatusFilter[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              aria-pressed={status === value}
              className={cn(
                'rounded-full px-3 py-1 text-xs border transition-colors capitalize',
                status === value
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
              )}
            >
              {value}
              {value === 'due' && dueSlugs.size > 0 && (
                <span className="ml-1.5 opacity-60">{dueSlugs.size}</span>
              )}
            </button>
          ))}

          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} shown
          </span>
        </div>
      </div>

      {dueSlugs.size > 0 && status !== 'due' && (
        <button
          type="button"
          onClick={() => setStatus('due')}
          className="w-full mb-8 flex items-center justify-between gap-4 rounded-lg border border-border hover:border-foreground transition-colors px-4 py-3 text-left"
        >
          <span className="text-sm">
            <span className="font-medium">{dueSlugs.size}</span>{' '}
            {dueSlugs.size === 1 ? 'problem is' : 'problems are'} due for a re-solve
          </span>
          <span className="text-xs text-muted-foreground shrink-0">Show</span>
        </button>
      )}

      <div className="lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10">
        <nav className="hidden lg:block" aria-label="Categories">
          <ul className="sticky top-32 space-y-1 text-sm">
            {categories.map((category) => {
              const visible = grouped.some((group) => group.category.slug === category.slug)
              return (
                <li key={category.slug}>
                  <a
                    href={`#${category.slug}`}
                    className={cn(
                      'flex items-baseline justify-between gap-2 rounded px-2 py-1 transition-colors',
                      !visible && 'opacity-40',
                      activeCategory === category.slug
                        ? 'bg-muted text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span className="truncate">{category.name}</span>
                    <span className="text-xs shrink-0 opacity-70">
                      {category.solved}/{category.count}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="min-w-0">
          {grouped.length === 0 ? (
            <p className="text-muted-foreground py-8">No problems match those filters.</p>
          ) : (
            <div className="space-y-10">
              {grouped.map(({ category, items }) => (
                <section key={category.slug} id={category.slug} className="scroll-mt-32">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h2 className="text-lg font-semibold">{category.name}</h2>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {category.solved}/{category.count}
                    </span>
                  </div>
                  <ul>
                    {items.map((problem) => (
                      <ProblemRow
                        key={problem.slug}
                        problem={problem}
                        due={dueSlugs.has(problem.slug)}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProblemRow({ problem, due }: { problem: Problem; due: boolean }) {
  return (
    <li className="flex items-baseline gap-3 py-2 border-b border-border/50 group">
      <DifficultyBadge difficulty={problem.difficulty} className="w-14 shrink-0" />

      <div className="min-w-0 flex-1 flex flex-wrap items-baseline gap-x-2">
        {problem.linkable ? (
          <Link
            href={`/dsa/${problem.slug}/`}
            className={cn('hover:underline', problem.solved ? 'font-medium' : 'text-muted-foreground')}
          >
            {problem.name}
          </Link>
        ) : (
          <span className="text-muted-foreground">{problem.name}</span>
        )}
        {problem.hasFile && !problem.solved && (
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70 border border-border rounded px-1">
            draft
          </span>
        )}
        {due && (
          <span className="text-[10px] uppercase tracking-wide text-amber-700 dark:text-amber-400 border border-current/40 rounded px-1">
            due
          </span>
        )}
        {problem.pattern && (
          <span className="text-sm text-muted-foreground truncate">— {problem.pattern}</span>
        )}
      </div>

      <a
        href={problem.neetcodeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
        title={`${problem.name} on NeetCode`}
      >
        NC
      </a>
    </li>
  )
}
