import { useState } from 'react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import {
  FEEDBACK_TYPES,
  CATEGORY_OPTIONS,
  type FeedbackType,
  type FeedbackCategory,
  type FeedbackContext,
} from '@/services/feedbackService'

export interface FeedbackDetailFormProps {
  type: FeedbackType
  onSubmit: (data: {
    category?: FeedbackCategory
    title: string
    description: string
    screenshotUrl?: string
  }) => void
  isSubmitting: boolean
  context?: Partial<FeedbackContext>
}

export default function FeedbackDetailForm({
  type,
  onSubmit,
  isSubmitting,
  context,
}: FeedbackDetailFormProps) {
  const [category, setCategory] = useState<FeedbackCategory | ''>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const feedbackTypeInfo = FEEDBACK_TYPES.find((t) => t.type === type)
  const categoryOptions = CATEGORY_OPTIONS[type]

  const isValid = title.trim().length > 0 && description.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    onSubmit({
      category: category || undefined,
      title: title.trim(),
      description: description.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <span>{feedbackTypeInfo?.icon}</span>
          <span>{feedbackTypeInfo?.title}</span>
        </h2>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-6" />

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Category Select */}
        <div>
          <label
            htmlFor="feedback-category"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Category
          </label>
          <select
            id="feedback-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'border-2 border-gray-200',
              'text-gray-900 bg-white',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
              'transition-colors'
            )}
          >
            <option value="">Select a category...</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Title Input */}
        <div>
          <label
            htmlFor="feedback-title"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Brief Summary <span className="text-error">*</span>
          </label>
          <input
            id="feedback-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              type === 'qa_issue'
                ? 'e.g., "Wrong answer marked correct"'
                : type === 'enhancement'
                ? 'e.g., "Add dark mode support"'
                : 'e.g., "Problem too difficult for level"'
            }
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'border-2 border-gray-200',
              'text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
              'transition-colors'
            )}
            required
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label
            htmlFor="feedback-description"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Tell us more <span className="text-error">*</span>
          </label>
          <textarea
            id="feedback-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe in detail..."
            rows={4}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'border-2 border-gray-200',
              'text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
              'transition-colors resize-none'
            )}
            required
          />
        </div>

        {/* Context Info (if available) */}
        {context && (context.currentLevel || context.currentWorksheet) && (
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <span>Context auto-captured:</span>
              {context.currentLevel && (
                <span className="font-medium">Level: {context.currentLevel}</span>
              )}
              {context.currentLevel && context.currentWorksheet && <span>•</span>}
              {context.currentWorksheet && (
                <span className="font-medium">Worksheet: {context.currentWorksheet}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
          className="w-full"
        >
          Submit Feedback
        </Button>
      </div>
    </form>
  )
}
