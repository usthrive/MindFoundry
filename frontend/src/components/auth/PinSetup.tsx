import { useState, useRef, useEffect } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface PinSetupProps {
  onComplete: (pin: string) => void
  onSkip: () => void
}

export default function PinSetup({ onComplete, onSkip }: PinSetupProps) {
  const [step, setStep] = useState<'create' | 'confirm'>('create')
  const [pin, setPin] = useState(['', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Focus first input on mount and step change
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus()
    }, 100)
  }, [step])

  const handleDigitInput = (
    index: number,
    value: string,
    currentPin: string[],
    setCurrentPin: (pin: string[]) => void
  ) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...currentPin]
    newPin[index] = value.slice(-1)
    setCurrentPin(newPin)
    setError('')

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-advance when all digits entered
    if (index === 3 && value) {
      const fullPin = [...newPin.slice(0, 3), value.slice(-1)].join('')
      if (step === 'create' && fullPin.length === 4) {
        setTimeout(() => {
          setStep('confirm')
          setConfirmPin(['', '', '', ''])
        }, 200)
      } else if (step === 'confirm' && fullPin.length === 4) {
        setTimeout(() => handleConfirm(fullPin), 200)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    const currentPin = step === 'create' ? pin : confirmPin
    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleConfirm = (enteredConfirmPin?: string) => {
    const createdPin = pin.join('')
    const confirmedPin = enteredConfirmPin || confirmPin.join('')

    if (createdPin !== confirmedPin) {
      setError('PINs do not match. Please try again.')
      setConfirmPin(['', '', '', ''])
      inputRefs.current[0]?.focus()
      return
    }

    onComplete(createdPin)
  }

  const handleBack = () => {
    setStep('create')
    setConfirmPin(['', '', '', ''])
    setError('')
  }

  const currentPin = step === 'create' ? pin : confirmPin
  const setCurrentPin = step === 'create' ? setPin : setConfirmPin

  return (
    <Card variant="elevated" padding="lg" className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 'create' ? 'Create Parent PIN' : 'Confirm Your PIN'}
        </h2>
        <p className="text-gray-600">
          {step === 'create'
            ? 'Set a 4-digit PIN to protect child profile switching'
            : 'Enter the same PIN again to confirm'}
        </p>
      </div>

      <div className="flex justify-center gap-3 mb-6">
        {currentPin.map((digit, index) => (
          <input
            key={`${step}-${index}`}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitInput(index, e.target.value, currentPin, setCurrentPin)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg
              ${error ? 'border-red-400' : 'border-gray-300'}
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              transition-colors`}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center mb-4">{error}</p>
      )}

      <div className="space-y-3">
        {step === 'create' ? (
          <>
            <Button
              variant="primary"
              onClick={() => {
                if (pin.join('').length === 4) {
                  setStep('confirm')
                  setConfirmPin(['', '', '', ''])
                }
              }}
              className="w-full"
              disabled={pin.join('').length !== 4}
            >
              Continue
            </Button>
            <Button variant="ghost" onClick={onSkip} className="w-full">
              Skip for now
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={() => handleConfirm()}
              className="w-full"
              disabled={confirmPin.join('').length !== 4}
            >
              Set PIN
            </Button>
            <Button variant="ghost" onClick={handleBack} className="w-full">
              Back
            </Button>
          </>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        This PIN prevents children from switching profiles without parent permission.
      </p>
    </Card>
  )
}
