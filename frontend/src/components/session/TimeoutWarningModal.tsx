/**
 * TimeoutWarningModal Component
 *
 * Shows a warning when the user has been idle for too long.
 * Displays a countdown and allows user to continue or end session.
 *
 * Features:
 * - Animated countdown timer
 * - Friendly messaging for children
 * - Continue and End Session options
 * - Auto-focuses Continue button for quick action
 */

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TimeoutWarningModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Seconds remaining until auto-timeout */
  remainingSeconds: number
  /** Called when user clicks "I'm still here!" */
  onContinue: () => void
  /** Called when user clicks "End Session" */
  onEnd: () => void
}

const TimeoutWarningModal = ({
  isOpen,
  remainingSeconds,
  onContinue,
  onEnd
}: TimeoutWarningModalProps) => {
  const continueButtonRef = useRef<HTMLButtonElement>(null)

  // Auto-focus continue button when modal opens
  useEffect(() => {
    if (isOpen && continueButtonRef.current) {
      continueButtonRef.current.focus()
    }
  }, [isOpen])

  // Format seconds as M:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  // Calculate urgency level for styling
  const isUrgent = remainingSeconds <= 60 // Last minute
  const isCritical = remainingSeconds <= 30 // Last 30 seconds

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onContinue} // Clicking backdrop = continue
      />

      {/* Modal */}
      <div className={cn(
        'relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl',
        'transform transition-all duration-300',
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      )}>
        {/* Icon */}
        <div className={cn(
          'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center',
          'text-5xl',
          isCritical ? 'bg-red-100 animate-pulse' : isUrgent ? 'bg-yellow-100' : 'bg-blue-100'
        )}>
          {isCritical ? '😱' : isUrgent ? '😮' : '🤔'}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Are you still there?
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {isCritical
            ? "Your session will end very soon!"
            : isUrgent
            ? "Don't forget about your math practice!"
            : "It looks like you've been away for a while."
          }
        </p>

        {/* Countdown */}
        <div className={cn(
          'text-center py-4 px-6 rounded-xl mb-6',
          isCritical ? 'bg-red-50' : isUrgent ? 'bg-yellow-50' : 'bg-gray-50'
        )}>
          <p className="text-sm text-gray-500 mb-1">Session will end in</p>
          <p className={cn(
            'text-4xl font-bold font-mono',
            isCritical ? 'text-red-600 animate-pulse' : isUrgent ? 'text-yellow-600' : 'text-gray-900'
          )}>
            {formatTime(remainingSeconds)}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            ref={continueButtonRef}
            onClick={onContinue}
            className={cn(
              'w-full py-3 px-6 rounded-xl font-semibold text-lg',
              'bg-green-500 text-white hover:bg-green-600',
              'transform transition-all hover:scale-[1.02] active:scale-[0.98]',
              'focus:outline-none focus:ring-4 focus:ring-green-300'
            )}
          >
            I'm still here! ✋
          </button>

          <button
            onClick={onEnd}
            className={cn(
              'w-full py-2 px-6 rounded-xl font-medium',
              'bg-gray-100 text-gray-600 hover:bg-gray-200',
              'transition-colors'
            )}
          >
            End Session
          </button>
        </div>

        {/* Helper text */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Tip: Click anywhere or press any key to continue
        </p>
      </div>
    </div>
  )
}

export default TimeoutWarningModal
