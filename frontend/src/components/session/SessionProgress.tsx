import { cn } from '@/lib/utils'

export interface SessionProgressProps {
  completed: number
  total: number
  correct?: number
  showDetails?: boolean
  className?: string
}

const SessionProgress = ({
  completed,
  total,
  correct,
  showDetails = false,
  className,
}: SessionProgressProps) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const accuracy = completed > 0 && correct !== undefined
    ? Math.round((correct / completed) * 100)
    : null

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Progress bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Text details */}
      {showDetails ? (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            {completed} / {total} problems
          </span>
          {accuracy !== null && (
            <span className={cn(
              'font-semibold',
              accuracy >= 90 ? 'text-success' :
              accuracy >= 70 ? 'text-warning' :
              'text-error'
            )}>
              {accuracy}% correct
            </span>
          )}
        </div>
      ) : (
        <div className="text-center text-sm font-medium text-gray-700">
          {completed} / {total}
        </div>
      )}
    </div>
  )
}

export default SessionProgress
