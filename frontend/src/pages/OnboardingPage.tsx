import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getUserProfile, updateUserType, setParentPin } from '@/services/userService'
import UserTypeSelection from '@/components/auth/UserTypeSelection'
import StudentProfileForm from '@/components/children/StudentProfileForm'
import PinSetup from '@/components/auth/PinSetup'

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<'selection' | 'student-profile' | 'parent-pin'>('selection')
  const [loading, setLoading] = useState(false)
  const [userFullName, setUserFullName] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
      return
    }

    // Check if user already has a type set
    if (user) {
      getUserProfile(user.id).then((profile) => {
        if (profile) {
          setUserFullName(profile.full_name || '')

          // If user already has a type, redirect appropriately
          if (profile.user_type === 'parent') {
            console.log('User is a parent, redirecting to /select-child')
            navigate('/select-child')
          } else if (profile.user_type === 'student') {
            console.log('User is a student, redirecting to /practice')
            // Check if student already has a profile
            navigate('/practice')
          } else {
            console.log('User type is not set, showing selection screen')
            // user_type is null, show selection screen
            // No redirect needed, stay on onboarding page
          }
        } else {
          console.log('No profile found for user, this should not happen')
        }
      })
    }
  }, [user, authLoading, navigate])

  const handleSelectParent = async () => {
    if (!user) return

    setLoading(true)
    try {
      const success = await updateUserType(user.id, 'parent')
      if (success) {
        // Show PIN setup step for parents
        setStep('parent-pin')
      } else {
        console.error('Failed to set user type as parent')
      }
    } catch (error) {
      console.error('Error setting user type:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePinComplete = async (pin: string) => {
    if (!user) return

    setLoading(true)
    try {
      await setParentPin(user.id, pin)
      navigate('/select-child')
    } catch (error) {
      console.error('Error setting parent PIN:', error)
      navigate('/select-child')
    } finally {
      setLoading(false)
    }
  }

  const handlePinSkip = () => {
    navigate('/select-child')
  }

  const handleSelectStudent = async () => {
    setStep('student-profile')
  }

  const handleStudentProfileComplete = () => {
    // Student profile created, navigate to practice
    navigate('/practice')
  }

  const handleBackFromProfile = () => {
    setStep('selection')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧠</div>
          <p className="text-xl text-text-secondary">Setting up your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <img
            src="/logo.png"
            alt="MindFoundry"
            className="h-36 sm:h-48 mx-auto mb-6"
          />
          <p className="text-xl sm:text-2xl text-text-secondary font-medium">
            Master Math at Your Own Pace
          </p>
        </div>

        {/* Content based on step */}
        {step === 'selection' && (
          <UserTypeSelection
            onSelectParent={handleSelectParent}
            onSelectStudent={handleSelectStudent}
            loading={loading}
          />
        )}

        {step === 'parent-pin' && (
          <PinSetup
            onComplete={handlePinComplete}
            onSkip={handlePinSkip}
          />
        )}

        {step === 'student-profile' && (
          <StudentProfileForm
            fullName={userFullName}
            onComplete={handleStudentProfileComplete}
            onBack={handleBackFromProfile}
          />
        )}
      </div>
    </div>
  )
}