/**
 * Video Preferences Form
 * Phase 1.18: YouTube Video Integration
 *
 * Parental controls for video settings on the dashboard.
 * Allows parents to enable/disable videos, set limits, and configure suggestions.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { VideoPreferences } from '@/types'
import { getVideoPreferences, updateVideoPreferences } from '@/services/videoService'

interface VideoPreferencesFormProps {
  childId: string
  childName: string
}

export default function VideoPreferencesForm({
  childId,
  childName,
}: VideoPreferencesFormProps) {
  const [preferences, setPreferences] = useState<VideoPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    async function loadPreferences() {
      setLoading(true)
      try {
        const prefs = await getVideoPreferences(childId)
        setPreferences(prefs)
      } catch (err) {
        console.error('Failed to load video preferences:', err)
      } finally {
        setLoading(false)
      }
    }

    if (childId) {
      loadPreferences()
    }
  }, [childId])

  const handleChange = (key: keyof VideoPreferences, value: any) => {
    if (!preferences) return

    setPreferences({
      ...preferences,
      [key]: value,
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!preferences || !hasChanges) return

    setSaving(true)
    try {
      await updateVideoPreferences(childId, {
        videosEnabled: preferences.videosEnabled,
        autoSuggestEnabled: preferences.autoSuggestEnabled,
        suggestThreshold: preferences.suggestThreshold,
        showInConceptIntro: preferences.showInConceptIntro,
        showInReview: preferences.showInReview,
        maxVideosPerDay: preferences.maxVideosPerDay,
        maxVideoDurationMinutes: preferences.maxVideoDurationMinutes,
      })
      setHasChanges(false)
    } catch (err) {
      console.error('Failed to save video preferences:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-40 mb-4" />
          <div className="h-10 bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  if (!preferences) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-blue-100/50 p-5"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">⚙️</span>
          <h3 className="text-sm font-semibold text-gray-700">Video Settings</h3>
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400"
        >
          ▼
        </motion.span>
      </button>

      {/* Quick Toggle */}
      <div className="mt-3 flex items-center justify-between py-2">
        <span className="text-sm text-gray-600">Enable educational videos</span>
        <button
          onClick={() => handleChange('videosEnabled', !preferences.videosEnabled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            preferences.videosEnabled ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <motion.div
            animate={{ x: preferences.videosEnabled ? 24 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
          />
        </button>
      </div>

      {/* Expanded Settings */}
      <AnimatePresence>
        {isExpanded && preferences.videosEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t border-gray-100 space-y-4">
              {/* Auto-suggest toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Auto-suggest videos</p>
                  <p className="text-xs text-gray-500">
                    Suggest videos when {childName} struggles
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleChange('autoSuggestEnabled', !preferences.autoSuggestEnabled)
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    preferences.autoSuggestEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: preferences.autoSuggestEnabled ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                  />
                </button>
              </div>

              {/* Suggestion threshold */}
              {preferences.autoSuggestEnabled && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-700">Suggest after mistakes</p>
                    <span className="text-sm font-medium text-blue-600">
                      {preferences.suggestThreshold}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={5}
                    value={preferences.suggestThreshold}
                    onChange={(e) =>
                      handleChange('suggestThreshold', parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>2 (early)</span>
                    <span>5 (patient)</span>
                  </div>
                </div>
              )}

              {/* Show in concept intro */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">Videos in concept intro</p>
                  <p className="text-xs text-gray-500">Show video option for new topics</p>
                </div>
                <button
                  onClick={() =>
                    handleChange('showInConceptIntro', !preferences.showInConceptIntro)
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    preferences.showInConceptIntro ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: preferences.showInConceptIntro ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                  />
                </button>
              </div>

              {/* Daily limits */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-sm font-medium text-gray-700 mb-3">Daily Limits</p>

                <div className="space-y-3">
                  {/* Max videos per day */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Max videos/day</span>
                      <span className="text-sm font-medium text-gray-800">
                        {preferences.maxVideosPerDay}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={preferences.maxVideosPerDay}
                      onChange={(e) =>
                        handleChange('maxVideosPerDay', parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Max duration */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Max duration</span>
                      <span className="text-sm font-medium text-gray-800">
                        {preferences.maxVideoDurationMinutes} min
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={15}
                      value={preferences.maxVideoDurationMinutes}
                      onChange={(e) =>
                        handleChange('maxVideoDurationMinutes', parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save button */}
              {hasChanges && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
