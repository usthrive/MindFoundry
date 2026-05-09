import type { Problem, LevelEProblemType } from '../types'
import { randomInt, generateId, lcm, simplifyFraction } from '../utils'
import {
  generateFractionAddSameDenomHints,
  generateFractionAddDiffDenomHints,
  generateFractionSubtractSameDenomHints,
  generateFractionSubtractDiffDenomHints,
  generateFractionMultiplyHints,
  generateFractionDivideHints,
} from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: LevelEProblemType
  minDenom?: number
  maxDenom?: number
} {
  // Spec lines for Level E:
  //   11-90  | Addition of Fractions (Parts 1-9: same-denom → different-denom, ramping)
  //   91-130 | Subtraction (Parts 1-3, then mixed add/sub at 121-130)
  //   131-160| Multiplication (Parts 1-2)
  //   161-170| Division
  //   171-180| Mult & Div mixed
  //   181-200| Four operations mixed
  // Previously the Parts 1-9 addition ladder was collapsed into 2 ranges.
  if (worksheet <= 10) return { type: 'review_level_d' }

  // Worksheets 11-50: same-denominator addition (Parts 1-4) — denom ramp
  if (worksheet <= 20) return { type: 'fraction_add_same_denom', minDenom: 2, maxDenom: 5 }
  if (worksheet <= 30) return { type: 'fraction_add_same_denom', minDenom: 3, maxDenom: 7 }
  if (worksheet <= 40) return { type: 'fraction_add_same_denom', minDenom: 4, maxDenom: 9 }
  if (worksheet <= 50) return { type: 'fraction_add_same_denom', minDenom: 5, maxDenom: 12 }

  // Worksheets 51-90: different-denominator addition (Parts 5-9) — denom ramp
  if (worksheet <= 60) return { type: 'fraction_add_diff_denom', minDenom: 2, maxDenom: 4 }
  if (worksheet <= 70) return { type: 'fraction_add_diff_denom', minDenom: 2, maxDenom: 6 }
  if (worksheet <= 80) return { type: 'fraction_add_diff_denom', minDenom: 2, maxDenom: 8 }
  if (worksheet <= 90) return { type: 'fraction_add_diff_denom', minDenom: 3, maxDenom: 9 }

  // Worksheets 91-130: subtraction
  if (worksheet <= 110) return { type: 'fraction_subtract_same_denom', minDenom: 3, maxDenom: 12 }
  if (worksheet <= 120) return { type: 'fraction_subtract_diff_denom', minDenom: 2, maxDenom: 8 }
  if (worksheet <= 130) return { type: 'fraction_add_subtract_mixed' }

  // Worksheets 131-160: multiplication
  if (worksheet <= 150) return { type: 'fraction_multiply', minDenom: 2, maxDenom: 8 }
  if (worksheet <= 160) return { type: 'fraction_multiply', minDenom: 2, maxDenom: 10 }

  // Worksheets 161-170: division
  if (worksheet <= 170) return { type: 'fraction_divide' }

  // Worksheets 171-180: multiplication & division mixed
  if (worksheet <= 180) return { type: 'fraction_mult_div_mixed' }

  // Worksheets 181-200: four operations mixed
  return { type: 'four_operations_fractions' }
}

function generateReviewProblem(): Problem {
  const denom = randomInt(2, 10)
  const num1 = randomInt(1, denom - 1)
  const num2 = randomInt(1, denom - 1)
  const sum = num1 + num2

  const simplified = simplifyFraction(sum, denom)

  return {
    id: generateId(),
    level: 'E',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'review_level_d',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `${num1}/${denom} + ${num2}/${denom} = ___`,
    correctAnswer: simplified,
    operands: [num1, denom, num2, denom],
    hints: ['Add the numerators, keep the denominator'],
    graduatedHints: generateFractionAddSameDenomHints(num1, num2, denom, 'E'),
  }
}

