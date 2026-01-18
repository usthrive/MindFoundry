import { useState, useRef, useEffect } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface ParentModeChallengeProps {
  isOpen: boolean
  onSuccess: () => void
  onCancel: () => void
}

interface MathChallenge {
  question: string
  answer: number
}

// Generate random math challenges for parent verification
function generateParentChallenge(): MathChallenge {
  const challenges: MathChallenge[] = [
    { question: "17 × 13", answer: 221 },
    { question: "156 ÷ 12", answer: 13 },
    { question: "23 × 11", answer: 253 },
    { question: "144 ÷ 16", answer: 9 },
    { question: "19 × 14", answer: 266 },
    { question: "225 ÷ 15", answer: 15 },
    { question: "18 × 17", answer: 306 },
    { question: "168 ÷ 14", answer: 12 },
    { question: "24 × 13", answer: 312 },
    { question: "195 ÷ 13", answer: 15 },
    { question: "√625", answer: 25 },
    { question: "√484", answer: 22 },
    { question: "43²", answer: 1849 },
    { question: "27²", answer: 729 },
    { question: "15²", answer: 225 }
  ]

  return challenges[Math.floor(Math.random() * challenges.length)]
}

export default function ParentModeChallenge({ isOpen, onSuccess, onCancel }: ParentModeChallengeProps) {
  const [challenge] = useState<MathChallenge>(generateParentChallenge())
  const [userAnswer, setUserAnswer] = useState('')
  const [error, setError] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Explicit focus management - autoFocus alone is unreliable across browsers
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready and modal is visible
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const answer = parseInt(userAnswer)

    if (answer === challenge.answer) {
      setError(false)
      onSuccess()
    } else {
      setError(true)
      setAttempts(attempts + 1)
      setUserAnswer('')

      // After 3 failed attempts, close the dialog
      if (attempts >= 2) {
        setTimeout(() => {
          onCancel()
        }, 1500)
      }
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
      onKeyPress={(e) => e.stopPropagation()}
    >
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Parent Verification Required</h2>
          <p className="text-gray-600">
            Please solve this problem to access parent controls
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {challenge.question} = ?
            </p>

            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9-]*"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className={`w-full text-center text-2xl px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                error
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
              placeholder="Enter answer"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 text-center">
                {attempts < 3
                  ? `Incorrect. ${3 - attempts} attempt${3 - attempts === 1 ? '' : 's'} remaining.`
                  : 'Too many attempts. Please try again later.'
                }
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={attempts >= 3}
              className="flex-1"
            >
              Verify
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          This verification helps ensure children don't accidentally change important settings
        </p>
      </Card>
    </div>
  )
}