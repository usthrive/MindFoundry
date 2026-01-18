import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createStudentProfile } from '@/services/userService'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface StudentProfileFormProps {
  fullName: string
  onComplete: () => void
  onBack: () => void
}

const AVATARS = ['🎓', '📚', '🚀', '⭐', '🎯', '🏆', '💡', '🎨', '🎭', '🎪', '🎸', '🎮']

const GRADE_LEVELS = [
  { value: -2, label: 'Pre-K (Age 3-4)' },
  { value: -1, label: 'Pre-K+ (Age 4-5)' },
  { value: 0, label: 'Kindergarten' },
  { value: 1, label: '1st Grade' },
  { value: 2, label: '2nd Grade' },
  { value: 3, label: '3rd Grade' },
  { value: 4, label: '4th Grade' },
  { value: 5, label: '5th Grade' },
  { value: 6, label: '6th Grade' },
]

export default function StudentProfileForm({ fullName, onComplete, onBack }: StudentProfileFormProps) {
  const { user, refreshChildren } = useAuth()
  const [name, setName] = useState(fullName || '')
  const [age, setAge] = useState(6)
  const [gradeLevel, setGradeLevel] = useState(1)
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!user) throw new Error('Not authenticated')

      const success = await createStudentProfile(
        user.id,
        name,
        age,
        gradeLevel,
        selectedAvatar
      )

      if (!success) throw new Error('Failed to create student profile')

      // Refresh children list in context
      await refreshChildren()

      onComplete()
    } catch (err) {
      console.error('Error creating student profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card variant="elevated" padding="lg">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Profile</h2>
          <p className="text-gray-600">
            Tell us a bit about yourself so we can personalize your learning experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              minLength={2}
              maxLength={50}
              placeholder="Enter your name"
            />
          </div>

          {/* Age Input */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Your Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                setAge(isNaN(value) ? 6 : value)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              min={3}
              max={11}
            />
            <p className="text-xs text-gray-500 mt-1">Must be between 3 and 11 years old</p>
          </div>

          {/* Grade Level Select */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
              Your Grade Level
            </label>
            <select
              id="grade"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              {GRADE_LEVELS.map((grade) => (
                <option key={grade.value} value={grade.value}>
                  {grade.label}
                </option>
              ))}
            </select>
          </div>

          {/* Avatar Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Your Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`flex items-center justify-center aspect-square text-3xl rounded-lg transition-all ${
                    selectedAvatar === avatar
                      ? 'bg-primary bg-opacity-20 scale-110 ring-2 ring-primary'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button type="submit" variant="primary" disabled={loading} className="flex-1">
              {loading ? 'Setting up...' : 'Start Learning!'}
            </Button>
          </div>
        </form>
      </Card>

      <p className="text-center text-sm text-gray-500 mt-4">
        Your profile will be saved and you can update it anytime
      </p>
    </div>
  )
}