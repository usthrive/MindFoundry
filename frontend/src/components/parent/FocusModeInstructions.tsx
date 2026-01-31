/**
 * FocusModeInstructions Component
 *
 * Provides instructions for enabling device-level focus modes:
 * - iOS: Guided Access
 * - Android: Screen Pinning
 *
 * These features help parents lock children into the app during study sessions,
 * preventing distractions from other apps or notifications.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FocusModeInstructionsProps {
  className?: string
  defaultExpanded?: boolean
}

type Platform = 'ios' | 'android'

const FocusModeInstructions = ({
  className,
  defaultExpanded = false
}: FocusModeInstructionsProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [activePlatform, setActivePlatform] = useState<Platform>('ios')

  return (
    <div className={cn('bg-blue-50 border border-blue-200 rounded-xl overflow-hidden', className)}>
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h4 className="font-semibold text-blue-900">Enable Focus Lock</h4>
            <p className="text-sm text-blue-700">Recommended for distraction-free practice</p>
          </div>
        </div>
        <span className={cn(
          'text-blue-600 transition-transform',
          isExpanded ? 'rotate-180' : ''
        )}>
          ▼
        </span>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-blue-200">
          {/* Platform Tabs */}
          <div className="flex gap-2 mt-4 mb-4">
            <button
              onClick={() => setActivePlatform('ios')}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors',
                activePlatform === 'ios'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
              )}
            >
              iPhone / iPad
            </button>
            <button
              onClick={() => setActivePlatform('android')}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors',
                activePlatform === 'android'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
              )}
            >
              Android
            </button>
          </div>

          {/* iOS Instructions */}
          {activePlatform === 'ios' && (
            <div className="space-y-3">
              <h5 className="font-semibold text-blue-900 flex items-center gap-2">
                <span>🍎</span> Guided Access (iOS)
              </h5>
              <p className="text-sm text-blue-800">
                Guided Access locks your child into MindFoundry and disables the home button.
              </p>

              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">One-time setup:</p>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">1.</span>
                    <span>Go to <strong>Settings</strong> → <strong>Accessibility</strong> → <strong>Guided Access</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">2.</span>
                    <span>Turn <strong>ON</strong> Guided Access</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">3.</span>
                    <span>Tap <strong>Passcode Settings</strong> and set a passcode</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">To start a focus session:</p>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-semibold text-green-600">1.</span>
                    <span>Open MindFoundry and navigate to the Study page</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-green-600">2.</span>
                    <span><strong>Triple-click</strong> the side button (or home button)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-green-600">3.</span>
                    <span>Tap <strong>Start</strong> in the top right corner</span>
                  </li>
                </ol>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">To end the session:</p>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-semibold text-orange-600">1.</span>
                    <span><strong>Triple-click</strong> the side button (or home button)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-orange-600">2.</span>
                    <span>Enter your passcode</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-orange-600">3.</span>
                    <span>Tap <strong>End</strong> in the top left corner</span>
                  </li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-yellow-800">
                  <strong>Tip:</strong> You can also enable Face ID / Touch ID in Passcode Settings for quicker unlocking.
                </p>
              </div>
            </div>
          )}

          {/* Android Instructions */}
          {activePlatform === 'android' && (
            <div className="space-y-3">
              <h5 className="font-semibold text-blue-900 flex items-center gap-2">
                <span>🤖</span> Screen Pinning (Android)
              </h5>
              <p className="text-sm text-blue-800">
                Screen Pinning locks your child into MindFoundry until you enter a PIN.
              </p>

              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">One-time setup:</p>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">1.</span>
                    <span>Go to <strong>Settings</strong> → <strong>Security</strong> → <strong>Screen Pinning</strong></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">2.</span>
                    <span>Turn <strong>ON</strong> Screen Pinning</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-blue-600">3.</span>
                    <span>Enable "Ask for PIN before unpinning"</span>
                  </li>
                </ol>
                <p className="text-xs text-gray-500 mt-2">
                  Note: On some devices, this is under Security & Privacy, Lock Screen, or Advanced Settings.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">To start a focus session:</p>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-semibold text-green-600">1.</span>
                    <span>Open MindFoundry and navigate to the Study page</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-green-600">2.</span>
                    <span>Tap the <strong>Recent Apps</strong> button (square button)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-green-600">3.</span>
                    <span>Tap the app icon at the top of MindFoundry's card</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-green-600">4.</span>
                    <span>Select <strong>Pin</strong> or <strong>Pin this app</strong></span>
                  </li>
                </ol>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-gray-700 mb-3">To end the session:</p>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-semibold text-orange-600">1.</span>
                    <span>Press and hold <strong>Back</strong> and <strong>Recent Apps</strong> buttons together</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-orange-600">2.</span>
                    <span>Enter your PIN, pattern, or password</span>
                  </li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-yellow-800">
                  <strong>Samsung devices:</strong> Go to Settings → Biometrics and Security → Other Security Settings → Pin Windows
                </p>
              </div>
            </div>
          )}

          {/* Why This Matters */}
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <h6 className="font-medium text-purple-900 text-sm mb-1">Why Focus Lock?</h6>
            <p className="text-xs text-purple-800">
              Research shows that children learn best with uninterrupted practice time.
              Focus Lock prevents notifications and app-switching distractions, helping your child
              complete their full 10-problem session without interruption.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FocusModeInstructions
