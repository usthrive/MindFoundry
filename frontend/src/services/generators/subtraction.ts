import type { Problem, KumonLevel } from '@/types'
import { generateId } from '@/lib/utils'

/**
 * Subtraction Problem Generator
 * Follows Kumon methodology progression from Level 6A to B
 */

interface SubtractionRange {
  min1: number
  max1: number
  min2: number
  max2: number
  allowBorrow?: boolean
}

const SUBTRACTION_LEVELS: Record<KumonLevel, SubtractionRange> = {
  // Level 7A: Basic counting subtraction (very simple)
  '7A': { min1: 1, max1: 5, min2: 0, max2: 2, allowBorrow: false },

  // Level 6A: -1, -2 (very simple)
  '6A': { min1: 3, max1: 10, min2: 1, max2: 2, allowBorrow: false },

  // Level 5A: -3, -4
  '5A': { min1: 5, max1: 10, min2: 3, max2: 4, allowBorrow: false },

  // Level 4A: -5 to -9
  '4A': { min1: 10, max1: 18, min2: 5, max2: 9, allowBorrow: false },

  // Level 3A: -1 to -9 mixed (no borrowing)
  '3A': { min1: 10, max1: 18, min2: 1, max2: 9, allowBorrow: false },

  // Level 2A: Subtracting from teens (11-19)
  '2A': { min1: 10, max1: 19, min2: 1, max2: 9, allowBorrow: false },

  // Level A: Subtraction within 20
  'A': { min1: 1, max1: 20, min2: 1, max2: 20, allowBorrow: true },

  // Level B: Multi-digit with borrowing
  'B': { min1: 10, max1: 99, min2: 1, max2: 99, allowBorrow: true },

  // Higher levels
  'C': { min1: 10, max1: 999, min2: 1, max2: 999, allowBorrow: true },
  'D': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
  'E': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
  'F': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
  'G': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
  'H': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
  'I': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
  'J': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
  'K': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
  'L': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
  'M': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
  'N': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
  'O': { min1: 100, max1: 9999, min2: 1, max2: 9999, allowBorrow: true },
}

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Check if subtraction requires borrowing
 */
function requiresBorrowing(operand1: number, operand2: number): boolean {
  const digits1 = operand1.toString().split('').reverse()
  const digits2 = operand2.toString().split('').reverse()

  for (let i = 0; i < digits2.length; i++) {
    const d1 = parseInt(digits1[i] || '0')
    const d2 = parseInt(digits2[i] || '0')
    if (d1 < d2) return true
  }

  return false
}

/**
 * Calculate difficulty score based on problem characteristics
 * Returns 1-10 scale
 */
function calculateDifficulty(operand1: number, operand2: number, level: KumonLevel): number {
  const hasBorrowing = requiresBorrowing(operand1, operand2)

  // Early levels (7A-3A) are always low difficulty
  if (['7A', '6A', '5A', '4A', '3A'].includes(level)) {
    return Math.min(operand2, 3) // Difficulty 1-3
  }

  // Level 2A and A (to 20)
  if (['2A', 'A'].includes(level)) {
    if (hasBorrowing) return 5
    if (operand1 > 10) return 4
    return 3
  }

  // Higher levels - base on number of digits and borrowing
  const digits = Math.max(
    operand1.toString().length,
    operand2.toString().length
  )

  let difficulty = digits * 2
  if (hasBorrowing) difficulty += 3 // Borrowing is harder than carrying

  return Math.min(Math.max(difficulty, 1), 10)
}

/**
 * Level 3A: Subtraction -1, -2, -3 ONLY (per Kumon spec)
 * Sublevels 1-50: -1 only
 * Sublevels 51-100: -2 only
 * Sublevels 101-150: -3 only
 * Sublevels 151-200: Mixed -1, -2, -3
 */
