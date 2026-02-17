import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CarryTransitionModalProps {
  show: boolean
  onDismiss: () => void
}

/**
 * CarryTransitionModal - One-time modal shown when transitioning from
 * automatic carries to manual carry entry mode.
 *
 * Explains to the child that they now need to enter carry digits themselves.
 */
export default function CarryTransitionModal({ show, onDismiss }: CarryTransitionModalProps) {
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
              You have been doing amazing with carrying numbers! Now it is time to practice entering the carry yourself.
            </p>

            {/* Visual example */}
            <div className="bg-blue-50 rounded-xl p-4 mb-4 w-full">
              <p className="text-sm text-gray-500 mb-3 font-medium">Here is how it works:</p>
              <div className="flex flex-col items-end font-mono text-lg font-bold mx-auto w-fit">
                {/* Carry row */}
                <div className="flex gap-1 mb-0.5">
                  <div className="w-8 text-center" />
                  <div className="w-8 text-center text-xs text-red-500 font-bold">
                    <span className="inline-block bg-red-50 border border-red-200 rounded px-1">1</span>
                  </div>
                  <div className="w-8 text-center" />
                </div>
                {/* Operand 1 */}
                <div className="flex gap-1">
                  <div className="w-8 text-center" />
                  <div className="w-8 text-center">4</div>
                  <div className="w-8 text-center">7</div>
                </div>
                {/* Operand 2 */}
                <div className="flex gap-1 items-center">
                  <div className="w-8 text-center text-primary">+</div>
                  <div className="w-8 text-center">3</div>
                  <div className="w-8 text-center">5</div>
                </div>
                {/* Divider */}
                <div className="w-full h-0.5 bg-primary my-1" />
                {/* Answer */}
                <div className="flex gap-1">
                  <div className="w-8 text-center" />
                  <div className="w-8 text-center">8</div>
                  <div className="w-8 text-center">2</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Tap the small box above each column to enter the carry number
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
