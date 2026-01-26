/**
 * DevTierPanel Component
 * Development-only floating panel for testing feature access at different tiers
 *
 * Features:
 * - Switch between subscription tiers instantly
 * - See all features and their access status
 * - Visual indicator when override is active
 * - Only visible in development mode
 */

import { useState, useEffect } from 'react'
import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import {
  FEATURES,
  TIER_NAMES,
  FEATURE_METADATA,
  FEATURE_CATEGORIES,
  type FeatureId,
} from '@/config/features'
import type { SubscriptionTierId, FeatureCategory } from '@/types'

// Only render in development mode
const isDev = import.meta.env.DEV

export default function DevTierPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'tiers' | 'features'>('tiers')

  // Return null immediately if not in dev mode
  if (!isDev) return null

  return <DevTierPanelContent isOpen={isOpen} setIsOpen={setIsOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
}

function DevTierPanelContent({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  activeTab: 'tiers' | 'features'
  setActiveTab: (tab: 'tiers' | 'features') => void
}) {
  const {
    effectiveTier,
    effectiveTierName,
    isDevOverride,
    hasFeature,
    setDevTierOverride,
    clearDevTierOverride,
    getDevTierOverride,
  } = useFeatureAccess()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const tiers: SubscriptionTierId[] = ['foundation', 'foundation_ai', 'vip']
  const currentOverride = getDevTierOverride?.()

  const categories = Object.entries(FEATURE_CATEGORIES) as [FeatureCategory, typeof FEATURE_CATEGORIES[FeatureCategory]][]

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium shadow-lg transition-all
          ${isDevOverride
            ? 'bg-amber-500 text-white animate-pulse'
            : 'bg-purple-600 text-white hover:bg-purple-700'
          }
        `}
      >
        <span>🧪</span>
        <span>DEV: {effectiveTierName || 'None'}</span>
        {isDevOverride && <span className="text-amber-200">(Override)</span>}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 text-white px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Feature Testing Panel</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-purple-200 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-purple-200 mt-1">
              Test features at different subscription tiers
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('tiers')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                activeTab === 'tiers'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tiers
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                activeTab === 'features'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Features
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {activeTab === 'tiers' ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-3">
                  Select a tier to override your current subscription:
                </p>

                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setDevTierOverride?.(tier)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all
                      ${effectiveTier === tier
                        ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-500'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                      ${currentOverride === tier ? 'ring-2 ring-amber-400' : ''}
                    `}
                  >
                    <span className="font-medium">{TIER_NAMES[tier]}</span>
                    <span className="flex items-center gap-2">
                      {effectiveTier === tier && <span className="text-purple-500">✓</span>}
                      {currentOverride === tier && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                          Override
                        </span>
                      )}
                    </span>
                  </button>
                ))}

                {/* Clear Override Button */}
                {isDevOverride && (
                  <button
                    onClick={() => clearDevTierOverride?.()}
                    className="w-full mt-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Clear Override (Use Real Subscription)
                  </button>
                )}

                {/* Current Status */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Current Status:</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {isDevOverride ? (
                      <span className="text-amber-600">
                        Override Active: {effectiveTierName}
                      </span>
                    ) : (
                      <span className="text-green-600">
                        Using Real: {effectiveTierName || 'No Subscription'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map(([category, config]) => {
                  const categoryFeatures = Object.values(FEATURES).filter(
                    (fid) => FEATURE_METADATA[fid as FeatureId]?.category === category
                  )

                  if (categoryFeatures.length === 0) return null

                  return (
                    <div key={category}>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <span>{config.icon}</span>
                        <span>{config.name}</span>
                      </h4>
                      <div className="space-y-1">
                        {categoryFeatures.map((featureId) => {
                          const metadata = FEATURE_METADATA[featureId as FeatureId]
                          const hasAccess = hasFeature(featureId as FeatureId)

                          return (
                            <div
                              key={featureId}
                              className={`
                                flex items-center justify-between px-3 py-2 rounded-lg text-sm
                                ${hasAccess ? 'bg-green-50' : 'bg-gray-50'}
                              `}
                            >
                              <div className="flex items-center gap-2">
                                <span>{metadata?.icon || '📦'}</span>
                                <span className="text-gray-700">{metadata?.name || featureId}</span>
                              </div>
                              <span className={hasAccess ? 'text-green-600' : 'text-gray-400'}>
                                {hasAccess ? '✅' : '❌'}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This panel is only visible in development mode
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
