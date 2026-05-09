import type { Problem, LevelCProblemType } from '../types'
import { randomInt, generateId } from '../utils'
import { generateAdditionHints, generateSubtractionHints, generateMultiplicationHints, generateDivisionHints, generateMissingFactorHints } from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: LevelCProblemType
  tables?: number[]
  maxMultiplicand?: number
  maxDivisor?: number
  allowRemainder?: boolean
} {
  // Spec lines 481-491: times tables span 11-50, then 2-digit × 1-digit
  // is 51-90 (Parts 1-5 with progressive operand ramp), 3-4 digit × 1-digit
  // is 91-110, division intro at 111, then division with remainders to 160.
  if (worksheet <= 10) return { type: 'review_level_b' }

  // Worksheets 11-20: ×2 and ×3 tables
  if (worksheet <= 14) return { type: 'times_table_2_3', tables: [2] }
  if (worksheet <= 17) return { type: 'times_table_2_3', tables: [3] }
  if (worksheet <= 20) return { type: 'times_table_2_3', tables: [2, 3] }

  // Worksheets 21-30: ×4 and ×5 tables
  if (worksheet <= 24) return { type: 'times_table_4_5', tables: [4] }
  if (worksheet <= 27) return { type: 'times_table_4_5', tables: [5] }
  if (worksheet <= 30) return { type: 'times_table_4_5', tables: [4, 5] }

  // Worksheets 31-40: ×6 and ×7 tables
  if (worksheet <= 34) return { type: 'times_table_6_7', tables: [6] }
  if (worksheet <= 37) return { type: 'times_table_6_7', tables: [7] }
  if (worksheet <= 40) return { type: 'times_table_6_7', tables: [6, 7] }

  // Worksheets 41-50: ×8, ×9, then full mixed review of all tables
  if (worksheet <= 44) return { type: 'times_table_8_9', tables: [8] }
  if (worksheet <= 47) return { type: 'times_table_8_9', tables: [9] }
  if (worksheet <= 50) return { type: 'times_table_8_9', tables: [2, 3, 4, 5, 6, 7, 8, 9] }

  // Worksheets 51-90: 2-digit × 1-digit (Parts 1-5 with progressive ramp).
  // Previously this whole 40-sheet span used maxMultiplicand=99 with no scaling.
  if (worksheet <= 58) return { type: 'multiplication_2digit_by_1digit', maxMultiplicand: 29 }
  if (worksheet <= 66) return { type: 'multiplication_2digit_by_1digit', maxMultiplicand: 49 }
  if (worksheet <= 74) return { type: 'multiplication_2digit_by_1digit', maxMultiplicand: 69 }
  if (worksheet <= 82) return { type: 'multiplication_2digit_by_1digit', maxMultiplicand: 89 }
  if (worksheet <= 90) return { type: 'multiplication_2digit_by_1digit', maxMultiplicand: 99 }

  // Worksheets 91-110: 3-digit × 1-digit
  if (worksheet <= 110) return { type: 'multiplication_3digit_by_1digit', maxMultiplicand: 999 }

  // Worksheets 111-120: division intro (exact, small divisors)
  if (worksheet <= 120) return { type: 'division_intro', maxDivisor: 9, allowRemainder: false }

  // Worksheets 121-160: division with remainders (Parts 1-4: divisor ramp)
  if (worksheet <= 130) return { type: 'division_with_remainder', maxDivisor: 5, allowRemainder: true }
  if (worksheet <= 140) return { type: 'division_with_remainder', maxDivisor: 7, allowRemainder: true }
  if (worksheet <= 150) return { type: 'division_with_remainder', maxDivisor: 9, allowRemainder: true }
  if (worksheet <= 160) return { type: 'division_exact', maxDivisor: 9, allowRemainder: false }

  // Worksheets 161-180: 2-digit ÷ 1-digit
  if (worksheet <= 180) return { type: 'division_2digit_by_1digit', maxDivisor: 9, allowRemainder: true }

  // Worksheets 181-200: 3-digit ÷ 1-digit
  return { type: 'division_3digit_by_1digit', maxDivisor: 9, allowRemainder: true }
}

