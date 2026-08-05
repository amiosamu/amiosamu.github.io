"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Problem } from '@/lib/problems'

interface ProblemPaginationProps {
  previous?: Problem
  next?: Problem
}

/** Prev/next within the category, also bound to the arrow keys. */
export function ProblemPagination({ previous, next }: ProblemPaginationProps) {
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      if (event.key === 'ArrowLeft' && previous) {
        router.push(`/dsa/${previous.slug}/`)
      }
      if (event.key === 'ArrowRight' && next) {
        router.push(`/dsa/${next.slug}/`)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previous, next, router])

  if (!previous && !next) {
    return null
  }

  return (
    <nav className="mt-16 pt-8 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {previous ? (
          <Link
            href={`/dsa/${previous.slug}/`}
            className="group p-4 rounded-lg border border-border hover:border-foreground transition-colors"
            prefetch={true}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </div>
            <div className="font-medium group-hover:text-foreground transition-colors">
              {previous.name}
            </div>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/dsa/${next.slug}/`}
            className="group p-4 rounded-lg border border-border hover:border-foreground transition-colors text-right"
            prefetch={true}
          >
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </div>
            <div className="font-medium group-hover:text-foreground transition-colors">
              {next.name}
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
