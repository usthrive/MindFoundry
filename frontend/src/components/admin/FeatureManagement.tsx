/**
 * Feature Management Admin Panel
 * Allows administrators to manage feature-to-tier mappings
 *
 * Features:
 * - View all features organized by category
 * - Toggle features on/off for each subscription tier
 * - Set usage limits for features
 * - See feature inventory at a glance
 * - Changes are saved to database in real-time
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  TIER_NAMES,
  FEATURE_CATEGORIES,
} from '@/config/features'
import type { SubscriptionTierId, Feature, FeatureCategory } from '@/types'

interface FeatureMapping {
  featureId: string
  tierId: SubscriptionTierId
  isEnabled: boolean
  usageLimit: number | null
  limitPeriod: string | null
}

interface FeatureWithMappings extends Feature {
  mappings: Record<SubscriptionTierId, FeatureMapping>
}

export default function FeatureManagement() {
  const [features, setFeatures] = useState<FeatureWithMappings[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const tiers: SubscriptionTierId[] = ['foundation', 'foundation_ai', 'vip']

  // Load features and mappings
  const loadFeatures = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch features
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('*')
        .order('display_order', { ascending: true })

      if (featuresError) throw featuresError

      // Fetch all mappings
      const { data: mappingsData, error: mappingsError } = await supabase
        .from('feature_tier_mappings')
        .select('*')

      if (mappingsError) throw mappingsError

      // Combine features with their mappings
      const featuresWithMappings: FeatureWithMappings[] = (featuresData || []).map((feature) => {
        const mappings: Record<SubscriptionTierId, FeatureMapping> = {} as Record<SubscriptionTierId, FeatureMapping>

        tiers.forEach((tier) => {
          const mapping = mappingsData?.find(
            (m) => m.feature_id === feature.id && m.tier_id === tier
          )
          mappings[tier] = {
            featureId: feature.id,
            tierId: tier,
            isEnabled: mapping?.is_enabled ?? false,
            usageLimit: mapping?.usage_limit ?? null,
            limitPeriod: mapping?.limit_period ?? null,
          }
        })

        return {
          id: feature.id,
          name: feature.name,
          description: feature.description,
          category: feature.category as FeatureCategory,
          isActive: feature.is_active,
          previewAvailable: feature.preview_available,
          displayOrder: feature.display_order,
          icon: feature.icon,
          mappings,
        }
      })

      setFeatures(featuresWithMappings)
    } catch (err) {
      console.error('Error loading features:', err)
      setError('Failed to load features. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFeatures()
  }, [loadFeatures])

  // Toggle feature for a tier
  const toggleFeatureForTier = async (featureId: string, tierId: SubscriptionTierId, enabled: boolean) => {
    const savingKey = `${featureId}-${tierId}`
    setSaving(savingKey)
    setError(null)

    try {
      // Upsert the mapping
      const { error: upsertError } = await supabase
        .from('feature_tier_mappings')
        .upsert(
          {
            feature_id: featureId,
            tier_id: tierId,
            is_enabled: enabled,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'feature_id,tier_id' }
        )

      if (upsertError) throw upsertError

      // Update local state
      setFeatures((prev) =>
        prev.map((f) =>
          f.id === featureId
            ? {
                ...f,
                mappings: {
                  ...f.mappings,
                  [tierId]: { ...f.mappings[tierId], isEnabled: enabled },
                },
              }
            : f
        )
      )

      setSuccessMessage(`Updated ${featureId} for ${TIER_NAMES[tierId]}`)
      setTimeout(() => setSuccessMessage(null), 2000)
    } catch (err) {
      console.error('Error toggling feature:', err)
      setError('Failed to update feature. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  // Toggle feature globally (is_active)
  const toggleFeatureActive = async (featureId: string, active: boolean) => {
    setSaving(featureId)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('features')
        .update({ is_active: active, updated_at: new Date().toISOString() })
        .eq('id', featureId)

      if (updateError) throw updateError

      // Update local state
      setFeatures((prev) =>
        prev.map((f) => (f.id === featureId ? { ...f, isActive: active } : f))
      )

      setSuccessMessage(`${active ? 'Enabled' : 'Disabled'} ${featureId} globally`)
      setTimeout(() => setSuccessMessage(null), 2000)
    } catch (err) {
      console.error('Error toggling feature active:', err)
      setError('Failed to update feature. Please try again.')
    } finally {
      setSaving(null)
    }
  }

  // Group features by category
  const featuresByCategory = features.reduce<Record<FeatureCategory, FeatureWithMappings[]>>(
    (acc, feature) => {
      const category = feature.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(feature)
      return acc
    },
    {} as Record<FeatureCategory, FeatureWithMappings[]>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feature Management</h1>
        <p className="text-gray-600 mt-1">
          Manage which features are available at each subscription tier
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      {/* Feature Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-700">Feature</div>
          <div className="text-sm font-semibold text-gray-700 text-center">Active</div>
          {tiers.map((tier) => (
            <div key={tier} className="text-sm font-semibold text-gray-700 text-center">
              {TIER_NAMES[tier]}
            </div>
          ))}
        </div>

        {/* Feature Rows by Category */}
        {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => {
          const categoryConfig = FEATURE_CATEGORIES[category as FeatureCategory]

          return (
            <div key={category}>
              {/* Category Header */}
              <div className="px-6 py-3 bg-gray-100 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <span>{categoryConfig?.icon || '📦'}</span>
                  <span>{categoryConfig?.name || category}</span>
                  <span className="text-gray-400">({categoryFeatures.length})</span>
                </div>
              </div>

              {/* Features in Category */}
              {categoryFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className={`grid grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !feature.isActive ? 'opacity-50' : ''
                  }`}
                >
                  {/* Feature Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{feature.icon || '📦'}</span>
                      <span className="font-medium text-gray-900">{feature.name}</span>
                      {feature.previewAvailable && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          Preview
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                    <code className="text-xs text-gray-400 mt-1 block">{feature.id}</code>
                  </div>

                  {/* Global Active Toggle */}
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => toggleFeatureActive(feature.id, !feature.isActive)}
                      disabled={saving === feature.id}
                      className={`
                        relative w-12 h-6 rounded-full transition-colors
                        ${feature.isActive ? 'bg-green-500' : 'bg-gray-300'}
                        ${saving === feature.id ? 'opacity-50' : ''}
                      `}
                    >
                      <span
                        className={`
                          absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform
                          ${feature.isActive ? 'left-7' : 'left-1'}
                        `}
                      />
                    </button>
                  </div>

                  {/* Tier Toggles */}
                  {tiers.map((tier) => {
                    const mapping = feature.mappings[tier]
                    const savingKey = `${feature.id}-${tier}`
                    const isDisabled = !feature.isActive || saving === savingKey

                    return (
                      <div key={tier} className="flex items-center justify-center">
                        <button
                          onClick={() => toggleFeatureForTier(feature.id, tier, !mapping.isEnabled)}
                          disabled={isDisabled}
                          className={`
                            w-8 h-8 rounded-lg flex items-center justify-center transition-all
                            ${mapping.isEnabled
                              ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }
                            ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          `}
                        >
                          {saving === savingKey ? (
                            <span className="animate-spin">⏳</span>
                          ) : mapping.isEnabled ? (
                            '✓'
                          ) : (
                            '−'
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {tiers.map((tier) => {
          const enabledCount = features.filter(
            (f) => f.isActive && f.mappings[tier]?.isEnabled
          ).length
          const totalCount = features.filter((f) => f.isActive).length

          return (
            <div key={tier} className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900">{TIER_NAMES[tier]}</h3>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {enabledCount} <span className="text-sm text-gray-500 font-normal">/ {totalCount}</span>
              </p>
              <p className="text-xs text-gray-500">features enabled</p>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-green-500"></span>
            <span>Feature is globally active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-300"></span>
            <span>Feature is globally disabled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-purple-100 text-purple-600 text-xs flex items-center justify-center">✓</span>
            <span>Enabled for tier</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-gray-100 text-gray-400 text-xs flex items-center justify-center">−</span>
            <span>Disabled for tier</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">How to Use</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Active Toggle</strong>: Turn features on/off globally (affects all tiers)</li>
          <li>• <strong>Tier Checkmarks</strong>: Enable/disable features for specific subscription tiers</li>
          <li>• <strong>Preview Badge</strong>: Features that show a blurred preview for lower tiers</li>
          <li>• Changes are saved automatically to the database</li>
        </ul>
      </div>
    </div>
  )
}
