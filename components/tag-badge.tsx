import Link from 'next/link'

interface TagBadgeProps {
  tag: string
  count?: number
  size?: 'sm' | 'md'
}

export function TagBadge({ tag, count, size = 'sm' }: TagBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
  
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}/`}
      className={`inline-flex items-center gap-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors ${sizeClasses}`}
    >
      <span>#{tag}</span>
      {count !== undefined && <span className="text-muted-foreground">({count})</span>}
    </Link>
  )
}



