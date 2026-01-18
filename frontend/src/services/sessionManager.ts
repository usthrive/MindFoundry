import type { KumonLevel, MathOperation } from '@/types'
import type { Problem } from './generators/types'
// Removed unused imports - now using proper Kumon generators

// Import proper Kumon-aligned generators for all levels
import {
  generate7AProblem,
  generate6AProblem,
  generate5AProblem,
  generate4AProblem,
  generate3AProblem,
  generate2AProblem,
  generateAProblem,
  generateBProblem,
  generateCProblem,
  generateDProblem,
  generateEProblem,
  generateFProblem,
  generateGProblem,
  generateHProblem,
  generateIProblem,
  generateJProblem,
  generateKProblem,
  generateLProblem,
  generateMProblem,
  generateNProblem,
  generateOProblem,
  generateXVProblem,
  generateXMProblem,
  generateXPProblem,
  generateXSProblem
} from './generators'

/**
 * Session Manager - Kumon-Compliant Sequential Progression
 *
 * CRITICAL: Follows official Kumon progression exactly.
 * - Level 7A-6A: Counting only
 * - Level 5A-4A: Sequences only
 * - Level 3A: Addition ONLY (+1, +2, +3)
 * - Level 2A: Addition ONLY (+4 to +10)
 * - Level A: Addition first (worksheets 1-80), then subtraction (81-200)
 * - Level B: Addition/Subtraction with regrouping
 * - Level C: Multiplication first (worksheets 1-110), then division (111-200)
 * - Level D+: Mixed operations
 */

/**
 * Get available operations for a level at a specific worksheet number
 * Implements strict Kumon sequential progression
 */
function getOperationsForWorksheet(
  level: KumonLevel,
  worksheetNumber: number = 100
): MathOperation[] {
  switch (level) {
    // Pre-K levels: No math operations (counting, number recognition)
    case '7A':
    case '6A':
    case '5A':
    case '4A':
      return [] // Special handling needed for counting/sequences

    // Level 3A: Addition ONLY (+1, +2, +3)
    // No subtraction, no +4 or higher
    case '3A':
      return ['addition']

    // Level 2A: Addition ONLY (+4 to +10)
    // Still no subtraction!
    case '2A':
      return ['addition']

    // Level A: Sequential introduction
    // Worksheets 1-80: Addition mastery
    // Worksheets 81-200: Subtraction introduced
    case 'A':
      if (worksheetNumber <= 80) {
        return ['addition'] // Addition ONLY for first 80 worksheets
      } else {
        return ['subtraction'] // Subtraction focus after worksheet 80
      }

    // Level B: Vertical operations with regrouping
    // Addition and subtraction, but sequential within level
    case 'B':
      if (worksheetNumber <= 100) {
        return ['addition'] // First half: addition with regrouping
      } else {
        return ['subtraction'] // Second half: subtraction with borrowing
      }

    // Level C: Sequential multiplication → division
    // Worksheets 1-110: Multiplication mastery
    // Worksheets 111-200: Division introduced
    case 'C':
      if (worksheetNumber <= 110) {
        return ['multiplication'] // Multiplication ONLY first
      } else {
        return ['division'] // Division introduced after mult mastery
      }

    // Level D+: All four operations, but fractions/decimals are priority
    case 'D':
    case 'E':
    case 'F':
      return ['addition', 'subtraction', 'multiplication', 'division']

    // Higher levels: All basic operations available
    default:
      return ['addition', 'subtraction', 'multiplication', 'division']
  }
}

/**
 * Generate a single problem for a given level
 * Automatically selects the appropriate operation based on Kumon progression
 *
 * @param level - The Kumon level
 * @param sublevel - Optional sublevel/worksheet number (1-200)
 */
