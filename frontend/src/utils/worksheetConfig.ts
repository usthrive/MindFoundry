import type { KumonLevel } from '@/types'

/**
 * Worksheet Configuration
 *
 * Defines how many problems appear per page based on Kumon level.
 * Mimics real Kumon worksheets which show multiple problems per page.
 */

/**
 * Get the number of problems to display per page for a given level
 *
 * - Pre-K (7A-6A): 1 problem per page - young children need focus
 * - Early (5A-4A): 2 problems per page - building attention span
 * - Elementary (3A-F): 5 problems per page - standard Kumon format
 * - Middle School+ (G+): 3 problems per page - complex problems need space
 */
export function getProblemsPerPage(level: KumonLevel): number {
  // Pre-K levels: 1 problem at a time for focus
  if (['7A', '6A'].includes(level)) return 1

  // Early Pre-K/K: 2 problems per page
  if (['5A', '4A'].includes(level)) return 2

  // Elementary levels: 5 problems per page (standard Kumon format)
  if (['3A', '2A', 'A', 'B', 'C', 'D', 'E', 'F'].includes(level)) return 5

  // Middle school and above: 3 problems per page (more complex)
  return 3
}

/**
 * Get the total number of pages for a worksheet
 *
 * Each worksheet has 10 problems total, divided across pages
 */
export function getTotalPages(level: KumonLevel): number {
  const problemsPerPage = getProblemsPerPage(level)
  return Math.ceil(10 / problemsPerPage)
}

/**
 * Get problem indices for a specific page
 *
 * @param level - Kumon level
 * @param pageNumber - 1-based page number
 * @returns Array of problem indices (0-based) for this page
 */
export function getProblemIndicesForPage(level: KumonLevel, pageNumber: number): number[] {
  const problemsPerPage = getProblemsPerPage(level)
  const startIndex = (pageNumber - 1) * problemsPerPage
  const endIndex = Math.min(startIndex + problemsPerPage, 10)

  const indices: number[] = []
  for (let i = startIndex; i < endIndex; i++) {
    indices.push(i)
  }
  return indices
}

/**
 * Check if a level uses tap-to-select interaction (Pre-K levels)
 */
export function usesTapToSelect(level: KumonLevel): boolean {
  return ['7A', '6A'].includes(level)
}

/**
 * Check if a level uses sequence input (number sequences)
 */
export function usesSequenceInput(level: KumonLevel): boolean {
  return ['5A', '4A', '3A'].includes(level)
}

/**
 * Get the grid layout for problems on a page
 *
 * @returns CSS grid classes for the problem layout
 */
export function getGridLayout(level: KumonLevel): string {
  const problemsPerPage = getProblemsPerPage(level)

  switch (problemsPerPage) {
    case 1:
      return 'grid-cols-1' // Single problem, full width
    case 2:
      return 'grid-cols-1 sm:grid-cols-2' // 2 columns on larger screens
    case 3:
      return 'grid-cols-1 sm:grid-cols-3' // 3 columns on larger screens
    case 5:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' // Responsive 1-2-3 columns
    default:
      return 'grid-cols-1'
  }
}

/**
 * Get spacing between problems based on level complexity
 */
export function getProblemSpacing(level: KumonLevel): string {
  const problemsPerPage = getProblemsPerPage(level)

  if (problemsPerPage === 1) return 'gap-0' // Single problem, no gap needed
  if (problemsPerPage <= 3) return 'gap-6' // More space for complex problems
  return 'gap-4' // Standard spacing for 5 problems
}
