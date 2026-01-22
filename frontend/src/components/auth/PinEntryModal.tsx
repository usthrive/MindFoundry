import { useState, useEffect, useRef } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface PinEntryModalProps {
  isOpen: boolean
  onSuccess: () => void
  onCancel: () => void
  correctPin: string
  title?: string
  description?: string
}

export default function PinEntryModal({
  isOpen,
  onSuccess,
  onCancel,
  correctPin,
  title = 'Enter Parent PIN',
  description = 'Please enter your 4-digit PIN to continue'
}: PinEntryModalProps) {
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', ''])
      setError(false)
      setAttempts(0)
      // Focus first input after a short delay
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleDigitInput = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    setError(false)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits entered
    if (index === 3 && value) {
      const fullPin = [...newPin.slice(0, 3), value.slice(-1)].join('')
      setTimeout(() => handleSubmit(fullPin), 100)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  const handleSubmit = (pinToCheck?: string) => {
    const enteredPin = pinToCheck || pin.join('')

    if (enteredPin.length !== 4) return

    if (enteredPin === correctPin) {
      setError(false)
      setPin(['', '', '', ''])
      onSuccess()
    } else {
      setError(true)
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setPin(['', '', '', ''])
      inputRefs.current[0]?.focus()

      // After 3 failed attempts, close the dialog
      if (newAttempts >= 3) {
        setTimeout(onCancel, 1500)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card variant="elevated" padding="lg" className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitInput(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg
                ${error ? 'border-red-400 animate-shake' : 'border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                transition-colors`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">
            {attempts < 3
              ? `Incorrect PIN. ${3 - attempts} attempt${3 - attempts === 1 ? '' : 's'} remaining.`
              : 'Too many attempts. Please try again later.'}
          </p>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSubmit()}
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
