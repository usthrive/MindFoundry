import type { Problem, LevelJProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'
import {
  generateFOILHints,
  generateQuadraticFormulaHints,
  generateGenericHints,
  generateSumCubesHints,
  generateDifferenceCubesHints,
  generateFactorByGroupingHints,
  generateComplexMultiplicationHints,
  generatePowersOfIHints,
  generatePolynomialDivisionHints,
  generateRemainderTheoremHints,
} from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: LevelJProblemType
} {
  if (worksheet <= 30) return { type: 'expansion_polynomial_products' }
  if (worksheet <= 50) return { type: 'factor_sum_difference_cubes' }
  if (worksheet <= 70) return { type: 'factor_by_grouping' }
  if (worksheet <= 90) return { type: 'fractional_expressions' }
  if (worksheet <= 110) return { type: 'complex_multiplication' }
  if (worksheet <= 120) return { type: 'powers_of_i' }
  if (worksheet <= 140) return { type: 'find_discriminant' }
  if (worksheet <= 160) return { type: 'sum_of_roots' }
  if (worksheet <= 180) return { type: 'polynomial_long_division' }
  return { type: 'remainder_theorem' }
}

function generatePolynomialExpansion(): Problem {
  const a = randomInt(1, 2)
  const b = randomInt(-3, 3)
  const c = randomInt(1, 2)
  const d = randomInt(-3, 3)
  const e = randomInt(1, 2)
  const f = randomInt(-3, 3)
  
  const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`
  const dStr = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`
  const fStr = f >= 0 ? `+ ${f}` : `- ${Math.abs(f)}`
  
  const coef3 = a * c * e
  const coef2 = a * c * f + a * d * e + b * c * e
  const coef1 = a * d * f + b * c * f + b * d * e
  const coef0 = b * d * f
  
  const formatCoef = (coef: number, power: string, first: boolean = false): string => {
    if (coef === 0) return ''
    const sign = coef > 0 ? (first ? '' : ' + ') : ' - '
    const absCoef = Math.abs(coef)
    if (power === '') return `${sign}${absCoef}`
    if (absCoef === 1) return `${sign}${power}`
    return `${sign}${absCoef}${power}`
  }
  
  const answer = `${formatCoef(coef3, 'x³', true)}${formatCoef(coef2, 'x²')}${formatCoef(coef1, 'x')}${formatCoef(coef0, '')}` || '0'
  
  return {
    id: generateId(),
    level: 'J',
    worksheetNumber: 1,
    type: 'polynomial',
    subtype: 'expansion_polynomial_products',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Expand: (${a === 1 ? '' : a}x ${bStr})(${c === 1 ? '' : c}x ${dStr})(${e === 1 ? '' : e}x ${fStr})`,
    correctAnswer: answer,
    hints: [
      'Multiply the first two binomials using FOIL',
      'Then multiply the result by the third binomial',
    ],
    graduatedHints: generateFOILHints(a, b, c, d, 'J'),
  }
}

function generateSumDifferenceCubes(): Problem {
  const type = randomChoice(['sum', 'difference'])
  const a = randomInt(1, 4)
  const b = randomInt(1, 5)
  
  const aCubed = a * a * a
  const bCubed = b * b * b
  
  if (type === 'sum') {
    return {
      id: generateId(),
      level: 'J',
      worksheetNumber: 1,
      type: 'factoring',
      subtype: 'factor_sum_difference_cubes',
      difficulty: 3,
      displayFormat: 'horizontal',
      question: `Factor: ${aCubed === 1 ? '' : aCubed}x³ + ${bCubed}`,
      correctAnswer: `(${a === 1 ? '' : a}x + ${b})(${a * a === 1 ? '' : a * a}x² - ${a * b}x + ${b * b})`,
      hints: [
        'Sum of cubes: a³ + b³ = (a + b)(a² - ab + b²)',
        `Here a = ${a === 1 ? '' : a}x and b = ${b}`,
      ],
      graduatedHints: generateSumCubesHints(a, b, 'J'),
    }
  }

  return {
    id: generateId(),
    level: 'J',
    worksheetNumber: 1,
    type: 'factoring',
    subtype: 'factor_sum_difference_cubes',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Factor: ${aCubed === 1 ? '' : aCubed}x³ - ${bCubed}`,
    correctAnswer: `(${a === 1 ? '' : a}x - ${b})(${a * a === 1 ? '' : a * a}x² + ${a * b}x + ${b * b})`,
    hints: [
      'Difference of cubes: a³ - b³ = (a - b)(a² + ab + b²)',
      `Here a = ${a === 1 ? '' : a}x and b = ${b}`,
    ],
    graduatedHints: generateDifferenceCubesHints(a, b, 'J'),
  }
}

