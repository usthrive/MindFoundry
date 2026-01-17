import Button from '@/components/ui/Button'

export interface FeedbackSuccessProps {
  onDone: () => void
}

export default function FeedbackSuccess({ onDone }: FeedbackSuccessProps) {
  return (
    <div className="p-8 text-center">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center">
          <span className="text-5xl">✅</span>
        </div>
      </div>

      {/* Message */}
      <h2 className="text-xl font-bold text-gray-900 mb-3">
        Thank you for your feedback!
      </h2>
      <p className="text-gray-600 mb-8 max-w-xs mx-auto">
        Your message has been sent to our team. We review all feedback daily and use it to improve MindFoundry.
      </p>

      {/* Done Button */}
      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={onDone}
        className="min-w-[160px]"
      >
        Got It!
      </Button>
    </div>
  )
}