function generateReviewProblem(): Problem {
  const isAddition = Math.random() < 0.5
  const a = randomInt(100, 999)
  const b = randomInt(100, 999)
  
  if (isAddition) {
    return {
      id: generateId(),
      level: 'C',
      worksheetNumber: 1,
      type: 'addition',
      subtype: 'review_level_b',
      difficulty: 1,
      displayFormat: 'vertical',
      question: '',
      correctAnswer: a + b,
      operands: [a, b],
      hints: ['Add column by column from right to left'],
      graduatedHints: generateAdditionHints([a, b], 'C'),
    }
  }
  
  const larger = Math.max(a, b)
  const smaller = Math.min(a, b)
  return {
    id: generateId(),
    level: 'C',
    worksheetNumber: 1,
    type: 'subtraction',
    subtype: 'review_level_b',
    difficulty: 1,
    displayFormat: 'vertical',
    question: '',
    correctAnswer: larger - smaller,
    operands: [larger, smaller],
    hints: ['Subtract column by column from right to left'],
    graduatedHints: generateSubtractionHints([larger, smaller], 'C'),
  }
}

function generateTimesTableProblem(tables: number[]): Problem {
  const table = tables[randomInt(0, tables.length - 1)]
  const multiplier = randomInt(1, 9)
  const product = table * multiplier
  
  const variants = ['standard', 'commutative', 'missing_factor'] as const
  const variant = variants[randomInt(0, variants.length - 1)]
  
  if (variant === 'commutative') {
    return {
      id: generateId(),
      level: 'C',
      worksheetNumber: 1,
      type: 'multiplication',
      subtype: tables.includes(2) || tables.includes(3) ? 'times_table_2_3' :
               tables.includes(4) || tables.includes(5) ? 'times_table_4_5' :
               tables.includes(6) || tables.includes(7) ? 'times_table_6_7' : 'times_table_8_9',
      difficulty: 1,
      displayFormat: 'horizontal',
      question: `${multiplier} × ${table} = ___`,
      correctAnswer: product,
      operands: [multiplier, table],
      hints: [`${multiplier} × ${table} is the same as ${table} × ${multiplier}`],
      graduatedHints: generateMultiplicationHints([multiplier, table], 'C'),
    }
  }
  
  if (variant === 'missing_factor') {
    return {
      id: generateId(),
      level: 'C',
      worksheetNumber: 1,
      type: 'multiplication',
      subtype: tables.includes(2) || tables.includes(3) ? 'times_table_2_3' :
               tables.includes(4) || tables.includes(5) ? 'times_table_4_5' :
               tables.includes(6) || tables.includes(7) ? 'times_table_6_7' : 'times_table_8_9',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `${table} × ___ = ${product}`,
      correctAnswer: multiplier,
      operands: [table, multiplier],
      hints: [`What times ${table} equals ${product}?`],
      graduatedHints: generateMissingFactorHints(table, product, 'C'),
    }
  }

  return {
    id: generateId(),
    level: 'C',
    worksheetNumber: 1,
    type: 'multiplication',
    subtype: tables.includes(2) || tables.includes(3) ? 'times_table_2_3' :
             tables.includes(4) || tables.includes(5) ? 'times_table_4_5' :
             tables.includes(6) || tables.includes(7) ? 'times_table_6_7' : 'times_table_8_9',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `${table} × ${multiplier} = ___`,
    correctAnswer: product,
    operands: [table, multiplier],
    hints: [
      `Count by ${table}s: ${Array.from({length: multiplier}, (_, i) => table * (i + 1)).join(', ')}`,
    ],
    graduatedHints: generateMultiplicationHints([table, multiplier], 'C'),
  }
}

function generateMultiDigitMultiplication(maxMultiplicand: number, subtype: LevelCProblemType): Problem {
  // Force a 2-digit minimum so Part 1 ramps (max=29, 49, 69, ...) still produce
  // genuinely 2-digit multiplicands rather than single-digit ones.
  const minMultiplicand = subtype === 'multiplication_2digit_by_1digit' ? 11 : Math.max(11, Math.floor(maxMultiplicand / 10))
  const multiplicand = randomInt(minMultiplicand, maxMultiplicand)
  const multiplier = randomInt(2, 9)
  const product = multiplicand * multiplier
  
  return {
    id: generateId(),
    level: 'C',
    worksheetNumber: 1,
    type: 'multiplication',
    subtype,
    difficulty: 2,
    displayFormat: 'vertical',
    question: '',
    correctAnswer: product,
    operands: [multiplicand, multiplier],
    hints: [
      'Multiply each digit by the multiplier',
      'Start from the ones place',
      'Carry over if needed',
    ],
    graduatedHints: generateMultiplicationHints([multiplicand, multiplier], 'C'),
  }
}

