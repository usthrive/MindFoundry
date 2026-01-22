/**
 * PinSettingsModal Component
 * Allows parents to set, change, or remove their PIN
 */

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getParentPin, setParentPin } from '@/services/userService'
import Button from '@/components/ui/Button'

interface PinSettingsModalProps {
  onBack: () => void
  onClose: () => void
}

type PinState = 'loading' | 'no-pin' | 'has-pin' | 'verify' | 'create' | 'confirm' | 'success'

export default function PinSettingsModal({ onBack, onClose: _onClose }: PinSettingsModalProps) {
  const { user } = useAuth()
  const [state, setState] = useState<PinState>('loading')
  const [pin, setPin] = useState(['', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', ''])
  const [currentPinValue, setCurrentPinValue] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [action, setAction] = useState<'create' | 'change' | 'remove'>('create')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Load current PIN status on mount
  useEffect(() => {
    async function loadPinStatus() {
      if (!user) return
      const existingPin = await getParentPin(user.id)
      setCurrentPinValue(existingPin)
      setState(existingPin ? 'has-pin' : 'no-pin')
    }
    loadPinStatus()
  }, [user])

  // Focus first input when entering PIN entry states
  useEffect(() => {
    if (['verify', 'create', 'confirm'].includes(state)) {
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }, [state])

  const handleDigitInput = (
    index: number,
    value: string,
    currentPinArray: string[],
    setCurrentPinArray: (pin: string[]) => void
  ) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...currentPinArray]
    newPin[index] = value.slice(-1)
    setCurrentPinArray(newPin)
    setError('')

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-advance when all digits entered
    if (index === 3 && value) {
      const fullPin = [...newPin.slice(0, 3), value.slice(-1)].join('')
      setTimeout(() => handlePinComplete(fullPin), 200)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent, currentPinArray: string[]) => {
    if (e.key === 'Backspace' && !currentPinArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePinComplete = async (enteredPin: string) => {
    if (!user) return

    if (state === 'verify') {
      // Verifying current PIN before change/remove
      if (enteredPin === currentPinValue) {
        if (action === 'remove') {
          // Remove PIN
          const success = await setParentPin(user.id, '')
          if (success) {
            setCurrentPinValue(null)
            setState('success')
            setTimeout(() => {
              setState('no-pin')
            }, 1500)
          } else {
            setError('Failed to remove PIN. Please try again.')
          }
        } else {
          // Proceed to create new PIN
          setPin(['', '', '', ''])
          setState('create')
        }
      } else {
        setError('Incorrect PIN. Please try again.')
        setPin(['', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } else if (state === 'create') {
      // First entry of new PIN
      setConfirmPin(['', '', '', ''])
      setState('confirm')
    } else if (state === 'confirm') {
      // Confirming new PIN
      const createdPin = pin.join('')
      if (enteredPin === createdPin) {
        const success = await setParentPin(user.id, createdPin)
        if (success) {
          setCurrentPinValue(createdPin)
          setState('success')
          setTimeout(() => {
            setState('has-pin')
          }, 1500)
        } else {
          setError('Failed to save PIN. Please try again.')
        }
      } else {
        setError('PINs do not match. Please try again.')
        setConfirmPin(['', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    }
  }

  const startAction = (selectedAction: 'create' | 'change' | 'remove') => {
    setAction(selectedAction)
    setPin(['', '', '', ''])
    setConfirmPin(['', '', '', ''])
    setError('')

    if (selectedAction === 'create') {
      setState('create')
    } else {
      // For change/remove, need to verify current PIN first
      setState('verify')
    }
  }

  const handleBackFromPinEntry = () => {
    setPin(['', '', '', ''])
    setConfirmPin(['', '', '', ''])
    setError('')
    setState(currentPinValue ? 'has-pin' : 'no-pin')
  }

  // Render PIN input fields
  const renderPinInput = (currentPinArray: string[], setCurrentPinArray: (pin: string[]) => void) => (
    <div className="flex justify-center gap-3 mb-6">
      {currentPinArray.map((digit, index) => (
        <input
          key={`${state}-${index}`}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleDigitInput(index, e.target.value, currentPinArray, setCurrentPinArray)}
          onKeyDown={(e) => handleKeyDown(index, e, currentPinArray)}
          className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-lg
            ${error ? 'border-red-400' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            transition-colors`}
        />
      ))}
    </div>
  )

  // Loading state
  if (state === 'loading') {
    return (
      <div className="px-4 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-xl font-bold text-gray-800">PIN & Security</h2>
        </div>
        <div className="flex justify-center py-12">
          <div className="text-4xl animate-bounce">🔒</div>
        </div>
      </div>
    )
  }

  // Success state
  if (state === 'success') {
    return (
      <div className="px-4 pb-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {action === 'remove' ? 'PIN Removed' : 'PIN Updated'}
          </h3>
          <p className="text-gray-600">
            {action === 'remove'
              ? 'Your parent PIN has been removed.'
              : 'Your parent PIN has been saved.'}
          </p>
        </div>
      </div>
    )
  }

  // No PIN state - show option to create
  if (state === 'no-pin') {
    return (
      <div className="px-4 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-xl font-bold text-gray-800">PIN & Security</h2>
        </div>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔓</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No PIN Set</h3>
          <p className="text-gray-600 text-sm">
            Set up a 4-digit PIN to prevent children from exiting their learning area or switching profiles without permission.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => startAction('create')}
          className="w-full"
        >
          Set Up PIN
        </Button>
      </div>
    )
  }

  // Has PIN state - show options to change or remove
  if (state === 'has-pin') {
    return (
      <div className="px-4 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-xl font-bold text-gray-800">PIN & Security</h2>
        </div>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">PIN Protected</h3>
          <p className="text-gray-600 text-sm">
            Your parent PIN is active. Children will need to enter the PIN to exit their learning area or switch profiles.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="secondary"
            onClick={() => startAction('change')}
            className="w-full"
          >
            Change PIN
          </Button>
          <Button
            variant="ghost"
            onClick={() => startAction('remove')}
            className="w-full text-red-600 hover:bg-red-50"
          >
            Remove PIN
          </Button>
        </div>
      </div>
    )
  }

  // Verify current PIN state
  if (state === 'verify') {
    return (
      <div className="px-4 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={handleBackFromPinEntry} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-xl font-bold text-gray-800">Enter Current PIN</h2>
        </div>

        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔐</div>
          <p className="text-gray-600">
            {action === 'remove'
              ? 'Enter your current PIN to remove it'
              : 'Enter your current PIN to continue'}
          </p>
        </div>

        {renderPinInput(pin, setPin)}

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <Button
          variant="ghost"
          onClick={handleBackFromPinEntry}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    )
  }

  // Create new PIN state
  if (state === 'create') {
    return (
      <div className="px-4 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={handleBackFromPinEntry} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-xl font-bold text-gray-800">Create New PIN</h2>
        </div>

        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔢</div>
          <p className="text-gray-600">Enter a 4-digit PIN</p>
        </div>

        {renderPinInput(pin, setPin)}

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <Button
          variant="ghost"
          onClick={handleBackFromPinEntry}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    )
  }

  // Confirm new PIN state
  if (state === 'confirm') {
    return (
      <div className="px-4 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => { setState('create'); setConfirmPin(['', '', '', '']); setError('') }} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-xl font-bold text-gray-800">Confirm PIN</h2>
        </div>

        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔄</div>
          <p className="text-gray-600">Enter the same PIN again to confirm</p>
        </div>

        {renderPinInput(confirmPin, setConfirmPin)}

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <Button
          variant="ghost"
          onClick={handleBackFromPinEntry}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    )
  }

  return null
}
