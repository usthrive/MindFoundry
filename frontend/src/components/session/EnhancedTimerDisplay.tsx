/**
 * EnhancedTimerDisplay Component
 *
 * Displays the enhanced timer with focus tracking information.
 * Shows total time, and optionally shows focus score when there's been away time.
 */

import { cn } from '@/lib/utils'

export interface EnhancedTimerDisplayProps {
  focusedTime: number      // Seconds when app was visible
  awayTime: number         // Seconds when app was hidden
  totalTime: number        // focusedTime + awayTime
  focusScore: number       // Percentage (0-100)
  isPaused: boolean        // Whether timer is currently paused
  distractionCount: number // Number of distractions
  className?: string
  showFocusScore?: boolean // Whether to show focus score (default: true when awayTime > 0)
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const EnhancedTimerDisplay = ({
  focusedTime: _focusedTime,
  awayTime,
  totalTime,
  focusScore,
  isPaused,
  distractionCount,
  className,
  showFocusScore = awayTime > 0
}: EnhancedTimerDisplayProps) => {
  // Determine focus score color
  const getFocusScoreColor = () => {
    if (focusScore >= 90) return 'text-green-600'
    if (focusScore >= 70) return 'text-yellow-600'
    return 'text-orange-600'
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Main timer display */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{isPaused ? '⏸️' : '⏱️'}</span>
        <span className="font-mono text-xl font-semibold tabular-nums text-gray-900">
          {formatTime(totalTime)}
        </span>
      </div>

      {/* Focus score indicator (only shown when there's been away time) */}
      {showFocusScore && (
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
          <span className="text-sm">🎯</span>
          <span className={cn('text-sm font-medium', getFocusScoreColor())}>
            {focusScore}%
          </span>
          {distractionCount > 0 && (
            <span className="text-xs text-gray-500 ml-1">
              ({distractionCount} break{distractionCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default EnhancedTimerDisplay