function generate3ASubtractionProblem(sublevel?: number): Problem {
  const sub = sublevel ?? getRandomInRange(1, 200)
  let operand1: number
  let operand2: number

  if (sub <= 50) {
    // Sublevels 1-50: Subtracting 1 only
    operand1 = getRandomInRange(2, 10)
    operand2 = 1
  } else if (sub <= 100) {
    // Sublevels 51-100: Subtracting 2 only
    operand1 = getRandomInRange(3, 10)
    operand2 = 2
  } else if (sub <= 150) {
    // Sublevels 101-150: Subtracting 3 only
    operand1 = getRandomInRange(4, 10)
    operand2 = 3
  } else {
    // Sublevels 151-200: Mixed -1, -2, -3 with larger numbers
    operand2 = getRandomInRange(1, 3)
    operand1 = getRandomInRange(operand2 + 1, 17)
  }

  return {
    id: generateId(),
    type: 'subtraction',
    level: '3A',
    operands: [operand1, operand2],
    correctAnswer: operand1 - operand2,
    displayFormat: 'horizontal',
    difficulty: calculateDifficulty(operand1, operand2, '3A'),
  }
}

/**
 * Level 2A: Subtraction -1 to -10 (per Kumon spec)
 * Sublevels 1-50: -4, -5, -6
 * Sublevels 51-100: -7, -8, -9
 * Sublevels 101-150: -10
 * Sublevels 151-200: Mixed practice
 */
function generate2ASubtractionProblem(sublevel?: number): Problem {
  const sub = sublevel ?? getRandomInRange(1, 200)
  let operand1: number
  let operand2: number

  if (sub <= 50) {
    // Sublevels 1-50: Subtracting 4-6
    operand2 = getRandomInRange(4, 6)
    operand1 = getRandomInRange(operand2 + 1, 15)
  } else if (sub <= 100) {
    // Sublevels 51-100: Subtracting 7-9
    operand2 = getRandomInRange(7, 9)
    operand1 = getRandomInRange(operand2 + 1, 18)
  } else if (sub <= 150) {
    // Sublevels 101-150: Subtracting 10
    operand1 = getRandomInRange(11, 20)
    operand2 = 10
  } else {
    // Sublevels 151-200: Mixed practice
    operand2 = getRandomInRange(1, 10)
    operand1 = getRandomInRange(operand2 + 1, 20)
  }

  return {
    id: generateId(),
    type: 'subtraction',
    level: '2A',
    operands: [operand1, operand2],
    correctAnswer: operand1 - operand2,
    displayFormat: 'horizontal',
    difficulty: calculateDifficulty(operand1, operand2, '2A'),
  }
}

/**
 * Level A: Subtraction within 20
 * Sublevels 1-100: Standard subtraction within 20
 * Sublevels 101-150: Missing subtrahend (e.g., 15 - __ = 7)
 * Sublevels 151-200: Mixed with addition review
 */
function generateLevelASubtractionProblem(sublevel?: number): Problem {
  const sub = sublevel ?? getRandomInRange(1, 200)

  if (sub <= 100) {
    // Standard subtraction within 20
    const operand2 = getRandomInRange(1, 19)
    const operand1 = getRandomInRange(operand2 + 1, 20)

    return {
      id: generateId(),
      type: 'subtraction',
      level: 'A',
      operands: [operand1, operand2],
      correctAnswer: operand1 - operand2,
      displayFormat: 'horizontal',
      difficulty: calculateDifficulty(operand1, operand2, 'A'),
    }
  } else if (sub <= 150) {
    // Missing subtrahend problems (e.g., 15 - __ = 7)
    const operand1 = getRandomInRange(10, 20)
    const difference = getRandomInRange(1, operand1 - 1)
    const operand2 = operand1 - difference // This is what student needs to find

    return {
      id: generateId(),
      type: 'subtraction',
      level: 'A',
      operands: [operand1, difference], // [minuend, difference]
      correctAnswer: operand2, // The missing subtrahend
      displayFormat: 'horizontal',
      difficulty: 6,
      missingPosition: 1, // Second operand is missing
    }
  } else {
    // Mixed practice with standard subtraction
    const operand2 = getRandomInRange(1, 15)
    const operand1 = getRandomInRange(operand2 + 1, 20)
    return {
      id: generateId(),
      type: 'subtraction',
      level: 'A',
      operands: [operand1, operand2],
      correctAnswer: operand1 - operand2,
      displayFormat: 'horizontal',
      difficulty: 5,
    }
  }
}

