import { cn } from '@/lib/utils'
import { FEEDBACK_TYPES, type FeedbackType } from '@/services/feedbackService'

export interface FeedbackTypeSelectorProps {
  onSelect: (type: FeedbackType) => void
}

export default function FeedbackTypeSelector({ onSelect }: FeedbackTypeSelectorProps) {
  return (
    <div className="p-6">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <span>Share Your Feedback</span>
        </h2>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-6" />

      {/* Subtitle */}
      <p className="text-gray-600 text-center mb-6">
        What would you like to share?
      </p>

      {/* Type Options */}
      <div className="space-y-3">
        {FEEDBACK_TYPES.map((feedbackType) => (
          <button
            key={feedbackType.type}
            onClick={() => onSelect(feedbackType.type)}
            className={cn(
              'w-full p-4 rounded-2xl text-left',
              'border-2 border-gray-100',
              'hover:border-primary/30 hover:bg-primary/5',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary/30'
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl" role="img" aria-hidden="true">
                {feedbackType.icon}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {feedbackType.title}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {feedbackType.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
