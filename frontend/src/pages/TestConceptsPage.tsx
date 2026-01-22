/**
 * TestConceptsPage - Test page for concept introduction system
 * Phase 1.19: Database-backed concept tracking
 *
 * Allows testing concept introduction modals, resetting seen concepts,
 * and jumping to specific level/worksheet combinations.
 */

import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import {
  clearSeenConceptsWithDB,
  loadSeenConceptsFromDB,
  getUnseenNewConceptsWithDB,
  getSeenConcepts,
} from '@/services/conceptIntroService'
import {
  CONCEPT_INTRODUCTION,
  getNewConceptsAtWorksheet,
} from '@/services/generators/concept-availability'
import { LEVEL_ORDER, type KumonLevel } from '@/services/generators/types'
import type { Database } from '@/lib/supabase'
import ConceptIntroModal from '@/components/concept-intro/ConceptIntroModal'

type Child = Database['public']['Tables']['children']['Row']

// Group levels by category for display
const LEVEL_CATEGORIES = {
  'Pre-K': ['7A', '6A', '5A', '4A'],
  'Elementary Basic': ['3A', '2A', 'A', 'B'],
  'Elementary Advanced': ['C', 'D', 'E', 'F'],
  'Middle School': ['G', 'H', 'I'],
  'High School': ['J', 'K'],
  'Calculus': ['L', 'M', 'N', 'O'],
}

// Test worksheet positions
const TEST_WORKSHEETS = [1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 101, 111, 121, 131, 141, 151, 161, 171, 181, 191]