function generateFactorByGrouping(): Problem {
  const a = randomInt(1, 3)
  const b = randomInt(1, 4)
  const c = randomInt(1, 3)
  const d = randomInt(1, 4)
  
  const term1 = a * c
  const term2 = a * d
  const term3 = b * c
  const term4 = b * d
  
  return {
    id: generateId(),
    level: 'J',
    worksheetNumber: 1,
    type: 'factoring',
    subtype: 'factor_by_grouping',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Factor by grouping: ${term1}x³ + ${term2}x² + ${term3}x + ${term4}`,
    correctAnswer: `(${a === 1 ? '' : a}x² + ${b})(${c === 1 ? '' : c}x + ${d})`,
    hints: [
      'Group the first two terms and the last two terms',
      'Factor out the GCF from each group',
      'Factor out the common binomial',
    ],
    graduatedHints: generateFactorByGroupingHints('J'),
  }
}

function generateComplexMultiplication(): Problem {
  const a = randomInt(-5, 5)
  const b = randomInt(-5, 5)
  const c = randomInt(-5, 5)
  const d = randomInt(-5, 5)
  
  const realPart = a * c - b * d
  const imagPart = a * d + b * c
  
  const bStr = b >= 0 ? `+ ${b}i` : `- ${Math.abs(b)}i`
  const dStr = d >= 0 ? `+ ${d}i` : `- ${Math.abs(d)}i`
  
  let answer = ''
  if (realPart !== 0) answer = String(realPart)
  if (imagPart !== 0) {
    if (answer) {
      answer += imagPart >= 0 ? ` + ${imagPart}i` : ` - ${Math.abs(imagPart)}i`
    } else {
      answer = `${imagPart}i`
    }
  }
  if (!answer) answer = '0'
  
  return {
    id: generateId(),
    level: 'J',
    worksheetNumber: 1,
    type: 'complex',
    subtype: 'complex_multiplication',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Multiply: (${a} ${bStr})(${c} ${dStr})`,
    correctAnswer: answer,
    hints: [
      'Use FOIL, remembering that i² = -1',
      'Combine real parts and imaginary parts',
    ],
    graduatedHints: generateComplexMultiplicationHints(a, b, c, d, 'J'),
  }
}

function generatePowersOfI(): Problem {
  const power = randomInt(2, 50)
  const remainder = power % 4
  const answers: Record<number, string> = {
    0: '1',
    1: 'i',
    2: '-1',
    3: '-i',
  }
  
  return {
    id: generateId(),
    level: 'J',
    worksheetNumber: 1,
    type: 'complex',
    subtype: 'powers_of_i',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Simplify: i^${power}`,
    correctAnswer: answers[remainder],
    hints: [
      'Powers of i cycle: i¹ = i, i² = -1, i³ = -i, i⁴ = 1',
      `Find ${power} mod 4`,
    ],
    graduatedHints: generatePowersOfIHints(power, 'J'),
  }
}

function generateDiscriminant(): Problem {
  const a = randomInt(1, 5)
  const b = randomInt(-10, 10)
  const c = randomInt(-10, 10)
  
  const discriminant = b * b - 4 * a * c
  
  const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
  
  let natureOfRoots: string
  if (discriminant > 0) {
    natureOfRoots = Number.isInteger(Math.sqrt(discriminant)) 
      ? 'two distinct rational roots'
      : 'two distinct irrational roots'
  } else if (discriminant === 0) {
    natureOfRoots = 'one repeated real root'
  } else {
    natureOfRoots = 'two complex conjugate roots'
  }
  
  return {
    id: generateId(),
    level: 'J',
    worksheetNumber: 1,
    type: 'quadratic',
    subtype: 'find_discriminant',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the discriminant and describe the nature of the roots: ${a === 1 ? '' : a}x² ${bStr} ${cStr} = 0`,
    correctAnswer: `Discriminant = ${discriminant}, ${natureOfRoots}`,
    hints: [
      'Discriminant = b² - 4ac',
      `b² = ${b * b}, 4ac = ${4 * a * c}`,
    ],
    graduatedHints: generateQuadraticFormulaHints(a, b, c, 'J'),
  }
}

