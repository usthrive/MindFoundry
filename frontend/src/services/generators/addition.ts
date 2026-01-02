import type { Problem, KumonLevel } from '@/types'
import { generateId } from '@/lib/utils'

/**
 * Addition Problem Generator
 * Follows Kumon methodology progression from Level 6A to A
 */

interface AdditionRange {
  min1: number
  max1: number
  min2: number
  max2: number
  allowCarry?: boolean
}

const ADDITION_LEVELS: Record<KumonLevel, AdditionRange> = {
  // Level 7A: Counting and recognition (very basic)
  '7A': { min1: 1, max1: 5, min2: 0, max2: 1, allowCarry: false },

  // Level 6A: +1, +2 (very simple)
  '6A': { min1: 1, max1: 10, min2: 1, max2: 2, allowCarry: false },

  // Level 5A: +3, +4
  '5A': { min1: 1, max1: 10, min2: 3, max2: 4, allowCarry: false },

  // Level 4A: +5 to +9
  '4A': { min1: 1, max1: 10, min2: 5, max2: 9, allowCarry: false },

  // Level 3A: +1 to +9 mixed
  '3A': { min1: 1, max1: 10, min2: 1, max2: 9, allowCarry: false },

  // Level 2A: Make 10 strategy (numbers to 10)
  '2A': { min1: 1, max1: 9, min2: 1, max2: 9, allowCarry: true },

  // Level A: Addition to 20
  'A': { min1: 1, max1: 20, min2: 1, max2: 20, allowCarry: true },

  // Level B and beyond use vertical format
  'B': { min1: 10, max1: 99, min2: 10, max2: 99, allowCarry: true },
  'C': { min1: 10, max1: 999, min2: 10, max2: 999, allowCarry: true },
  'D': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
  'E': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
  'F': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
  'G': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
  'H': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
  'I': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
  'J': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
  'K': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
  'L': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
  'M': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
  'N': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
  'O': { min1: 100, max1: 9999, min2: 100, max2: 9999, allowCarry: true },
}

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Calculate difficulty score based on problem characteristics
 * Returns 1-10 scale
 */
function calculateDifficulty(operand1: number, operand2: number, level: KumonLevel): number {
  const sum = operand1 + operand2
  const hasCarry = (operand1 % 10) + (operand2 % 10) >= 10

  // Early levels (6A-3A) are always low difficulty
  if (['6A', '5A', '4A', '3A'].includes(level)) {
    return Math.min(operand2, 3) // Difficulty 1-3
  }

  // Level 2A and A (to 20)
  if (['2A', 'A'].includes(level)) {
    if (hasCarry) return 5
    if (sum > 10) return 4
    return 3
  }

  // Higher levels - base on number of digits and carrying
  const digits = Math.max(
    operand1.toString().length,
    operand2.toString().length
  )

  let difficulty = digits * 2
  if (hasCarry) difficulty += 2

  return Math.min(Math.max(difficulty, 1), 10)
}

/**
 * Generate a single addition problem for a given level
 * @param level - The Kumon level
 * @param sublevel - Optional sublevel (1-200) for progressive difficulty
 */
export function generateAdditionProblem(level: KumonLevel, sublevel?: number): Problem {
  // Special handling for levels with sublevel progression
  if (level === '3A') {
    return generate3AProblem(sublevel)
  }
  if (level === '2A') {
    return generate2AProblem(sublevel)
  }
  if (level === 'A') {
    return generateLevelAProblem(sublevel)
  }

  // Standard generation for other levels
  const range = ADDITION_LEVELS[level]

  if (!range) {
    throw new Error(`Invalid level for addition: ${level}`)
  }

  let operand1 = getRandomInRange(range.min1, range.max1)
  let operand2 = getRandomInRange(range.min2, range.max2)

  // If carry is not allowed, regenerate if sum would require carry
  if (!range.allowCarry) {
    while ((operand1 % 10) + (operand2 % 10) >= 10) {
      operand1 = getRandomInRange(range.min1, range.max1)
      operand2 = getRandomInRange(range.min2, range.max2)
    }
  }

  const correctAnswer = operand1 + operand2

  // Determine display format
  // Horizontal for levels 6A-A, vertical for B+
  const displayFormat = ['6A', '5A', '4A', '3A', '2A', 'A'].includes(level)
    ? 'horizontal'
    : 'vertical'

  return {
    id: generateId(),
    type: 'addition',
    level,
    operands: [operand1, operand2],
    correctAnswer,
    displayFormat,
    difficulty: calculateDifficulty(operand1, operand2, level),
  }
}

/**
 * Level 3A: Addition +1, +2, +3 ONLY (per Kumon spec)
 * Sublevels 1-50: +1 only
 * Sublevels 51-100: +2 only
 * Sublevels 101-150: +3 only
 * Sublevels 151-200: Mixed +1, +2, +3
 */
