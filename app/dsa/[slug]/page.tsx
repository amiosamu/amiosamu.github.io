import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import {
  getAdjacentProblems,
  getCategorySiblings,
  getPageSlugs,
  getProblemBySlug,
} from '@/lib/problems'
import { DifficultyBadge } from '@/components/difficulty-badge'
import { ProblemRail } from '@/components/problem-rail'
import { ProblemPagination } from '@/components/problem-pagination'
import { BackToTop } from '@/components/back-to-top'
import SolutionContent from './solution-content'

export async function generateStaticParams() {
  return getPageSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const problem = getProblemBySlug(params.slug)

  if (!problem) {
    return {}
  }

  return {
    title: `${problem.name} - amiosamu`,
    description: problem.pattern || `${problem.difficulty} · ${problem.category}`,
  }
}

export default function ProblemPage({ params }: { params: { slug: string } }) {
  const problem = getProblemBySlug(params.slug)

  if (!problem) {
    notFound()
  }

  const siblings = getCategorySiblings(params.slug)
  const { previous, next } = getAdjacentProblems(params.slug)

  return (
    <>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <Link
          href="/dsa/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to problems
        </Link>

        <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
          <ProblemRail
            problems={siblings}
            currentSlug={problem.slug}
            category={problem.category}
          />

          <article className="min-w-0">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-3">{problem.name}</h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <DifficultyBadge difficulty={problem.difficulty} />
                <Link
                  href={`/dsa/#${problem.categorySlug}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {problem.category}
                </Link>
                <span className="h-4 w-px bg-border" aria-hidden="true" />
                <a
                  href={problem.neetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  NeetCode <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {(problem.pattern ||
                problem.time ||
                problem.space ||
                problem.nextReview ||
                problem.retired) && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  {problem.pattern && (
                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      {problem.pattern}
                    </span>
                  )}
                  {problem.time && (
                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      time <span className="font-mono text-foreground">{problem.time}</span>
                    </span>
                  )}
                  {problem.space && (
                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      space <span className="font-mono text-foreground">{problem.space}</span>
                    </span>
                  )}
                  {problem.retired ? (
                    <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                      re-solved {problem.reviewCount}× · retired
                    </span>
                  ) : (
                    problem.nextReview && (
                      <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                        {problem.reviewCount > 0 && `re-solved ${problem.reviewCount}× · `}
                        next{' '}
                        <span className="font-mono text-foreground">{problem.nextReview}</span>
                      </span>
                    )
                  )}
                  {problem.revisit && (
                    <span className="rounded-full bg-muted px-3 py-1 text-amber-700 dark:text-amber-400">
                      flagged for revisit
                    </span>
                  )}
                </div>
              )}
            </header>

            <SolutionContent content={problem.content} />

            <ProblemPagination previous={previous} next={next} />
          </article>
        </div>
      </div>

      <BackToTop />
    </>
  )
}
