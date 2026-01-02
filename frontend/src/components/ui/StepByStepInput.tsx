import { useState } from 'react'
import MathRenderer from './MathRenderer'

interface Step {
  id: string
  value: string
  label?: string
}

interface StepByStepInputProps {
  steps?: Step[]
  onStepsChange?: (steps: Step[]) => void
  expectedSteps?: string[]
  showExpectedAfterSubmit?: boolean
  isSubmitted?: boolean
  disabled?: boolean
  minSteps?: number
  maxSteps?: number
  className?: string
}

export default function StepByStepInput({
  steps: controlledSteps,
  onStepsChange,
  expectedSteps = [],
  showExpectedAfterSubmit = true,
  isSubmitted = false,
  disabled = false,
  minSteps = 1,
  maxSteps = 10,
  className = '',
}: StepByStepInputProps) {
  const [internalSteps, setInternalSteps] = useState<Step[]>([
    { id: crypto.randomUUID(), value: '', label: 'Step 1' },
  ])

  const steps = controlledSteps ?? internalSteps
  const setSteps = (newSteps: Step[]) => {
    if (controlledSteps) {
      onStepsChange?.(newSteps)
    } else {
      setInternalSteps(newSteps)
      onStepsChange?.(newSteps)
    }
  }

  const handleStepChange = (id: string, value: string) => {
    const newSteps = steps.map((step) =>
      step.id === id ? { ...step, value } : step
    )
    setSteps(newSteps)
  }

  const addStep = () => {
    if (steps.length >= maxSteps) return
    const newStep: Step = {
      id: crypto.randomUUID(),
      value: '',
      label: `Step ${steps.length + 1}`,
    }
    setSteps([...steps, newStep])
  }

  const removeStep = (id: string) => {
    if (steps.length <= minSteps) return
    const newSteps = steps
      .filter((step) => step.id !== id)
      .map((step, index) => ({ ...step, label: `Step ${index + 1}` }))
    setSteps(newSteps)
  }

  const getStepStatus = (index: number, value: string): 'correct' | 'incorrect' | 'neutral' => {
    if (!isSubmitted || !showExpectedAfterSubmit || index >= expectedSteps.length) {
      return 'neutral'
    }
    const expected = expectedSteps[index].toLowerCase().replace(/\s/g, '')
    const actual = value.toLowerCase().replace(/\s/g, '')
    return expected === actual ? 'correct' : 'incorrect'
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col gap-3">
        {steps.map((step, index) => {
          const status = getStepStatus(index, step.value)

          return (
            <div key={step.id} className="flex items-start gap-2">
              <div className="flex-shrink-0 w-16 pt-2">
                <span className="text-sm font-medium text-gray-600">
                  {step.label || `Step ${index + 1}`}
                </span>
              </div>

              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={step.value}
                    onChange={(e) => handleStepChange(step.id, e.target.value)}
                    disabled={disabled}
                    placeholder={`Enter step ${index + 1}...`}
                    className={`w-full px-4 py-2 border-2 rounded-lg text-lg transition-colors ${
                      status === 'correct'
                        ? 'border-green-500 bg-green-50'
                        : status === 'incorrect'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 focus:border-purple-500'
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />

                  {status === 'correct' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                      ✓
                    </span>
                  )}
                  {status === 'incorrect' && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                      ✗
                    </span>
                  )}
                </div>

                {isSubmitted && showExpectedAfterSubmit && status === 'incorrect' && expectedSteps[index] && (
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Expected: </span>
                    <MathRenderer expression={expectedSteps[index]} className="inline" />
                  </div>
                )}
              </div>

              {!disabled && steps.length > minSteps && (
                <button
                  onClick={() => removeStep(step.id)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  aria-label="Remove step"
                >
                  ×
                </button>
              )}
            </div>
          )
        })}
      </div>

      {!disabled && steps.length < maxSteps && (
        <button
          onClick={addStep}
          className="self-start flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <span className="text-lg">+</span>
          Add step
        </button>
      )}

      {isSubmitted && showExpectedAfterSubmit && expectedSteps.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            Solution Steps:
          </h4>
          <ol className="list-decimal list-inside space-y-1">
            {expectedSteps.map((step, index) => (
              <li key={index} className="text-sm text-blue-700">
                <MathRenderer expression={step} className="inline" />
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export { type Step }
