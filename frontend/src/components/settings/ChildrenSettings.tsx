/**
 * ChildrenSettings Component
 * Allows parents to view, edit, and add child profiles
 */

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { Database } from '@/lib/supabase'
import AddChildModal from '@/components/children/AddChildModal'
import EditChildModal from '@/components/children/EditChildModal'
import Button from '@/components/ui/Button'

type Child = Database['public']['Tables']['children']['Row']

interface ChildrenSettingsProps {
  onBack: () => void
  onClose: () => void
}

export default function ChildrenSettings({ onBack, onClose: _onClose }: ChildrenSettingsProps) {
  const { children } = useAuth()
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const [showEditChildModal, setShowEditChildModal] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)

  const handleEditChild = (child: Child) => {
    setEditingChild(child)
    setShowEditChildModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditChildModal(false)
    setEditingChild(null)
  }

  const handleChildAdded = () => {
    setShowAddChildModal(false)
  }

  const handleChildUpdated = () => {
    setShowEditChildModal(false)
    setEditingChild(null)
  }

  return (
    <div className="px-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <span className="text-xl">←</span>
        </button>
        <h2 className="text-xl font-bold text-gray-800">Children</h2>
      </div>

      {/* Children List */}
      {children.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">👶</div>
          <p className="text-gray-600 mb-4">No children added yet</p>
          <Button
            variant="primary"
            onClick={() => setShowAddChildModal(true)}
          >
            Add Your First Child
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {children.map((child) => (
            <div
              key={child.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              {/* Avatar */}
              <div className="text-4xl">{child.avatar}</div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-medium text-gray-800">{child.name}</p>
                <p className="text-sm text-gray-500">
                  Level {child.current_level} • Age {child.age}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => handleEditChild(child)}
                className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                Edit
              </button>
            </div>
          ))}

          {/* Add Child Button */}
          <button
            onClick={() => setShowAddChildModal(true)}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors"
          >
            <span className="text-2xl">+</span>
            <span className="font-medium">Add Another Child</span>
          </button>
        </div>
      )}

      {/* Add Child Modal */}
      <AddChildModal
        isOpen={showAddChildModal}
        onClose={() => setShowAddChildModal(false)}
        onSuccess={handleChildAdded}
      />

      {/* Edit Child Modal */}
      {editingChild && (
        <EditChildModal
          isOpen={showEditChildModal}
          child={editingChild}
          onClose={handleCloseEditModal}
          onSuccess={handleChildUpdated}
        />
      )}
    </div>
  )
}