function generateAddSameDenom(minDenom: number = 3, maxDenom: number = 12): Problem {
  const denom = randomInt(Math.max(2, minDenom), Math.max(minDenom + 1, maxDenom))
  const num1 = randomInt(1, denom - 1)
  const num2 = randomInt(1, denom - 1)
  const sum = num1 + num2

  const simplified = simplifyFraction(sum, denom)

  return {
    id: generateId(),
    level: 'E',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'fraction_add_same_denom',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `${num1}/${denom} + ${num2}/${denom} = ___`,
    correctAnswer: simplified,
    operands: [num1, denom, num2, denom],
    hints: [
      'When denominators are the same, just add the numerators',
      'Simplify if possible',
    ],
    graduatedHints: generateFractionAddSameDenomHints(num1, num2, denom, 'E'),
  }
}

function generateAddDiffDenom(minDenom: number = 2, maxDenom: number = 8): Problem {
  const denom1 = randomInt(minDenom, maxDenom)
  let denom2 = randomInt(minDenom, maxDenom)
  while (denom2 === denom1) denom2 = randomInt(minDenom, maxDenom)

  const num1 = randomInt(1, denom1 - 1)
  const num2 = randomInt(1, denom2 - 1)

  const commonDenom = lcm(denom1, denom2)
  const newNum1 = num1 * (commonDenom / denom1)
  const newNum2 = num2 * (commonDenom / denom2)
  const sum = newNum1 + newNum2

  const simplified = simplifyFraction(sum, commonDenom)

  return {
    id: generateId(),
    level: 'E',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'fraction_add_diff_denom',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${num1}/${denom1} + ${num2}/${denom2} = ___`,
    correctAnswer: simplified,
    operands: [num1, denom1, num2, denom2],
    hints: [
      'Find a common denominator first',
      `The LCM of ${denom1} and ${denom2} is ${commonDenom}`,
      'Convert both fractions, then add',
    ],
    graduatedHints: generateFractionAddDiffDenomHints(num1, denom1, num2, denom2, 'E'),
  }
}

function generateSubtractSameDenom(minDenom: number = 3, maxDenom: number = 12): Problem {
  const denom = randomInt(Math.max(3, minDenom), Math.max(minDenom + 1, maxDenom))
  const num1 = randomInt(2, denom)
  const num2 = randomInt(1, num1 - 1)
  const diff = num1 - num2

  const simplified = simplifyFraction(diff, denom)

  return {
    id: generateId(),
    level: 'E',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'fraction_subtract_same_denom',
    difficulty: 1,
    displayFormat: 'horizontal',
    question: `${num1}/${denom} - ${num2}/${denom} = ___`,
    correctAnswer: simplified,
    operands: [num1, denom, num2, denom],
    hints: [
      'When denominators are the same, just subtract the numerators',
      'Simplify if possible',
    ],
    graduatedHints: generateFractionSubtractSameDenomHints(num1, num2, denom, 'E'),
  }
}

function generateSubtractDiffDenom(minDenom: number = 2, maxDenom: number = 8): Problem {
  const denom1 = randomInt(minDenom, maxDenom)
  let denom2 = randomInt(minDenom, maxDenom)
  while (denom2 === denom1) denom2 = randomInt(minDenom, maxDenom)

  const commonDenom = lcm(denom1, denom2)

  const num1 = randomInt(2, denom1)
  const num2 = randomInt(1, denom2 - 1)

  const newNum1 = num1 * (commonDenom / denom1)
  const newNum2 = num2 * (commonDenom / denom2)

  if (newNum1 <= newNum2) {
    return generateSubtractDiffDenom(minDenom, maxDenom)
  }

  const diff = newNum1 - newNum2
  const simplified = simplifyFraction(diff, commonDenom)

  return {
    id: generateId(),
    level: 'E',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'fraction_subtract_diff_denom',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${num1}/${denom1} - ${num2}/${denom2} = ___`,
    correctAnswer: simplified,
    operands: [num1, denom1, num2, denom2],
    hints: [
      'Find a common denominator first',
      `The LCM of ${denom1} and ${denom2} is ${commonDenom}`,
      'Convert both fractions, then subtract',
    ],
    graduatedHints: generateFractionSubtractDiffDenomHints(num1, denom1, num2, denom2, 'E'),
  }
}

