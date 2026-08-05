import Link from 'next/link'
import { Problem } from '@/lib/problems'
import { cn } from '@/lib/utils'

interface ProblemRailProps {
  problems: Problem[]
  currentSlug: string
  category: string
}

/** Sticky in-category list shown alongside a solution, so siblings stay one click away. */
export function ProblemRail({ problems, currentSlug, category }: ProblemRailProps) {
  if (problems.length === 0) {
    return null
  }

  return (
    <nav className="hidden lg:block" aria-label={`${category} problems`}>
      <div className="sticky top-8">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
          {category}
        </p>
        <ul className="space-y-1 text-sm border-l border-border">
          {problems.map((problem) => {
            const isCurrent = problem.slug === currentSlug

            if (isCurrent) {
              return (
                <li key={problem.slug} className="-ml-px border-l-2 border-foreground pl-3 py-0.5">
                  <span className="font-medium" aria-current="page">
                    {problem.name}
                  </span>
                </li>
              )
            }

            return (
              <li key={problem.slug} className="pl-3 py-0.5">
                {problem.linkable ? (
                  <Link
                    href={`/dsa/${problem.slug}/`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {problem.name}
                  </Link>
                ) : (
                  <span
                    className={cn('text-muted-foreground/50')}
                    title="No writeup yet"
                  >
                    {problem.name}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
