import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface MicroHintProps {
  /** Hint text to display */
  text: string
  /** Whether to show the hint */
  show: boolean
  /** Callback when hint is dismissed */
  onDismiss?: () => void
  /** Auto-dismiss after duration (default: 5000ms) */
  autoDismiss?: boolean
  /** Duration before auto-dismiss in milliseconds (default: 5000) */
  dismissAfter?: number
  /** Position relative to problem - inline shows under problem, toast shows at top */
  position?: 'inline' | 'toast'
  /** Additional className */
  className?: string
}

/**
 * MicroHint - First-level hint shown after 1st wrong answer
 *
 * A quick text hint displayed as a banner/toast.
 * - Yellow/amber background with lightbulb icon
 * - Auto-dismisses after 5 seconds OR user can click to dismiss
 * - Part of the 3-level graduated hint system
 */
export default function MicroHint({
  text,
  show,
  onDismiss,
  autoDismiss = true,
  dismissAfter = 5000,
  position = 'inline',
  className,
}: MicroHintProps) {
  const [isVisible, setIsVisible] = useState(show)

  // Use ref to store onDismiss to avoid re-running useEffect when parent re-renders
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    setIsVisible(show)

    if (show && autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onDismissRef.current?.()
      }, dismissAfter)

      return () => clearTimeout(timer)
    }
  }, [show, autoDismiss, dismissAfter])  // onDismiss removed - using ref instead

  const handleClick = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const isToast = position === 'toast'

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: isToast ? -20 : 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: isToast ? -20 : 10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            isToast ? 'fixed left-1/2 top-20 z-50 -translate-x-1/2' : 'w-full',
            className
          )}
        >
          <div
            onClick={handleClick}
            className={cn(
              'flex items-start gap-3 rounded-2xl px-4 py-3 shadow-md cursor-pointer',
              'bg-amber-100 border-2 border-amber-300',
              'hover:bg-amber-200 transition-colors',
              isToast ? 'max-w-md' : 'w-full'
            )}
            role="alert"
            aria-live="polite"
          >
            <span
              className="text-2xl flex-shrink-0 mt-0.5"
              role="img"
              aria-label="hint"
            >
              💡
            </span>
            <div className="flex-1">
              <p className="text-amber-900 font-medium text-base leading-relaxed">
                {text}
              </p>
              <p className="text-amber-700 text-xs mt-1">
                Tap to dismiss
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
