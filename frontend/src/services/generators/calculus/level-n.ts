import type { Problem, LevelNProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'
import {
  generateArithmeticSequenceHints,
  generateGeometricSequenceHints,
  generateSigmaNotationHints,
  generateRecurrenceHints,
  generateInductionHints,
  generateInfiniteSeriesHints,
  generateLimitHints,
  generateContinuityHints,
  generateTrigDerivativeHints,
  generateHigherDerivativeHints,
  generateGenericHints,
} from '../hintGenerator'

function getWorksheetConfig(worksheet: number): {
  type: LevelNProblemType
} {
  if (worksheet <= 20) return { type: 'arithmetic_sequence_nth_term' }
  if (worksheet <= 40) return { type: 'geometric_sequence_nth_term' }
  if (worksheet <= 60) return { type: 'sigma_notation' }
  if (worksheet <= 80) return { type: 'recurrence_relations' }
  if (worksheet <= 100) return { type: 'mathematical_induction_proof' }
  if (worksheet <= 120) return { type: 'infinite_geometric_series' }
  if (worksheet <= 140) return { type: 'limit_of_function' }
  if (worksheet <= 160) return { type: 'continuity_at_point' }
  if (worksheet <= 180) return { type: 'derivative_of_trig' }
  return { type: 'higher_order_derivatives' }
}

function generateArithmeticSequence(): Problem {
  const a1 = randomInt(1, 10)
  const d = randomInt(-5, 10)
  const n = randomInt(5, 15)
  
  const an = a1 + (n - 1) * d
  
  return {
    id: generateId(),
    level: 'N',
    worksheetNumber: 1,
    type: 'sequence',
    subtype: 'arithmetic_sequence_nth_term',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the ${n}th term of the arithmetic sequence with a₁ = ${a1} and d = ${d}`,
    correctAnswer: an,
    hints: [
      'Formula: aₙ = a₁ + (n-1)d',
      `aₙ = ${a1} + (${n}-1)(${d})`,
    ],
    graduatedHints: generateArithmeticSequenceHints(a1, d, n, 'N'),
  }
}

function generateGeometricSequence(): Problem {
  const a1 = randomInt(1, 5)
  const r = randomChoice([2, 3, 0.5, -2])
  const n = randomInt(4, 8)
  
  const an = a1 * Math.pow(r, n - 1)
  
  return {
    id: generateId(),
    level: 'N',
    worksheetNumber: 1,
    type: 'sequence',
    subtype: 'geometric_sequence_nth_term',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the ${n}th term of the geometric sequence with a₁ = ${a1} and r = ${r}`,
    correctAnswer: an,
    hints: [
      'Formula: aₙ = a₁ × r^(n-1)',
      `aₙ = ${a1} × ${r}^${n - 1}`,
    ],
    graduatedHints: generateGeometricSequenceHints(a1, r, n, 'N'),
  }
}

function generateArithmeticSeries(): Problem {
  const a1 = randomInt(1, 10)
  const d = randomInt(1, 5)
  const n = randomInt(5, 12)
  
  const an = a1 + (n - 1) * d
  const sum = (n * (a1 + an)) / 2
  
  return {
    id: generateId(),
    level: 'N',
    worksheetNumber: 1,
    type: 'series',
    subtype: 'arithmetic_series_sum',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the sum of the first ${n} terms of the arithmetic series: ${a1}, ${a1 + d}, ${a1 + 2 * d}, ...`,
    correctAnswer: sum,
    hints: [
      'Formula: Sₙ = n(a₁ + aₙ)/2',
      'First find aₙ, then use the formula',
    ],
    graduatedHints: generateGenericHints('arithmetic_series', 'N'),
  }
}

function generateSigmaNotation(): Problem {
  const type = randomChoice(['expand', 'evaluate'])
  
  if (type === 'expand') {
    const start = 1
    const end = randomInt(4, 6)
    const a = randomInt(1, 3)
    
    return {
      id: generateId(),
      level: 'N',
      worksheetNumber: 1,
      type: 'series',
      subtype: 'sigma_notation',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Expand: Σ(i=${start} to ${end}) ${a}i`,
      correctAnswer: Array.from({ length: end - start + 1 }, (_, i) => a * (start + i)).join(' + '),
      hints: ['Substitute each value of i from the lower to upper bound'],
      graduatedHints: generateSigmaNotationHints('expand', start, end, 'N'),
    }
  }
  
  const n = randomInt(4, 8)
  const sum = (n * (n + 1)) / 2
  
  return {
    id: generateId(),
    level: 'N',
    worksheetNumber: 1,
    type: 'series',
    subtype: 'sigma_notation',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Evaluate: Σ(i=1 to ${n}) i`,
    correctAnswer: sum,
    hints: [
      'This is the sum of first n natural numbers',
      'Formula: n(n+1)/2',
    ],
    graduatedHints: generateSigmaNotationHints('evaluate', 1, n, 'N'),
  }
}

function generateRecurrence(): Problem {
  const a1 = randomInt(1, 5)
  const multiplier = randomInt(2, 3)
  const addend = randomInt(-2, 3)
  
  const sequence = [a1]
  for (let i = 1; i < 5; i++) {
    sequence.push(multiplier * sequence[i - 1] + addend)
  }
  
  return {
    id: generateId(),
    level: 'N',
    worksheetNumber: 1,
    type: 'sequence',
    subtype: 'recurrence_relations',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Given aₙ₊₁ = ${multiplier}aₙ ${addend >= 0 ? '+' : '-'} ${Math.abs(addend)} with a₁ = ${a1}, find a₅`,
    correctAnswer: sequence[4],
    hints: [
      'Calculate each term in order',
      `a₂ = ${multiplier}(${a1}) ${addend >= 0 ? '+' : '-'} ${Math.abs(addend)} = ${sequence[1]}`,
    ],
    graduatedHints: generateRecurrenceHints(a1, multiplier, addend, 'N'),
  }
}