function generate3AProblem(sublevel?: number): Problem {
  const sub = sublevel ?? getRandomInRange(1, 200)
  let operand1: number
  let operand2: number

  if (sub <= 50) {
    // Sublevels 1-50: Adding 1 only
    operand1 = getRandomInRange(1, 10)
    operand2 = 1
  } else if (sub <= 100) {
    // Sublevels 51-100: Adding 2 only
    operand1 = getRandomInRange(1, 10)
    operand2 = 2
  } else if (sub <= 150) {
    // Sublevels 101-150: Adding 3 only
    operand1 = getRandomInRange(1, 10)
    operand2 = 3
  } else {
    // Sublevels 151-200: Mixed +1, +2, +3 with larger numbers
    operand1 = getRandomInRange(1, 17)
    operand2 = getRandomInRange(1, 3)
  }

  return {
    id: generateId(),
    type: 'addition',
    level: '3A',
    operands: [operand1, operand2],
    correctAnswer: operand1 + operand2,
    displayFormat: 'horizontal',
    difficulty: calculateDifficulty(operand1, operand2, '3A'),
  }
}

/**
 * Level 2A: Addition +1 to +10 (per Kumon spec)
 * Sublevels 1-50: +4, +5, +6
 * Sublevels 51-100: +7, +8, +9
 * Sublevels 101-150: +10
 * Sublevels 151-200: Mixed with subtraction intro
 */
function generate2AProblem(sublevel?: number): Problem {
  const sub = sublevel ?? getRandomInRange(1, 200)
  let operand1: number
  let operand2: number

  if (sub <= 50) {
    // Sublevels 1-50: Adding 4-6
    operand1 = getRandomInRange(1, 14)
    operand2 = getRandomInRange(4, 6)
  } else if (sub <= 100) {
    // Sublevels 51-100: Adding 7-9
    operand1 = getRandomInRange(1, 11)
    operand2 = getRandomInRange(7, 9)
  } else if (sub <= 150) {
    // Sublevels 101-150: Adding 10
    operand1 = getRandomInRange(1, 10)
    operand2 = 10
  } else {
    // Sublevels 151-200: Mixed practice
    operand1 = getRandomInRange(1, 10)
    operand2 = getRandomInRange(1, 10)
  }

  return {
    id: generateId(),
    type: 'addition',
    level: '2A',
    operands: [operand1, operand2],
    correctAnswer: operand1 + operand2,
    displayFormat: 'horizontal',
    difficulty: calculateDifficulty(operand1, operand2, '2A'),
  }
}

/**
 * Level A: Addition/Subtraction to 20, includes missing addend and 3-number addition
 * Sublevels 1-100: Standard addition to 20
 * Sublevels 101-150: Missing addend (e.g., 7 + __ = 15)
 * Sublevels 151-200: Three-number addition (e.g., 3 + 5 + 2)
 */
function generateLevelAProblem(sublevel?: number): Problem {
  const sub = sublevel ?? getRandomInRange(1, 200)

  if (sub <= 100) {
    // Standard addition/subtraction to 20
    const operand1 = getRandomInRange(1, 20)
    const operand2 = getRandomInRange(1, 20)
    const sum = operand1 + operand2

    // Ensure sum doesn't exceed 20
    if (sum > 20) {
      return generateLevelAProblem(sublevel) // Retry
    }

    return {
      id: generateId(),
      type: 'addition',
      level: 'A',
      operands: [operand1, operand2],
      correctAnswer: sum,
      displayFormat: 'horizontal',
      difficulty: calculateDifficulty(operand1, operand2, 'A'),
    }
  } else if (sub <= 150) {
    // Missing addend problems (e.g., 7 + __ = 15)
    const sum = getRandomInRange(10, 20)
    const operand1 = getRandomInRange(1, sum - 1)
    const operand2 = sum - operand1 // This is what student needs to find

    return {
      id: generateId(),
      type: 'addition',
      level: 'A',
      operands: [operand1, sum], // [known addend, sum]
      correctAnswer: operand2, // The missing addend
      displayFormat: 'horizontal',
      difficulty: 6,
      missingPosition: 1, // Second operand is missing
    }
  } else {
    // Three-number addition (e.g., 3 + 5 + 2)
    const operand1 = getRandomInRange(1, 8)
    const operand2 = getRandomInRange(1, 8)
    const operand3 = getRandomInRange(1, 8)
    const sum = operand1 + operand2 + operand3

    // Ensure sum doesn't exceed 20
    if (sum > 20) {
      return generateLevelAProblem(sublevel) // Retry
    }

    return {
      id: generateId(),
      type: 'addition',
      level: 'A',
      operands: [operand1, operand2, operand3],
      correctAnswer: sum,
      displayFormat: 'horizontal',
      difficulty: 7,
    }
  }
}

/**
 * Generate multiple addition problems for a session
 */
export function generateAdditionProblems(
  level: KumonLevel,
  count: number
): Problem[] {
  const problems: Problem[] = []

  for (let i = 0; i < count; i++) {
    problems.push(generateAdditionProblem(level))
  }

  return problems
}

/**
 * Generate a problem set with progressive difficulty
 * Useful for warm-up → main practice → challenge pattern
 */
export function generateAdditionProblemSet(
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
    problems.push(generateAdditionProblem(warmupLevel))
  }

  // Main practice: current level
  for (let i = 0; i < practiceCount; i++) {
    problems.push(generateAdditionProblem(level))
  }

  // Challenge: slightly harder (next level if mastered, or same level)
  for (let i = 0; i < challengeCount; i++) {
    problems.push(generateAdditionProblem(level))
  }

  return problems
}
