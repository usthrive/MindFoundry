/**
 * Concept Introduction Service
 * Phase 1.12: Educational Animation System
 * Phase 1.19: Database-backed concept tracking
 *
 * Tracks which concept introductions each child has seen.
 * Uses database as source of truth with localStorage as cache.
 * Provides functions to check for unseen concepts when starting a new worksheet.
 */

import type { KumonLevel } from './generators/types'
import { getNewConceptsAtWorksheet } from './generators/concept-availability'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'mindfoundry_seen_concepts'

interface SeenConceptsData {
  [childId: string]: string[]
}

/**
 * Get all concepts that a child has already seen introductions for
 */
export function getSeenConcepts(childId: string): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const parsed: SeenConceptsData = JSON.parse(data)
    return parsed[childId] || []
  } catch (error) {
    console.error('Error reading seen concepts:', error)
    return []
  }
}

/**
 * Mark a concept as seen for a child
 */
export function markConceptSeen(childId: string, concept: string): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const parsed: SeenConceptsData = data ? JSON.parse(data) : {}

    if (!parsed[childId]) {
      parsed[childId] = []
    }

    if (!parsed[childId].includes(concept)) {
      parsed[childId].push(concept)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
  } catch (error) {
    console.error('Error saving seen concept:', error)
  }
}

/**
 * Mark multiple concepts as seen at once
 */
export function markConceptsSeen(childId: string, concepts: string[]): void {
  concepts.forEach(concept => markConceptSeen(childId, concept))
}

/**
 * Get concepts that are introduced at this worksheet but haven't been seen yet
 * This is the main function used to determine if a concept intro modal should show
 */
export function getUnseenNewConcepts(
  childId: string,
  level: KumonLevel,
  worksheet: number
): string[] {
  const newConcepts = getNewConceptsAtWorksheet(level, worksheet)
  const seenConcepts = getSeenConcepts(childId)

  return newConcepts.filter(concept => !seenConcepts.includes(concept))
}

/**
 * Clear all seen concepts for a child (useful for testing/reset)
 */
export function clearSeenConcepts(childId: string): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed: SeenConceptsData = JSON.parse(data)
      delete parsed[childId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
    }
  } catch (error) {
    console.error('Error clearing seen concepts:', error)
  }
}

/**
 * Clear all concept tracking data (for complete reset)
 */
export function clearAllConceptData(): void {
  localStorage.removeItem(STORAGE_KEY)
}

// ============================================
// Database-Backed Functions (Phase 1.19)
// ============================================

/**
 * Load seen concepts from database and cache in localStorage
 * Should be called when session starts to sync DB -> localStorage
 */
export async function loadSeenConceptsFromDB(childId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('concepts_seen')
      .select('concept_id')
      .eq('child_id', childId)

    if (error) {
      console.error('Error loading seen concepts from DB:', error)
      // Fall back to localStorage if DB fails
      return getSeenConcepts(childId)
    }

    const concepts = data?.map((row) => row.concept_id) || []

    // Cache in localStorage for fast subsequent reads
    const existingData = localStorage.getItem(STORAGE_KEY)
    const parsed: SeenConceptsData = existingData ? JSON.parse(existingData) : {}
    parsed[childId] = concepts
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))

    return concepts
  } catch (error) {
    console.error('Error loading seen concepts from DB:', error)
    return getSeenConcepts(childId)
  }
}

/**
 * Mark concepts as seen - saves to BOTH localStorage AND database
 * Database is the source of truth, localStorage is the cache
 */
export async function markConceptsSeenWithDB(
  childId: string,
  concepts: string[]
): Promise<void> {
  // First, save to localStorage immediately for fast reads
  markConceptsSeen(childId, concepts)

  // Then persist to database
  try {
    // Insert concepts (ignore conflicts since we have UNIQUE constraint)
    const rows = concepts.map((conceptId) => ({
      child_id: childId,
      concept_id: conceptId,
    }))

    const { error } = await supabase
      .from('concepts_seen')
      .upsert(rows, { onConflict: 'child_id,concept_id' })

    if (error) {
      console.error('Error saving seen concepts to DB:', error)
    }
  } catch (error) {
    console.error('Error saving seen concepts to DB:', error)
  }
}

/**
 * Get unseen concepts - loads from DB first to ensure we have latest data
 * This is the main function to check if concept intro should show
 */
export async function getUnseenNewConceptsWithDB(
  childId: string,
  level: KumonLevel,
  worksheet: number
): Promise<string[]> {
  // Load from DB to ensure we have the latest seen concepts
  const seenConcepts = await loadSeenConceptsFromDB(childId)
  const newConcepts = getNewConceptsAtWorksheet(level, worksheet)

  return newConcepts.filter((concept) => !seenConcepts.includes(concept))
}

/**
 * Clear seen concepts from BOTH localStorage AND database
 * Used for testing and reset functionality
 */
export async function clearSeenConceptsWithDB(childId: string): Promise<void> {
  // Clear localStorage
  clearSeenConcepts(childId)

  // Clear from database
  try {
    const { error } = await supabase
      .from('concepts_seen')
      .delete()
      .eq('child_id', childId)

    if (error) {
      console.error('Error clearing seen concepts from DB:', error)
    }
  } catch (error) {
    console.error('Error clearing seen concepts from DB:', error)
  }
}