export function generateProblem(level: KumonLevel, sublevel?: number): Problem {
  // Default to mid-level if no sublevel provided
  const worksheetNumber = sublevel ?? 100

  // Get allowed operations for this level and worksheet
  const operations = getOperationsForWorksheet(level, worksheetNumber)

  // Pre-K levels need special handling - use proper Kumon generators
  if (operations.length === 0) {
    // Route to correct Kumon-aligned generators for Pre-K levels
    switch (level) {
      case '7A':
        console.log(`Generating Level 7A problem for worksheet ${worksheetNumber}`)
        return generate7AProblem(worksheetNumber)
      case '6A':
        console.log(`Generating Level 6A problem for worksheet ${worksheetNumber}`)
        return generate6AProblem(worksheetNumber)
      case '5A':
        console.log(`Generating Level 5A problem for worksheet ${worksheetNumber}`)
        return generate5AProblem(worksheetNumber)
      case '4A':
        console.log(`Generating Level 4A problem for worksheet ${worksheetNumber}`)
        return generate4AProblem(worksheetNumber)
      default:
        throw new Error(`Level ${level} requires special problem generation`)
    }
  }

  // Use proper Kumon generators for all other levels
  console.log(`Generating problem for level ${level}, worksheet ${worksheetNumber}`)

  switch (level) {
    // Elementary Basic levels
    case '3A':
      return generate3AProblem(worksheetNumber)
    case '2A':
      return generate2AProblem(worksheetNumber)
    case 'A':
      return generateAProblem(worksheetNumber)
    case 'B':
      return generateBProblem(worksheetNumber)

    // Elementary Advanced levels
    case 'C':
      return generateCProblem(worksheetNumber)
    case 'D':
      return generateDProblem(worksheetNumber)
    case 'E':
      return generateEProblem(worksheetNumber)
    case 'F':
      return generateFProblem(worksheetNumber)

    // Middle School levels
    case 'G':
      return generateGProblem(worksheetNumber)
    case 'H':
      return generateHProblem(worksheetNumber)
    case 'I':
      return generateIProblem(worksheetNumber)

    // High School levels
    case 'J':
      return generateJProblem(worksheetNumber)
    case 'K':
      return generateKProblem(worksheetNumber)

    // Calculus levels
    case 'L':
      return generateLProblem(worksheetNumber)
    case 'M':
      return generateMProblem(worksheetNumber)
    case 'N':
      return generateNProblem(worksheetNumber)
    case 'O':
      return generateOProblem(worksheetNumber)

    // Elective levels
    case 'XV':
      return generateXVProblem(worksheetNumber)
    case 'XM':
      return generateXMProblem(worksheetNumber)
    case 'XP':
      return generateXPProblem(worksheetNumber)
    case 'XS':
      return generateXSProblem(worksheetNumber)

    default:
      throw new Error(`Unknown Kumon level: ${level}`)
  }
}

/**
 * Generate a session of problems
 *
 * @param level - The Kumon level
 * @param count - Number of problems to generate (default: 10)
 * @param startingWorksheet - Starting worksheet number (default: random mid-level)
 */
export function generateSession(
  level: KumonLevel,
  count: number = 10,
  startingWorksheet?: number
): Problem[] {
  const problems: Problem[] = []
  const worksheet = startingWorksheet ?? Math.floor(Math.random() * 200) + 1

  for (let i = 0; i < count; i++) {
    // Generate problems from the same worksheet range
    // This keeps session coherent (e.g., all worksheet 85 problems are subtraction)
    problems.push(generateProblem(level, worksheet + Math.floor(i / 2)))
  }

  return problems
}

/**
 * Check if a level supports a given operation at a specific worksheet
 */
export function supportsOperation(
  level: KumonLevel,
  operation: MathOperation,
  worksheetNumber: number = 100
): boolean {
  const operations = getOperationsForWorksheet(level, worksheetNumber)
  return operations.includes(operation)
}

/**
 * Get all operations supported by a level at a specific worksheet
 */
export function getSupportedOperations(
  level: KumonLevel,
  worksheetNumber: number = 100
): MathOperation[] {
  return getOperationsForWorksheet(level, worksheetNumber)
}

/**
 * Get the operation for a specific level and worksheet
 * This is deterministic for levels with sequential progression
 */
export function getOperationForWorksheet(
  level: KumonLevel,
  worksheetNumber: number
): MathOperation {
  const operations = getOperationsForWorksheet(level, worksheetNumber)

  if (operations.length === 0) {
    throw new Error(`Level ${level} has no math operations at worksheet ${worksheetNumber}`)
  }

  // For most levels, there's only one operation type at any worksheet
  return operations[0]
}

/**
 * Get a human-readable label for what's being practiced at a specific worksheet
 */
