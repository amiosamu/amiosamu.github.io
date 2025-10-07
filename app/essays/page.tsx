import { getAllEssays } from '@/lib/essays'
import Link from 'next/link'

export default function EssaysPage() {
  const essays = getAllEssays()

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
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