function generateMultiplyFractions(minDenom: number = 2, maxDenom: number = 10): Problem {
  const num1 = randomInt(1, Math.max(2, maxDenom - 1))
  const denom1 = randomInt(minDenom, maxDenom)
  const num2 = randomInt(1, Math.max(2, maxDenom - 1))
  const denom2 = randomInt(minDenom, maxDenom)

  const productNum = num1 * num2
  const productDenom = denom1 * denom2

  const simplified = simplifyFraction(productNum, productDenom)

  return {
    id: generateId(),
    level: 'E',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'fraction_multiply',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${num1}/${denom1} × ${num2}/${denom2} = ___`,
    correctAnswer: simplified,
    operands: [num1, denom1, num2, denom2],
    hints: [
      'Multiply numerators together',
      'Multiply denominators together',
      'Simplify the result',
    ],
    graduatedHints: generateFractionMultiplyHints(num1, denom1, num2, denom2, 'E'),
  }
}

function generateDivideFractions(): Problem {
  const num1 = randomInt(1, 8)
  const denom1 = randomInt(2, 10)
  const num2 = randomInt(1, 8)
  const denom2 = randomInt(2, 10)

  const resultNum = num1 * denom2
  const resultDenom = denom1 * num2

  const simplified = simplifyFraction(resultNum, resultDenom)

  return {
    id: generateId(),
    level: 'E',
    worksheetNumber: 1,
    type: 'fraction',
    subtype: 'fraction_divide',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `${num1}/${denom1} ÷ ${num2}/${denom2} = ___`,
    correctAnswer: simplified,
    operands: [num1, denom1, num2, denom2],
    hints: [
      'To divide fractions, multiply by the reciprocal',
      `Flip the second fraction: ${denom2}/${num2}`,
      'Then multiply',
    ],
    graduatedHints: generateFractionDivideHints(num1, denom1, num2, denom2, 'E'),
  }
}

function generateMixedOperations(): Problem {
  const operations = ['add', 'subtract', 'multiply', 'divide']
  const op = operations[randomInt(0, operations.length - 1)]
  
  switch (op) {
    case 'add':
      return generateAddDiffDenom()
    case 'subtract':
      return generateSubtractDiffDenom()
    case 'multiply':
      return generateMultiplyFractions()
    case 'divide':
      return generateDivideFractions()
    default:
      return generateMultiplyFractions()
  }
}

export function generateEProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'review_level_d':
      problem = generateReviewProblem()
      break
    case 'fraction_add_same_denom':
      problem = generateAddSameDenom(config.minDenom, config.maxDenom)
      break
    case 'fraction_add_diff_denom':
      problem = generateAddDiffDenom(config.minDenom, config.maxDenom)
      break
    case 'fraction_subtract_same_denom':
      problem = generateSubtractSameDenom(config.minDenom, config.maxDenom)
      break
    case 'fraction_subtract_diff_denom':
      problem = generateSubtractDiffDenom(config.minDenom, config.maxDenom)
      break
    case 'fraction_add_subtract_mixed':
      problem = Math.random() < 0.5 ? generateAddDiffDenom() : generateSubtractDiffDenom()
      break
    case 'fraction_multiply':
      problem = generateMultiplyFractions(config.minDenom, config.maxDenom)
      break
    case 'fraction_divide':
      problem = generateDivideFractions()
      break
    case 'fraction_mult_div_mixed':
      problem = Math.random() < 0.5 ? generateMultiplyFractions() : generateDivideFractions()
      break
    case 'four_operations_fractions':
      problem = generateMixedOperations()
      break
    default:
      problem = generateReviewProblem()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateEProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateEProblem(worksheet))
  }
  return problems
}

export function getEWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelEProblemType, string> = {
    'review_level_d': 'Level D Review',
    'fraction_add_same_denom': 'Adding Fractions (Same Denominator)',
    'fraction_add_diff_denom': 'Adding Fractions (Different Denominators)',
    'fraction_subtract_same_denom': 'Subtracting Fractions (Same Denominator)',
    'fraction_subtract_diff_denom': 'Subtracting Fractions (Different Denominators)',
    'fraction_add_subtract_mixed': 'Adding & Subtracting Fractions',
    'fraction_multiply': 'Multiplying Fractions',
    'fraction_divide': 'Dividing Fractions',
    'fraction_mult_div_mixed': 'Multiplying & Dividing Fractions',
    'four_operations_fractions': 'Four Operations with Fractions',
  }
  
  return {
    level: 'E' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '5 min',
    problemTypes: [config.type],
  }
}
