import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Card from '@/components/ui/Card'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in to onboarding (will check user_type there)
  useEffect(() => {
    if (user) {
      navigate('/onboarding')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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

        {/* Auth Card with gradient border */}
        <div className="bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30 p-1 rounded-3xl shadow-xl">
          <div className="bg-white rounded-3xl overflow-hidden">
            {showLogin ? (
              <LoginForm onSwitchToSignup={() => setShowLogin(false)} />
            ) : (
              <SignupForm onSwitchToLogin={() => setShowLogin(true)} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-text-muted">
          <p>Inspired by the Kumon Method</p>
        </div>
      </div>
    </div>
  )
}
