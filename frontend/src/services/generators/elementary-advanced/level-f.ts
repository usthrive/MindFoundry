import type { Problem, LevelFProblemType, Fraction } from '../types'
import { randomInt, generateId, lcm, simplifyFraction, randomChoice } from '../utils'
import {
  generateFractionMultiplyHints,
  generateFractionAddSameDenomHints,
  generateOrderOfOpsFractionsHints,
  generateFractionToDecimalHints,
  generateDecimalToFractionHints,
  generateDecimalHints,
  generateWordProblemHints,
} from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: LevelFProblemType
} {
  if (worksheet <= 20) return { type: 'review_level_e' }
  if (worksheet <= 40) return { type: 'three_fraction_mult_div' }
  if (worksheet <= 60) return { type: 'three_fraction_addition' }
  if (worksheet <= 80) return { type: 'three_fraction_add_subtract' }
  if (worksheet <= 100) return { type: 'order_of_operations_3_fractions' }
  if (worksheet <= 130) return { type: 'order_of_operations_multi_fractions' }
  if (worksheet <= 150) return { type: 'fraction_to_decimal' }
  if (worksheet <= 170) return { type: 'decimal_to_fraction' }
  if (worksheet <= 180) return { type: 'word_problems' }
  return { type: 'decimal_operations' }
}

function generateReviewProblem(): Problem {
  const num1 = randomInt(1, 8)
  const denom1 = randomInt(2, 10)
  const num2 = randomInt(1, 8)
  const denom2 = randomInt(2, 10)

  const resultNum = num1 * num2
  const resultDenom = denom1 * denom2
  const simplified = simplifyFraction(resultNum, resultDenom)

  return {
    id: generateId(),
    level: 'F',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'review_level_e',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `${num1}/${denom1} × ${num2}/${denom2} = ___`,
    correctAnswer: simplified,
    operands: [num1, denom1, num2, denom2],
    hints: ['Multiply numerators, multiply denominators, then simplify'],
    graduatedHints: generateFractionMultiplyHints(num1, denom1, num2, denom2, 'F'),
  }
}

function generateThreeFractionMultDiv(): Problem {
  const nums = [randomInt(1, 5), randomInt(1, 5), randomInt(1, 5)]
  const denoms = [randomInt(2, 8), randomInt(2, 8), randomInt(2, 8)]

  const ops = [randomChoice(['×', '÷']), randomChoice(['×', '÷'])]

  let resultNum = nums[0]
  let resultDenom = denoms[0]

  for (let i = 1; i < 3; i++) {
    if (ops[i - 1] === '×') {
      resultNum *= nums[i]
      resultDenom *= denoms[i]
    } else {
      resultNum *= denoms[i]
      resultDenom *= nums[i]
    }
  }

  const simplified = simplifyFraction(resultNum, resultDenom)

  return {
    id: generateId(),
    level: 'F',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'three_fraction_mult_div',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${nums[0]}/${denoms[0]} ${ops[0]} ${nums[1]}/${denoms[1]} ${ops[1]} ${nums[2]}/${denoms[2]} = ___`,
    correctAnswer: simplified,
    hints: [
      'Work from left to right',
      'For division, multiply by the reciprocal',
    ],
    graduatedHints: generateOrderOfOpsFractionsHints([nums[0], denoms[0], nums[1], denoms[1], nums[2], denoms[2]], 'F'),
  }
}

function generateThreeFractionAddition(): Problem {
  const denom = randomInt(3, 10)
  const nums = [randomInt(1, denom - 1), randomInt(1, denom - 1), randomInt(1, denom - 1)]
  const sum = nums[0] + nums[1] + nums[2]

  const simplified = simplifyFraction(sum, denom)

  return {
    id: generateId(),
    level: 'F',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'three_fraction_addition',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${nums[0]}/${denom} + ${nums[1]}/${denom} + ${nums[2]}/${denom} = ___`,
    correctAnswer: simplified,
    hints: [
      'Add all numerators together',
      'Keep the common denominator',
      'Simplify if possible',
    ],
    graduatedHints: generateFractionAddSameDenomHints(nums[0] + nums[1], nums[2], denom, 'F'),
  }
}

