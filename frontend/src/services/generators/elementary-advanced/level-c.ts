import type { Problem, LevelCProblemType } from '../types'
import { randomInt, generateId } from '../utils'
import { generateAdditionHints, generateSubtractionHints, generateMultiplicationHints, generateDivisionHints, generateMissingFactorHints } from '../hintGenerator'

/**
 * How a times-table sheet presents its facts.
 *
 *   ordered — the table in sequence, 2×1, 2×2, 2×3 … 2×10. This is how a table is
 *             learned: the child hears the count-by rhythm and the answers arrive in
 *             a pattern rather than as ten unrelated facts.
 *   random  — the same table out of order, once the sequence is known. This is where
 *             recall becomes fluency rather than recitation.
 *   mixed   — this table interleaved with every table learned so far, so the earlier
 *             ones keep getting retrieved instead of quietly fading.
 */
type Presentation = 'ordered' | 'random' | 'mixed'

function getWorksheetConfig(worksheet: number): {
  type: LevelCProblemType
  tables?: number[]
  presentation?: Presentation
  maxMultiplicand?: number
  maxDivisor?: number
  maxQuotient?: number
  allowRemainder?: boolean
  /** Fraction of the sheet given to "3 × ___ = 12" — the bridge into division. */
  missingFactorShare?: number
} {
  if (worksheet <= 10) return { type: 'review_level_b' }

  // ── 11-50: the times tables ──
  // Each table gets the same four-beat treatment: meet it in order, then out of
  // order, then folded in with everything already learned. Two sheets per beat.
  const T = (type: LevelCProblemType, tables: number[], presentation: Presentation) =>
    ({ type, tables, presentation })

  if (worksheet <= 12) return T('times_table_2_3', [2], 'ordered')
  if (worksheet <= 14) return T('times_table_2_3', [2], 'random')
  if (worksheet <= 16) return T('times_table_2_3', [3], 'ordered')
  if (worksheet <= 18) return T('times_table_2_3', [3], 'random')
  if (worksheet <= 20) return T('times_table_2_3', [2, 3], 'mixed')

  if (worksheet <= 22) return T('times_table_4_5', [4], 'ordered')
  if (worksheet <= 24) return T('times_table_4_5', [4], 'random')
  if (worksheet <= 26) return T('times_table_4_5', [5], 'ordered')
  if (worksheet <= 28) return T('times_table_4_5', [5], 'random')
  if (worksheet <= 30) return T('times_table_4_5', [2, 3, 4, 5], 'mixed')

  if (worksheet <= 32) return T('times_table_6_7', [6], 'ordered')
  if (worksheet <= 34) return T('times_table_6_7', [6], 'random')
  if (worksheet <= 36) return T('times_table_6_7', [7], 'ordered')
  if (worksheet <= 38) return T('times_table_6_7', [7], 'random')
  if (worksheet <= 40) return T('times_table_6_7', [2, 3, 4, 5, 6, 7], 'mixed')

  if (worksheet <= 42) return T('times_table_8_9', [8], 'ordered')
  if (worksheet <= 44) return T('times_table_8_9', [8], 'random')
  if (worksheet <= 46) return T('times_table_8_9', [9], 'ordered')
  if (worksheet <= 48) return T('times_table_8_9', [9], 'random')
  if (worksheet <= 50) return T('times_table_8_9', [2, 3, 4, 5, 6, 7, 8, 9], 'mixed')

  // ── 51-100: 2-digit × 1-digit, in five parts of ten sheets each ──
  if (worksheet <= 60) return { type: 'multiplication_2digit_by_1digit', maxMultiplicand: 29 }
  if (worksheet <= 70) return { type: 'multiplication_2digit_by_1digit', maxMultiplicand: 49 }
  if (worksheet <= 80) return { type: 'multiplication_2digit_by_1digit', maxMultiplicand: 69 }
  if (worksheet <= 90) return { type: 'multiplication_2digit_by_1digit', maxMultiplicand: 89 }
  if (worksheet <= 100) return { type: 'multiplication_2digit_by_1digit', maxMultiplicand: 99 }

  // ── 101-110: 3-4 digits × 1 digit ──
  if (worksheet <= 110) return { type: 'multiplication_3digit_by_1digit', maxMultiplicand: 999 }

  // ── 111-120: introduction to division ──
  // Division arrives as the question the tables have already been answering. The
  // first sheets ask it the way the child has been thinking — "3 × ? = 12" — before
  // rewriting the same fact as "12 ÷ 3". Every quotient here is a table fact, so
  // nothing new has to be worked out, only recognised from the other side.
  if (worksheet <= 115) {
    return { type: 'division_intro', maxDivisor: 9, maxQuotient: 9, allowRemainder: false, missingFactorShare: 0.5 }
  }
  if (worksheet <= 120) return { type: 'division_intro', maxDivisor: 9, maxQuotient: 9, allowRemainder: false }

  // ── 121-160: division with remainders, divisor ramping ──
  // Quotients stay inside the tables so the only new idea is the leftover.
  if (worksheet <= 130) return { type: 'division_with_remainder', maxDivisor: 5, maxQuotient: 9, allowRemainder: true }
  if (worksheet <= 140) return { type: 'division_with_remainder', maxDivisor: 7, maxQuotient: 9, allowRemainder: true }
  if (worksheet <= 150) return { type: 'division_with_remainder', maxDivisor: 9, maxQuotient: 9, allowRemainder: true }
  if (worksheet <= 160) return { type: 'division_with_remainder', maxDivisor: 9, maxQuotient: 9, allowRemainder: true }

  // ── 161-180: 2-digit ÷ 1-digit ──
  if (worksheet <= 180) return { type: 'division_2digit_by_1digit', maxDivisor: 9, allowRemainder: true }

  // ── 181-200: 3-digit ÷ 1-digit ──
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

/** Which of the four table groups a set of tables belongs to. */
function tableSubtype(tables: number[]): LevelCProblemType {
  const highest = Math.max(...tables)
  if (highest <= 3) return 'times_table_2_3'
  if (highest <= 5) return 'times_table_4_5'
  if (highest <= 7) return 'times_table_6_7'
  return 'times_table_8_9'
}

/**
 * One times-table question.
 *
 * The multiplicand is always the table being learned and it is always written first:
 * a child working the ×3 sheet sees 3×1, 3×2, 3×3 …, never 7×3 among them. Keeping
 * it fixed is what lets the answers arrive as a pattern instead of ten unrelated
 * facts, and it is why `index` matters — on an "ordered" sheet the multiplier walks
 * 1 to 10 across the worksheet.
 *
 * Two things this deliberately does NOT do on a table sheet:
 *  - swap the factors round (7 × 3 on the ×3 sheet), which breaks the count-by rhythm
 *    exactly when the rhythm is the thing being taught;
 *  - ask for a missing factor (3 × ___ = 12). That is division wearing multiplication's
 *    clothes, and asking it before the fact is known makes the child work backwards
 *    through something they cannot yet do forwards. It belongs at the division
 *    introduction, and that is now where it lives.
 */
function generateTimesTableProblem(
  tables: number[],
  presentation: Presentation = 'random',
  index?: number,
  /** Worksheet number — varies the scramble so consecutive sheets differ. */
  seed = 0
): Problem {
  const table = tables.length === 1 ? tables[0] : tables[randomInt(0, tables.length - 1)]
  // Tables run to ×10 — 7 × 10 is a table fact and was previously never asked.
  //
  // On a single-table sheet the ten questions should be the ten facts, each once.
  // Drawing at random gave 2×3 three times and 2×7 not at all, so a third of the
  // table went unpractised on the very sheet meant to drill it. Stepping by 7 — which
  // shares no factor with 10 — walks all ten in a scrambled order, and starting the
  // walk at a different place on each sheet keeps consecutive sheets from matching.
  const scrambled = (i: number, offset: number) => ((i * 7 + offset) % 10) + 1
  const multiplier = presentation === 'ordered'
    ? ((index ?? 0) % 10) + 1
    : presentation === 'random'
      ? scrambled(index ?? 0, seed)
      : randomInt(1, 10)
  const product = table * multiplier

  return {
    id: generateId(),
    level: 'C',
    worksheetNumber: 1,
    type: 'multiplication',
    subtype: tableSubtype(tables),
    difficulty: presentation === 'ordered' ? 1 : 2,
    displayFormat: 'horizontal',
    question: `${table} × ${multiplier} = ___`,
    correctAnswer: product,
    operands: [table, multiplier],
    hints: [
      `Count by ${table}s: ${Array.from({ length: multiplier }, (_, i) => table * (i + 1)).join(', ')}`,
    ],
    graduatedHints: generateMultiplicationHints([table, multiplier], 'C'),
  }
}

/** "3 × ___ = 12" — the same table fact, asked from the division side. */
function generateMissingFactorProblem(maxTable: number): Problem {
  const table = randomInt(2, maxTable)
  const multiplier = randomInt(2, 9)
  const product = table * multiplier

  return {
    id: generateId(),
    level: 'C',
    worksheetNumber: 1,
    type: 'multiplication',
    subtype: 'division_intro',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${table} × ___ = ${product}`,
    correctAnswer: multiplier,
    operands: [table, multiplier],
    hints: [
      `Count by ${table}s until you reach ${product}. How many did you count?`,
      `This is the same as asking ${product} ÷ ${table}`,
    ],
    graduatedHints: generateMissingFactorHints(table, product, 'C'),
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
  subtype: LevelCProblemType,
  /** Largest answer allowed. While division is being introduced this is 9, so every
   *  question is a times-table fact read backwards — "80 ÷ 4 = 20" is a different and
   *  much later skill than "12 ÷ 3 = 4", and it was appearing on the first sheet. */
  maxQuotient?: number
): Problem {
  const divisor = randomInt(2, maxDivisor)
  const quotientCeiling = Math.max(2, Math.min(maxQuotient ?? Infinity, Math.floor(maxDividend / divisor)))
  let dividend: number
  let quotient: number
  let remainder: number

  if (allowRemainder) {
    quotient = randomInt(2, quotientCeiling)
    remainder = randomInt(0, divisor - 1)
    dividend = quotient * divisor + remainder
  } else {
    quotient = randomInt(2, quotientCeiling)
    dividend = quotient * divisor
    remainder = 0
  }
  
  const answer = remainder > 0 ? `${quotient} R ${remainder}` : quotient
  
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
      allowRemainder
        ? 'If some is left over, tap R and write what is left — like 13 R 1'
        : '',
    ].filter(Boolean),
    graduatedHints: generateDivisionHints([dividend, divisor], 'C'),
  }
}

export function generateCProblem(worksheet: number, index?: number): Problem {
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
      problem = generateTimesTableProblem(config.tables || [2, 3], config.presentation, index, worksheet)
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
      // The bridge sheets alternate: half the questions still ask the multiplication
      // the child knows ("3 × ___ = 12"), half ask the same fact as a division.
      // Alternating by position rather than at random means every sheet carries both,
      // and the pairing is visible down the page.
      problem = config.missingFactorShare && ((index ?? 0) % 2 === 0)
        ? generateMissingFactorProblem(config.maxDivisor || 9)
        : generateDivisionProblem(config.maxDivisor || 9, false, 81, config.type, config.maxQuotient)
      break
    case 'division_with_remainder':
      problem = generateDivisionProblem(config.maxDivisor || 9, true, 90, config.type, config.maxQuotient)
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
    problems.push(generateCProblem(worksheet, i))
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
