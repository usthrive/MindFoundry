import type { Problem, LevelDProblemType, Fraction } from '../types'
import { randomInt, generateId, gcd } from '../utils'
import { generateMultiplicationHints, generateDivisionHints, generateGenericHints } from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: LevelDProblemType
} {
  if (worksheet <= 10) return { type: 'review_level_c' }
  if (worksheet <= 40) return { type: 'multiplication_2digit_by_2digit' }
  if (worksheet <= 70) return { type: 'multiplication_3digit_by_2digit' }
  if (worksheet <= 80) return { type: 'add_subtract_review' }
  if (worksheet <= 90) return { type: 'mult_div_review' }
  if (worksheet <= 130) return { type: 'long_division_by_2digit' }
  if (worksheet <= 140) return { type: 'fraction_identification' }
  if (worksheet <= 160) return { type: 'fraction_shading' }
  if (worksheet <= 180) return { type: 'equivalent_fractions' }
  return { type: 'reduce_fraction' }
}

function generateReviewProblem(): Problem {
  const a = randomInt(100, 999)
  const b = randomInt(2, 9)
  const product = a * b

  return {
    id: generateId(),
    level: 'D',
    worksheetNumber: 1,
    type: 'multiplication',
    subtype: 'review_level_c',
    difficulty: 1,
    displayFormat: 'vertical',
    question: `${a.toString().padStart(5)}\n×${b.toString().padStart(4)}\n-----`,
    correctAnswer: product,
    operands: [a, b],
    hints: ['Multiply each digit by the multiplier, starting from the right'],
    graduatedHints: generateMultiplicationHints([a, b], 'D'),
  }
}

function generateMultiplication2x2(): Problem {
  const a = randomInt(11, 99)
  const b = randomInt(11, 99)
  const product = a * b

  return {
    id: generateId(),
    level: 'D',
    worksheetNumber: 1,
    type: 'multiplication',
    subtype: 'multiplication_2digit_by_2digit',
    difficulty: 2,
    displayFormat: 'vertical',
    question: `${a.toString().padStart(5)}\n×${b.toString().padStart(4)}\n-----`,
    correctAnswer: product,
    operands: [a, b],
    hints: [
      'Multiply by the ones digit first',
      'Then multiply by the tens digit (shift one place left)',
      'Add the partial products',
    ],
    graduatedHints: generateMultiplicationHints([a, b], 'D'),
  }
}

function generateMultiplication3x2(): Problem {
  const a = randomInt(100, 999)
  const b = randomInt(11, 99)
  const product = a * b

  return {
    id: generateId(),
    level: 'D',
    worksheetNumber: 1,
    type: 'multiplication',
    subtype: 'multiplication_3digit_by_2digit',
    difficulty: 3,
    displayFormat: 'vertical',
    question: `${a.toString().padStart(6)}\n×${b.toString().padStart(5)}\n------`,
    correctAnswer: product,
    operands: [a, b],
    hints: [
      'Multiply by the ones digit first',
      'Then multiply by the tens digit (shift one place left)',
      'Add the partial products',
    ],
    graduatedHints: generateMultiplicationHints([a, b], 'D'),
  }
}

function generateLongDivision(): Problem {
  const divisor = randomInt(11, 99)
  const quotient = randomInt(10, 99)
  const remainder = randomInt(0, divisor - 1)
  const dividend = divisor * quotient + remainder

  const answer = remainder > 0 ? `${quotient} R${remainder}` : quotient

  return {
    id: generateId(),
    level: 'D',
    worksheetNumber: 1,
    type: 'division',
    subtype: 'long_division_by_2digit',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `${dividend} ÷ ${divisor} = ___`,
    correctAnswer: answer,
    operands: [dividend, divisor],
    hints: [
      'Estimate how many times the divisor goes into the first digits',
      'Multiply, subtract, bring down the next digit',
      'Repeat until done',
    ],
    graduatedHints: generateDivisionHints([dividend, divisor], 'D'),
  }
}

function generateFractionIdentification(): Problem {
  const denominator = randomInt(2, 12)
  const numerator = randomInt(1, denominator - 1)

  return {
    id: generateId(),
    level: 'D',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'fraction_identification',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `A circle is divided into ${denominator} equal parts. ${numerator} parts are shaded. What fraction is shaded?`,
    correctAnswer: { numerator, denominator } as Fraction,
    operands: [numerator, denominator],
    visualAssets: [`fraction_circle_${numerator}_${denominator}`],
    hints: [
      'The denominator is the total number of parts',
      'The numerator is the number of shaded parts',
    ],
    graduatedHints: generateGenericHints('fraction', 'D'),
  }
}