function generateOrderOfOperations(): Problem {
  const num1 = randomInt(1, 5)
  const denom1 = randomInt(2, 6)
  const num2 = randomInt(1, 5)
  const denom2 = randomInt(2, 6)
  const num3 = randomInt(1, 5)
  const denom3 = randomInt(2, 6)

  const productNum = num2 * num3
  const productDenom = denom2 * denom3

  const commonDenom = lcm(denom1, productDenom)
  const term1Num = num1 * (commonDenom / denom1)
  const term2Num = productNum * (commonDenom / productDenom)

  const resultNum = term1Num + term2Num
  const simplified = simplifyFraction(resultNum, commonDenom)

  return {
    id: generateId(),
    level: 'F',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'order_of_operations_3_fractions',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `${num1}/${denom1} + ${num2}/${denom2} × ${num3}/${denom3} = ___`,
    correctAnswer: simplified,
    hints: [
      'Follow order of operations: multiply first',
      `First calculate ${num2}/${denom2} × ${num3}/${denom3}`,
      'Then add to the first fraction',
    ],
    graduatedHints: generateOrderOfOpsFractionsHints([num1, denom1, num2, denom2, num3, denom3], 'F'),
  }
}

function generateFractionToDecimal(): Problem {
  const denominators = [2, 4, 5, 8, 10, 20, 25, 50, 100]
  const denom = randomChoice(denominators)
  const num = randomInt(1, denom - 1)

  const decimal = (num / denom).toFixed(denom === 100 ? 2 : denom <= 4 ? 2 : 3).replace(/\.?0+$/, '')

  return {
    id: generateId(),
    level: 'F',
    worksheetNumber: 1,
    type: 'conversion',
    subtype: 'fraction_to_decimal',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Convert ${num}/${denom} to a decimal`,
    correctAnswer: parseFloat(decimal),
    operands: [num, denom],
    hints: [
      'Divide the numerator by the denominator',
      `${num} ÷ ${denom} = ?`,
    ],
    graduatedHints: generateFractionToDecimalHints(num, denom, 'F'),
  }
}

function generateDecimalToFraction(): Problem {
  const decimals = [0.5, 0.25, 0.75, 0.2, 0.4, 0.6, 0.8, 0.1, 0.125, 0.375]
  const decimal = randomChoice(decimals)

  const fractionMap: Record<number, Fraction> = {
    0.5: { numerator: 1, denominator: 2 },
    0.25: { numerator: 1, denominator: 4 },
    0.75: { numerator: 3, denominator: 4 },
    0.2: { numerator: 1, denominator: 5 },
    0.4: { numerator: 2, denominator: 5 },
    0.6: { numerator: 3, denominator: 5 },
    0.8: { numerator: 4, denominator: 5 },
    0.1: { numerator: 1, denominator: 10 },
    0.125: { numerator: 1, denominator: 8 },
    0.375: { numerator: 3, denominator: 8 },
  }

  return {
    id: generateId(),
    level: 'F',
    worksheetNumber: 1,
    type: 'conversion',
    subtype: 'decimal_to_fraction',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Convert ${decimal} to a fraction in lowest terms`,
    correctAnswer: fractionMap[decimal],
    hints: [
      'Think about what fraction this decimal represents',
      'Reduce to lowest terms',
    ],
    graduatedHints: generateDecimalToFractionHints(decimal, 'F'),
  }
}

