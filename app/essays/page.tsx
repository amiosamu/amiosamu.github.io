import { getAllEssaysMetadata } from '@/lib/essays'
import Link from 'next/link'
import { TagBadge } from '@/components/tag-badge'

export default function EssaysPage() {
  const essays = getAllEssaysMetadata()

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Essays</h1>
      
      {essays.length === 0 ? (
        <p className="text-muted-foreground">No essays yet. Check back soon!</p>
      ) : (
        <div className="space-y-8">
          {essays.map((essay) => (
            <article key={essay.slug} className="space-y-2">
              <Link 
                href={`/essays/${essay.slug}/`}
                className="group"
                prefetch={true}
              >
                <h2 className="text-xl font-semibold group-hover:underline">
                  {essay.title}
                </h2>
              </Link>
              {essay.date && (
                <p className="text-sm text-muted-foreground">
                  {new Date(essay.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
              {essay.description && (
                <p className="text-muted-foreground">{essay.description}</p>
              )}
              {essay.tags && essay.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {essay.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

