/**
 * ParentVerification Component
 * Unified parent verification that uses PIN if set, with math challenge fallback
 *
 * Flow:
 * 1. Check if parent has PIN set
 * 2. If PIN exists → Show PIN entry with "Forgot PIN?" option
 * 3. If no PIN or "Forgot PIN?" → Show math challenge
 */

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getParentPin } from '@/services/userService'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface ParentVerificationProps {
  isOpen: boolean
  onSuccess: () => void
  onCancel: () => void
  title?: string
  description?: string
}

type VerificationMode = 'loading' | 'pin' | 'math'

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

export default function ParentVerification({
  isOpen,
  onSuccess,
  onCancel,
  title = 'Parent Verification Required',
  description
}: ParentVerificationProps) {
  const { user } = useAuth()
  const [mode, setMode] = useState<VerificationMode>('loading')
  const [parentPin, setParentPin] = useState<string | null>(null)

  // PIN entry state
  const [pin, setPin] = useState(['', '', '', ''])
  const [pinError, setPinError] = useState(false)
  const [pinAttempts, setPinAttempts] = useState(0)
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Math challenge state
  const [challenge] = useState<MathChallenge>(generateParentChallenge())
  const [mathAnswer, setMathAnswer] = useState('')
  const [mathError, setMathError] = useState(false)
  const [mathAttempts, setMathAttempts] = useState(0)
  const mathInputRef = useRef<HTMLInputElement>(null)

  // Check for PIN on open
  useEffect(() => {
    if (isOpen && user) {
      setMode('loading')
      getParentPin(user.id).then((existingPin) => {
        setParentPin(existingPin)
        if (existingPin) {
          setMode('pin')
        } else {
          setMode('math')
        }
      })
    }
  }, [isOpen, user])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', ''])
      setPinError(false)
      setPinAttempts(0)
      setMathAnswer('')
      setMathError(false)
      setMathAttempts(0)
    }
  }, [isOpen])

  // Focus management for PIN inputs
  useEffect(() => {
    if (isOpen && mode === 'pin') {
      setTimeout(() => {
        pinInputRefs.current[0]?.focus()
      }, 100)
    }
  }, [isOpen, mode])

  // Focus management for math input
  useEffect(() => {
    if (isOpen && mode === 'math') {
      setTimeout(() => {
        mathInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, mode])

  if (!isOpen) return null

  // PIN Input Handlers
  const handlePinDigitInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    setPinError(false)

    // Auto-focus next input
    if (value && index < 3) {
      pinInputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits entered
    if (index === 3 && value) {
      const fullPin = [...newPin.slice(0, 3), value.slice(-1)].join('')
      setTimeout(() => handlePinSubmit(fullPin), 100)
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  const handlePinSubmit = (pinToCheck?: string) => {
    const enteredPin = pinToCheck || pin.join('')

    if (enteredPin.length !== 4) return

    if (enteredPin === parentPin) {
      setPinError(false)
      onSuccess()
    } else {
      setPinError(true)
      const newAttempts = pinAttempts + 1
      setPinAttempts(newAttempts)
      setPin(['', '', '', ''])
      pinInputRefs.current[0]?.focus()

      // After 3 failed attempts, close
      if (newAttempts >= 3) {
        setTimeout(onCancel, 1500)
      }
    }
  }

  const handleForgotPin = () => {
    setMode('math')
    setMathAnswer('')
    setMathError(false)
    setMathAttempts(0)
  }

  // Math Challenge Handlers
  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const answer = parseInt(mathAnswer)

    if (answer === challenge.answer) {
      setMathError(false)
      onSuccess()
    } else {
      setMathError(true)
      const newAttempts = mathAttempts + 1
      setMathAttempts(newAttempts)
      setMathAnswer('')

      // After 3 failed attempts, close
      if (newAttempts >= 3) {
        setTimeout(onCancel, 1500)
      }
    }
  }

  // Loading state
  if (mode === 'loading') {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <Card variant="elevated" padding="lg" className="w-full max-w-sm">
          <div className="text-center py-8">
            <div className="text-5xl mb-4 animate-bounce">🔐</div>
            <p className="text-gray-600">Checking verification method...</p>
          </div>
        </Card>
      </div>
    )
  }

  // PIN Entry Mode
  if (mode === 'pin') {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <Card variant="elevated" padding="lg" className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🔐</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 text-sm">
              {description || 'Enter your 4-digit PIN to continue'}
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { pinInputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinDigitInput(index, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(index, e)}
                className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg
                  ${pinError ? 'border-red-400 animate-shake' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                  transition-colors`}
              />
            ))}
          </div>

          {pinError && (
            <p className="text-red-600 text-sm text-center mb-4">
              {pinAttempts < 3
                ? `Incorrect PIN. ${3 - pinAttempts} attempt${3 - pinAttempts === 1 ? '' : 's'} remaining.`
                : 'Too many attempts. Please try again later.'}
            </p>
          )}

          {/* Forgot PIN link */}
          <div className="text-center mb-4">
            <button
              type="button"
              onClick={handleForgotPin}
              className="text-sm text-primary hover:underline"
            >
              Forgot PIN? Use math challenge instead
            </button>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handlePinSubmit()}
              className="flex-1"
              disabled={pin.join('').length !== 4}
            >
              Verify
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Math Challenge Mode
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
    >
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🧮</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">
            {description || 'Please solve this problem to continue'}
          </p>
        </div>

        <form onSubmit={handleMathSubmit} className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {challenge.question} = ?
            </p>

            <input
              ref={mathInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9-]*"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              className={`w-full text-center text-2xl px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 ${
                mathError
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-primary focus:border-primary'
              }`}
              placeholder="Enter answer"
              autoFocus
              required
            />
          </div>

          {mathError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800 text-center">
                {mathAttempts < 3
                  ? `Incorrect. ${3 - mathAttempts} attempt${3 - mathAttempts === 1 ? '' : 's'} remaining.`
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
              disabled={mathAttempts >= 3}
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
