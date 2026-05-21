import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RegroupTransitionModalProps {
  show: boolean
  onDismiss: () => void
}

/**
 * RegroupTransitionModal - One-time modal shown when subtraction-with-borrow
 * transitions from automatic regroup demonstrations to manual regroup entry.
 *
 * Mirrors CarryTransitionModal for addition. The pedagogical pattern:
 * before this point the regroup (slash on tens + "1" beside ones) animates
 * in automatically when the child taps a column needing it. After this point
 * the child must tap each target themselves to perform the regroup.
 */
export default function RegroupTransitionModal({ show, onDismiss }: RegroupTransitionModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal content */}
          <motion.div
            className={cn(
              'relative z-10 w-full max-w-sm',
              'bg-white rounded-3xl shadow-2xl p-6',
              'flex flex-col items-center text-center'
            )}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Star icon */}
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <span className="text-3xl">&#11088;</span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Great Progress!
            </h2>

            <p className="text-gray-600 mb-4 leading-relaxed">
              You have been doing amazing with regrouping! Now it is time to do the regrouping yourself.
            </p>

            {/* Visual example: 43 - 18 with regroup annotations */}
            <div className="bg-amber-50 rounded-xl p-4 mb-4 w-full">
              <p className="text-sm text-gray-500 mb-3 font-medium">Here is how it works:</p>
              <div className="flex flex-col items-end font-mono text-lg font-bold mx-auto w-fit">
                {/* Replacement-digit row (above the donor "4") */}
                <div className="flex gap-1 mb-0.5">
                  <div className="w-8 text-center" />
                  <div className="w-8 text-center text-xs text-amber-600 font-bold">
                    <span className="inline-block bg-amber-50 border border-amber-300 rounded px-1">3</span>
                  </div>
                  <div className="w-8 text-center text-xs text-amber-600 font-bold">
                    <span className="inline-block bg-amber-50 border border-amber-300 rounded px-1">1</span>
                  </div>
                </div>
                {/* Top operand with strike on the "4" */}
                <div className="flex gap-1">
                  <div className="w-8 text-center" />
                  <div className="w-8 text-center relative">
                    <span className="text-gray-400">4</span>
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="block w-6 h-0.5 bg-amber-600 rotate-[-25deg]" />
                    </span>
                  </div>
                  <div className="w-8 text-center">3</div>
                </div>
                {/* Bottom operand */}
                <div className="flex gap-1 items-center">
                  <div className="w-8 text-center text-primary">−</div>
                  <div className="w-8 text-center">1</div>
                  <div className="w-8 text-center">8</div>
                </div>
                {/* Divider */}
                <div className="w-full h-0.5 bg-primary my-1" />
                {/* Answer */}
                <div className="flex gap-1">
                  <div className="w-8 text-center" />
                  <div className="w-8 text-center">2</div>
                  <div className="w-8 text-center">5</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Tap the top digit to cross it out. Tap above the next column to add the 10.
              </p>
            </div>

            <button
              onClick={onDismiss}
              className={cn(
                'w-full py-3 rounded-2xl font-bold text-lg text-white',
                'bg-primary shadow-md transition-all duration-150',
                'hover:bg-primary/90 active:scale-[0.98]',
                'touch-manipulation select-none'
              )}
              type="button"
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
