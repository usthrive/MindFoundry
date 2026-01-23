import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { updateChildProfile, deleteChildProfile } from '@/services/progressService'
import { getInitialLevelForGrade, getLevelDescription } from '@/utils/levelMapping'
import { getStandardProblemsPerPage, type QuestionsPerPageMode } from '@/utils/worksheetConfig'
import type { Database } from '@/lib/supabase'
import type { KumonLevel } from '@/types'
import Button from '../ui/Button'
import Card from '../ui/Card'

type Child = Database['public']['Tables']['children']['Row']

interface EditChildModalProps {
  isOpen: boolean
  child: Child
  onClose: () => void
  onSuccess: () => void
}

const AVATARS = ['👦', '👧', '🧒', '👶', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🔬']

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

const KUMON_LEVELS: { value: KumonLevel; label: string }[] = [
  { value: '7A', label: '7A - Counting to 10' },
  { value: '6A', label: '6A - Number Recognition' },
  { value: '5A', label: '5A - Number Sequences' },
  { value: '4A', label: '4A - Writing Numbers' },
  { value: '3A', label: '3A - Addition +1, +2, +3' },
  { value: '2A', label: '2A - Addition +4 to +10' },
  { value: 'A', label: 'A - Subtraction Basics' },
  { value: 'B', label: 'B - 2-Digit Operations' },
  { value: 'C', label: 'C - Multiplication & Division' },
  { value: 'D', label: 'D - Long Division & Fractions' },
  { value: 'E', label: 'E - Fraction Operations' },
  { value: 'F', label: 'F - Decimals & Order of Ops' },
]

export default function EditChildModal({ isOpen, child, onClose, onSuccess }: EditChildModalProps) {
  const { refreshChildren } = useAuth()
  const [name, setName] = useState(child.name)
  const [age, setAge] = useState(child.age)
  const [gradeLevel, setGradeLevel] = useState(child.grade_level)
  const [selectedAvatar, setSelectedAvatar] = useState(child.avatar)
  const [currentLevel, setCurrentLevel] = useState(child.current_level as KumonLevel)
  const [currentWorksheet, setCurrentWorksheet] = useState(child.current_worksheet)
  const [questionsPerPageMode, setQuestionsPerPageMode] = useState<QuestionsPerPageMode>(
    (child.questions_per_page_mode as QuestionsPerPageMode) || 'standard'
  )
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const gradeAppropriateLevel = getInitialLevelForGrade(gradeLevel)

  const handleResetLevel = () => {
    setCurrentLevel(gradeAppropriateLevel)
    setCurrentWorksheet(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const success = await updateChildProfile(child.id, {
        name,
        age,
        grade_level: gradeLevel,
        current_level: currentLevel,
        current_worksheet: currentWorksheet,
        questions_per_page_mode: questionsPerPageMode,
      })

      if (!success) throw new Error('Failed to update child profile')

      // Also update avatar if changed (separate field in table)
      if (selectedAvatar !== child.avatar) {
        const { supabase } = await import('@/lib/supabase')
        await supabase.from('children').update({ avatar: selectedAvatar }).eq('id', child.id)
      }

      await refreshChildren()
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error updating child profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      return
    }

    setLoading(true)
    try {
      const success = await deleteChildProfile(child.id)
      if (!success) throw new Error('Failed to delete child profile')

      await refreshChildren()
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error deleting child profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-md my-8">
        <Card variant="elevated" padding="lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              />
            </div>

            {/* Age and Grade in row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 5)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  min={3}
                  max={11}
                />
              </div>
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
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
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar
              </label>
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`flex items-center justify-center aspect-square text-2xl rounded-lg transition-all ${
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

            {/* Current Level Section */}
            <div className="border-t pt-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Level</h3>
              <p className="text-sm text-gray-600 mb-3">
                Level: <strong>{currentLevel}</strong> ({getLevelDescription(currentLevel)})
                <br />
                Worksheet: <strong>{currentWorksheet}</strong>
              </p>

              {/* Reset to Grade Level */}
              <button
                type="button"
                onClick={handleResetLevel}
                className="w-full mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition flex items-center justify-center gap-2"
              >
                <span>Reset to Grade Level</span>
              </button>
              <p className="text-xs text-gray-500 mb-4">
                Resets to: {gradeAppropriateLevel} ({getLevelDescription(gradeAppropriateLevel)})
              </p>

              {/* Manual Level Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <select
                    id="level"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value as KumonLevel)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {KUMON_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="worksheet" className="block text-sm font-medium text-gray-700 mb-2">
                    Worksheet
                  </label>
                  <input
                    type="number"
                    id="worksheet"
                    value={currentWorksheet}
                    onChange={(e) => setCurrentWorksheet(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    min={1}
                    max={200}
                  />
                </div>
              </div>

              {/* Questions Per Page Mode */}
              <div className="mt-4">
                <label htmlFor="questionsPerPage" className="block text-sm font-medium text-gray-700 mb-2">
                  Questions per page
                </label>
                <select
                  id="questionsPerPage"
                  value={questionsPerPageMode}
                  onChange={(e) => setQuestionsPerPageMode(e.target.value as QuestionsPerPageMode)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="one">1 at a time (Quick feedback)</option>
                  <option value="standard">Standard (Level default)</option>
                  {/* Only show 'half' when standard is > 3 */}
                  {getStandardProblemsPerPage(currentLevel) > 3 && (
                    <option value="half">Half (Balanced)</option>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Quick feedback helps kids stay motivated with immediate results
                </p>
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
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            {/* Danger Zone - Delete */}
            <div className="border-t pt-5 mt-5">
              <p className="text-sm text-gray-500 mb-3">Danger Zone</p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg transition ${
                  deleteConfirm
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                }`}
              >
                {deleteConfirm ? 'Click again to confirm deletion' : 'Delete Child Profile'}
              </button>
              {deleteConfirm && (
                <p className="text-xs text-red-600 mt-2 text-center">
                  This will permanently delete all progress data.
                </p>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
