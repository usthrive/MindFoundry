import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RegroupGraduationModalProps {
  show: boolean
  onDismiss: () => void
}

/**
 * RegroupGraduationModal — fires once when the child first enters 'optional'
 * regroup mode (worksheet 131 of Level B, after 4 manual-mode worksheets).
 *
 * Celebrates the transition: from "tap to regroup" → "you've got it, just
 * write the answer". Pedagogically the goal is to signal that the helpers
 * are no longer required — they can do this in their head now.
 */
export default function RegroupGraduationModal({ show, onDismiss }: RegroupGraduationModalProps) {
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
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

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
            {/* Trophy/grad icon */}
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <span className="text-3xl">&#127881;</span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              You've got it!
            </h2>

            <p className="text-gray-600 mb-4 leading-relaxed">
              You don't need the tapping boxes anymore. From here on, just write the answer — you can do the regrouping in your head.
            </p>

            {/* Visual: before and after */}
            <div className="bg-amber-50 rounded-xl p-4 mb-4 w-full">
              <div className="grid grid-cols-2 gap-3 text-center">
                {/* Before */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium">Before</p>
                  <div className="flex flex-col items-end font-mono text-sm font-bold mx-auto w-fit">
                    <div className="flex gap-1">
                      <div className="w-6 text-center" />
                      <div className="w-6 text-center relative">
                        <span className="text-gray-400">4</span>
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="block w-4 h-0.5 bg-amber-600 rotate-[-25deg]" />
                        </span>
                      </div>
                      <div className="w-6 text-center relative">
                        <span className="text-gray-400">3</span>
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="block w-4 h-0.5 bg-amber-600 rotate-[-25deg]" />
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-6 text-center" />
                      <div className="w-6 text-center text-amber-600">3</div>
                      <div className="w-6 text-center text-amber-600 inline-flex items-baseline justify-center">
                        <span className="text-[0.55em] leading-none mr-0.5">1</span>
                        <span>3</span>
                      </div>
                    </div>
                    <div className="flex gap-1 items-center">
                      <div className="w-6 text-center text-primary">−</div>
                      <div className="w-6 text-center">1</div>
                      <div className="w-6 text-center">8</div>
                    </div>
                    <div className="w-full h-0.5 bg-primary my-0.5" />
                    <div className="flex gap-1">
                      <div className="w-6 text-center" />
                      <div className="w-6 text-center">2</div>
                      <div className="w-6 text-center">5</div>
                    </div>
                  </div>
                </div>
                {/* After */}
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium">Now</p>
                  <div className="flex flex-col items-end font-mono text-sm font-bold mx-auto w-fit">
                    <div className="flex gap-1">
                      <div className="w-6 text-center" />
                      <div className="w-6 text-center">4</div>
                      <div className="w-6 text-center">3</div>
                    </div>
                    <div className="flex gap-1 items-center">
                      <div className="w-6 text-center text-primary">−</div>
                      <div className="w-6 text-center">1</div>
                      <div className="w-6 text-center">8</div>
                    </div>
                    <div className="w-full h-0.5 bg-primary my-0.5" />
                    <div className="flex gap-1">
                      <div className="w-6 text-center" />
                      <div className="w-6 text-center text-green-600">2</div>
                      <div className="w-6 text-center text-green-600">5</div>
                    </div>
                  </div>
                </div>
              </div>
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
              Let's go!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
