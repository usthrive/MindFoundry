import type { Problem, LevelKProblemType } from '../types'
import { randomInt, generateId, randomChoice } from '../utils'

function getWorksheetConfig(worksheet: number): {
  type: LevelKProblemType
} {
  if (worksheet <= 20) return { type: 'linear_function_review' }
  if (worksheet <= 40) return { type: 'quadratic_function_review' }
  if (worksheet <= 60) return { type: 'find_max_min_value' }
  if (worksheet <= 80) return { type: 'find_max_min_restricted_domain' }
  if (worksheet <= 100) return { type: 'quadratic_inequality_solve' }
  if (worksheet <= 120) return { type: 'cubic_function_graphing' }
  if (worksheet <= 140) return { type: 'find_asymptotes' }
  if (worksheet <= 160) return { type: 'solve_rational_equation' }
  if (worksheet <= 170) return { type: 'graph_square_root_function' }
  if (worksheet <= 180) return { type: 'solve_radical_equation' }
  if (worksheet <= 190) return { type: 'graph_exponential' }
  return { type: 'solve_exponential_equation' }
}

function generateQuadraticReview(): Problem {
  const a = randomChoice([-2, -1, 1, 2])
  const h = randomInt(-4, 4)
  const k = randomInt(-5, 5)
  
  const expanded_b = -2 * a * h
  const expanded_c = a * h * h + k
  
  const bStr = expanded_b >= 0 ? `+ ${expanded_b}x` : `- ${Math.abs(expanded_b)}x`
  const cStr = expanded_c >= 0 ? `+ ${expanded_c}` : `- ${Math.abs(expanded_c)}`
  
  return {
    id: generateId(),
    level: 'K',
    worksheetNumber: 1,
    type: 'function',
    subtype: 'quadratic_function_review',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the vertex of f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}x² ${bStr} ${cStr}`,
    correctAnswer: `(${h}, ${k})`,
    hints: [
      'Convert to vertex form: f(x) = a(x - h)² + k',
      'Or use: h = -b/(2a), k = f(h)',
    ],
  }
}

function generateMaxMin(): Problem {
  const a = randomChoice([-3, -2, -1, 1, 2, 3])
  const h = randomInt(-5, 5)
  const k = randomInt(-10, 10)
  
  const type = a > 0 ? 'minimum' : 'maximum'
  
  const hStr = h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`
  const kStr = k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`
  
  return {
    id: generateId(),
    level: 'K',
    worksheetNumber: 1,
    type: 'function',
    subtype: 'find_max_min_value',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the ${type} value of f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}(x ${hStr})² ${kStr}`,
    correctAnswer: k,
    hints: [
      `This is in vertex form, vertex is (${h}, ${k})`,
      `Since a ${a > 0 ? '> 0' : '< 0'}, the parabola opens ${a > 0 ? 'up' : 'down'}`,
    ],
  }
}

function generateMaxMinRestrictedDomain(): Problem {
  const a = randomChoice([-2, -1, 1, 2])
  const h = randomInt(0, 5)
  const k = randomInt(-5, 5)
  
  const leftBound = randomInt(-2, h - 1)
  const rightBound = randomInt(h + 1, h + 5)
  
  const hStr = h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`
  const kStr = k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`
  
  return {
    id: generateId(),
    level: 'K',
    worksheetNumber: 1,
    type: 'function',
    subtype: 'find_max_min_restricted_domain',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Find the maximum and minimum values of f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}(x ${hStr})² ${kStr} on [${leftBound}, ${rightBound}]`,
    correctAnswer: `Check vertex and endpoints`,
    hints: [
      'Check if the vertex is within the domain',
      'Evaluate f(x) at the endpoints',
      'Compare all values to find max and min',
    ],
  }
}

function generateQuadraticInequality(): Problem {
  const r1 = randomInt(-5, 0)
  const r2 = randomInt(1, 6)
  
  const b = -(r1 + r2)
  const c = r1 * r2
  
  const op = randomChoice(['<', '>', '≤', '≥'])
  
  const bStr = b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`
  
  let answer: string
  if (op === '<' || op === '≤') {
    answer = `${r1} ${op === '<' ? '<' : '≤'} x ${op === '<' ? '<' : '≤'} ${r2}`
  } else {
    answer = `x ${op === '>' ? '<' : '≤'} ${r1} or x ${op === '>' ? '>' : '≥'} ${r2}`
  }
  
  return {
    id: generateId(),
    level: 'K',
    worksheetNumber: 1,
    type: 'inequality',
    subtype: 'quadratic_inequality_solve',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Solve: x² ${bStr} ${cStr} ${op} 0`,
    correctAnswer: answer,
    hints: [
      'Factor the quadratic',
      'Find the zeros',
      'Test intervals to determine the solution',
    ],
  }
}

function generateCubicGraphing(): Problem {
  const a = randomChoice([-1, 1])
  const h = randomInt(-3, 3)
  const k = randomInt(-5, 5)
  
  const hStr = h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`
  const kStr = k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`
  
  return {
    id: generateId(),
    level: 'K',
    worksheetNumber: 1,
    type: 'function',
    subtype: 'cubic_function_graphing',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Describe the transformations of f(x) = ${a === -1 ? '-' : ''}(x ${hStr})³ ${kStr} from the parent function y = x³`,
    correctAnswer: `Shifted ${Math.abs(h)} ${h > 0 ? 'right' : 'left'}, ${Math.abs(k)} ${k > 0 ? 'up' : 'down'}${a === -1 ? ', reflected over x-axis' : ''}`,
    hints: [
      'The number inside parentheses shifts horizontally (opposite direction)',
      'The number outside shifts vertically',
      'A negative leading coefficient reflects over the x-axis',
    ],
  }
}

