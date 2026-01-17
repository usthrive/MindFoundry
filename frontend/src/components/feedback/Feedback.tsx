import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export type FeedbackType = 'success' | 'incorrect' | 'hint' | 'encouragement'

export interface FeedbackProps {
  type: FeedbackType
  message: string
  show: boolean
  onDismiss?: () => void
  autoDismiss?: boolean
  dismissAfter?: number // milliseconds
}

const Feedback = ({
  type,
  message,
  show,
  onDismiss,
  autoDismiss = true,
  dismissAfter = 2000,
}: FeedbackProps) => {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)

    if (show && autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, dismissAfter)

      return () => clearTimeout(timer)
    }
  }, [show, autoDismiss, dismissAfter, onDismiss])

  const variants = {
    success: {
      bg: 'bg-success',
      icon: '⭐',
      textColor: 'text-white',
    },
    incorrect: {
      bg: 'bg-error',
      icon: '🤔',
      textColor: 'text-white',
    },
    hint: {
      bg: 'bg-warning',
      icon: '💡',
      textColor: 'text-gray-900',
    },
    encouragement: {
      bg: 'bg-primary',
      icon: '👍',
      textColor: 'text-white',
    },
  }

  const config = variants[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed left-1/2 top-20 z-50 -translate-x-1/2"
        >
          <div
            className={cn(
              'flex items-center gap-3 rounded-3xl px-6 py-4 shadow-lg',
              config.bg
            )}
          >
            <span className="text-3xl" role="img" aria-label={type}>
              {config.icon}
            </span>
            <p className={cn('text-lg font-semibold whitespace-pre-line text-center', config.textColor)}>
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Feedback
