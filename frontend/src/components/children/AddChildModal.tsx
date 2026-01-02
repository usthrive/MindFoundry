import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { getInitialLevelForGrade } from '@/utils/levelMapping'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface AddChildModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const AVATARS = ['👦', '👧', '🧒', '👶', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🔬']

const GRADE_LEVELS = [
  { value: 0, label: 'Kindergarten' },
  { value: 1, label: '1st Grade' },
  { value: 2, label: '2nd Grade' },
  { value: 3, label: '3rd Grade' },
  { value: 4, label: '4th Grade' },
  { value: 5, label: '5th Grade' },
  { value: 6, label: '6th Grade' },
]

export default function AddChildModal({ isOpen, onClose, onSuccess }: AddChildModalProps) {
  const { user, refreshChildren } = useAuth()
  const [name, setName] = useState('')
  const [age, setAge] = useState(7)
  const [gradeLevel, setGradeLevel] = useState(1)
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!user) throw new Error('Not authenticated')

      // Get appropriate Kumon level based on grade
      const initialLevel = getInitialLevelForGrade(gradeLevel)

      const { error: insertError } = await supabase.from('children').insert({
        user_id: user.id,
        name,
        age,
        grade_level: gradeLevel,
        avatar: selectedAvatar,
        current_level: initialLevel, // Grade-appropriate starting level
        current_worksheet: 1,
      })

      if (insertError) throw insertError

      // Refresh children list in context
      await refreshChildren()

      // Reset form
      setName('')
      setAge(7)
      setGradeLevel(1)
      setSelectedAvatar(AVATARS[0])

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating child profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to create child profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <Card variant="elevated" padding="lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add Child Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Child's Name
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
                placeholder="Enter child's name"
              />
            </div>

            {/* Age Input */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  setAge(isNaN(value) ? 7 : value)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                min={4}
                max={11}
              />
            </div>

            {/* Grade Level Select */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade Level
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
                Choose Avatar
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
              <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Add Child'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