export default function TestConceptsPage() {
  // State
  const { children } = useAuth()
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [allChildren, setAllChildren] = useState<Child[]>([])
  const [seenConcepts, setSeenConcepts] = useState<string[]>([])
  const [selectedLevel, setSelectedLevel] = useState<KumonLevel>('7A')
  const [selectedWorksheet, setSelectedWorksheet] = useState<number>(1)
  const [conceptsAtWorksheet, setConceptsAtWorksheet] = useState<string[]>([])
  const [unseenConcepts, setUnseenConcepts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Concept intro modal state
  const [showConceptModal, setShowConceptModal] = useState(false)
  const [conceptsToShow, setConceptsToShow] = useState<string[]>([])

  // Load all children on mount (for testing without auth)
  useEffect(() => {
    const loadChildren = async () => {
      if (children && children.length > 0) {
        setAllChildren(children)
        return
      }

      // Fallback: load all children from database for testing
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .order('name', { ascending: true })
        .limit(50)

      if (!error && data) {
        setAllChildren(data)
      }
    }

    loadChildren()
  }, [children])

  // Load seen concepts when child changes
  useEffect(() => {
    if (selectedChild) {
      loadSeenConceptsFromDB(selectedChild.id).then((concepts) => {
        setSeenConcepts(concepts)
      })
    } else {
      setSeenConcepts([])
    }
  }, [selectedChild])

  // Update concepts at worksheet when level/worksheet changes
  useEffect(() => {
    const concepts = getNewConceptsAtWorksheet(selectedLevel, selectedWorksheet)
    setConceptsAtWorksheet(concepts)

    if (selectedChild) {
      const seen = getSeenConcepts(selectedChild.id)
      setUnseenConcepts(concepts.filter((c) => !seen.includes(c)))
    } else {
      setUnseenConcepts(concepts)
    }
  }, [selectedLevel, selectedWorksheet, selectedChild, seenConcepts])

  // Reset seen concepts for selected child
  const handleResetConcepts = useCallback(async () => {
    if (!selectedChild) {
      setMessage({ type: 'error', text: 'Please select a child first' })
      return
    }

    const confirmed = window.confirm(
      `Reset all seen concept introductions for ${selectedChild.name}? This will show concept intro modals again for all concepts.`
    )
    if (!confirmed) return

    setLoading(true)
    try {
      await clearSeenConceptsWithDB(selectedChild.id)
      const concepts = await loadSeenConceptsFromDB(selectedChild.id)
      setSeenConcepts(concepts)
      setMessage({ type: 'success', text: 'Concept introductions have been reset!' })
    } catch (error) {
      console.error('Failed to reset concepts:', error)
      setMessage({ type: 'error', text: 'Failed to reset concepts. Please try again.' })
    } finally {
      setLoading(false)
    }
  }, [selectedChild])

  // Show concept intro modal for current worksheet
  const handleShowConceptIntro = useCallback(async () => {
    if (!selectedChild) {
      setMessage({ type: 'error', text: 'Please select a child first' })
      return
    }

    const unseen = await getUnseenNewConceptsWithDB(selectedChild.id, selectedLevel, selectedWorksheet)

    if (unseen.length === 0) {
      setMessage({
        type: 'error',
        text: 'No unseen concepts at this worksheet. Try resetting concepts or selecting a different worksheet.',
      })
      return
    }

    setConceptsToShow(unseen)
    setShowConceptModal(true)
  }, [selectedChild, selectedLevel, selectedWorksheet])

  // Handle concept intro modal close
  const handleConceptModalClose = useCallback(() => {
    setShowConceptModal(false)
    setConceptsToShow([])
    // Refresh seen concepts
    if (selectedChild) {
      loadSeenConceptsFromDB(selectedChild.id).then(setSeenConcepts)
    }
  }, [selectedChild])

  // Get all concepts as a sorted list for display
  const allConcepts = Object.entries(CONCEPT_INTRODUCTION)
    .sort((a, b) => {
      const levelA = LEVEL_ORDER.indexOf(a[1].level)
      const levelB = LEVEL_ORDER.indexOf(b[1].level)
      if (levelA !== levelB) return levelA - levelB
      return a[1].worksheet - b[1].worksheet
    })
    .map(([id, intro]) => ({
      id,
      level: intro.level,
      worksheet: intro.worksheet,
      isSeen: seenConcepts.includes(id),
    }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="text-lg">&larr;</span>
              <span>Back</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Concept Intro Test Page</h1>
            <span className="text-sm text-gray-500 ml-auto">Phase 1.19: Concept Tracking</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Message Banner */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'mb-6 p-4 rounded-lg font-medium',
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            )}
          >
            {message.text}
            <button
              onClick={() => setMessage(null)}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Child Selector & Actions */}
          <div className="space-y-6">
            {/* Child Selector */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Child</h2>

              {allChildren.length === 0 ? (
                <p className="text-gray-500">No children found. Create a child profile first.</p>
              ) : (
                <div className="space-y-2">
                  {allChildren.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChild(child)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg border-2 transition-all',
                        selectedChild?.id === child.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="font-medium text-gray-900">
                        {child.avatar} {child.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Level {child.current_level} - Worksheet {child.current_worksheet}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>

              <div className="space-y-3">
                <button
                  onClick={handleResetConcepts}
                  disabled={!selectedChild || loading}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg font-medium transition-all',
                    selectedChild && !loading
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  {loading ? 'Resetting...' : 'Reset All Seen Concepts'}
                </button>

                <button
                  onClick={handleShowConceptIntro}
                  disabled={!selectedChild || unseenConcepts.length === 0}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg font-medium transition-all',
                    selectedChild && unseenConcepts.length > 0
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  Show Concept Intro Modal
                </button>
              </div>

              {selectedChild && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="text-gray-600">
                    <strong>Seen concepts:</strong> {seenConcepts.length} / {allConcepts.length}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column: Level/Worksheet Selector */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Level & Worksheet</h2>

            {/* Level Categories */}
            <div className="space-y-4 mb-6">
              {Object.entries(LEVEL_CATEGORIES).map(([category, levels]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level as KumonLevel)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                          selectedLevel === level
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Worksheet Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Worksheet</h3>
              <div className="flex flex-wrap gap-2">
                {TEST_WORKSHEETS.map((ws) => (
                  <button
                    key={ws}
                    onClick={() => setSelectedWorksheet(ws)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      selectedWorksheet === ws
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {ws}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium text-gray-500 mr-2">Custom:</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={selectedWorksheet}
                  onChange={(e) => setSelectedWorksheet(Number(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Concepts at Worksheet */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">
                Concepts Introduced at Level {selectedLevel}, Worksheet {selectedWorksheet}
              </h3>
              {conceptsAtWorksheet.length === 0 ? (
                <p className="text-sm text-gray-500">No new concepts at this worksheet</p>
              ) : (
                <div className="space-y-1">
                  {conceptsAtWorksheet.map((concept) => (
                    <div
                      key={concept}
                      className={cn(
                        'text-sm px-2 py-1 rounded',
                        seenConcepts.includes(concept)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      )}
                    >
                      {concept.replace(/_/g, ' ')}
                      {seenConcepts.includes(concept) ? ' (seen)' : ' (unseen)'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: All Concepts Registry */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Concept Registry ({allConcepts.length} total)
            </h2>

            <div className="max-h-[600px] overflow-y-auto space-y-1">
              {allConcepts.map((concept) => (
                <div
                  key={concept.id}
                  onClick={() => {
                    setSelectedLevel(concept.level)
                    setSelectedWorksheet(concept.worksheet)
                  }}
                  className={cn(
                    'text-sm px-2 py-1.5 rounded cursor-pointer transition-all',
                    concept.isSeen
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{concept.id.replace(/_/g, ' ')}</span>
                    <span className="text-xs text-gray-500">
                      {concept.level}:{concept.worksheet}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link
            to="/test-levels"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Test Levels Page
          </Link>
          <Link
            to="/test-animations"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Test Animations Page
          </Link>
          <Link
            to="/study"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Study Page
          </Link>
        </div>
      </main>

      {/* Concept Introduction Modal */}
      {showConceptModal && conceptsToShow.length > 0 && selectedChild && (
        <ConceptIntroModal
          show={showConceptModal}
          onComplete={handleConceptModalClose}
          concepts={conceptsToShow}
          childId={selectedChild.id}
          level={selectedLevel}
          worksheet={selectedWorksheet}
        />
      )}
    </div>
  )
}
