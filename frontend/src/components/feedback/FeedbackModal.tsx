import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import {
  submitFeedback,
  getCurrentContext,
  type FeedbackType,
  type FeedbackCategory,
  type FeedbackContext,
} from '@/services/feedbackService'
import FeedbackTypeSelector from './FeedbackTypeSelector'
import FeedbackDetailForm from './FeedbackDetailForm'
import FeedbackSuccess from './FeedbackSuccess'

export interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  /** Pre-populated context (e.g., from worksheet completion) */
  initialContext?: Partial<FeedbackContext>
  /** Pre-select a feedback type */
  initialType?: FeedbackType
  /** Current child ID if in child session */
  childId?: string
}

type ModalStep = 'select-type' | 'detail-form' | 'success'

export default function FeedbackModal({
  isOpen,
  onClose,
  initialContext,
  initialType,
  childId,
}: FeedbackModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<ModalStep>(initialType ? 'detail-form' : 'select-type')
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(initialType || null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTypeSelect = (type: FeedbackType) => {
    setSelectedType(type)
    setStep('detail-form')
  }

  const handleBack = () => {
    setStep('select-type')
    setSelectedType(null)
  }

  const handleSubmit = async (data: {
    category?: FeedbackCategory
    title: string
    description: string
    screenshotUrl?: string
  }) => {
    if (!selectedType) return

    setIsSubmitting(true)

    // Gather context
    const autoContext = getCurrentContext()
    const context: FeedbackContext = {
      ...autoContext,
      ...initialContext,
    }

    const result = await submitFeedback(
      {
        type: selectedType,
        category: data.category,
        title: data.title,
        description: data.description,
        screenshotUrl: data.screenshotUrl,
      },
      context,
      user?.id,
      childId
    )

    setIsSubmitting(false)

    if (result.success) {
      setStep('success')
    } else {
      // TODO: Show error toast
      console.error('Failed to submit feedback:', result.error)
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setStep(initialType ? 'detail-form' : 'select-type')
    setSelectedType(initialType || null)
    onClose()
  }

  const handleSuccessDone = () => {
    handleClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        // Modal Container - combines backdrop and flexbox centering for reliable mobile positioning
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'w-full max-w-md max-h-[85vh] overflow-hidden',
              'bg-white rounded-3xl shadow-2xl'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              {step === 'detail-form' && !initialType ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <span className="text-lg">←</span>
                  <span className="text-sm">Back</span>
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
              <AnimatePresence mode="wait">
                {step === 'select-type' && (
                  <motion.div
                    key="select-type"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <FeedbackTypeSelector onSelect={handleTypeSelect} />
                  </motion.div>
                )}

                {step === 'detail-form' && selectedType && (
                  <motion.div
                    key="detail-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <FeedbackDetailForm
                      type={selectedType}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      context={initialContext}
                    />
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <FeedbackSuccess onDone={handleSuccessDone} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
