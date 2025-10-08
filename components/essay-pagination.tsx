import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { EssayMetadata } from '@/lib/essays'

interface EssayPaginationProps {
  previousEssay?: EssayMetadata
  nextEssay?: EssayMetadata
}

export function EssayPagination({ previousEssay, nextEssay }: EssayPaginationProps) {
  if (!previousEssay && !nextEssay) {
    return null
  }

  return (
    <nav className="mt-16 pt-8 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {previousEssay ? (
          <Link
            href={`/essays/${previousEssay.slug}/`}
            className="group p-4 rounded-lg border border-border hover:border-foreground transition-colors"
            prefetch={true}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </div>
            <div className="font-medium group-hover:text-foreground transition-colors">
              {previousEssay.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        
        {nextEssay ? (
          <Link
            href={`/essays/${nextEssay.slug}/`}
            className="group p-4 rounded-lg border border-border hover:border-foreground transition-colors text-right"
            prefetch={true}
          >
            <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </div>
            <div className="font-medium group-hover:text-foreground transition-colors">
              {nextEssay.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}