function generateFractionShading(): Problem {
  const denominator = randomInt(2, 10)
  const numerator = randomInt(1, denominator)

  return {
    id: generateId(),
    level: 'D',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'fraction_shading',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `Shade ${numerator}/${denominator} of the shape`,
    correctAnswer: { numerator, denominator } as Fraction,
    operands: [numerator, denominator],
    visualAssets: [`shape_to_shade_${denominator}`],
    hints: [
      `Divide the shape into ${denominator} equal parts`,
      `Shade ${numerator} of those parts`,
    ],
    graduatedHints: generateGenericHints('fraction', 'D'),
  }
}

function generateEquivalentFractions(): Problem {
  const originalDenom = randomInt(2, 6)
  const originalNum = randomInt(1, originalDenom - 1)
  const multiplier = randomInt(2, 5)

  const newDenom = originalDenom * multiplier
  const newNum = originalNum * multiplier

  const askNumerator = Math.random() < 0.5

  if (askNumerator) {
    return {
      id: generateId(),
      level: 'D',
      worksheetNumber: 1,
      type: 'fraction',
      subtype: 'equivalent_fractions',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `${originalNum}/${originalDenom} = ___/${newDenom}`,
      correctAnswer: newNum,
      operands: [originalNum, originalDenom, newDenom],
      hints: [
        `What was ${originalDenom} multiplied by to get ${newDenom}?`,
        `Multiply both numerator and denominator by the same number`,
      ],
      graduatedHints: generateGenericHints('fraction', 'D'),
    }
  }

  return {
    id: generateId(),
    level: 'D',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'equivalent_fractions',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${originalNum}/${originalDenom} = ${newNum}/___`,
    correctAnswer: newDenom,
    operands: [originalNum, originalDenom, newNum],
    hints: [
      `What was ${originalNum} multiplied by to get ${newNum}?`,
      `Multiply both numerator and denominator by the same number`,
    ],
    graduatedHints: generateGenericHints('fraction', 'D'),
  }
}

function generateReduceFraction(): Problem {
  const simpleDenom = randomInt(2, 10)
  const simpleNum = randomInt(1, simpleDenom - 1)
  const factor = randomInt(2, 5)

  const num = simpleNum * factor
  const denom = simpleDenom * factor
  const divisor = gcd(num, denom)

  return {
    id: generateId(),
    level: 'D',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'reduce_fraction',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Reduce ${num}/${denom} to lowest terms`,
    correctAnswer: { numerator: num / divisor, denominator: denom / divisor } as Fraction,
    operands: [num, denom],
    hints: [
      'Find the greatest common factor of the numerator and denominator',
      'Divide both by that factor',
    ],
    graduatedHints: generateGenericHints('fraction', 'D'),
  }
}

export function generateDProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'review_level_c':
    case 'mult_div_review':
      problem = generateReviewProblem()
      break
    case 'multiplication_2digit_by_2digit':
      problem = generateMultiplication2x2()
      break
    case 'multiplication_3digit_by_2digit':
      problem = generateMultiplication3x2()
      break
    case 'add_subtract_review':
      problem = generateReviewProblem()
      break
    case 'long_division_by_2digit':
    case 'long_division_multi_digit_quotient':
      problem = generateLongDivision()
      break
    case 'fraction_identification':
      problem = generateFractionIdentification()
      break
    case 'fraction_shading':
      problem = generateFractionShading()
      break
    case 'equivalent_fractions':
      problem = generateEquivalentFractions()
      break
    case 'reduce_fraction':
      problem = generateReduceFraction()
      break
    default:
      problem = generateReviewProblem()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateDProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateDProblem(worksheet))
  }
  return problems
}

export function getDWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelDProblemType, string> = {
    'review_level_c': 'Level C Review',
    'multiplication_2digit_by_2digit': '2-Digit × 2-Digit',
    'multiplication_3digit_by_2digit': '3-Digit × 2-Digit',
    'add_subtract_review': 'Addition & Subtraction Review',
    'mult_div_review': 'Multiplication & Division Review',
    'long_division_by_2digit': 'Long Division by 2-Digit',
    'long_division_multi_digit_quotient': 'Long Division (Multi-Digit Quotient)',
    'fraction_identification': 'Fraction Identification',
    'fraction_shading': 'Fraction Shading',
    'equivalent_fractions': 'Equivalent Fractions',
    'reduce_fraction': 'Reducing Fractions',
  }
  
  return {
    level: 'D' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '5 min',
    problemTypes: [config.type],
  }
}
