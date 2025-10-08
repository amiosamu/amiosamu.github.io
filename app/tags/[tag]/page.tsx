import { getAllTags, getEssaysByTag } from '@/lib/essays'
import Link from 'next/link'
import { TagBadge } from '@/components/tag-badge'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map(({ tag }) => ({
    tag: encodeURIComponent(tag),
  }))
}

export async function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  
  return {
    title: `Essays tagged with "${tag}" - amiosamu`,
    description: `All essays about ${tag}`,
  }
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag)
  const essays = getEssaysByTag(tag)

  if (essays.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="mb-8">
        <Link 
          href="/tags/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
        >
          ← All tags
        </Link>
        <h1 className="text-3xl font-bold mb-2">
          Essays tagged with <span className="text-primary">#{tag}</span>
        </h1>
        <p className="text-muted-foreground">
          {essays.length} {essays.length === 1 ? 'essay' : 'essays'}
        </p>
      </div>
      
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
                {essay.tags.map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}



