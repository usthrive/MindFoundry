/**
 * Scholarship Request Modal
 * Allows users to request financial assistance
 */

import { useState } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'

interface ScholarshipRequestModalProps {
  onClose: () => void
}

export default function ScholarshipRequestModal({ onClose }: ScholarshipRequestModalProps) {
  const { requestScholarship } = useSubscription()
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reason.trim()) {
      setError('Please tell us a bit about your situation')
      return
    }

    if (reason.trim().length < 20) {
      setError('Please provide a bit more detail (at least 20 characters)')
      return
    }

    setLoading(true)
    setError('')

    const result = await requestScholarship(reason.trim())

    if (result.success) {
      setSubmitted(true)
    } else {
      setError(result.error || 'Failed to submit request. Please try again.')
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
          <div className="text-5xl mb-4">💝</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Request Submitted
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. We'll review your request and get back to you
            within 24-48 hours. We want every family to have access to quality math education.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5 text-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-3xl">🤝</div>
            <div>
              <h2 className="text-xl font-bold">Request Assistance</h2>
              <p className="text-purple-100 text-sm">
                We're here to help
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 text-sm mb-4">
            We believe every child deserves access to quality math education, regardless
            of financial circumstances. If you're facing hardship, please let us know
            and we'll do our best to help.
          </p>

          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Tell us about your situation
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please share a bit about why you're requesting assistance..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Your request is confidential and will be reviewed by our team. We typically
            respond within 24-48 hours.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !reason.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
