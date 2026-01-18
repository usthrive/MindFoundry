import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getUserProfile, getParentPin } from '@/services/userService'
import type { Database } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import ChildSelector from '@/components/children/ChildSelector'
import AddChildModal from '@/components/children/AddChildModal'
import EditChildModal from '@/components/children/EditChildModal'
import PinEntryModal from '@/components/auth/PinEntryModal'
import ParentModeChallenge from '@/components/auth/ParentModeChallenge'

type Child = Database['public']['Tables']['children']['Row']

export default function ChildSelectPage() {
  const { user, children, selectChild, currentChild, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const [showEditChildModal, setShowEditChildModal] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [showPinModal, setShowPinModal] = useState(false)
  const [parentPin, setParentPin] = useState<string | null>(null)
  const [pendingChildId, setPendingChildId] = useState<string | null>(null)
  // Parent Settings state
  const [showParentVerification, setShowParentVerification] = useState(false)
  const [parentModeActive, setParentModeActive] = useState(false)
  const [selectedChildToEdit, setSelectedChildToEdit] = useState<string>('')

  // Redirect to login if not authenticated or to onboarding if user_type not set
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
      return
    }

    // Check if user has selected their type and fetch parent PIN
    if (user) {
      getUserProfile(user.id).then((profile) => {
        if (!profile || !profile.user_type) {
          console.log('User type not set, redirecting to onboarding')
          navigate('/onboarding')
        }
      })

      // Fetch parent PIN
      getParentPin(user.id).then((pin) => {
        setParentPin(pin)
      })
    }
  }, [user, loading, navigate])

  const handleSelectChild = (childId: string) => {
    // If there's a PIN set and we're switching to a different child, require PIN
    if (parentPin && currentChild && currentChild.id !== childId) {
      setPendingChildId(childId)
      setShowPinModal(true)
      return
    }

    // No PIN or same child or first selection - proceed directly
    selectChild(childId)
    navigate('/study')
  }

  const handlePinSuccess = () => {
    setShowPinModal(false)
    if (pendingChildId) {
      selectChild(pendingChildId)
      setPendingChildId(null)
      navigate('/study')
    }
  }

  const handlePinCancel = () => {
    setShowPinModal(false)
    setPendingChildId(null)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleAddChild = () => {
    setShowAddChildModal(true)
  }

  const handleCloseModal = () => {
    setShowAddChildModal(false)
  }

  const handleChildAdded = () => {
    // Modal will call refreshChildren and close itself
    console.log('Child profile created successfully!')
  }

  // Parent Settings - click to show verification challenge
  const handleParentSettingsClick = () => {
    setShowParentVerification(true)
  }

  // After verification success, show child dropdown for editing
  const handleParentVerificationSuccess = () => {
    setShowParentVerification(false)
    setParentModeActive(true)
    // Default to first child if available
    if (children.length > 0) {
      setSelectedChildToEdit(children[0].id)
    }
  }

  const handleParentVerificationCancel = () => {
    setShowParentVerification(false)
  }

  // Edit selected child from dropdown
  const handleEditSelectedChild = () => {
    const child = children.find(c => c.id === selectedChildToEdit)
    if (child) {
      setEditingChild(child)
      setShowEditChildModal(true)
    }
  }

  const handleCloseEditModal = () => {
    setShowEditChildModal(false)
    setEditingChild(null)
  }

  const handleChildUpdated = () => {
    console.log('Child profile updated successfully!')
  }

  // Close parent mode panel
  const handleCloseParentMode = () => {
    setParentModeActive(false)
    setSelectedChildToEdit('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧠</div>
          <p className="text-xl text-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header with large logo */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="MindFoundry"
            className="h-32 sm:h-40 mx-auto mb-4"
          />
          <p className="text-lg sm:text-xl text-text-secondary">Welcome back! Ready to learn?</p>
        </div>

        {/* Parent Settings and Sign Out buttons */}
        <div className="flex justify-end gap-2 mb-6">
          <Button
            variant="ghost"
            onClick={handleParentSettingsClick}
            size="sm"
            className="text-text-muted hover:text-text-primary"
          >
            ⚙️ Parent Settings
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            size="sm"
            className="text-text-muted hover:text-text-primary"
          >
            Sign Out
          </Button>
        </div>

        {/* Parent Mode Active - Edit Panel */}
        {parentModeActive && children.length > 0 && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
            {/* Close button at top right */}
            <div className="flex justify-end mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseParentMode}
                className="text-orange-600 hover:text-orange-800 -mt-1 -mr-1"
              >
                ✕ Close
              </Button>
            </div>

            {/* Label */}
            <p className="text-orange-600 font-medium text-center mb-3">
              Edit Child Profile
            </p>

            {/* Dropdown and Button - stack on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <select
                value={selectedChildToEdit}
                onChange={(e) => setSelectedChildToEdit(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 border border-orange-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
              >
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.avatar} {child.name} (Level {child.current_level})
                  </option>
                ))}
              </select>
              <Button
                variant="primary"
                size="md"
                onClick={handleEditSelectedChild}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        )}

        {/* Child Selector Card with gradient border */}
        <div className="bg-white rounded-3xl shadow-lg p-1 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
          <div className="bg-white rounded-3xl p-6 sm:p-8">
            <ChildSelector
              children={children}
              onSelectChild={handleSelectChild}
              onAddChild={handleAddChild}
            />
          </div>
        </div>

        {/* Add Child Modal */}
        <AddChildModal
          isOpen={showAddChildModal}
          onClose={handleCloseModal}
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

        {/* PIN Entry Modal for switching children */}
        {parentPin && (
          <PinEntryModal
            isOpen={showPinModal}
            onSuccess={handlePinSuccess}
            onCancel={handlePinCancel}
            correctPin={parentPin}
            title="Switch Child Profile"
            description="Enter your parent PIN to switch to a different child"
          />
        )}

        {/* Parent Settings Verification Modal */}
        <ParentModeChallenge
          isOpen={showParentVerification}
          onSuccess={handleParentVerificationSuccess}
          onCancel={handleParentVerificationCancel}
        />
      </div>
    </div>
  )
}
