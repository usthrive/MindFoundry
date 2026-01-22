/**
 * HelpSupport Component
 * Help and support options including FAQ, feedback, and contact
 */

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { FeedbackModal } from '@/components/feedback'

interface HelpSupportProps {
  onBack: () => void
  onClose: () => void
}

export default function HelpSupport({ onBack, onClose: _onClose }: HelpSupportProps) {
  const { currentChild } = useAuth()
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqItems = [
    {
      question: 'How does the level system work?',
      answer: 'Children progress through levels from 7A (easiest) to O (most advanced). Each level builds on the previous one, ensuring a solid foundation in math concepts.',
    },
    {
      question: 'How do I change my child\'s level?',
      answer: 'Go to Settings > Children, select the child, and tap "Edit Profile". You can adjust their current level from there.',
    },
    {
      question: 'What is the parent PIN for?',
      answer: 'The parent PIN prevents children from accidentally leaving their learning area or switching profiles without your permission.',
    },
    {
      question: 'How do videos unlock?',
      answer: 'Videos unlock as your child progresses through levels. They can see videos for their current level and one level ahead, giving them a preview of what\'s coming next.',
    },
    {
      question: 'Can I use this app on multiple devices?',
      answer: 'Yes! Your account syncs across all devices. Just sign in with the same account on any device to access your children\'s progress.',
    },
  ]

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@mindfoundry.app?subject=Help%20Request'
  }

  return (
    <div className="px-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <span className="text-xl">←</span>
        </button>
        <h2 className="text-xl font-bold text-gray-800">Help & Support</h2>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setIsFeedbackOpen(true)}
          className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <span className="text-3xl">💬</span>
          <span className="text-sm font-medium text-gray-800">Give Feedback</span>
        </button>
        <button
          onClick={handleContactSupport}
          className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
        >
          <span className="text-3xl">📧</span>
          <span className="text-sm font-medium text-gray-800">Contact Us</span>
        </button>
      </div>

      {/* FAQ Section */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 mb-3">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800 pr-4">{item.question}</span>
                <span className="text-gray-400 flex-shrink-0">
                  {expandedFaq === index ? '−' : '+'}
                </span>
              </button>
              {expandedFaq === index && (
                <div className="px-4 pb-4 text-sm text-gray-600">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div className="text-center text-sm text-gray-500">
        <p>MindFoundry v1.0.0</p>
        <p className="mt-1">Made with ❤️ for young learners</p>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        childId={currentChild?.id}
      />
    </div>
  )
}
