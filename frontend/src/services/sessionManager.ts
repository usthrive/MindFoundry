import type { Problem, KumonLevel, MathOperation } from '@/types'
import { generateAdditionProblem } from './generators/addition'
import { generateSubtractionProblem } from './generators/subtraction'
import { generateMultiplicationProblem } from './generators/multiplication'
import { generateDivisionProblem } from './generators/division'
import { generateDecimalProblem, generateOrderOfOperationsProblem } from './generators/decimals'
import { generateSequenceProblem, generateCountingProblem } from './generators/sequences'
import { generateVerticalProblem } from './generators/vertical'

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

  // Pre-K levels need special handling (counting/sequences)
  if (operations.length === 0) {
    // Handle Pre-K and special levels
    switch (level) {
      case '7A':
      case '6A':
      case '5A':
        return generateCountingProblem(level, worksheetNumber)
      case '4A':
        return generateSequenceProblem(worksheetNumber)
      default:
        throw new Error(`Level ${level} requires special problem generation`)
    }
  }

  // Handle special levels that need custom generators
  if (level === 'B') {
    // Level B uses vertical format
    return generateVerticalProblem(worksheetNumber)
  }

  if (level === 'F') {
    // Level F focuses on decimals and order of operations
    if (worksheetNumber <= 160) {
      return generateDecimalProblem(worksheetNumber)
    } else {
      return generateOrderOfOperationsProblem(worksheetNumber)
    }
  }

  if (level === 'D' || level === 'E') {
    // For now, use basic operations for D and E
    // TODO: Implement fraction generators
    const operation = operations[Math.floor(Math.random() * operations.length)]
    switch (operation) {
      case 'addition':
        return generateAdditionProblem('C', sublevel) // Use Level C style for now
      case 'subtraction':
        return generateSubtractionProblem('C', sublevel)
      case 'multiplication':
        return generateMultiplicationProblem('C', sublevel)
      case 'division':
        return generateDivisionProblem('C', sublevel)
      default:
        return generateAdditionProblem('C', sublevel)
    }
  }

  // Select operation (for levels with one operation, it's deterministic)
  const operation = operations[Math.floor(Math.random() * operations.length)]

  // Generate problem based on operation
  switch (operation) {
    case 'addition':
      return generateAdditionProblem(level, sublevel)
    case 'subtraction':
      return generateSubtractionProblem(level, sublevel)
    case 'multiplication':
      return generateMultiplicationProblem(level, sublevel)
    case 'division':
      return generateDivisionProblem(level, sublevel)
    default:
      throw new Error(`Unknown operation: ${operation}`)
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
  // Level 3A progression
  if (level === '3A') {
    if (worksheetNumber <= 70) return 'Number Sequences to 120'
    if (worksheetNumber <= 130) return 'Addition +1 only'
    if (worksheetNumber <= 160) return 'Addition +2 only'
    if (worksheetNumber <= 180) return 'Addition +3 only'
    return 'Addition +1, +2, +3 Mixed'
  }

  // Level 2A progression
  if (level === '2A') {
    if (worksheetNumber <= 10) return 'Review Addition +1-3'
    if (worksheetNumber <= 30) return 'Addition +4 only'
    if (worksheetNumber <= 50) return 'Addition +5 only'
    if (worksheetNumber <= 70) return 'Addition +4-5 Mixed'
    if (worksheetNumber <= 90) return 'Addition +6 only'
    if (worksheetNumber <= 110) return 'Addition +7 only'
    if (worksheetNumber <= 130) return 'Addition +6-7 Mixed'
    if (worksheetNumber <= 150) return 'Addition +8 only'
    if (worksheetNumber <= 170) return 'Addition +9 and +10'
    return 'Addition +1 through +10 Mixed'
  }

  // Level A progression
  if (level === 'A') {
    if (worksheetNumber <= 80) return 'Addition Mastery'
    if (worksheetNumber <= 90) return 'Subtraction -1 only'
    if (worksheetNumber <= 100) return 'Subtraction -2 only'
    if (worksheetNumber <= 110) return 'Subtraction -3 only'
    if (worksheetNumber <= 120) return 'Subtraction -1, -2, -3 Mixed'
    if (worksheetNumber <= 140) return 'Subtraction up to -5'
    if (worksheetNumber <= 160) return 'Subtraction from 10'
    if (worksheetNumber <= 180) return 'Subtraction from teens'
    return 'Subtraction within 20'
  }

  // Level B progression
  if (level === 'B') {
    if (worksheetNumber <= 10) return 'Addition Review'
    if (worksheetNumber <= 40) return '2-Digit Addition (No Regrouping)'
    if (worksheetNumber <= 70) return '2-Digit Addition (With Carrying)'
    if (worksheetNumber <= 100) return '3-Digit Addition'
    if (worksheetNumber <= 120) return 'Subtraction Review'
    if (worksheetNumber <= 150) return '2-Digit Subtraction (With Borrowing)'
    if (worksheetNumber <= 160) return 'Mixed Add/Subtract 2-Digit'
    return '3-Digit Subtraction'
  }

  // Level C progression
  if (level === 'C') {
    if (worksheetNumber <= 10) return 'Review'
    if (worksheetNumber <= 30) return 'Multiplication ×2-5 Tables'
    if (worksheetNumber <= 50) return 'Multiplication ×6-9 Tables'
    if (worksheetNumber <= 110) return 'Multi-Digit Multiplication'
    if (worksheetNumber <= 120) return 'Introduction to Division'
    if (worksheetNumber <= 160) return 'Division with Remainders'
    return 'Division Practice'
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