function generateAsymptotes(): Problem {
  const a = randomInt(1, 5)
  const h = randomInt(-5, 5)
  const k = randomInt(-5, 5)
  
  const hStr = h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`
  const kStr = k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`
  
  return {
    id: generateId(),
    level: 'K',
    worksheetNumber: 1,
    type: 'rational',
    subtype: 'find_asymptotes',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Find the vertical and horizontal asymptotes of f(x) = ${a}/(x ${hStr}) ${kStr}`,
    correctAnswer: `VA: x = ${h}, HA: y = ${k}`,
    hints: [
      'Vertical asymptote: set denominator = 0',
      'Horizontal asymptote: the value the function approaches as x → ±∞',
    ],
  }
}

function generateRationalEquation(): Problem {
  const a = randomInt(1, 5)
  const b = randomInt(-5, 5)
  const c = randomInt(1, 5)
  
  return {
    id: generateId(),
    level: 'K',
    worksheetNumber: 1,
    type: 'equation',
    subtype: 'solve_rational_equation',
    difficulty: 3,
    displayFormat: 'horizontal',
    question: `Solve: ${a}/x + ${b} = ${c}`,
    correctAnswer: `x = ${a / (c - b)}`,
    hints: [
      'Multiply both sides by x to clear the fraction',
      'Then solve the linear equation',
      'Check that x ≠ 0',
    ],
  }
}

function generateRadicalEquation(): Problem {
  const x = randomInt(1, 10)
  const k = randomInt(-5, 5)
  const result = Math.sqrt(x + k)
  
  if (!Number.isInteger(result)) {
    return generateRadicalEquation()
  }
  
  const kStr = k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`
  
  return {
    id: generateId(),
    level: 'K',
    worksheetNumber: 1,
    type: 'equation',
    subtype: 'solve_radical_equation',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Solve: √(x ${kStr}) = ${result}`,
    correctAnswer: x,
    hints: [
      'Square both sides',
      'Solve the resulting equation',
      'Check your answer in the original equation',
    ],
  }
}

function generateExponentialGraph(): Problem {
  const base = randomChoice([2, 3, 'e'])
  const a = randomChoice([-1, 1, 2])
  const h = randomInt(-3, 3)
  const k = randomInt(-3, 3)
  
  const hStr = h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`
  const kStr = k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`
  
  return {
    id: generateId(),
    level: 'K',
    worksheetNumber: 1,
    type: 'function',
    subtype: 'graph_exponential',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Describe the transformations and find the horizontal asymptote of f(x) = ${a === 1 ? '' : a === -1 ? '-' : a}${base}^(x ${hStr}) ${kStr}`,
    correctAnswer: `HA: y = ${k}; shifted ${Math.abs(h)} ${h > 0 ? 'right' : 'left'}, ${Math.abs(k)} ${k > 0 ? 'up' : 'down'}`,
    hints: [
      'Horizontal shift: opposite sign of h',
      'Vertical shift: same sign as k',
      'Horizontal asymptote is y = k',
    ],
  }
}

function generateExponentialEquation(): Problem {
  const base = randomChoice([2, 3, 4, 5])
  const exponent = randomInt(1, 4)
  const result = Math.pow(base, exponent)
  
  return {
    id: generateId(),
    level: 'K',
    worksheetNumber: 1,
    type: 'equation',
    subtype: 'solve_exponential_equation',
    difficulty: 2,
    displayFormat: 'horizontal',
    question: `Solve: ${base}^x = ${result}`,
    correctAnswer: exponent,
    hints: [
      `Express ${result} as a power of ${base}`,
      `${result} = ${base}^${exponent}`,
    ],
  }
}

export function generateKProblem(worksheet: number): Problem {
  const config = getWorksheetConfig(worksheet)
  let problem: Problem
  
  switch (config.type) {
    case 'linear_function_review':
    case 'quadratic_function_review':
    case 'find_vertex':
    case 'find_axis_symmetry':
      problem = generateQuadraticReview()
      break
    case 'find_max_min_value':
    case 'write_equation_from_graph':
      problem = generateMaxMin()
      break
    case 'find_max_min_restricted_domain':
      problem = generateMaxMinRestrictedDomain()
      break
    case 'quadratic_inequality_solve':
      problem = generateQuadraticInequality()
      break
    case 'cubic_function_graphing':
    case 'polynomial_end_behavior':
    case 'find_zeros_multiplicity':
      problem = generateCubicGraphing()
      break
    case 'find_asymptotes':
    case 'graph_rational_function':
    case 'solve_rational_inequality':
      problem = generateAsymptotes()
      break
    case 'solve_rational_equation':
      problem = generateRationalEquation()
      break
    case 'graph_square_root_function':
    case 'domain_of_radical':
    case 'irrational_functions':
      problem = generateRadicalEquation()
      break
    case 'solve_radical_equation':
      problem = generateRadicalEquation()
      break
    case 'graph_exponential':
    case 'exponential_growth_decay':
    case 'compound_interest':
      problem = generateExponentialGraph()
      break
    case 'solve_exponential_equation':
      problem = generateExponentialEquation()
      break
    case 'higher_degree_functions':
    case 'rational_functions':
      problem = generateAsymptotes()
      break
    default:
      problem = generateQuadraticReview()
  }
  
  problem.worksheetNumber = worksheet
  return problem
}

export function generateKProblemSet(worksheet: number, count: number = 10): Problem[] {
  const problems: Problem[] = []
  for (let i = 0; i < count; i++) {
    problems.push(generateKProblem(worksheet))
  }
  return problems
}

export function getKWorksheetInfo(worksheet: number) {
  const config = getWorksheetConfig(worksheet)
  
  const topicMap: Record<LevelKProblemType, string> = {
    'linear_function_review': 'Linear Function Review',
    'quadratic_function_review': 'Quadratic Function Review',
    'find_vertex': 'Find Vertex',
    'find_axis_symmetry': 'Axis of Symmetry',
    'find_max_min_value': 'Max/Min Values',
    'find_max_min_restricted_domain': 'Max/Min on Restricted Domain',
    'write_equation_from_graph': 'Equation from Graph',
    'quadratic_inequality_solve': 'Quadratic Inequalities',
    'cubic_function_graphing': 'Cubic Function Graphing',
    'polynomial_end_behavior': 'Polynomial End Behavior',
    'find_zeros_multiplicity': 'Zeros and Multiplicity',
    'find_asymptotes': 'Find Asymptotes',
    'graph_rational_function': 'Graph Rational Functions',
    'solve_rational_equation': 'Solve Rational Equations',
    'solve_rational_inequality': 'Rational Inequalities',
    'graph_square_root_function': 'Graph Square Root Functions',
    'domain_of_radical': 'Domain of Radicals',
    'solve_radical_equation': 'Solve Radical Equations',
    'graph_exponential': 'Graph Exponential Functions',
    'exponential_growth_decay': 'Exponential Growth/Decay',
    'solve_exponential_equation': 'Solve Exponential Equations',
    'compound_interest': 'Compound Interest',
    'higher_degree_functions': 'Higher Degree Functions',
    'rational_functions': 'Rational Functions',
    'irrational_functions': 'Irrational Functions',
  }
  
  return {
    level: 'K' as const,
    worksheetNumber: worksheet,
    topic: topicMap[config.type],
    sct: '4 min',
    problemTypes: [config.type],
  }
}