export function getWorksheetLabel(level: KumonLevel, worksheetNumber: number): string {
  // Level 3A progression (aligned with level-3a.ts problem generator)
  if (level === '3A') {
    if (worksheetNumber <= 70) return 'Number Sequences to 120'
    if (worksheetNumber <= 130) return 'Addition +1 only'
    if (worksheetNumber <= 170) return 'Addition +2 only'
    if (worksheetNumber <= 190) return 'Addition +3 only'
    return 'Addition +1, +2, +3 Mixed'
  }

  // Level 2A progression (aligned with level-2a.ts problem generator)
  if (level === '2A') {
    if (worksheetNumber <= 10) return 'Review Addition +1-3'
    if (worksheetNumber <= 30) return 'Addition +4 only'
    if (worksheetNumber <= 50) return 'Addition +5 only'
    if (worksheetNumber <= 70) return 'Addition +1-5 Mixed'
    if (worksheetNumber <= 90) return 'Addition +6 only'
    if (worksheetNumber <= 110) return 'Addition +7 only'
    if (worksheetNumber <= 130) return 'Addition +1-7 Mixed'
    if (worksheetNumber <= 150) return 'Addition +8 only'
    if (worksheetNumber <= 160) return 'Addition +9 only'
    if (worksheetNumber <= 170) return 'Addition +10 only'
    return 'Addition +1 through +10 Mixed'
  }

  // Level A progression (aligned with level-a.ts problem generator)
  if (level === 'A') {
    if (worksheetNumber <= 80) return 'Addition Mastery'
    if (worksheetNumber <= 90) return 'Subtracting 1'
    if (worksheetNumber <= 100) return 'Subtracting 2'
    if (worksheetNumber <= 110) return 'Subtracting 3'
    if (worksheetNumber <= 120) return 'Subtracting 1, 2, 3 Mixed'
    if (worksheetNumber <= 130) return 'Subtracting up to 5'
    if (worksheetNumber <= 140) return 'Subtracting from 10'
    if (worksheetNumber <= 150) return 'Subtracting from 11'
    if (worksheetNumber <= 160) return 'Subtracting from 12'
    if (worksheetNumber <= 170) return 'Subtracting from 14'
    if (worksheetNumber <= 180) return 'Subtracting from 16'
    if (worksheetNumber <= 190) return 'Subtracting from 20'
    return 'Subtraction Summary'
  }

  // Level B progression (aligned with level-b.ts problem generator)
  if (level === 'B') {
    if (worksheetNumber <= 10) return 'Addition Review'
    if (worksheetNumber <= 40) return '2-Digit Addition (No Regrouping)'
    if (worksheetNumber <= 70) return '2-Digit Addition (With Carrying)'
    if (worksheetNumber <= 100) return '3-Digit Addition'
    if (worksheetNumber <= 120) return 'Subtraction Review'
    if (worksheetNumber <= 150) return '2-Digit Subtraction (No Borrowing)'
    if (worksheetNumber <= 180) return '2-Digit Subtraction (With Borrowing)'
    if (worksheetNumber <= 190) return '3-Digit Subtraction'
    return 'Mixed Add/Subtract 2-Digit'
  }

  // Level C progression (aligned with level-c.ts problem generator)
  if (level === 'C') {
    if (worksheetNumber <= 10) return 'Review'
    if (worksheetNumber <= 34) return 'Multiplication ×2-5 Tables'
    if (worksheetNumber <= 60) return 'Multiplication ×6-9 Tables'
    if (worksheetNumber <= 70) return 'All Times Tables Mixed'
    if (worksheetNumber <= 110) return 'Multi-Digit Multiplication'
    if (worksheetNumber <= 120) return 'Introduction to Division'
    if (worksheetNumber <= 140) return 'Division (Exact)'
    if (worksheetNumber <= 160) return 'Division with Remainders'
    if (worksheetNumber <= 180) return '2-Digit Division'
    return '3-Digit Division'
  }

  // Default labels for other levels
  const operations = getOperationsForWorksheet(level, worksheetNumber)
  if (operations.length === 0) return 'Pre-Math Skills'
  if (operations.length === 1) {
    const opName = operations[0].charAt(0).toUpperCase() + operations[0].slice(1)
    return `${opName} Practice`
  }
  return 'Mixed Operations'
}
