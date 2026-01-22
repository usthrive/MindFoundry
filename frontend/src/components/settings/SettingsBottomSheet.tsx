/**
 * SettingsBottomSheet Component
 * A bottom sheet that slides up from the bottom of the screen
 * Contains all parent settings: PIN, Children, Subscription, Help, Sign Out
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import PinSettingsModal from './PinSettingsModal'
import ChildrenSettings from './ChildrenSettings'
import SubscriptionSettings from './SubscriptionSettings'
import HelpSupport from './HelpSupport'

interface SettingsBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

type SettingsView = 'main' | 'pin' | 'children' | 'subscription' | 'help'

export default function SettingsBottomSheet({ isOpen, onClose }: SettingsBottomSheetProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [currentView, setCurrentView] = useState<SettingsView>('main')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      onClose()
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleClose = () => {
    setCurrentView('main')
    onClose()
  }

  const handleBack = () => {
    setCurrentView('main')
  }

  // Menu items for the main settings view
  const menuItems = [
    {
      id: 'pin',
      icon: '🔒',
      label: 'PIN & Security',
      description: 'Set up or change your parent PIN',
      onClick: () => setCurrentView('pin'),
    },
    {
      id: 'children',
      icon: '👨‍👩‍👧‍👦',
      label: 'Children',
      description: 'Manage child profiles',
      onClick: () => setCurrentView('children'),
    },
    {
      id: 'subscription',
      icon: '💳',
      label: 'Subscription',
      description: 'View and manage your plan',
      onClick: () => setCurrentView('subscription'),
    },
    {
      id: 'help',
      icon: '❓',
      label: 'Help & Support',
      description: 'FAQ, feedback, contact us',
      onClick: () => setCurrentView('help'),
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-hidden"
            style={{ maxWidth: '100%' }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(85vh-40px)]">
              {/* Main Menu View */}
              {currentView === 'main' && (
                <div className="px-4 pb-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
                      <span>⚙️</span> Settings
                    </h2>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={item.onClick}
                        className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <span className="text-gray-400">›</span>
                      </button>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="my-4 border-t border-gray-200" />

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors text-left"
                  >
                    <span className="text-2xl">🚪</span>
                    <div className="flex-1">
                      <p className="font-medium text-red-600">
                        {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                      </p>
                    </div>
                  </button>

                  {/* Bottom padding for safe area */}
                  <div className="h-4" />
                </div>
              )}

              {/* PIN Settings View */}
              {currentView === 'pin' && (
                <PinSettingsModal onBack={handleBack} onClose={handleClose} />
              )}

              {/* Children Settings View */}
              {currentView === 'children' && (
                <ChildrenSettings onBack={handleBack} onClose={handleClose} />
              )}

              {/* Subscription Settings View */}
              {currentView === 'subscription' && (
                <SubscriptionSettings onBack={handleBack} />
              )}

              {/* Help & Support View */}
              {currentView === 'help' && (
                <HelpSupport onBack={handleBack} onClose={handleClose} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
