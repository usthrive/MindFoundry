import type { Problem, KumonLevel } from '@/types'
import { generateId } from '@/lib/utils'

/**
 * Division Problem Generator
 * Follows Kumon methodology progression from Level C to O
 */

interface DivisionRange {
  minDividend: number
  maxDividend: number
  minDivisor: number
  maxDivisor: number
  allowRemainder?: boolean
}

const DIVISION_LEVELS: Record<KumonLevel, DivisionRange> = {
  // Level C: Basic division facts (÷1 to ÷12, no remainders)
  'C': { minDividend: 0, maxDividend: 144, minDivisor: 1, maxDivisor: 12, allowRemainder: false },

  // Level D: Long division with remainders
  'D': { minDividend: 10, maxDividend: 999, minDivisor: 2, maxDivisor: 12, allowRemainder: true },

  // Level E: 3-digit ÷ 2-digit
  'E': { minDividend: 100, maxDividend: 999, minDivisor: 10, maxDivisor: 99, allowRemainder: true },

  // Level F: 4-digit ÷ 2-digit
  'F': { minDividend: 1000, maxDividend: 9999, minDivisor: 10, maxDivisor: 99, allowRemainder: true },

  // Higher levels - placeholder ranges
  'G': { minDividend: 100, maxDividend: 999, minDivisor: 10, maxDivisor: 99, allowRemainder: true },
  'H': { minDividend: 100, maxDividend: 999, minDivisor: 10, maxDivisor: 99, allowRemainder: true },
  'I': { minDividend: 100, maxDividend: 999, minDivisor: 10, maxDivisor: 99, allowRemainder: true },
  'J': { minDividend: 100, maxDividend: 999, minDivisor: 10, maxDivisor: 99, allowRemainder: true },
  'K': { minDividend: 100, maxDividend: 999, minDivisor: 10, maxDivisor: 99, allowRemainder: true },
  'L': { minDividend: 100, maxDividend: 999, minDivisor: 10, maxDivisor: 99, allowRemainder: true },
  'M': { minDividend: 100, maxDividend: 999, minDivisor: 10, maxDivisor: 99, allowRemainder: true },
  'N': { minDividend: 100, maxDividend: 999, minDivisor: 10, maxDivisor: 99, allowRemainder: true },
  'O': { minDividend: 100, maxDividend: 999, minDivisor: 10, maxDivisor: 99, allowRemainder: true },

  // Earlier levels don't have division
  '7A': { minDividend: 0, maxDividend: 2, minDivisor: 1, maxDivisor: 1, allowRemainder: false },
  '6A': { minDividend: 0, maxDividend: 0, minDivisor: 1, maxDivisor: 1, allowRemainder: false },
  '5A': { minDividend: 0, maxDividend: 0, minDivisor: 1, maxDivisor: 1, allowRemainder: false },
  '4A': { minDividend: 0, maxDividend: 0, minDivisor: 1, maxDivisor: 1, allowRemainder: false },
  '3A': { minDividend: 0, maxDividend: 0, minDivisor: 1, maxDivisor: 1, allowRemainder: false },
  '2A': { minDividend: 0, maxDividend: 0, minDivisor: 1, maxDivisor: 1, allowRemainder: false },
  'A': { minDividend: 0, maxDividend: 0, minDivisor: 1, maxDivisor: 1, allowRemainder: false },
  'B': { minDividend: 0, maxDividend: 0, minDivisor: 1, maxDivisor: 1, allowRemainder: false },
}

function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Calculate difficulty score based on problem characteristics
 * Returns 1-10 scale
 */
function calculateDifficulty(dividend: number, divisor: number, hasRemainder: boolean): number {
  const dividendDigits = dividend.toString().length
  const divisorDigits = divisor.toString().length

  let difficulty = (dividendDigits + divisorDigits) * 2

  // Remainders add difficulty
  if (hasRemainder) {
    difficulty += 2
  }

  return Math.min(Math.max(difficulty, 1), 10)
}

/**
 * Level C: Division facts (÷1 to ÷12)
 * Sublevels 1-50: ÷1, ÷2, ÷3
 * Sublevels 51-100: ÷4, ÷5, ÷6
 * Sublevels 101-150: ÷7, ÷8, ÷9
 * Sublevels 151-200: ÷10, ÷11, ÷12
 */
function generateLevelCProblem(sublevel?: number): Problem {
  const sub = sublevel ?? getRandomInRange(1, 200)
  let divisor: number

  if (sub <= 50) {
    divisor = getRandomInRange(1, 3)
  } else if (sub <= 100) {
    divisor = getRandomInRange(4, 6)
  } else if (sub <= 150) {
    divisor = getRandomInRange(7, 9)
  } else {
    divisor = getRandomInRange(10, 12)
  }

  // Generate quotient, then calculate dividend to avoid remainders
  const quotient = getRandomInRange(0, 12)
  const dividend = quotient * divisor

  return {
    id: generateId(),
    type: 'division',
    level: 'C',
    operands: [dividend, divisor],
    correctAnswer: quotient,
    displayFormat: 'horizontal',
    difficulty: calculateDifficulty(dividend, divisor, false),
  }
}

/**
 * Generate a single division problem for a given level
 * @param level - The Kumon level
 * @param sublevel - Optional sublevel (1-200) for progressive difficulty
 */
export function generateDivisionProblem(level: KumonLevel, sublevel?: number): Problem {
  // Special handling for Level C
  if (level === 'C') {
    return generateLevelCProblem(sublevel)
  }

  // Early levels don't have division
  if (['7A', '6A', '5A', '4A', '3A', '2A', 'A', 'B'].includes(level)) {
    throw new Error(`Level ${level} does not include division`)
  }

  // Standard generation for levels D+
  const range = DIVISION_LEVELS[level]

  if (!range) {
    throw new Error(`Invalid level for division: ${level}`)
  }

  let dividend: number
  let divisor: number
  let quotient: number
  let remainder: number

  if (range.allowRemainder) {
    // Allow any dividend
    dividend = getRandomInRange(range.minDividend, range.maxDividend)
    divisor = getRandomInRange(range.minDivisor, range.maxDivisor)
    quotient = Math.floor(dividend / divisor)
    remainder = dividend % divisor
  } else {
    // Ensure no remainder
    quotient = getRandomInRange(1, 99)
    divisor = getRandomInRange(range.minDivisor, range.maxDivisor)
    dividend = quotient * divisor
    remainder = 0
  }

  // For now, only return quotient (remainder problems need special UI)
  const correctAnswer = quotient

  // Determine display format
  const displayFormat = dividend < 100 && divisor < 10 ? 'horizontal' : 'vertical'

  return {
    id: generateId(),
    type: 'division',
    level,
    operands: [dividend, divisor],
    correctAnswer,
    displayFormat,
    difficulty: calculateDifficulty(dividend, divisor, remainder > 0),
  }
}

/**
 * Generate multiple division problems for a session
 */
export function generateDivisionProblems(
  level: KumonLevel,
  count: number
): Problem[] {
  const problems: Problem[] = []

  for (let i = 0; i < count; i++) {
    problems.push(generateDivisionProblem(level))
  }

  return problems
}
