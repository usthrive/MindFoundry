/**
 * Concept Introduction Service
 * Phase 1.12: Educational Animation System
 *
 * Tracks which concept introductions each child has seen using localStorage.
 * Provides functions to check for unseen concepts when starting a new worksheet.
 */

import type { KumonLevel } from './generators/types'
import { getNewConceptsAtWorksheet } from './generators/concept-availability'

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
