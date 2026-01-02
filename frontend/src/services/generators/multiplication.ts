import type { Problem, KumonLevel } from '@/types'
import { generateId } from '@/lib/utils'

/**
 * Multiplication Problem Generator
 * Follows Kumon methodology progression from Level C to O
 */

interface MultiplicationRange {
  min1: number
  max1: number
  min2: number
  max2: number
}

const MULTIPLICATION_LEVELS: Record<KumonLevel, MultiplicationRange> = {
  // Level C: Basic multiplication tables (1-12)
  'C': { min1: 0, max1: 12, min2: 0, max2: 12 },

  // Level D: Multi-digit multiplication
  'D': { min1: 10, max1: 99, min2: 1, max2: 12 },

  // Level E: 2-digit × 2-digit
  'E': { min1: 10, max1: 99, min2: 10, max2: 99 },

  // Level F: 3-digit × 2-digit
  'F': { min1: 100, max1: 999, min2: 10, max2: 99 },

  // Higher levels - placeholder ranges
  'G': { min1: 10, max1: 99, min2: 10, max2: 99 },
  'H': { min1: 10, max1: 99, min2: 10, max2: 99 },
  'I': { min1: 10, max1: 99, min2: 10, max2: 99 },
  'J': { min1: 10, max1: 99, min2: 10, max2: 99 },
  'K': { min1: 10, max1: 99, min2: 10, max2: 99 },
  'L': { min1: 10, max1: 99, min2: 10, max2: 99 },
  'M': { min1: 10, max1: 99, min2: 10, max2: 99 },
  'N': { min1: 10, max1: 99, min2: 10, max2: 99 },
  'O': { min1: 10, max1: 99, min2: 10, max2: 99 },

  // Earlier levels don't have multiplication
  '7A': { min1: 0, max1: 1, min2: 0, max2: 1 },
  '6A': { min1: 0, max1: 0, min2: 0, max2: 0 },
  '5A': { min1: 0, max1: 0, min2: 0, max2: 0 },
  '4A': { min1: 0, max1: 0, min2: 0, max2: 0 },
  '3A': { min1: 0, max1: 0, min2: 0, max2: 0 },
  '2A': { min1: 0, max1: 0, min2: 0, max2: 0 },
  'A': { min1: 0, max1: 0, min2: 0, max2: 0 },
  'B': { min1: 0, max1: 0, min2: 0, max2: 0 },
}

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Calculate difficulty score based on problem characteristics
 * Returns 1-10 scale
 */
function calculateDifficulty(operand1: number, operand2: number, level: KumonLevel): number {
  const digits1 = operand1.toString().length
  const digits2 = operand2.toString().length

  // Level C: Basic facts
  if (level === 'C') {
    // Multiplying by 0 or 1 is easy
    if (operand1 <= 1 || operand2 <= 1) return 1
    // Multiplying by 2-5 is medium
    if (operand1 <= 5 && operand2 <= 5) return 3
    // Multiplying by 6-9 is harder
    if (operand1 <= 9 && operand2 <= 9) return 5
    // Multiplying by 10-12 is hardest for basic facts
    return 6
  }

  // Higher levels - base on number of digits
  let difficulty = (digits1 + digits2) * 2

  return Math.min(Math.max(difficulty, 1), 10)
}

/**
 * Level C: Multiplication tables (1-12)
 * Sublevels 1-50: × 1, ×2, ×3
 * Sublevels 51-100: ×4, ×5, ×6
 * Sublevels 101-150: ×7, ×8, ×9
 * Sublevels 151-200: ×10, ×11, ×12
 */
function generateLevelCProblem(sublevel?: number): Problem {
  const sub = sublevel ?? getRandomInRange(1, 200)
  let operand1: number
  let operand2: number

  if (sub <= 50) {
    // Sublevels 1-50: Multiply by 1-3
    operand1 = getRandomInRange(0, 12)
    operand2 = getRandomInRange(1, 3)
  } else if (sub <= 100) {
    // Sublevels 51-100: Multiply by 4-6
    operand1 = getRandomInRange(0, 12)
    operand2 = getRandomInRange(4, 6)
  } else if (sub <= 150) {
    // Sublevels 101-150: Multiply by 7-9
    operand1 = getRandomInRange(0, 12)
    operand2 = getRandomInRange(7, 9)
  } else {
    // Sublevels 151-200: Multiply by 10-12
    operand1 = getRandomInRange(0, 12)
    operand2 = getRandomInRange(10, 12)
  }

  return {
    id: generateId(),
    type: 'multiplication',
    level: 'C',
    operands: [operand1, operand2],
    correctAnswer: operand1 * operand2,
    displayFormat: 'horizontal',
    difficulty: calculateDifficulty(operand1, operand2, 'C'),
  }
}

/**
 * Generate a single multiplication problem for a given level
 * @param level - The Kumon level
 * @param sublevel - Optional sublevel (1-200) for progressive difficulty
 */
export function generateMultiplicationProblem(level: KumonLevel, sublevel?: number): Problem {
  // Special handling for Level C
  if (level === 'C') {
    return generateLevelCProblem(sublevel)
  }

  // Early levels don't have multiplication
  if (['7A', '6A', '5A', '4A', '3A', '2A', 'A', 'B'].includes(level)) {
    throw new Error(`Level ${level} does not include multiplication`)
  }

  // Standard generation for levels D+
  const range = MULTIPLICATION_LEVELS[level]

  if (!range) {
    throw new Error(`Invalid level for multiplication: ${level}`)
  }

  const operand1 = getRandomInRange(range.min1, range.max1)
  const operand2 = getRandomInRange(range.min2, range.max2)

  // Determine display format
  // Horizontal for single digits, vertical for 2+ digits
  const displayFormat = operand1 < 10 && operand2 < 10 ? 'horizontal' : 'vertical'

  return {
    id: generateId(),
    type: 'multiplication',
    level,
    operands: [operand1, operand2],
    correctAnswer: operand1 * operand2,
    displayFormat,
    difficulty: calculateDifficulty(operand1, operand2, level),
  }
}

/**
 * Generate multiple multiplication problems for a session
 */
export function generateMultiplicationProblems(
  level: KumonLevel,
  count: number
): Problem[] {
  const problems: Problem[] = []

  for (let i = 0; i < count; i++) {
    problems.push(generateMultiplicationProblem(level))
  }

  return problems
}
