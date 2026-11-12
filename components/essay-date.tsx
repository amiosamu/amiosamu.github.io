import { formatEssayDate } from '@/lib/essays'

export function EssayDate({ date }: { date?: string }) {
  const label = formatEssayDate(date)

  if (!label) return null

  return (
    <time dateTime={date} className="text-sm text-muted-foreground">
      {label}
    </time>
  )
}
