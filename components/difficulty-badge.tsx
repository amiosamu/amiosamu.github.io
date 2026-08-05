import { Difficulty } from '@/lib/problems'
import { cn } from '@/lib/utils'

const difficultyClasses: Record<Difficulty, string> = {
  Easy: 'text-emerald-700 dark:text-emerald-400',
  Medium: 'text-amber-700 dark:text-amber-400',
  Hard: 'text-rose-700 dark:text-rose-400',
}

interface DifficultyBadgeProps {
  difficulty: Difficulty
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span className={cn('text-xs font-medium', difficultyClasses[difficulty], className)}>
      {difficulty}
    </span>
  )
}