/**
 * Generate a single subtraction problem for a given level
 * @param level - The Kumon level
 * @param sublevel - Optional sublevel (1-200) for progressive difficulty
 */
export function generateSubtractionProblem(level: KumonLevel, sublevel?: number): Problem {
  // Special handling for levels with sublevel progression
  if (level === '3A') {
    return generate3ASubtractionProblem(sublevel)
  }
  if (level === '2A') {
    return generate2ASubtractionProblem(sublevel)
  }
  if (level === 'A') {
    return generateLevelASubtractionProblem(sublevel)
  }

  // Standard generation for other levels
  const range = SUBTRACTION_LEVELS[level]

  if (!range) {
    throw new Error(`Invalid level for subtraction: ${level}`)
  }

  let operand1 = getRandomInRange(range.min1, range.max1)
  let operand2 = getRandomInRange(range.min2, range.max2)

  // Ensure operand1 >= operand2 (no negative answers for elementary levels)
  if (operand2 > operand1) {
    ;[operand1, operand2] = [operand2, operand1]
  }

  // If borrowing is not allowed, regenerate if subtraction would require borrowing
  if (!range.allowBorrow) {
    let attempts = 0
    while (requiresBorrowing(operand1, operand2) && attempts < 50) {
      operand1 = getRandomInRange(range.min1, range.max1)
      operand2 = getRandomInRange(range.min2, range.max2)

      if (operand2 > operand1) {
        ;[operand1, operand2] = [operand2, operand1]
      }
      attempts++
    }
  }

  const correctAnswer = operand1 - operand2

  // Determine display format
  // Horizontal for levels 7A-A, vertical for B+
  const displayFormat = ['7A', '6A', '5A', '4A', '3A', '2A', 'A'].includes(level)
    ? 'horizontal'
    : 'vertical'

  return {
    id: generateId(),
    type: 'subtraction',
    level,
    operands: [operand1, operand2],
    correctAnswer,
    displayFormat,
    difficulty: calculateDifficulty(operand1, operand2, level),
  }
}

/**
 * Generate multiple subtraction problems for a session
 */
export function generateSubtractionProblems(
  level: KumonLevel,
  count: number
): Problem[] {
  const problems: Problem[] = []

  for (let i = 0; i < count; i++) {
    problems.push(generateSubtractionProblem(level))
  }

  return problems
}

/**
 * Generate a problem set with progressive difficulty
 */
export function generateSubtractionProblemSet(
  level: KumonLevel,
  warmupCount: number = 5,
  practiceCount: number = 15,
  challengeCount: number = 5
): Problem[] {
  const problems: Problem[] = []

  // Get level index for easier progression
  const levels: KumonLevel[] = ['6A', '5A', '4A', '3A', '2A', 'A', 'B', 'C', 'D', 'E']
  const currentIndex = levels.indexOf(level)

  // Warm-up: easier problems (previous level if available)
  const warmupLevel = currentIndex > 0 ? levels[currentIndex - 1] : level
  for (let i = 0; i < warmupCount; i++) {
    problems.push(generateSubtractionProblem(warmupLevel))
  }

  // Main practice: current level
  for (let i = 0; i < practiceCount; i++) {
    problems.push(generateSubtractionProblem(level))
  }

  // Challenge: same level (subtraction is already challenging!)
  for (let i = 0; i < challengeCount; i++) {
    problems.push(generateSubtractionProblem(level))
  }

  return problems
}
