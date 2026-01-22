/**
 * SubscriptionSettings Component
 * Placeholder for future subscription management
 */

interface SubscriptionSettingsProps {
  onBack: () => void
}

export default function SubscriptionSettings({ onBack }: SubscriptionSettingsProps) {
  return (
    <div className="px-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <span className="text-xl">←</span>
        </button>
        <h2 className="text-xl font-bold text-gray-800">Subscription</h2>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎁</span>
          <div>
            <p className="font-bold text-gray-800">Free Plan</p>
            <p className="text-sm text-gray-600">Basic features included</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Unlimited worksheets</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Video lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Progress tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Up to 3 children</span>
          </div>
        </div>
      </div>

      {/* Premium Teaser */}
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
        <span className="text-4xl mb-3 block">✨</span>
        <h3 className="font-bold text-gray-800 mb-2">Premium Coming Soon</h3>
        <p className="text-sm text-gray-600 mb-4">
          Unlock advanced features like detailed analytics, personalized learning paths, and priority support.
        </p>
        <div className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
          <span>🔔</span>
          <span>We&apos;ll notify you when available</span>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-500 text-center mt-6">
        Questions? Contact us at support@mindfoundry.app
      </p>
    </div>
  )
}