function generateInductionProof(): Problem {
  const type = randomChoice(['sum', 'divisibility', 'inequality'])
  
  if (type === 'sum') {
    const formulas = [
      {
        statement: '1 + 2 + 3 + ... + n = n(n+1)/2',
        baseCase: 'n = 1: 1 = 1(1+1)/2 = 1 ✓',
        inductiveStep: 'Assume true for k. For k+1: LHS = k(k+1)/2 + (k+1) = (k+1)(k+2)/2 = RHS',
        answer: 'Proven by mathematical induction'
      },
      {
        statement: '1² + 2² + 3² + ... + n² = n(n+1)(2n+1)/6',
        baseCase: 'n = 1: 1 = 1(2)(3)/6 = 1 ✓',
        inductiveStep: 'Assume true for k. Add (k+1)² to both sides and simplify.',
        answer: 'Proven by mathematical induction'
      },
      {
        statement: '1 + 3 + 5 + ... + (2n-1) = n²',
        baseCase: 'n = 1: 1 = 1² ✓',
        inductiveStep: 'Assume true for k. For k+1: k² + (2k+1) = (k+1)²',
        answer: 'Proven by mathematical induction'
      }
    ]
    
    const formula = randomChoice(formulas)
    
    return {
      id: generateId(),
      level: 'N',
      worksheetNumber: 1,
      type: 'proof',
      subtype: 'mathematical_induction_proof',
      difficulty: 3,
      displayFormat: 'vertical',
      question: `Prove by mathematical induction:\n${formula.statement}`,
      correctAnswer: formula.answer,
      hints: [
        'Step 1 (Base Case): Verify P(1) is true',
        formula.baseCase,
        'Step 2 (Inductive Step): Assume P(k) is true, prove P(k+1)',
        formula.inductiveStep,
      ],
      graduatedHints: generateInductionHints('sum', formula.statement, 'N'),
    }
  }
  
  if (type === 'divisibility') {
    const divisors = [
      { expr: 'n³ - n', divisor: 6, baseCheck: '0 is divisible by 6' },
      { expr: '4ⁿ - 1', divisor: 3, baseCheck: '3 is divisible by 3' },
      { expr: 'n² + n', divisor: 2, baseCheck: '2 is divisible by 2' },
    ]
    
    const div = randomChoice(divisors)
    
    return {
      id: generateId(),
      level: 'N',
      worksheetNumber: 1,
      type: 'proof',
      subtype: 'mathematical_induction_proof',
      difficulty: 3,
      displayFormat: 'vertical',
      question: `Prove by induction that ${div.expr} is divisible by ${div.divisor} for all positive integers n`,
      correctAnswer: 'Proven by mathematical induction',
      hints: [
        'Step 1: Base case n = 1',
        `Check: ${div.baseCheck}`,
        'Step 2: Assume divisible for n = k, prove for n = k+1',
        `Show that the difference is also divisible by ${div.divisor}`,
      ],
      graduatedHints: generateInductionHints('divisibility', div.expr, 'N'),
    }
  }
  
  const n0 = randomInt(2, 4)
  return {
    id: generateId(),
    level: 'N',
    worksheetNumber: 1,
    type: 'proof',
    subtype: 'mathematical_induction_proof',
    difficulty: 3,
    displayFormat: 'vertical',
    question: `Prove by induction: 2ⁿ > n² for all n ≥ ${n0}`,
    correctAnswer: 'Proven by mathematical induction',
    hints: [
      `Step 1: Base case n = ${n0}`,
      `Check: 2^${n0} = ${Math.pow(2, n0)} > ${n0 * n0} = ${n0}² ✓`,
      'Step 2: Assume 2^k > k² for some k ≥ ' + n0,
      'Prove 2^(k+1) > (k+1)² by showing 2·k² > (k+1)²',
    ],
    graduatedHints: generateInductionHints('inequality', `2ⁿ > n²`, 'N'),
  }
}

