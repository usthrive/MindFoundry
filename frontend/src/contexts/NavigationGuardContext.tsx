/**
 * NavigationGuardContext
 * Provides protected navigation for exiting child view to parent areas
 *
 * When a child is using the app, navigating to parent areas (like /select-child)
 * requires parent verification (PIN if set, or math challenge as fallback).
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { getParentPin } from '@/services/userService'
import ParentVerification from '@/components/auth/ParentVerification'

interface NavigationGuardContextType {
  /**
   * Navigate to a path with protection for parent areas
   * If navigating from child view to a parent area and PIN is set, shows verification modal
   */
  navigateWithGuard: (path: string) => void

  /**
   * Check if a path is a protected parent area
   */
  isParentArea: (path: string) => boolean

  /**
   * Whether parent mode is currently active (parent has verified)
   * Used to show/hide parent-only UI elements like Settings
   */
  isParentMode: boolean

  /**
   * Request parent mode activation (shows verification if PIN is set)
   * Used when parent wants to access Settings
   */
  requestParentMode: () => void

  /**
   * Exit parent mode (go back to child mode)
   */
  exitParentMode: () => void
}

const NavigationGuardContext = createContext<NavigationGuardContextType | null>(null)

// Routes that are considered "parent areas" requiring verification to access from child view
const PARENT_AREAS = ['/select-child', '/']

export function NavigationGuardProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { user, currentChild } = useAuth()

  // Verification modal state
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const [hasPin, setHasPin] = useState(false)
  const [pinLoaded, setPinLoaded] = useState(false)

  // Parent mode state - tracks if parent has verified in current session
  const [isParentMode, setIsParentMode] = useState(false)
  const [pendingParentModeRequest, setPendingParentModeRequest] = useState(false)

  // Check if parent has PIN on mount (to know if verification is needed)
  useEffect(() => {
    async function checkPin() {
      if (user) {
        const pin = await getParentPin(user.id)
        setHasPin(!!pin)
        setPinLoaded(true)
      } else {
        setHasPin(false)
        setPinLoaded(true)
      }
    }
    checkPin()
  }, [user])

  // Check if a path is a protected parent area
  const isParentArea = useCallback((path: string): boolean => {
    return PARENT_AREAS.some(area => path === area || path.startsWith(area + '/'))
  }, [])

  // Navigate with optional verification protection
  const navigateWithGuard = useCallback(async (path: string) => {
    // If already on the target page, no guard needed
    const currentPath = window.location.pathname
    if (currentPath === path) {
      return // Already there, do nothing
    }

    // Determine if we're in child view (currentChild is set)
    const isChildView = !!currentChild
    const isGoingToParentArea = isParentArea(path)

    // Only require PIN when exiting from study page to parent area
    // Videos and Progress pages can navigate freely without PIN
    const isLeavingStudy = currentPath === '/study' || currentPath.startsWith('/study/')

    // If leaving study page to go to parent area and PIN is set, require verification
    if (isChildView && isGoingToParentArea && isLeavingStudy && pinLoaded && hasPin) {
      // PIN exists and leaving study - show verification modal
      setPendingPath(path)
      setShowVerificationModal(true)
      return
    }

    // No verification needed - navigate directly
    navigate(path)
  }, [currentChild, hasPin, pinLoaded, isParentArea, navigate])

  // Handle successful verification
  const handleVerificationSuccess = useCallback(() => {
    setShowVerificationModal(false)

    // Handle parent mode request
    if (pendingParentModeRequest) {
      setIsParentMode(true)
      setPendingParentModeRequest(false)
    }

    // Handle navigation request
    if (pendingPath) {
      navigate(pendingPath)
      setPendingPath(null)
    }
  }, [pendingPath, pendingParentModeRequest, navigate])

  // Handle verification modal cancel
  const handleVerificationCancel = useCallback(() => {
    setShowVerificationModal(false)
    setPendingPath(null)
    setPendingParentModeRequest(false)
  }, [])

  // Request parent mode activation
  const requestParentMode = useCallback(() => {
    // If no child is selected (no child mode), parent mode is automatic
    if (!currentChild) {
      setIsParentMode(true)
      return
    }

    // If no PIN is set, allow parent mode directly
    if (pinLoaded && !hasPin) {
      setIsParentMode(true)
      return
    }

    // PIN is set - require verification
    setPendingParentModeRequest(true)
    setShowVerificationModal(true)
  }, [currentChild, pinLoaded, hasPin])

  // Exit parent mode
  const exitParentMode = useCallback(() => {
    setIsParentMode(false)
  }, [])

  // Reset parent mode when child changes
  useEffect(() => {
    setIsParentMode(false)
  }, [currentChild?.id])

  return (
    <NavigationGuardContext.Provider value={{
      navigateWithGuard,
      isParentArea,
      isParentMode,
      requestParentMode,
      exitParentMode,
    }}>
      {children}

      {/* Parent Verification Modal */}
      <ParentVerification
        isOpen={showVerificationModal}
        onSuccess={handleVerificationSuccess}
        onCancel={handleVerificationCancel}
        title="Parent Access"
        description={pendingParentModeRequest ? "Enter PIN to access parent settings" : "Verify to exit child mode"}
      />
    </NavigationGuardContext.Provider>
  )
}

/**
 * Hook to access navigation guard functionality
 * Must be used within NavigationGuardProvider
 */
export function useNavigationGuard(): NavigationGuardContextType {
  const context = useContext(NavigationGuardContext)
  if (!context) {
    throw new Error('useNavigationGuard must be used within NavigationGuardProvider')
  }
  return context
}