function generateWordProblem(): Problem {
  const scenarios = [
    {
      template: 'A recipe calls for {a}/{b} cup of flour. If you want to make {n} batches, how much flour do you need?',
      generator: () => {
        const denom = randomChoice([2, 3, 4])
        const num = randomInt(1, denom - 1)
        const batches = randomInt(2, 4)
        const resultNum = num * batches
        return {
          params: { a: num, b: denom, n: batches },
          answer: simplifyFraction(resultNum, denom),
        }
      },
    },
    {
      template: 'You have {a}/{b} of a pizza. You eat {c}/{d} of what you have. How much pizza did you eat?',
      generator: () => {
        const denom1 = randomChoice([2, 4, 8])
        const num1 = randomInt(1, denom1)
        const denom2 = randomChoice([2, 4])
        const num2 = randomInt(1, denom2)
        const resultNum = num1 * num2
        const resultDenom = denom1 * denom2
        return {
          params: { a: num1, b: denom1, c: num2, d: denom2 },
          answer: simplifyFraction(resultNum, resultDenom),
        }
      },
    },
  ]

  const scenario = randomChoice(scenarios)
  const { params, answer } = scenario.generator()

  let question = scenario.template
  for (const [key, value] of Object.entries(params)) {
    question = question.replace(`{${key}}`, String(value))
  }

  return {
    id: generateId(),
    level: 'F',
    worksheetNumber: 1,
    type: 'word_problem',
    subtype: 'word_problems',
    difficulty: 3,
    displayFormat: 'horizontal',
    question,
    correctAnswer: answer,
    hints: [
      'Identify what operation to use',
      'Set up the fraction problem',
      'Simplify your answer',
    ],
    graduatedHints: generateWordProblemHints('F'),
  }
}

function generateDecimalOperations(): Problem {
  const a = (randomInt(1, 99) / 10).toFixed(1)
  const b = (randomInt(1, 99) / 10).toFixed(1)
  const op = randomChoice(['+', '-', '×'])

  let result: number
  let decimalOp: string
  switch (op) {
    case '+':
      result = parseFloat(a) + parseFloat(b)
      decimalOp = 'decimal_add'
      break
    case '-':
      result = Math.abs(parseFloat(a) - parseFloat(b))
      decimalOp = 'decimal_subtract'
      break
    case '×':
      result = parseFloat(a) * parseFloat(b)
      decimalOp = 'decimal_multiply'
      break
    default:
      result = 0
      decimalOp = 'decimal_add'
  }

  const displayA = op === '-' && parseFloat(a) < parseFloat(b) ? b : a
  const displayB = op === '-' && parseFloat(a) < parseFloat(b) ? a : b

  return {
    id: generateId(),
    level: 'F',
    worksheetNumber: 1,
    type: 'decimal',
    subtype: 'decimal_operations',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${displayA} ${op} ${displayB} = ___`,
    correctAnswer: Math.round(result * 100) / 100,
    hints: [
      op === '×' ? 'Count total decimal places in the answer' : 'Line up the decimal points',
    ],
    graduatedHints: generateDecimalHints([parseFloat(displayA), parseFloat(displayB)], decimalOp, 'F'),
  }
}

export function generateFProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'review_level_e':
      problem = generateReviewProblem()
      break
    case 'three_fraction_mult_div':
      problem = generateThreeFractionMultDiv()
      break
    case 'three_fraction_addition':
      problem = generateThreeFractionAddition()
      break
    case 'three_fraction_add_subtract':
      problem = generateThreeFractionAddition()
      break
    case 'order_of_operations_3_fractions':
    case 'order_of_operations_multi_fractions':
      problem = generateOrderOfOperations()
      break
    case 'fraction_to_decimal':
      problem = generateFractionToDecimal()
      break
    case 'decimal_to_fraction':
      problem = generateDecimalToFraction()
      break
    case 'word_problems':
      problem = generateWordProblem()
      break
    case 'decimal_operations':
      problem = generateDecimalOperations()
      break
    default:
      problem = generateReviewProblem()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateFProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateFProblem(worksheet))
  }
  return problems
}

export function getFWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelFProblemType, string> = {
    'review_level_e': 'Level E Review',
    'three_fraction_mult_div': 'Three-Fraction Multiplication/Division',
    'three_fraction_addition': 'Three-Fraction Addition',
    'three_fraction_add_subtract': 'Three-Fraction Add/Subtract',
    'order_of_operations_3_fractions': 'Order of Operations (3 Fractions)',
    'order_of_operations_multi_fractions': 'Order of Operations (Multiple Fractions)',
    'fraction_to_decimal': 'Fraction to Decimal',
    'decimal_to_fraction': 'Decimal to Fraction',
    'word_problems': 'Word Problems',
    'decimal_operations': 'Decimal Operations',
  }
  
  return {
    level: 'F' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