function generateSumProductOfRoots(): Problem {
  const a = randomInt(1, 5)
  const b = randomInt(-10, 10)
  const c = randomInt(-10, 10)
  
  const sumOfRoots = -b / a
  const productOfRoots = c / a
  
  const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
  
  const type = randomChoice(['sum', 'product'])
  
  if (type === 'sum') {
    return {
      id: generateId(),
      level: 'J',
      worksheetNumber: 1,
      type: 'quadratic',
      subtype: 'sum_of_roots',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Find the sum of the roots: ${a === 1 ? '' : a}x² ${bStr} ${cStr} = 0`,
      correctAnswer: Number.isInteger(sumOfRoots) ? sumOfRoots : `${-b}/${a}`,
      hints: ['Sum of roots = -b/a'],
      graduatedHints: generateGenericHints('sum_of_roots', 'J'),
    }
  }

  return {
    id: generateId(),
    level: 'J',
    worksheetNumber: 1,
    type: 'quadratic',
    subtype: 'product_of_roots',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the product of the roots: ${a === 1 ? '' : a}x² ${bStr} ${cStr} = 0`,
    correctAnswer: Number.isInteger(productOfRoots) ? productOfRoots : `${c}/${a}`,
    hints: ['Product of roots = c/a'],
    graduatedHints: generateGenericHints('product_of_roots', 'J'),
  }
}

function generatePolynomialDivision(): Problem {
  const r = randomInt(-3, 3)
  const q2 = randomInt(1, 2)
  const q1 = randomInt(-3, 3)
  const q0 = randomInt(-3, 3)
  const rem = randomInt(-5, 5)
  
  const a3 = q2
  const a2 = q1 - q2 * r
  const a1 = q0 - q1 * r
  const a0 = rem - q0 * r
  
  const formatTerm = (coef: number, power: string, first: boolean = false): string => {
    if (coef === 0) return ''
    const sign = coef > 0 ? (first ? '' : ' + ') : ' - '
    const absCoef = Math.abs(coef)
    if (power === '') return `${sign}${absCoef}`
    if (absCoef === 1) return `${sign}${power}`
    return `${sign}${absCoef}${power}`
  }
  
  const dividend = `${formatTerm(a3, 'x³', true)}${formatTerm(a2, 'x²')}${formatTerm(a1, 'x')}${formatTerm(a0, '')}` || '0'
  const divisorStr = r >= 0 ? `(x - ${r})` : `(x + ${Math.abs(r)})`
  
  const quotient = `${formatTerm(q2, 'x²', true)}${formatTerm(q1, 'x')}${formatTerm(q0, '')}` || '0'
  const answer = rem === 0 ? quotient : `${quotient}, remainder ${rem}`
  
  return {
    id: generateId(),
    level: 'J',
    worksheetNumber: 1,
    type: 'polynomial',
    subtype: 'polynomial_long_division',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Divide ${dividend} by ${divisorStr}`,
    correctAnswer: answer,
    hints: [
      'Use polynomial long division or synthetic division',
      'Divide the leading terms first',
      `Divide by (x ${r >= 0 ? '- ' + r : '+ ' + Math.abs(r)})`,
    ],
    graduatedHints: generatePolynomialDivisionHints('J'),
  }
}

function generateRemainderTheorem(): Problem {
  const c = randomInt(-3, 3)
  const a = randomInt(1, 2)
  const b = randomInt(-4, 4)
  const d = randomInt(-4, 4)
  const e = randomInt(-5, 5)
  
  const remainder = a * Math.pow(c, 3) + b * Math.pow(c, 2) + d * c + e
  
  const formatTerm = (coef: number, power: string, first: boolean = false): string => {
    if (coef === 0) return ''
    const sign = coef > 0 ? (first ? '' : ' + ') : ' - '
    const absCoef = Math.abs(coef)
    if (power === '') return `${sign}${absCoef}`
    if (absCoef === 1) return `${sign}${power}`
    return `${sign}${absCoef}${power}`
  }
  
  const polynomial = `${formatTerm(a, 'x³', true)}${formatTerm(b, 'x²')}${formatTerm(d, 'x')}${formatTerm(e, '')}` || '0'
  const divisorStr = c >= 0 ? `(x - ${c})` : `(x + ${Math.abs(c)})`
  
  return {
    id: generateId(),
    level: 'J',
    worksheetNumber: 1,
    type: 'polynomial',
    subtype: 'remainder_theorem',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Use the Remainder Theorem to find the remainder when ${polynomial} is divided by ${divisorStr}`,
    correctAnswer: remainder,
    hints: [
      'Remainder Theorem: The remainder is f(c) when dividing by (x - c)',
      `Substitute x = ${c} into the polynomial`,
      `f(${c}) = ${a}(${c})³ + ${b}(${c})² + ${d}(${c}) + ${e}`,
    ],
    graduatedHints: generateRemainderTheoremHints(c, 'J'),
  }
}

export function generateJProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'expansion_polynomial_products':
      problem = generatePolynomialExpansion()
      break
    case 'factor_sum_difference_cubes':
      problem = generateSumDifferenceCubes()
      break
    case 'factor_by_grouping':
    case 'factor_quartic':
      problem = generateFactorByGrouping()
      break
    case 'fractional_expressions':
      problem = generateComplexMultiplication()
      break
    case 'complex_addition_subtraction':
    case 'complex_multiplication':
    case 'complex_division':
      problem = generateComplexMultiplication()
      break
    case 'powers_of_i':
      problem = generatePowersOfI()
      break
    case 'find_discriminant':
    case 'determine_nature_of_roots':
    case 'find_k_for_root_type':
      problem = generateDiscriminant()
      break
    case 'sum_of_roots':
    case 'product_of_roots':
    case 'form_equation_from_roots':
      problem = generateSumProductOfRoots()
      break
    case 'polynomial_long_division':
    case 'synthetic_division':
      problem = generatePolynomialDivision()
      break
    case 'remainder_theorem':
    case 'factor_theorem':
      problem = generateRemainderTheorem()
      break
    case 'algebraic_identity_proof':
    case 'inequality_proof':
      problem = generateDiscriminant()
      break
    default:
      problem = generateComplexMultiplication()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateJProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateJProblem(worksheet))
  }
  return problems
}

export function getJWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelJProblemType, string> = {
    'expansion_polynomial_products': 'Polynomial Products',
    'factor_sum_difference_cubes': 'Sum/Difference of Cubes',
    'factor_by_grouping': 'Factor by Grouping',
    'factor_quartic': 'Factor Quartics',
    'fractional_expressions': 'Fractional Expressions',
    'complex_addition_subtraction': 'Complex Addition/Subtraction',
    'complex_multiplication': 'Complex Multiplication',
    'complex_division': 'Complex Division',
    'powers_of_i': 'Powers of i',
    'find_discriminant': 'Discriminant',
    'determine_nature_of_roots': 'Nature of Roots',
    'find_k_for_root_type': 'Find k for Root Type',
    'sum_of_roots': 'Sum of Roots',
    'product_of_roots': 'Product of Roots',
    'form_equation_from_roots': 'Form Equation from Roots',
    'polynomial_long_division': 'Polynomial Long Division',
    'synthetic_division': 'Synthetic Division',
    'remainder_theorem': 'Remainder Theorem',
    'factor_theorem': 'Factor Theorem',
    'algebraic_identity_proof': 'Algebraic Identity Proofs',
    'inequality_proof': 'Inequality Proofs',
  }
  
  return {
    level: 'J' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
