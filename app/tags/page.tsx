import { getAllTags } from '@/lib/essays'
import { TagBadge } from '@/components/tag-badge'

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Tags</h1>
      <p className="text-muted-foreground mb-8">
        Browse essays by topic
      </p>
      
      {tags.length === 0 ? (
        <p className="text-muted-foreground">No tags yet.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <TagBadge key={tag} tag={tag} count={count} size="md" />
          ))}
        </div>
      )}
    </div>
  )
}