function generateInfiniteGeometricSeries(): Problem {
  const a = randomInt(1, 10)
  const rChoices = [0.5, 0.25, '1/3', '2/3', 0.1]
  const r = randomChoice(rChoices)
  
  const rValue = typeof r === 'string' ? (r === '1/3' ? 1 / 3 : 2 / 3) : r
  const sum = a / (1 - rValue)
  
  return {
    id: generateId(),
    level: 'N',
    worksheetNumber: 1,
    type: 'series',
    subtype: 'infinite_geometric_series',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the sum of the infinite geometric series: a = ${a}, r = ${r}`,
    correctAnswer: Number.isInteger(sum) ? sum : `${a}/(1-${r})`,
    hints: [
      'Converges only if |r| < 1',
      'Formula: S = a/(1-r)',
    ],
    graduatedHints: generateInfiniteSeriesHints(a, rValue, 'N'),
  }
}

function generateLimitOfFunction(): Problem {
  const type = randomChoice(['polynomial', 'rational', 'special'])
  
  if (type === 'polynomial') {
    const a = randomInt(1, 3)
    const b = randomInt(-5, 5)
    const x0 = randomInt(-3, 3)
    const result = a * x0 * x0 + b * x0
    
    const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`
    
    return {
      id: generateId(),
      level: 'N',
      worksheetNumber: 1,
      type: 'limit',
      subtype: 'limit_of_function',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Evaluate: lim(x→${x0}) (${a}x² ${bStr})`,
      correctAnswer: result,
      hints: ['For polynomials, substitute directly'],
      graduatedHints: generateLimitHints(`${a}x² ${bStr}`, x0, 'N'),
    }
  }
  
  if (type === 'special') {
    return {
      id: generateId(),
      level: 'N',
      worksheetNumber: 1,
      type: 'limit',
      subtype: 'special_limits',
      difficulty: 2,
      displayFormat: 'horizontal',
      question: `Evaluate: lim(x→0) (1 - cos(x))/x²`,
      correctAnswer: '1/2',
      hints: ['This is a standard limit', 'Use L\'Hôpital\'s rule or series expansion'],
      graduatedHints: generateLimitHints('(1 - cos(x))/x²', 0, 'N'),
    }
  }
  
  return {
    id: generateId(),
    level: 'N',
    worksheetNumber: 1,
    type: 'limit',
    subtype: 'limit_of_function',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Evaluate: lim(x→∞) (3x² + x)/(x² + 1)`,
    correctAnswer: 3,
    hints: ['Divide numerator and denominator by x²'],
    graduatedHints: generateLimitHints('(3x² + x)/(x² + 1)', Infinity, 'N'),
  }
}

function generateContinuity(): Problem {
  const a = randomInt(1, 3)
  const x0 = randomInt(-2, 2)
  
  return {
    id: generateId(),
    level: 'N',
    worksheetNumber: 1,
    type: 'continuity',
    subtype: 'continuity_at_point',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Determine if f(x) = ${a}x² is continuous at x = ${x0}`,
    correctAnswer: 'Yes, it is continuous',
    hints: [
      'Check: 1) f(a) exists, 2) lim(x→a) f(x) exists, 3) lim(x→a) f(x) = f(a)',
      'Polynomials are continuous everywhere',
    ],
    graduatedHints: generateContinuityHints(`${a}x²`, x0, 'N'),
  }
}

function generateTrigDerivative(): Problem {
  const func = randomChoice(['sin', 'cos', 'tan'])
  
  const derivatives: Record<string, string> = {
    sin: 'cos(x)',
    cos: '-sin(x)',
    tan: 'sec²(x)',
  }
  
  return {
    id: generateId(),
    level: 'N',
    worksheetNumber: 1,
    type: 'derivative',
    subtype: 'derivative_of_trig',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the derivative: d/dx[${func}(x)]`,
    correctAnswer: derivatives[func],
    hints: [`Memorize: d/dx[sin(x)] = cos(x), d/dx[cos(x)] = -sin(x), d/dx[tan(x)] = sec²(x)`],
    graduatedHints: generateTrigDerivativeHints(func, 'N'),
  }
}

function generateHigherOrderDerivative(): Problem {
  const n = randomInt(3, 5)
  const a = randomInt(1, 3)
  
  return {
    id: generateId(),
    level: 'N',
    worksheetNumber: 1,
    type: 'derivative',
    subtype: 'higher_order_derivatives',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Find the ${n}th derivative of f(x) = ${a === 1 ? '' : a}x^${n + 2}`,
    correctAnswer: `${a * Array.from({ length: n }, (_, i) => n + 2 - i).reduce((a, b) => a * b, 1)}x²`,
    hints: [
      'Apply the power rule repeatedly',
      'Each derivative reduces the power by 1',
    ],
    graduatedHints: generateHigherDerivativeHints(a, n + 2, n, 'N'),
  }
}

export function generateNProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'arithmetic_sequence_nth_term':
    case 'arithmetic_series_sum':
      problem = randomChoice([generateArithmeticSequence, generateArithmeticSeries])()
      break
    case 'geometric_sequence_nth_term':
    case 'geometric_series_sum':
      problem = generateGeometricSequence()
      break
    case 'sigma_notation':
      problem = generateSigmaNotation()
      break
    case 'recurrence_relations':
      problem = generateRecurrence()
      break
    case 'mathematical_induction_proof':
      problem = generateInductionProof()
      break
    case 'infinite_geometric_series':
    case 'convergence_tests':
    case 'limit_of_sequence':
      problem = generateInfiniteGeometricSeries()
      break
    case 'limit_of_function':
    case 'special_limits':
      problem = generateLimitOfFunction()
      break
    case 'continuity_at_point':
      problem = generateContinuity()
      break
    case 'derivative_of_trig':
    case 'derivative_of_ln':
    case 'derivative_of_exponential':
    case 'implicit_differentiation':
    case 'logarithmic_differentiation':
      problem = generateTrigDerivative()
      break
    case 'higher_order_derivatives':
      problem = generateHigherOrderDerivative()
      break
    default:
      problem = generateArithmeticSequence()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateNProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateNProblem(worksheet))
  }
  return problems
}

export function getNWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelNProblemType, string> = {
    'arithmetic_sequence_nth_term': 'Arithmetic Sequence',
    'arithmetic_series_sum': 'Arithmetic Series',
    'geometric_sequence_nth_term': 'Geometric Sequence',
    'geometric_series_sum': 'Geometric Series',
    'sigma_notation': 'Sigma Notation',
    'recurrence_relations': 'Recurrence Relations',
    'mathematical_induction_proof': 'Mathematical Induction',
    'infinite_geometric_series': 'Infinite Geometric Series',
    'convergence_tests': 'Convergence Tests',
    'limit_of_sequence': 'Limit of Sequence',
    'limit_of_function': 'Limit of Function',
    'special_limits': 'Special Limits',
    'continuity_at_point': 'Continuity',
    'derivative_of_trig': 'Trig Derivatives',
    'derivative_of_ln': 'Logarithmic Derivatives',
    'derivative_of_exponential': 'Exponential Derivatives',
    'implicit_differentiation': 'Implicit Differentiation',
    'logarithmic_differentiation': 'Logarithmic Differentiation',
    'higher_order_derivatives': 'Higher Order Derivatives',
  }
  
  return {
    level: 'N' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