function generateDivisionProblem(
  maxDivisor: number,
  allowRemainder: boolean,
  maxDividend: number,
  subtype: LevelCProblemType
): Problem {
  const divisor = randomInt(2, maxDivisor)
  let dividend: number
  let quotient: number
  let remainder: number
  
  if (allowRemainder) {
    quotient = randomInt(2, Math.floor(maxDividend / divisor))
    remainder = randomInt(0, divisor - 1)
    dividend = quotient * divisor + remainder
  } else {
    quotient = randomInt(2, Math.floor(maxDividend / divisor))
    dividend = quotient * divisor
    remainder = 0
  }
  
  const answer = remainder > 0 ? `${quotient} R${remainder}` : quotient
  
  return {
    id: generateId(),
    level: 'C',
    worksheetNumber: 1,
    type: 'division',
    subtype,
    difficulty: allowRemainder ? 2 : 1,
    displayFormat: 'horizontal',
    question: `${dividend} ÷ ${divisor} = ___`,
    correctAnswer: answer,
    operands: [dividend, divisor],
    hints: [
      `How many times does ${divisor} go into ${dividend}?`,
      allowRemainder ? 'Remember to include the remainder if there is one' : '',
    ].filter(Boolean),
    graduatedHints: generateDivisionHints([dividend, divisor], 'C'),
  }
}

export function generateCProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'review_level_b':
      problem = generateReviewProblem()
      break
    case 'times_table_2_3':
    case 'times_table_4_5':
    case 'times_table_6_7':
    case 'times_table_8_9':
      problem = generateTimesTableProblem(config.tables || [2, 3])
      break
    case 'multiplication_2digit_by_1digit':
      problem = generateMultiDigitMultiplication(config.maxMultiplicand || 99, config.type)
      break
    case 'multiplication_3digit_by_1digit':
    case 'multiplication_4digit_by_1digit':
      problem = generateMultiDigitMultiplication(config.maxMultiplicand || 999, config.type)
      break
    case 'division_intro':
    case 'division_exact':
      problem = generateDivisionProblem(config.maxDivisor || 9, false, 81, config.type)
      break
    case 'division_with_remainder':
      problem = generateDivisionProblem(config.maxDivisor || 9, true, 90, config.type)
      break
    case 'division_2digit_by_1digit':
      problem = generateDivisionProblem(config.maxDivisor || 9, true, 99, config.type)
      break
    case 'division_3digit_by_1digit':
      problem = generateDivisionProblem(config.maxDivisor || 9, true, 999, config.type)
      break
    default:
      problem = generateTimesTableProblem([2, 3])
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateCProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateCProblem(worksheet))
  }
  return problems
}

export function getCWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelCProblemType, string> = {
    'review_level_b': 'Level B Review',
    'times_table_2_3': 'Times Tables (2, 3)',
    'times_table_4_5': 'Times Tables (4, 5)',
    'times_table_6_7': 'Times Tables (6, 7)',
    'times_table_8_9': 'Times Tables (8, 9)',
    'multiplication_2digit_by_1digit': '2-Digit × 1-Digit',
    'multiplication_3digit_by_1digit': '3-Digit × 1-Digit',
    'multiplication_4digit_by_1digit': '4-Digit × 1-Digit',
    'division_intro': 'Division Introduction',
    'division_exact': 'Division (No Remainder)',
    'division_with_remainder': 'Division (With Remainder)',
    'division_2digit_by_1digit': '2-Digit ÷ 1-Digit',
    'division_3digit_by_1digit': '3-Digit ÷ 1-Digit',
  }
  
  return {
    level: 'C' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '5 min',
    problemTypes: [config.type],
  }
}
