/**
 * SessionControls Component
 *
 * Provides session management controls for children:
 * - End Session: Clears progress and starts fresh
 * - Save & Exit: Saves position (limited to 2x/day)
 *
 * Features:
 * - Shows remaining saves count
 * - Disabled state when no saves remaining
 * - Confirmation before ending session
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SessionControlsProps {
  /** Called when user wants to end session (after confirmation) */
  onEndSession: () => void
  /** Called when user wants to save progress and exit */
  onSaveProgress: () => void
  /** Number of saves remaining today (0, 1, or 2) */
  savesRemaining: number
  /** Whether save is possible (savesRemaining > 0) */
  canSave: boolean
  /** Whether save/end actions are in progress */
  isLoading?: boolean
  /** Optional className for container */
  className?: string
}

const SessionControls = ({
  onEndSession,
  onSaveProgress,
  savesRemaining,
  canSave,
  isLoading = false,
  className
}: SessionControlsProps) => {
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  const handleEndClick = () => {
    if (showEndConfirm) {
      // Already showing confirm, actually end
      setShowEndConfirm(false)
      onEndSession()
    } else {
      // Show confirmation
      setShowEndConfirm(true)
      // Auto-hide after 3 seconds if no action
      setTimeout(() => setShowEndConfirm(false), 3000)
    }
  }

  const handleSaveClick = () => {
    if (!canSave || isLoading) return
    onSaveProgress()
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* End Session Button */}
      <button
        onClick={handleEndClick}
        disabled={isLoading}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
          showEndConfirm
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        {showEndConfirm ? 'Confirm End?' : 'End Session'}
      </button>

      {/* Save & Exit Button */}
      <div className="relative">
        <button
          onClick={handleSaveClick}
          disabled={!canSave || isLoading}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
            canSave
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
          title={!canSave ? 'No saves remaining today' : `${savesRemaining} save${savesRemaining !== 1 ? 's' : ''} remaining`}
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            'Save & Exit'
          )}
        </button>

        {/* Saves remaining indicator */}
        <div className={cn(
          'absolute -bottom-5 left-0 right-0 text-center text-xs',
          savesRemaining === 0 ? 'text-red-500' : 'text-gray-500'
        )}>
          {savesRemaining === 0
            ? 'No saves left today'
            : `${savesRemaining} save${savesRemaining !== 1 ? 's' : ''} left`
          }
        </div>
      </div>
    </div>
  )
}

export default SessionControls
