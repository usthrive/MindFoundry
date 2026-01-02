import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getUserProfile, getParentPin } from '@/services/userService'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ChildSelector from '@/components/children/ChildSelector'
import AddChildModal from '@/components/children/AddChildModal'
import PinEntryModal from '@/components/auth/PinEntryModal'

export default function ChildSelectPage() {
  const { user, children, selectChild, currentChild, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [parentPin, setParentPin] = useState<string | null>(null)
  const [pendingChildId, setPendingChildId] = useState<string | null>(null)

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

        {/* Sign Out button - subtle positioning */}
        <div className="flex justify-end mb-6">
          <Button
            variant="ghost"
            onClick={handleLogout}
            size="sm"
            className="text-text-muted hover:text-text-primary"
          >
            Sign Out
          </Button>
        </div>

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
      </div>
    </div>
  )
}
