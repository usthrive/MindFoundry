import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigationGuard } from '@/contexts/NavigationGuardContext'
import { SettingsBottomSheet } from '@/components/settings'

interface NavItem {
  icon: string
  label: string
  path: string
  requiresAuth: boolean
}

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, currentChild } = useAuth()
  const { navigateWithGuard, isParentArea } = useNavigationGuard()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const navItems: NavItem[] = [
    { icon: '🏠', label: 'Home', path: '/dashboard', requiresAuth: true },
    { icon: '📷', label: 'Homework', path: '/homework', requiresAuth: true },
    { icon: '📺', label: 'Videos', path: '/videos', requiresAuth: true },
    { icon: '📊', label: 'Progress', path: '/progress', requiresAuth: true }
  ]

  // Don't show nav on login/onboarding pages or video watch page (immersive mode)
  if (
    location.pathname === '/login' ||
    location.pathname === '/onboarding' ||
    location.pathname.startsWith('/videos/watch')
  ) {
    return null
  }

  // Don't show if not authenticated
  if (!user) {
    return null
  }

  // Get current worksheet progress for the mini progress bar
  const getProgressText = () => {
    if (location.pathname === '/study' && currentChild) {
      return `Level ${currentChild.current_level} • Worksheet ${currentChild.current_worksheet}/200`
    }
    return null
  }

  const progressText = getProgressText()

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        {/* Mini progress indicator */}
        {progressText && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-1">
            <p className="text-xs text-center text-gray-600">{progressText}</p>
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            // Handle navigation click - use guarded navigation for parent areas
            const handleNavClick = () => {
              if (isParentArea(item.path)) {
                // Parent areas require PIN protection when exiting child view
                navigateWithGuard(item.path)
              } else {
                navigate(item.path)
              }
            }

            return (
              <button
                key={item.path}
                onClick={handleNavClick}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                disabled={!user && item.requiresAuth}
              >
                <span className={`text-2xl mb-1 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </button>
            )
          })}

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all ${
              isSettingsOpen ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-2xl mb-1">⚙️</span>
            <span className="text-xs font-medium">Settings</span>
          </button>
        </nav>
      </div>

      {/* Settings Bottom Sheet */}
      <SettingsBottomSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  )
}
